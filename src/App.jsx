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
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
    width: 150,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: 250,
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    width: 120,
  },
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
    width: 120,
  },
]

const antdDataSource = [
  { key: '1', id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', position: 'Senior Dev', phone: '123-456-7890', address: '123 Main St', city: 'New York', country: 'USA' },
  { key: '2', id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing', position: 'Manager', phone: '123-456-7891', address: '456 Oak Ave', city: 'Los Angeles', country: 'USA' },
  { key: '3', id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales', position: 'Director', phone: '123-456-7892', address: '789 Pine Rd', city: 'Chicago', country: 'USA' },
  { key: '4', id: 4, name: 'Alice Williams', email: 'alice@example.com', department: 'Design', position: 'Lead Designer', phone: '123-456-7893', address: '321 Elm St', city: 'Boston', country: 'USA' },
  { key: '5', id: 5, name: 'Charlie Brown', email: 'charlie@example.com', department: 'Engineering', position: 'Developer', phone: '123-456-7894', address: '654 Maple Dr', city: 'Seattle', country: 'USA' },
  { key: '6', id: 6, name: 'Diana Prince', email: 'diana@example.com', department: 'HR', position: 'Specialist', phone: '123-456-7895', address: '987 Cedar Ln', city: 'Miami', country: 'USA' },
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
        <h2>2. TablePaginationNew (Ant Design) - ALL FEATURES</h2>
        <p>✅ Drag to reorder • ✅ Resize • ✅ Freeze (ID left) • ✅ Sort (click header) • ✅ Filter (dropdown/search) • ✅ Column visibility</p>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <TablePaginationNew
            idTable="test-table"
            dataSource={antdDataSource}
            columns={antdColumns}
            current={currentPage}
            pageSize={pageSize}
            totalData={antdDataSource.length}
            onChange={handlePageChange}
            enableDragColumn={true}
            freezeColumns={[
              0,  // Simple format: freeze first column (ID) on LEFT
              { key: 'country', position: 'right' }  // Advanced format: freeze 'country' column on RIGHT
            ]}
            enableColumnSorter={true}  // ✅ Enable built-in sorting (click header to sort)
            enableColumnFilter={true}  // ✅ Enable built-in filtering (dropdown/search in header)
            useSelect={true}
            usePagination={true}
            type="FE"
            tableScrolled={{ x: 1500 }}
            loading={false}
          />
        </div>
      </section>
    </div>
  )
}
