"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import DataGrid, {
  Column,
  CopyEvent,
  PasteEvent,
  RenderCellProps,
  RenderEditCellProps,
  RenderHeaderCellProps,
} from "react-data-grid";
import {
  PlusIcon,
  ChevronDownIcon,
  EnterFullScreenIcon,
  CalendarIcon,
  Link2Icon,
  Pencil1Icon,
  TrashIcon,
  AvatarIcon,
  ArrowRightIcon,
  DownloadIcon,
  FileIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormInputType } from "@/types";
import { JsonEditCell } from "./json-cell";
import { useEditorState } from "../editor";
import { GFResponseRow } from "./types";
import { SelectColumn } from "./select-column";
import "./grid.css";
import { unwrapFeildValue } from "@/lib/forms/unwrap";
import { Button } from "@/components/ui/button";
import { FormFieldTypeIcon } from "@/components/form-field-type-icon";
import { toZonedTime } from "date-fns-tz";
import { tztostr } from "../editor/symbols";
import { mask } from "./mask";
import toast from "react-hot-toast";
import { FormValue } from "@/services/form";
function rowKeyGetter(row: GFResponseRow) {
  return row.__gf_id;
}

export function ResponseGrid({
  columns,
  rows,
  selectionDisabled,
  readonly,
  onAddNewFieldClick,
  onEditFieldClick,
  onDeleteFieldClick,
  onCellChange,
}: {
  columns: {
    key: string;
    name: string;
    type?: string;
  }[];
  rows: GFResponseRow[];
  selectionDisabled?: boolean;
  readonly?: boolean;
  onAddNewFieldClick?: () => void;
  onEditFieldClick?: (id: string) => void;
  onDeleteFieldClick?: (id: string) => void;
  onCellChange?: (row: GFResponseRow, column: string, value: any) => void;
}) {
  const [state, dispatch] = useEditorState();
  const { selected_responses } = state;

  const onSelectedRowsChange = (selectedRows: ReadonlySet<string>) => {
    dispatch({
      type: "editor/response/select",
      selection: selectedRows,
    });
  };

  const __id_column: Column<GFResponseRow> = {
    key: "__gf_display_id",
    name: "id",
    frozen: true,
    resizable: true,
    width: 100,
    renderHeaderCell: DefaultPropertyHeaderCell,
  };

  const __created_at_column: Column<GFResponseRow> = {
    key: "__gf_created_at",
    name: "time",
    frozen: true,
    resizable: true,
    width: 100,
    renderHeaderCell: DefaultPropertyHeaderCell,
    renderCell: DefaultPropertyDateCell,
  };

  const __customer_uuid_column: Column<GFResponseRow> = {
    key: "__gf_customer_id",
    name: "customer",
    frozen: true,
    resizable: true,
    width: 100,
    renderHeaderCell: DefaultPropertyHeaderCell,
    renderCell: DefaultPropertyCustomerCell,
  };

  const __new_column: Column<GFResponseRow> = {
    key: "__gf_new",
    name: "+",
    resizable: false,
    draggable: true,
    width: 100,
    renderHeaderCell: (props) => (
      <NewFieldHeaderCell {...props} onClick={onAddNewFieldClick} />
    ),
  };

  const formattedColumns = [
    __id_column,
    __created_at_column,
    __customer_uuid_column,
  ]
    .concat(
      columns.map(
        (col) =>
          ({
            key: col.key,
            name: col.name,
            resizable: true,
            draggable: true,
            editable: true,
            minWidth: 150,
            width: undefined,
            renderHeaderCell: (props) => (
              <FieldHeaderCell
                {...props}
                type={col.type as FormInputType}
                onEditClick={() => {
                  onEditFieldClick?.(col.key);
                }}
                onDeleteClick={() => {
                  onDeleteFieldClick?.(col.key);
                }}
              />
            ),
            renderCell: FieldCell,
            renderEditCell: !readonly ? FieldEditCell : undefined,
          }) as Column<any>
      )
    )
    .concat(__new_column);

  if (!selectionDisabled) {
    formattedColumns.unshift(SelectColumn);
  }

  const onCopy = (e: CopyEvent<GFResponseRow>) => {
    console.log(e);
    let val: string | undefined;
    if (e.sourceColumnKey.startsWith("__gf_")) {
      // copy value as is
      val = (e.sourceRow as any)[e.sourceColumnKey];
    } else {
      // copy value from fields
      const field = e.sourceRow.fields[e.sourceColumnKey];
      const value = field.value;
      val = unwrapFeildValue(value, field.type as FormInputType)?.toString();
    }

    if (val) {
      // copy to clipboard
      const cp = navigator.clipboard.writeText(val);
      toast.promise(cp, {
        loading: "Copying to clipboard...",
        success: "Copied to clipboard",
        error: "Failed to copy to clipboard",
      });
    }
  };

  return (
    <DataGrid
      className="flex-grow border border-neutral-200 dark:border-neutral-900 select-none"
      rowKeyGetter={rowKeyGetter}
      columns={formattedColumns}
      selectedRows={selectionDisabled ? undefined : selected_responses}
      onCopy={onCopy}
      onRowsChange={(rows, data) => {
        const key = data.column.key;
        const indexes = data.indexes;

        for (const i of indexes) {
          const row = rows[i];
          const field = row.fields[key];
          const value = field.value;

          onCellChange?.(row, key, value);
        }
      }}
      onSelectedRowsChange={
        selectionDisabled ? undefined : onSelectedRowsChange
      }
      rows={rows}
      rowHeight={44}
    />
  );
}

