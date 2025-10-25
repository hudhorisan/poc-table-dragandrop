import React, { useState, useRef } from 'react'

export default function DraggableTable({ initialColumns = [], initialRows = [], freezeLastColumn = false }) {
  const [columns, setColumns] = useState(initialColumns)
  const [rows] = useState(initialRows)
  const [columnWidths, setColumnWidths] = useState(() => {
    const defaultWidths = { id: 80 }
    initialColumns.forEach(col => {
      defaultWidths[col.key] = 150
    })
    return defaultWidths
  })
  
  const dragItem = useRef(null)
  const resizing = useRef(null)
  const startX = useRef(null)
  const startWidth = useRef(null)

  function onHeaderDragStart(e, index) {
    // Prevent dragging the last column if frozen
    if (freezeLastColumn && index === columns.length - 1) {
      e.preventDefault()
      return
    }
    dragItem.current = index
    e.dataTransfer.setData('text/plain', '')
    e.dataTransfer.effectAllowed = 'move'
  }

  function onHeaderDragOver(e, index) {
    e.preventDefault()
    const dragIndex = dragItem.current
    if (dragIndex === null || dragIndex === index) return
    
    // Prevent dropping onto the last column if frozen
    if (freezeLastColumn && index === columns.length - 1) return
    // Prevent moving the last column if frozen
    if (freezeLastColumn && dragIndex === columns.length - 1) return
    
    const _cols = [...columns]
    const [moved] = _cols.splice(dragIndex, 1)
    _cols.splice(index, 0, moved)
    dragItem.current = index
    setColumns(_cols)
  }

  function onResizeStart(e, columnKey) {
    e.preventDefault()
    e.stopPropagation()
    resizing.current = columnKey
    startX.current = e.clientX
    startWidth.current = columnWidths[columnKey]
    
    document.addEventListener('mousemove', onResize)
    document.addEventListener('mouseup', onResizeEnd)
  }

  function onResize(e) {
    if (!resizing.current) return
    const diff = e.clientX - startX.current
    const newWidth = Math.max(50, startWidth.current + diff)
    setColumnWidths(prev => ({
      ...prev,
      [resizing.current]: newWidth
    }))
  }

  function onResizeEnd() {
    resizing.current = null
    startX.current = null
    startWidth.current = null
    document.removeEventListener('mousemove', onResize)
    document.removeEventListener('mouseup', onResizeEnd)
  }

  return (
    <div className="draggable-table-wrapper" style={{width:'500px'}}>
    <table style={{ tableLayout: 'fixed', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ width: columnWidths.id, position: 'relative' }}>
            ID
            <div 
              className="resize-handle"
              onMouseDown={(e) => onResizeStart(e, 'id')}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                cursor: 'col-resize',
                backgroundColor: 'transparent'
              }}
            />
          </th>
          {columns.map((col, i) => {
            const isLastColumnFrozen = freezeLastColumn && i === columns.length - 1
            return (
              <th 
                key={col.key} 
                draggable={!isLastColumnFrozen}
                onDragStart={(e) => onHeaderDragStart(e, i)} 
                onDragOver={(e) => onHeaderDragOver(e, i)}
                style={{ 
                  width: columnWidths[col.key], 
                  position: 'relative',
                  backgroundColor: isLastColumnFrozen ? '#f8f9fa' : 'inherit',
                  borderLeft: isLastColumnFrozen ? '2px solid #007acc' : 'inherit'
                }}
                className={isLastColumnFrozen ? 'frozen-column' : ''}
              >
                {col.label}
                {isLastColumnFrozen && <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>🔒</span>}
                <div 
                  className="resize-handle"
                  onMouseDown={(e) => onResizeStart(e, col.key)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    cursor: 'col-resize',
                    backgroundColor: 'transparent'
                  }}
                />
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td style={{ width: columnWidths.id }}>{r.id}</td>
            {columns.map((c) => (
              <td key={c.key} style={{ width: columnWidths[c.key] }}>{r[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    </div>
  )
}
