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
  const dragItem = useRef(null);

  useEffect(() => {
    setOrderedColumns(columns);
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
      return filtered.map((col, index) => ({
        ...col,
        onHeaderCell: () => ({
          draggable: true,
          onDragStart: (e) => handleHeaderDragStart(e, index),
          onDragOver: (e) => handleHeaderDragOver(e, index),
          onDragEnd: handleHeaderDragEnd,
          style: { cursor: 'move', userSelect: 'none' },
        }),
      }));
    }
    
    return filtered;
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