function LeadingHeaderCell({ column }: RenderHeaderCellProps<any>) {
  return <div></div>;
}

function LeadingCell({ column }: RenderCellProps<any>) {
  return (
    <div className="flex group items-center justify-between h-full w-full">
      <input type="checkbox" />
      <button className="opacity-0 group-hover:opacity-100">
        <EnterFullScreenIcon />
      </button>
    </div>
  );
}

function DefaultPropertyHeaderCell({ column }: RenderHeaderCellProps<any>) {
  const { name, key } = column;

  return (
    <div className="flex items-center gap-2">
      <DefaultPropertyIcon __key={key} />
      <span className="font-normal">{name}</span>
    </div>
  );
}

function DefaultPropertyIcon({ __key: key }: { __key: string }) {
  switch (key) {
    case "__gf_id":
    case "__gf_display_id":
      return <Link2Icon className="min-w-4" />;
    case "__gf_created_at":
      return <CalendarIcon className="min-w-4" />;
    case "__gf_customer_id":
    case "__gf_customer":
      return <AvatarIcon className="min-w-4" />;
  }
}

function FieldHeaderCell({
  column,
  type,
  onEditClick,
  onDeleteClick,
}: RenderHeaderCellProps<any> & {
  type: FormInputType;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}) {
  const { name } = column;

  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2">
        <FormFieldTypeIcon type={type} className="w-4 h-4" />
        <span className="font-normal">{name}</span>
      </span>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button>
            <ChevronDownIcon />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="z-50">
            <DropdownMenuItem onClick={onEditClick}>
              <Pencil1Icon className="me-2 align-middle" />
              Edit Field
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDeleteClick}>
              <TrashIcon className="me-2 align-middle" />
              Delete Field
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
}

function NewFieldHeaderCell({
  onClick,
}: RenderHeaderCellProps<any> & {
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded p-2 bg-neutral-100 dark:bg-neutral-900 w-full flex items-center justify-center"
    >
      <PlusIcon />
    </button>
  );
}

function DefaultPropertyDateCell({
  column,
  row,
}: RenderCellProps<GFResponseRow>) {
  const [state] = useEditorState();

  const date = row.__gf_created_at;

  const { dateformat, datetz } = state;

  if (!date) {
    return <></>;
  }

  return <>{fmtdate(date, dateformat, tztostr(datetz))}</>;
}

function fmtdate(
  date: Date | string,
  format: "date" | "time" | "datetime",
  tz?: string
) {
  if (typeof date === "string") {
    date = new Date(date);
  }

  if (tz) {
    date = toZonedTime(date, tz);
  }

  switch (format) {
    case "date":
      return date.toLocaleDateString();
    case "time":
      return date.toLocaleTimeString();
    case "datetime":
      return date.toLocaleString();
  }
}

function DefaultPropertyCustomerCell({
  column,
  row,
}: RenderCellProps<GFResponseRow>) {
  const [state, dispatch] = useEditorState();

  const data = row.__gf_customer_id;

  if (!data) {
    return <></>;
  }

  return (
    <div className="w-full flex justify-between">
      <span className="font-mono text-ellipsis flex-1 overflow-hidden">
        {data}
      </span>
      <FKButton
        onClick={() => {
          dispatch({
            type: "editor/customers/edit",
            open: true,
            customer_id: data,
          });
        }}
      />
    </div>
  );
}

function FKButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="outline" className="m-1 p-2" onClick={onClick}>
      <ArrowRightIcon className="w-3 h-3" />
    </Button>
  );
}

function FieldCell({ column, row }: RenderCellProps<GFResponseRow>) {
  const [state] = useEditorState();
  const data = row.fields[column.key];

  if (!data) {
    return <></>;
  }

  const { type, value, files } = data;

  const unwrapped = unwrapFeildValue(value, type as FormInputType);

  if (unwrapped === null || unwrapped === "") {
    return (
      <span className="text-muted-foreground/50">
        <Empty value={unwrapped} />
      </span>
    );
  }

  switch (type as FormInputType) {
    case "switch":
    case "checkbox": {
      return <input type="checkbox" checked={unwrapped as boolean} disabled />;
    }
    case "file": {
      return (
        <div className="w-full h-full flex gap-2">
          {files?.map((f, i) => (
            <span key={i}>
              <FileIcon className="inline w-4 h-4 align-middle me-2" />
              {f.name}
            </span>
          ))}
        </div>
      );
    }
    case "image": {
      return (
        <div className="w-full h-full flex gap-2">
          {files?.map((file, i) => (
            <figure className="p-1 flex items-center gap-2" key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file.src}
                alt={file.name}
                className="h-full min-w-10 aspect-square rounded overflow-hidden object-cover bg-neutral-500"
              />
              <figcaption>{file.name}</figcaption>
            </figure>
          ))}
        </div>
      );
    }
    default:
      return (
        <div>
          {state.datagrid_filter.masking_enabled &&
          typeof unwrapped === "string"
            ? mask(unwrapped)
            : unwrapped}
        </div>
      );
  }
}

