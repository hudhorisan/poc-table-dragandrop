# POC Table Drag and Drop

Minimal Vite + React proof-of-concept demonstrating draggable table rows.

Quick start

```bash
cd /Volumes/extended/project/poc-table-dragandrop
npm install
npm run dev
```

Build

```bash
npm run build
npm run preview
```

Note about dependencies

If you see peer dependency resolution errors during `npm install`, run:

```bash
npm install --legacy-peer-deps
```

This project uses Vite 5 and @vitejs/plugin-react; some plugin versions may have peer constraints targeting Vite 4.x. Using --legacy-peer-deps is a pragmatic way to install in local dev. For production, prefer aligning plugin versions.

Building the library

This repo includes a small library entry under `src/lib/` exporting a `DraggableTable` component. To build the library bundles (ES / UMD):

```bash
npm run build:lib
```

The output will be in `dist/` (files named `draggable-table.es.js`, `draggable-table.umd.js`, etc.). React is externalized by default.

Usage examples

**Installation:**

```bash
npm install poc-table-dragandrop antd
```

**1. DraggableTable (Vanilla React)**

```js
import { DraggableTable } from 'poc-table-dragandrop'

const columns = [
  { key: 'col1', label: 'Column 1' },
  { key: 'col2', label: 'Column 2' },
  { key: 'col3', label: 'Column 3' },
  { key: 'col4', label: 'Column 4' }
]

const rows = [
  { id: 1, col1: 'A1', col2: 'A2', col3: 'A3', col4: 'A4' },
  { id: 2, col1: 'B1', col2: 'B2', col3: 'B3', col4: 'B4' },
]

function App() {
  return (
    <DraggableTable 
      initialColumns={columns} 
      initialRows={rows}
      freezeLastColumn={true}  // optional: freeze last column
    />
  )
}
```

**2. TablePaginationNew (with Ant Design)**

```js
import { TablePaginationNew } from 'poc-table-dragandrop'
import { useState } from 'react'

// Define columns (Ant Design format)
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
]

// Sample data
const data = [
  { key: '1', name: 'John', age: 32, address: 'New York' },
  { key: '2', name: 'Jane', age: 28, address: 'London' },
  // ... more data
]

function App() {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handlePageChange = (page, size) => {
    setCurrent(page)
    setPageSize(size)
  }

  return (
    <TablePaginationNew
      dataSource={data}
      columns={columns}
      
      // Pagination
      current={current}
      pageSize={pageSize}
      totalData={100}  // total records (for backend pagination)
      onChange={handlePageChange}
      usePagination={true}
      
      // Features
      enableDragColumn={true}  // ✅ Enable column dragging & resizing
      useSelect={true}         // Show column visibility selector
      loading={false}
      
      // Optional
      type="BE"  // "BE" for backend pagination, "FE" for frontend
      className="custom-class"
      tableScrolled={{ x: 1000, y: 400 }}
      
      // Event handlers
      onSort={(pagination, filters, sorter) => {
        console.log('Sort:', sorter)
      }}
    />
  )
}
```

**All TablePaginationNew Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataSource` | `array` | required | Data array for table |
| `columns` | `array` | required | Ant Design column definitions |
| `enableDragColumn` | `boolean` | `false` | Enable column drag, reorder & resize |
| `current` | `number` | - | Current page number |
| `pageSize` | `number` | - | Items per page |
| `totalData` | `number` | - | Total records (for BE pagination) |
| `onChange` | `function` | - | Page change callback |
| `usePagination` | `boolean` | `true` | Show pagination |
| `useSelect` | `boolean` | `true` | Show column selector |
| `type` | `"BE" \| "FE"` | `"BE"` | Pagination type |
| `loading` | `boolean` | `false` | Loading state |
| `tableScrolled` | `object` | - | Scroll config `{x, y}` |
| `className` | `string` | - | Custom CSS class |
| `onSort` | `function` | - | Sort callback |
| `rowSelection` | `object` | - | Ant Design row selection |
| `expandable` | `object` | - | Ant Design expandable config |

Manual CSS import (if needed):

```js
import 'poc-table-dragandrop/dist/draggable-table.css'
```UMD usage via script tag (React must be provided globally):

```html
<script src="https://unpkg.com/react/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
<script src="/path/to/dist/draggable-table.umd.js"></script>
<script>
	const { DraggableTable } = window.DraggableTable
	// render with ReactDOM
</script>
```

Publishing to npm

1. Fill `package.json` metadata fields: `author`, `repository.url`, and confirm `name` is unique on npm.
2. Build the library (prepare script runs automatically on publish):

```bash
npm run build:lib
```

3. Login and publish:

```bash
npm login
npm publish --access public
```

After publishing, other projects can install:

```bash
npm install poc-table-dragandrop
```

