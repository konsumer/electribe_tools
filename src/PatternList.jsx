import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { IconTrash, IconPencil, IconDownload, IconPiano } from '@tabler/icons-react'
import { download } from './utils.js'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export default function PatternList ({ items, setItems, ...props }) {
  const [edit, setEdit] = useState()
  const [editPattern, setEditPattern] = useState()
  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    setItems(reorder(
      items,
      result.source.index,
      result.destination.index
    ))
  }

  const handleDelete = index => () => {
    const a = [...items]
    a.splice(index, 1)
    setItems(a)
  }

  const handleEditShow = index => () => {
    setEdit({
      index,
      name: items[index].name,
      bpm: items[index].bpm,
      swing: items[index].swing,
      length: items[index].length,
      beat: items[index].beat,
      key: items[index].key,
      scale: items[index].scale,
      chordset: items[index].chordset,
      level: items[index].level,
      gatearp: items[index].gatearp,
      mfxtype: items[index].mfxtype,
      alt_13_14: items[index].alt_13_14,
      alt_15_16: items[index].alt_15_16
    })
    window.modal_edit.showModal()
  }

  const handleEditPatternShow = index => () => {

  }

  const handleEditSave = e => {
    e.preventDefault()
    const i = [...items]
    for (const k of Object.keys(edit)) {
      if (k !== 'index') {
        i[edit.index][k] = edit[k]
      }
    }
    setItems(i)
    setEdit(false)
    window.modal_edit.close()
  }

  const handleDownload = n => e => {
    download(items[n].name + '.e2spat', items[n].pattern)
  }

  const handFieldChange = n => e => setEdit({ ...edit, [n]: e.target.value })

  return (
    <>
      <dialog id='modal_edit' className='modal'>
        {edit && (
          <form method='dialog' className='modal-box'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
            <h3 className='font-bold text-lg'>{edit.name}</h3>
            <div className='overflow-auto h-96'>
              <div className='py-4'>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>Pattern Name</span>
                  </label>
                  <input type='text' className='input input-bordered w-full max-w-xs' value={edit.name} onChange={handFieldChange('name')} />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>BPM</span>
                  </label>
                  <input type='number' className='input input-bordered w-full max-w-xs' value={edit.bpm} onChange={handFieldChange('bpm')} />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>Swing</span>
                  </label>
                  <input type='number' className='input input-bordered w-full max-w-xs' value={edit.swing} onChange={handFieldChange('swing')} />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>Length</span>
                  </label>
                  <input type='number' className='input input-bordered w-full max-w-xs' value={edit.length} onChange={handFieldChange('length')} />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>Beat</span>
                  </label>
                  <input type='number' className='input input-bordered w-full max-w-xs' value={edit.beat} onChange={handFieldChange('beat')} />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>Key</span>
                  </label>
                  <input type='number' className='input input-bordered w-full max-w-xs' value={edit.key} onChange={handFieldChange('key')} />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>Scale</span>
                  </label>
                  <input type='number' className='input input-bordered w-full max-w-xs' value={edit.scale} onChange={handFieldChange('scale')} />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>Chord Set</span>
                  </label>
                  <input type='number' className='input input-bordered w-full max-w-xs' value={edit.chordset} onChange={handFieldChange('chordset')} />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>Level</span>
                  </label>
                  <input type='number' className='input input-bordered w-full max-w-xs' value={edit.level} onChange={handFieldChange('level')} />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>Gate Arp</span>
                  </label>
                  <input type='number' className='input input-bordered w-full max-w-xs' value={edit.gatearp} onChange={handFieldChange('gatearp')} />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>MFX Type</span>
                  </label>
                  <input type='number' className='input input-bordered w-full max-w-xs' value={edit.mfxtype} onChange={handFieldChange('mfxtype')} />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>Alt 13/14</span>
                  </label>
                  <input type='number' className='input input-bordered w-full max-w-xs' value={edit.alt_13_14} onChange={handFieldChange('alt_13_14')} />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>Alt 15/16</span>
                  </label>
                  <input type='number' className='input input-bordered w-full max-w-xs' value={edit.alt_15_16} onChange={handFieldChange('alt_15_16')} />
                </div>
              </div>
            </div>
            <div className='modal-action'>
              <button className='btn'>Cancel</button>
              <button className='btn btn-primary' onClick={handleEditSave}>Save</button>
            </div>
          </form>
        )}
      </dialog>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              {...props}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className='menu menu-horizontal bg-base-200 rounded-box mt-2 w-full items-center justify-between'>
                        <div>{item.name}</div>
                        <div>
                          <a className='tooltip cursor-pointer' data-tip={`Delete ${item.name} from this set`} onClick={handleDelete(index)}>
                            <IconTrash />
                          </a>
                          <a className='tooltip cursor-pointer' data-tip={`Download ${item.name}`} onClick={handleDownload(index)}>
                            <IconDownload />
                          </a>
                          <a className='tooltip cursor-pointer' data-tip={`Edit patterns for ${item.name}`} onClick={handleEditPatternShow(index)}>
                            <IconPiano />
                          </a>
                          <a className='tooltip cursor-pointer' data-tip={`Edit params for ${item.name}`} onClick={handleEditShow(index)}>
                            <IconPencil />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}