function FieldEditCell(props: RenderEditCellProps<GFResponseRow>) {
  const { column, row } = props;
  const data = row.fields[column.key];
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const wasEscPressed = useRef(false);

  useEffect(() => {
    if (ref.current) {
      // focus & select all
      ref.current.focus();
      ref.current.select();
    }
  }, [ref]);

  const { type, value, files } = data ?? {};

  const onKeydown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      const val = ref.current?.value;
      onCommit(e);
    }
    if (e.key === "Escape") {
      wasEscPressed.current = true;
    }
  };

  const onBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!wasEscPressed.current) {
      const val = ref.current?.value;
      onCommit(e);
    } else {
      wasEscPressed.current = false;
    }
  };

  const onCommit = (
    e:
      | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let val: any = ref.current?.value;
    switch (e.currentTarget.type) {
      case "checkbox": {
        val = (e.currentTarget as HTMLInputElement).checked;
        break;
      }
      case "number":
        val = parseFloat(val);
        break;
    }

    props.onRowChange(
      {
        ...row,
        fields: {
          ...row.fields,
          [column.key]: {
            ...data,
            value: JSON.stringify(val),
          },
        },
      },
      true
    );
  };

  try {
    const unwrapped = value ? unwrapFeildValue(value, type) : undefined;

    switch (type as FormInputType) {
      case "email":
      case "password":
      case "tel":
      case "url":
      case "text":
      case "hidden": {
        return (
          <input
            ref={ref as React.RefObject<HTMLInputElement>}
            type={type}
            className="w-full px-2 appearance-none outline-none border-none"
            defaultValue={unwrapped as string}
            onKeyDown={onKeydown}
            onBlur={onBlur}
          />
        );
      }
      case "textarea": {
        return (
          <textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            className="w-full px-2 appearance-none outline-none border-none"
            defaultValue={unwrapped as string}
            onKeyDown={onKeydown}
            onBlur={onBlur}
          />
        );
      }
      case "number": {
        return (
          <input
            ref={ref as React.RefObject<HTMLInputElement>}
            className="w-full px-2 appearance-none outline-none border-none"
            type="number"
            defaultValue={unwrapped as string | number}
            onKeyDown={onKeydown}
            onBlur={onBlur}
          />
        );
      }
      case "date":
      case "datetime-local":
      case "time":
      case "month":
      case "week": {
        return (
          <input
            ref={ref as React.RefObject<HTMLInputElement>}
            type={type}
            className="w-full px-2 appearance-none outline-none border-none"
            defaultValue={unwrapped as string}
            onKeyDown={onKeydown}
            onBlur={onBlur}
          />
        );
      }
      case "color":
        return (
          <input
            type="color"
            defaultValue={unwrapped as string}
            onKeyDown={onKeydown}
            onBlur={onBlur}
          />
        );
      case "file":
      case "image": {
        return (
          <div>
            {files?.map((f, i) => (
              <a
                key={i}
                href={f.download}
                target="_blank"
                rel="noreferrer"
                download
              >
                <Button variant="link" size="sm">
                  <DownloadIcon className="me-2 align-middle" />
                  Download {f.name}
                </Button>
              </a>
            ))}
          </div>
        );
      }
      case "toggle":
      case "switch":
      case "checkbox": {
        return (
          <div className="px-2 w-full h-full flex justify-between items-center">
            <input
              ref={ref as React.RefObject<HTMLInputElement>}
              type="checkbox"
              defaultChecked={unwrapped === true}
              onKeyDown={onKeydown}
              onBlur={onBlur}
            />
          </div>
        );
      }
      case "toggle-group":
      case "radio":
      case "select":
        return <JsonEditCell {...props} />;
      // not supported
      case "checkboxes":
      case "signature":
      case "payment":
        return (
          <div className="px-2 w-full text-muted-foreground">
            Editing not supported
          </div>
        );
      default:
        return <JsonEditCell {...props} />;
    }
  } catch (e) {
    console.error(e);
    return <JsonEditCell {...props} />;
  }
}

function Empty({ value }: { value?: null | undefined | "" }) {
  if (value === null) {
    return <>NULL</>;
  }
  if (value === "") {
    return <>EMPTY</>;
  }
  return <></>;
}
