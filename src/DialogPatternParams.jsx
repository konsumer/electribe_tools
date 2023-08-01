import { useEffect, useRef } from 'react'

export default function DialogPatternParams ({ value, onSubmit, onChange }) {
  const ref = useRef()

  useEffect(() => {
    if (value) {
      ref.current.showModal()
    } else {
      ref.current.closeModal()
    }
  }, [value])

  const handFieldChange = n => e => onChange({ ...value, [n]: e.target.value })

  return (
    <dialog ref={ref} className='modal'>
      {!!value && (
        <form method='dialog' className='modal-box'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          <h3 className='font-bold text-lg'>{value.name}</h3>
          <div className='overflow-auto h-96'>
            <div className='py-4'>
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text'>Pattern Name</span>
                </label>
                <input type='text' className='input input-bordered w-full max-w-xs' value={value.name || ''} onChange={handFieldChange('name')} />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text'>BPM</span>
                </label>
                <input type='number' className='input input-bordered w-full max-w-xs' value={value.bpm || ''} onChange={handFieldChange('bpm')} />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text'>Swing</span>
                </label>
                <input type='number' className='input input-bordered w-full max-w-xs' value={value.swing || ''} onChange={handFieldChange('swing')} />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text'>Length</span>
                </label>
                <input type='number' className='input input-bordered w-full max-w-xs' value={value.length || ''} onChange={handFieldChange('length')} />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text'>Beat</span>
                </label>
                <input type='number' className='input input-bordered w-full max-w-xs' value={value.beat || ''} onChange={handFieldChange('beat')} />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text'>Key</span>
                </label>
                <input type='number' className='input input-bordered w-full max-w-xs' value={value.key || ''} onChange={handFieldChange('key')} />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text'>Scale</span>
                </label>
                <input type='number' className='input input-bordered w-full max-w-xs' value={value.scale || ''} onChange={handFieldChange('scale')} />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text'>Chord Set</span>
                </label>
                <input type='number' className='input input-bordered w-full max-w-xs' value={value.chordset || ''} onChange={handFieldChange('chordset')} />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text'>Level</span>
                </label>
                <input type='number' className='input input-bordered w-full max-w-xs' value={value.level || ''} onChange={handFieldChange('level')} />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text'>Gate Arp</span>
                </label>
                <input type='number' className='input input-bordered w-full max-w-xs' value={value.gatearp || ''} onChange={handFieldChange('gatearp')} />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text'>MFX Type</span>
                </label>
                <input type='number' className='input input-bordered w-full max-w-xs' value={value.mfxtype || ''} onChange={handFieldChange('mfxtype')} />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text'>Alt 13/14</span>
                </label>
                <input type='number' className='input input-bordered w-full max-w-xs' value={value.alt_13_14 || ''} onChange={handFieldChange('alt_13_14')} />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text'>Alt 15/16</span>
                </label>
                <input type='number' className='input input-bordered w-full max-w-xs' value={value.alt_15_16 || ''} onChange={handFieldChange('alt_15_16')} />
              </div>
            </div>
          </div>
          <div className='modal-action'>
            <button className='btn'>Cancel</button>
            <button className='btn btn-primary' onClick={onSubmit}>Save</button>
          </div>
        </form>
      )}
    </dialog>
  )
}
