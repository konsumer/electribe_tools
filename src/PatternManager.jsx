import { useState } from 'react'
import { Uint8ArrayReader, Uint8ArrayWriter, BlobWriter, ZipReader, ZipWriter, BlobReader } from '@zip.js/zip.js'
import { IconCircleXFilled, IconDownload } from '@tabler/icons-react'

import { E2Pattern } from './e2.js'
import { download, readAsArrayBuffer, getID } from './utils.js'
import PatternList from './PatternList.jsx'

const decoder = new TextDecoder()

function e2load (file, bytes) {
  const header = bytes.slice(0, 0x100) // Korg file header
  const settings = bytes.slice(0x100, 0x10100) //  global settings + padding
  const pat_count = 250
  const pat_off = 0x10100
  const pat_len = 0x4000

  const out = []

  try {
    for (let i = 0; i < pat_count; i++) {
      const start = pat_off + (i * pat_len)
      const end = start + pat_len
      const c = new Uint8Array(bytes.slice(start, end))
      const data = new Uint8Array(header.byteLength + c.byteLength)
      data.set(new Uint8Array(header), 0)
      data.set(c, header.byteLength)
      const sample = new E2Pattern(data)
      sample.id = getID()
      out.push(sample)
    }
  } catch (e) {
    // TODO: this is not a very good check, but if full e2sallpat fails, load as e2spat
    // also the bytes are not correct here, so leaving until later
    // const sample = new E2Pattern(bytes)
    // sample.id = getID()
    // out.push(sample)
  }

  return out
}

async function zipload (file, bytes) {
  // TODO: pull out global header

  const zipFileReader = new Uint8ArrayReader(new Uint8Array(bytes))
  const zipReader = new ZipReader(zipFileReader)
  const entries = await zipReader.getEntries()
  const out = await Promise.all(entries.map(async (entry) => {
    const data = await entry.getData(new Uint8ArrayWriter())
    const sample = new E2Pattern(data)
    sample.id = getID()
    return sample
  }))
  await zipReader.close()
  return out
}

// this will detect the file-type and run the converter for it
async function processFile (file) {
  if (!file) {
    return
  }
  // TODO: handle e2sallpat vs e2spat

  const bytes = await readAsArrayBuffer(file)

  if (decoder.decode(bytes.slice(0x0, 0x19)) === 'KORG\0\0\0\0\0\0\0\0\0\0\0\0e2sampler') {
    return e2load(file, bytes)
  } else if (decoder.decode(bytes.slice(0x0, 0x4)) === 'PK\x03\x04') {
    return zipload(file, bytes)
  } else {
    throw new Error('Not a valid zip or e2sallpat file.')
  }
}

export default function PatternManager () {
  const [tab, setTab] = useState('zip')
  const [error, setError] = useState(false)
  const [samples, setSamples] = useState([])

  // TODO: add file DnD

  const handleFileSelect = e => {
    const { files: [file] } = e.target
    processFile(file)
      .then(files => {
        if (!files) {
          return
        }
        setError(false)
        setSamples([...samples, ...files])
      })
      .catch(e => setError(e.message))
  }

  const handleDownloadE2 = async () => {
    console.log('TODO', samples)
  }

  const handleDownloadZip = async () => {
    const zipWriter = new ZipWriter(new BlobWriter('application/zip'), { bufferedWrite: true, useCompressionStream: false })
    for (const s in samples) {
      const sample = samples[s]
      const filename = `${s.toString().padStart(3, '0')}_${sample.name}.e2spat`
      const blob = new Blob([new Uint8Array(sample.pattern.buffer)])
      await zipWriter.add(filename, new BlobReader(blob))
    }
    download('e2patterns.zip', await zipWriter.close())
  }

  return (
    <div className='p-2 m-auto prose'>
      <div className='mt-4'>
        <h2>Pattern Collection Manager</h2>
        <p>This tool will allow you to convert a zip of patterns + global settings to an e2sallpat file, or vice-versa. You can use it to rename/re-order a bunch of patterns, or use the individual patterns in other tools. No files are stored on server, or even uploaded.</p>
        <p>Select a zip or e2sallpat file, it will auto-detect the format.</p>
        {!!samples.length && (<p>Drag & drop to re-order</p>)}
        <div className='flex gap-2 justify-between'>
          <input id='allpat' onChange={handleFileSelect} type='file' className='file-input file-input-bordered file-input-primary w-full max-w-xs' />
          {!!samples.length && (<button onClick={handleDownloadE2} className='btn btn-secondary'><IconDownload /> Download e2sallpat</button>)}
          {!!samples.length && (<button onClick={handleDownloadZip} className='btn btn-secondary'><IconDownload /> Download zip</button>)}
        </div>
        {error && (
          <div className='alert alert-error mt-4'>
            <IconCircleXFilled />
            <span>{error}</span>
          </div>
        )}
        <PatternList className='mt-4' items={samples} setItems={setSamples} />
      </div>
    </div>
  )
}
