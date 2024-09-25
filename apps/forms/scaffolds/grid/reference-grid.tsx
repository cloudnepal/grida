"use client";

import React from "react";
import DataGrid, { Column, RenderCellProps } from "react-data-grid";
import { EmptyRowsRenderer } from "./empty";
import Highlight from "@/components/highlight";
import { mask } from "./mask";
import { CellRoot } from "./cell";
import { GridDataXSBUnknown } from "../grid-editor/grid-data-xsb-unknow";
import "./grid.css";

export function XSBReferenceTableGrid({
  columns: _columns,
  rows: _rows,
  rowKey,
  tokens,
  masked,
  loading,
  onRowDoubleClick,
}: {
  columns: GridDataXSBUnknown.DataGridColumn[];
  rows: GridDataXSBUnknown.DataGridRow[];
  rowKey?: string;
  tokens?: string[];
  masked?: boolean;
  loading?: boolean;
  onRowDoubleClick?: (row: GridDataXSBUnknown.DataGridRow) => void;
}) {
  const columns = _columns.map(
    (col) =>
      ({
        key: col.key,
        name: col.name,
        resizable: true,
        draggable: true,
        editable: false,
        frozen: col.pk,
        width: undefined,
        renderHeaderCell: ({ column }) => {
          return (
            <CellRoot className="flex items-center gap-1.5">
              <span>{column.name}</span>
              <span>
                {col.format && (
                  <span className="text-xs font-normal text-foreground/60">
                    {col.format}
                  </span>
                )}
              </span>
            </CellRoot>
          );
        },
        renderCell: ({ row, column }: RenderCellProps<any>) => {
          const val = row[col.key as keyof GridDataXSBUnknown.DataGridRow];
          const display = masked
            ? val
              ? mask(val.toString())
              : ""
            : val?.toString();

          return (
            <CellRoot>
              <Highlight
                text={display}
                tokens={tokens}
                className="bg-foreground text-background"
              />
            </CellRoot>
          );
        },
        maxWidth: 300,
      }) as Column<any>
  );

  const rows = _rows.map((row) => {
    return Object.keys(row).reduce((acc, k) => {
      const val = row[k as keyof GridDataXSBUnknown.DataGridRow];
      if (typeof val === "object") {
        return { ...acc, [k]: JSON.stringify(val) };
      }

      return { ...acc, [k]: val };
    }, {});
  });

  return (
    <DataGrid
      className="flex-grow select-none text-xs text-foreground/80"
      columns={columns}
      rows={rows}
      onCellDoubleClick={({ row }) => {
        onRowDoubleClick?.(row);
      }}
      renderers={{ noRowsFallback: <EmptyRowsRenderer loading={loading} /> }}
      rowKeyGetter={rowKey ? (row) => (row as any)[rowKey] : undefined}
      rowHeight={32}
      headerRowHeight={36}
    />
  );
}
