import { Select, Table } from "antd";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
const { Option } = Select;

const TablePaginationNew = ({
  idTable,
  dataSource,
  columns,
  pageSize,
  current,
  loading,
  onChange = () => {},
  onSizeChanger = () => {},
  totalData,
  onDelete,
  rowSelection,
  onRowClicked = () => {},
  tableScrolled,
  expandable,
  className,
  useSelect = true,
  usePagination = true,
  onSort = () => {},
  type = "BE",
  enableDragColumn = false,
}) => {
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [totalDataFE, setTotalDataFE] = useState(0);
  const [orderedColumns, setOrderedColumns] = useState(columns);
  const [columnWidths, setColumnWidths] = useState({});
  const dragItem = useRef(null);
  const resizing = useRef(null);
  const startX = useRef(null);
  const startWidth = useRef(null);

  useEffect(() => {
    setOrderedColumns(columns);
    // Initialize column widths
    const initialWidths = {};
    columns.forEach((col) => {
      if (!columnWidths[col.dataIndex || col.key]) {
        initialWidths[col.dataIndex || col.key] = col.width || 150;
      }
    });
    if (Object.keys(initialWidths).length > 0) {
      setColumnWidths((prev) => ({ ...prev, ...initialWidths }));
    }
  }, [columns]);

  useEffect(() => {
    if (type !== "BE") {
      setTotalDataFE(dataSource?.length || 0);
    }
  }, [type, dataSource]);

  const handleHeaderDragStart = (e, index) => {
    if (!enableDragColumn) return;
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleHeaderDragOver = (e, index) => {
    if (!enableDragColumn) return;
    e.preventDefault();
    const dragIndex = dragItem.current;
    if (dragIndex === null || dragIndex === index) return;
    
    // Get the visible (filtered) columns first
    const visibleCols = orderedColumns.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
    
    // Reorder only the visible columns
    const [moved] = visibleCols.splice(dragIndex, 1);
    visibleCols.splice(index, 0, moved);
    dragItem.current = index;
    
    // Merge back with hidden columns in their original positions
    const hiddenCols = orderedColumns.filter((col) => {
      return optionSelectedCol.includes(col.title);
    });
    
    // Reconstruct the full column list maintaining hidden column positions
    const newOrderedColumns = [...visibleCols];
    hiddenCols.forEach(hiddenCol => {
      const originalIndex = orderedColumns.findIndex(c => c.title === hiddenCol.title);
      newOrderedColumns.splice(originalIndex, 0, hiddenCol);
    });
    
    setOrderedColumns(newOrderedColumns);
  };

  const handleHeaderDragEnd = () => {
    dragItem.current = null;
  };

  const onResizeStart = (e, columnKey) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = columnKey;
    startX.current = e.clientX;
    startWidth.current = columnWidths[columnKey] || 150;

    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', onResizeEnd);
  };

  const onResize = (e) => {
    if (!resizing.current) return;
    const diff = e.clientX - startX.current;
    const newWidth = Math.max(50, startWidth.current + diff);
    setColumnWidths((prev) => ({
      ...prev,
      [resizing.current]: newWidth,
    }));
  };

  const onResizeEnd = () => {
    resizing.current = null;
    startX.current = null;
    startWidth.current = null;
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', onResizeEnd);
  };

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };
  const handleDelete = (index) => {
    onDelete(index);
  };
  const filterColumns = () => {
    const filtered = orderedColumns.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
    
    if (enableDragColumn) {
      return filtered.map((col, index) => {
        const columnKey = col.dataIndex || col.key;
        return {
          ...col,
          width: columnWidths[columnKey] || col.width || 150,
          onHeaderCell: () => ({
            draggable: true,
            onDragStart: (e) => handleHeaderDragStart(e, index),
            onDragOver: (e) => handleHeaderDragOver(e, index),
            onDragEnd: handleHeaderDragEnd,
            style: { 
              cursor: 'move', 
              userSelect: 'none',
              position: 'relative'
            },
          }),
          title: (
            <div style={{ position: 'relative', width: '100%' }}>
              <span>{col.title}</span>
              <div
                className="resize-handle"
                onMouseDown={(e) => onResizeStart(e, columnKey)}
                style={{
                  position: 'absolute',
                  right: -8,
                  top: -16,
                  bottom: -16,
                  width: '8px',
                  cursor: 'col-resize',
                  backgroundColor: 'transparent',
                  zIndex: 10,
                }}
                onClick={(e) => e.stopPropagation()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          ),
        };
      });
    }
    
    return filtered.map((col) => {
      const columnKey = col.dataIndex || col.key;
      return {
        ...col,
        width: columnWidths[columnKey] || col.width || 150,
      };
    });
  };
  const onChangeFE = (_, __, ___, extra) => {
    setTotalDataFE(extra?.currentDataSource?.length || 0);
  };
  return (
    <div className={"relative flex flex-col w-full"}>
      {useSelect ? (
        <div
          className={`${
            (type === "BE" ? totalData : totalDataFE) !== 0
              ? "z-[1] absolute mt-4"
              : "my-4"
          } w-1/4 flex`}
        >
          {useSelect ? (
            <Select
              mode="multiple"
              placeholder="Show All Column"
              className={"w-full"}
              maxTagCount={"responsive"}
              onChange={handleDisplayColumn}
            >
              {orderedColumns
                .map((col) => (
                  <Option
                    key={col.title}
                    value={col.title}
                    disabled={
                      optionSelectedCol.length > 3
                        ? optionSelectedCol.includes(col.title)
                          ? false
                          : true
                        : false
                    }
                  >
                    {col.title}
                  </Option>
                ))
                .splice(1)}
            </Select>
          ) : null}
        </div>
      ) : null}
      <Table
        dataSource={dataSource}
        columns={[...filterColumns()]}
        scroll={tableScrolled}
        bordered
        pagination={
          !usePagination
            ? false
            : {
                position: ["topRight"],
                current: current,
                pageSize: pageSize,
                total: type === "BE" ? totalData : undefined,
                onChange: onChange,
                className: "pr-1 w-3/4",
                style: { marginLeft: "auto", marginRight: 0 },
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `Showing ${range[0]} to ${range[1]} of ${total} records`,
              }
        }
        className={`w-full ${className}`}
        loading={loading}
        tableLayout="fixed"
        expandable={expandable}
        id={idTable}
        onChange={type === "BE" ? onSort : onChangeFE}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default TablePaginationNew;
