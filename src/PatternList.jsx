import { useState, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { IconTrash, IconPencil, IconDownload, IconPiano } from '@tabler/icons-react'
import { download } from './utils.js'
import DialogPatternParams from './DialogPatternParams.jsx'

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
  }

  const handleDownload = n => e => {
    download(items[n].name + '.e2spat', items[n].pattern)
  }

  return (
    <>
      {edit && (<DialogPatternParams value={edit} onChange={setEdit} onSubmit={handleEditSave} />)}
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
