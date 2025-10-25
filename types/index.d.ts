import * as React from 'react'

export interface ColumnDef {
  key: string
  label: string
}

export interface RowData {
  id: number | string
  [key: string]: any
}

export interface DraggableTableProps {
  initialColumns?: ColumnDef[]
  initialRows?: RowData[]
  freezeLastColumn?: boolean
}

export interface TablePaginationProps {
  idTable?: string
  dataSource: any[]
  columns: any[]
  pageSize?: number
  current?: number
  loading?: boolean
  onChange?: (page: number, pageSize: number) => void
  onSizeChanger?: (current: number, size: number) => void
  totalData?: number
  onDelete?: (index: number) => void
  rowSelection?: any
  onRowClicked?: () => void
  tableScrolled?: { x?: number | string; y?: number | string }
  expandable?: any
  className?: string
  useSelect?: boolean
  usePagination?: boolean
  onSort?: () => void
  type?: 'BE' | 'FE'
  enableDragColumn?: boolean
}

export declare function DraggableTable(props: DraggableTableProps & { children?: React.ReactNode }): JSX.Element

export declare function TablePaginationNew(props: TablePaginationProps & { children?: React.ReactNode }): JSX.Element

export as namespace DraggableTable
