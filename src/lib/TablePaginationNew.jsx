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
  freezeColumns = [], // Array of column indices or keys to freeze, e.g. [0, 'email'] or ['id', 'name']
}) => {
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [totalDataFE, setTotalDataFE] = useState(0);
  const [orderedColumns, setOrderedColumns] = useState(columns);
  const [columnWidths, setColumnWidths] = useState({});
  const dragItem = useRef(null);
  const resizing = useRef(null);
  const startX = useRef(null);
  const startWidth = useRef(null);
  const tableRef = useRef(null);

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

  // Add resize handles after table renders
  useEffect(() => {
    if (!enableDragColumn || !tableRef.current) return;

    const addResizeHandles = () => {
      const table = tableRef.current.querySelector('.ant-table');
      
      if (!table) {
        setTimeout(addResizeHandles, 200);
        return;
      }

      const colgroup = table.querySelector('colgroup');
      const headers = table.querySelectorAll('.ant-table-thead > tr > th');
      
      if (!colgroup || !headers.length) {
        setTimeout(addResizeHandles, 200);
        return;
      }

      headers.forEach((th, index) => {
        // Remove existing handle if any
        const existingHandle = th.querySelector('.resize-handle-custom');
        if (existingHandle) existingHandle.remove();

        // Create resize handle
        const handle = document.createElement('div');
        handle.className = 'resize-handle-custom';
        handle.innerHTML = '⋮';
        handle.style.cssText = `
          position: absolute;
          right: -5px;
          top: 0;
          bottom: 0;
          width: 10px;
          cursor: col-resize;
          z-index: 1001;
          background: transparent;
          border-right: 2px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: transparent;
          font-size: 18px;
          user-select: none;
        `;
        
        const col = colgroup.children[index];
        
        let startX = 0;
        let startWidth = 0;

        const onMouseDown = (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          startX = e.clientX;
          startWidth = th.offsetWidth;
          
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
          
          // Prevent drag during resize
          th.setAttribute('draggable', 'false');
        };

        const onMouseMove = (e) => {
          const diff = e.clientX - startX;
          const newWidth = Math.max(50, startWidth + diff);
          
          if (col) {
            col.style.width = newWidth + 'px';
          }
          th.style.width = newWidth + 'px';
        };

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          
          // Re-enable drag
          th.setAttribute('draggable', 'true');
          
          // Update state
          const visibleCols = orderedColumns.filter(c => !optionSelectedCol.includes(c.title));
          const columnKey = visibleCols[index]?.dataIndex || visibleCols[index]?.key;
          
          if (columnKey && col) {
            const finalWidth = parseInt(col.style.width);
            setColumnWidths(prev => ({
              ...prev,
              [columnKey]: finalWidth
            }));
          }
        };

        handle.addEventListener('mousedown', onMouseDown);
        handle.addEventListener('mouseenter', () => {
          handle.style.borderRightColor = '#1890ff';
          handle.style.background = 'rgba(24, 144, 255, 0.1)';
          handle.style.color = '#1890ff';
        });
        handle.addEventListener('mouseleave', () => {
          handle.style.borderRightColor = 'transparent';
          handle.style.background = 'transparent';
          handle.style.color = 'transparent';
        });
        
        th.appendChild(handle);
      });
    };

    // Run after render
    const timer = setTimeout(addResizeHandles, 150);
    
    return () => {
      clearTimeout(timer);
      // Clean up event listeners
      const handles = tableRef.current?.querySelectorAll('.resize-handle-custom');
      handles?.forEach(h => h.remove());
    };
  }, [enableDragColumn, orderedColumns, optionSelectedCol]);

  // Helper function to check if a column is frozen and get its position
  // Returns: { frozen: boolean, position: 'left' | 'right' | null }
  const isColumnFrozen = (columnIndex, columnKey) => {
    if (!freezeColumns || freezeColumns.length === 0) {
      return { frozen: false, position: null };
    }
    
    // Check if any freeze config matches this column
    for (const config of freezeColumns) {
      // Simple format: number or string
      if (typeof config === 'number' || typeof config === 'string') {
        if (config === columnIndex || config === columnKey) {
          return { frozen: true, position: 'left' }; // default to left
        }
      }
      // Advanced format: object with index/key and position
      else if (typeof config === 'object') {
        const matchByIndex = config.index !== undefined && config.index === columnIndex;
        const matchByKey = config.key !== undefined && config.key === columnKey;
        
        if (matchByIndex || matchByKey) {
          return { frozen: true, position: config.position || 'left' };
        }
      }
    }
    
    return { frozen: false, position: null };
  };

  const handleHeaderDragStart = (e, index) => {
    if (!enableDragColumn) return;
    
    // Check if this column is frozen
    const visibleCols = orderedColumns.filter(c => !optionSelectedCol.includes(c.title));
    const columnKey = visibleCols[index]?.dataIndex || visibleCols[index]?.key;
    
    const frozenInfo = isColumnFrozen(index, columnKey);
    if (frozenInfo.frozen) {
      e.preventDefault();
      return;
    }
    
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
    
    // Check if target column is frozen
    const targetColumnKey = visibleCols[index]?.dataIndex || visibleCols[index]?.key;
    const dragColumnKey = visibleCols[dragIndex]?.dataIndex || visibleCols[dragIndex]?.key;
    
    // Prevent dropping onto frozen column or dragging frozen column
    const targetFrozen = isColumnFrozen(index, targetColumnKey);
    const dragFrozen = isColumnFrozen(dragIndex, dragColumnKey);
    
    if (targetFrozen.frozen || dragFrozen.frozen) {
      return;
    }
    
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
      let leftOffset = 0;
      
      return filtered.map((col, index) => {
        const columnKey = col.dataIndex || col.key;
        const frozenInfo = isColumnFrozen(index, columnKey);
        const colWidth = columnWidths[columnKey] || col.width || 150;
        
        const colConfig = {
          ...col,
          width: colWidth,
          className: frozenInfo.frozen ? 'frozen-column-header' : '',
          onHeaderCell: () => ({
            draggable: !frozenInfo.frozen,
            onDragStart: (e) => handleHeaderDragStart(e, index),
            onDragOver: (e) => handleHeaderDragOver(e, index),
            onDragEnd: handleHeaderDragEnd,
            style: { 
              cursor: frozenInfo.frozen ? 'not-allowed' : 'move', 
              userSelect: 'none',
              position: 'relative',
              ...(frozenInfo.frozen && {
                backgroundColor: '#f5f5f5',
                ...(frozenInfo.position === 'left' && { borderLeft: '3px solid #1890ff' }),
                ...(frozenInfo.position === 'right' && { borderRight: '3px solid #1890ff' }),
              }),
            },
          }),
        };
        
        // Add Ant Design fixed property for frozen columns
        if (frozenInfo.frozen) {
          colConfig.fixed = frozenInfo.position; // 'left' or 'right'
        }
        
        return colConfig;
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
    <div className={"relative flex flex-col w-full"} ref={tableRef}>
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
