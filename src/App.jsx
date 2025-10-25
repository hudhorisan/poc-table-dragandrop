import React, { useState } from 'react'
import DraggableTable from './lib/DraggableTable'
import TablePaginationNew from './lib/TablePaginationNew'

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

// Data untuk TablePaginationNew (Ant Design format)
const antdColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 200,
  },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
    width: 150,
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
    width: 150,
  },
]

const antdDataSource = [
  { key: '1', id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', position: 'Senior Dev' },
  { key: '2', id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing', position: 'Manager' },
  { key: '3', id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales', position: 'Director' },
  { key: '4', id: 4, name: 'Alice Williams', email: 'alice@example.com', department: 'Design', position: 'Lead Designer' },
  { key: '5', id: 5, name: 'Charlie Brown', email: 'charlie@example.com', department: 'Engineering', position: 'Developer' },
  { key: '6', id: 6, name: 'Diana Prince', email: 'diana@example.com', department: 'HR', position: 'Specialist' },
]

export default function App() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const handlePageChange = (page, size) => {
    setCurrentPage(page)
    setPageSize(size)
  }

  return (
    <div className="app">
      <h1>POC Table — Draggable & Resizable Columns</h1>
      
      <section style={{ marginBottom: '40px' }}>
        <h2>1. Vanilla DraggableTable</h2>
        <p>✅ Drag column headers to reorder • ✅ Drag the right edge to resize • ✅ Last column is frozen</p>
        <DraggableTable 
          initialColumns={initialColumns} 
          initialRows={initialRows} 
          freezeLastColumn={true} 
        />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>2. TablePaginationNew (Ant Design) - TEST RESIZE</h2>
        <p>✅ Drag column headers to reorder • ✅ Drag the right edge to resize • ✅ Column visibility selector</p>
        <TablePaginationNew
          idTable="test-table"
          dataSource={antdDataSource}
          columns={antdColumns}
          current={currentPage}
          pageSize={pageSize}
          totalData={antdDataSource.length}
          onChange={handlePageChange}
          enableDragColumn={true}
          useSelect={true}
          usePagination={true}
          type="FE"
          loading={false}
          tableScrolled={{ x: 1000 }}
        />
      </section>
    </div>
  )
}
