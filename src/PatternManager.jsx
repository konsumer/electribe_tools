import { useState } from 'react'
import { Uint8ArrayReader, BlobWriter, ZipReader, ZipWriter } from '@zip.js/zip.js'
import { IconCircleXFilled, IconDownload } from '@tabler/icons-react'

import { E2Pattern } from './e2.js'
import { download, readAsArrayBuffer } from './utils.js'
import PatternList from './PatternList.jsx'

const decoder = new TextDecoder()

function e2zip (file, bytes) {
  const header = bytes.slice(0, 0x100) // Korg file header
  const settings = bytes.slice(0x100, 0x10100) //  global settings + padding
  const pat_count = 250

  const pat_off = 0x10100
  const pat_len = 0x4000
  const out = []

  for (let i = 0; i < pat_count; i++) {
    const start = pat_off + (i * pat_len)
    const end = start + pat_len
    const c = bytes.slice(start, end)
    const data = new Uint8Array(header.byteLength + c.byteLength)
    data.set(new Uint8Array(header), 0)
    data.set(new Uint8Array(c), header.byteLength)
    const sample = new E2Pattern(data)
    sample.id = Math.random().toString(36).slice(2, 7)
    out.push(sample)
  }

  return out
}

async function zip2e (file, bytes) {
  const zipFileReader = new Uint8ArrayReader(new Uint8Array(bytes))
  const zipReader = new ZipReader(zipFileReader)
  const out = await Promise.all((await zipReader.getEntries()).map(async (entry, i) => {
    const sample = new E2Pattern(data)
    sample.id = Math.random().toString(36).slice(2, 7)
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
  const bytes = await readAsArrayBuffer(file)
  if (decoder.decode(bytes.slice(0x0, 0x19)) === 'KORG\0\0\0\0\0\0\0\0\0\0\0\0e2sampler') {
    return e2zip(file, bytes)
  } else if (decoder.decode(bytes.slice(0x0, 0x4)) === 'PK\x03\x04') {
    return zip2e(file, bytes)
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

  const handleDownloadE2 = () => {

  }

  const handleDownloadZip = () => {

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
