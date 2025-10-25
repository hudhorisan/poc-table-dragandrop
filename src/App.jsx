import React from 'react'
import DraggableTable from './lib/DraggableTable'

const initialColumns = [
  { key: 'col1', label: 'First Name' },
  { key: 'col2', label: 'Last Name' },
  { key: 'col3', label: 'Email Address' },
  { key: 'col4', label: 'Department' }
]

const initialRows = [
  { id: 1, col1: 'John', col2: 'Doe', col3: 'john.doe@example.com', col4: 'Engineering' },
  { id: 2, col1: 'Jane', col2: 'Smith', col3: 'jane.smith@example.com', col4: 'Marketing' },
  { id: 3, col1: 'Bob', col2: 'Johnson', col3: 'bob.johnson@example.com', col4: 'Sales' },
  { id: 4, col1: 'Alice', col2: 'Williams', col3: 'alice.williams@example.com', col4: 'Design' }
]

export default function App() {
  return (
    <div className="app">
      <h1>POC Table — Draggable & Resizable Columns</h1>
      <p>Drag column headers to reorder • Drag the right edge of headers to resize • Last column is frozen (locked)</p>
      
      <DraggableTable 
        initialColumns={initialColumns} 
        initialRows={initialRows} 
        freezeLastColumn={true} 
      />
    </div>
  )
}
