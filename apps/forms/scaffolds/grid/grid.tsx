"use client";

import React, { useEffect, useRef } from "react";
import "react-data-grid/lib/styles.css";
import DataGrid, {
  Column,
  RenderCellProps,
  RenderEditCellProps,
  RenderHeaderCellProps,
} from "react-data-grid";
import {
  PlusIcon,
  ChevronDownIcon,
  EnvelopeClosedIcon,
  TextIcon,
  ImageIcon,
  EnterFullScreenIcon,
  CalendarIcon,
  Link2Icon,
  Pencil1Icon,
  TrashIcon,
  GlobeIcon,
  DropdownMenuIcon,
  CheckCircledIcon,
  EyeClosedIcon,
  ColorWheelIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@editor-ui/dropdown-menu";
import { FormFieldType } from "@/types";

export function Grid({
  columns,
  rows,
  onAddNewFieldClick,
  onEditFieldClick,
  onDeleteFieldClick,
}: {
  columns: {
    key: string;
    name: string;
    type?: string;
  }[];
  rows: { __id: string; [key: string]: string | number | boolean }[];
  onAddNewFieldClick?: () => void;
  onEditFieldClick?: (id: string) => void;
  onDeleteFieldClick?: (id: string) => void;
}) {
  const __leading_column: Column<any> = {
    key: "__",
    name: "",
    frozen: true,
    width: 50,
    renderHeaderCell: LeadingHeaderCell,
    renderCell: LeadingCell,
  };

  const __id_column: Column<any> = {
    key: "__gf_id",
    name: "id",
    frozen: true,
    resizable: true,
    width: 100,
    renderHeaderCell: DefaultPropertyHeaderCell,
  };

  const __created_at_column: Column<any> = {
    key: "__gf_created_at",
    name: "time",
    frozen: true,
    resizable: true,
    width: 100,
    renderHeaderCell: DefaultPropertyHeaderCell,
  };

  const __new_column: Column<any> = {
    key: "__gf_new",
    name: "+",
    resizable: false,
    draggable: true,
    width: 100,
    renderHeaderCell: (props) => (
      <NewFieldHeaderCell {...props} onClick={onAddNewFieldClick} />
    ),
  };

  const formattedColumns = [__leading_column, __id_column, __created_at_column]
    .concat(
      columns.map(
        (col) =>
          ({
            key: col.key,
            name: col.name,
            resizable: true,
            draggable: true,
            editable: true,
            width: undefined,
            renderHeaderCell: (props) => (
              <FieldHeaderCell
                {...props}
                type={col.type as FormFieldType}
                onEditClick={() => {
                  onEditFieldClick?.(col.key);
                }}
                onDeleteClick={() => {
                  onDeleteFieldClick?.(col.key);
                }}
              />
            ),
            renderCell: FieldCell,
            renderEditCell: FieldEditCell,
          }) as Column<any>
      )
    )
    .concat(__new_column);

  return (
    <DataGrid
      className="border border-gray-200 dark:border-gray-900 h-max select-none"
      columns={formattedColumns}
      rows={rows}
    />
  );
}

function LeadingHeaderCell({ column }: RenderHeaderCellProps<any>) {
  return <div></div>;
}

function LeadingCell({ column }: RenderCellProps<any>) {
  return (
    <div className="flex group items-center justify-between h-full w-full">
      {/* <input type="checkbox" /> */}
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
      return <Link2Icon />;
    case "__gf_created_at":
      return <CalendarIcon />;
  }
}

function FieldHeaderCell({
  column,
  type,
  onEditClick,
  onDeleteClick,
}: RenderHeaderCellProps<any> & {
  type: FormFieldType;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}) {
  const { name } = column;

  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2">
        <FormFieldTypeIcon type={type} />
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
              <Pencil1Icon />
              Edit Field
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDeleteClick}>
              <TrashIcon />
              Delete Field
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
}

function FormFieldTypeIcon({ type }: { type: FormFieldType }) {
  switch (type) {
    case "text":
      return <TextIcon />;
    case "tel":
    case "email":
      return <EnvelopeClosedIcon />;
    case "radio":
    case "select":
      return <DropdownMenuIcon />;
    case "url":
      return <GlobeIcon />;
    case "image":
      return <ImageIcon />;
    case "checkbox":
      return <CheckCircledIcon />;
    case "date":
    case "month":
    case "week":
      return <CalendarIcon />;
    case "password":
      return <EyeClosedIcon />;
    case "color":
      return <ColorWheelIcon />;
    default:
      return <TextIcon />;
  }
}

function NewFieldHeaderCell({
  onClick,
}: RenderHeaderCellProps<any> & {
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded p-2 bg-neutral-100 w-full flex items-center justify-center"
    >
      <PlusIcon />
    </button>
  );
}

function FieldCell({ column, row }: RenderCellProps<any>) {
  const data = row[column.key];

  if (!data) {
    return <></>;
  }

  const { type, value } = data;

  const unwrapped = JSON.parse(value);

  let display = unwrapped;
  switch (type as FormFieldType) {
    case "text":
      display = unwrapped;
      break;
    case "password":
      display = "●".repeat(display?.length ?? 0);
      break;
    case "checkbox": {
      return <input type="checkbox" checked={unwrapped} disabled />;
    }
  }

  return <div>{display}</div>;
}

function FieldEditCell({ column, row }: RenderEditCellProps<any>) {
  const data = row[column.key];
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      // focus & select all
      ref.current.focus();
      ref.current.select();
    }
  }, [ref]);

  if (!data) {
    return <></>;
  }

  const { type, value } = data;

  const unwrapped = JSON.parse(value);

  switch (type as FormFieldType) {
    case "email":
    case "password":
    case "tel":
    case "textarea":
    case "url":
    case "text":
      return (
        <input
          ref={ref}
          readOnly
          className="w-full px-2 appearance-none outline-none border-none"
          type="text"
          defaultValue={unwrapped}
        />
      );
    case "select":
      return <select></select>;
    case "color":
      return <input readOnly disabled type="color" defaultValue={unwrapped} />;
    case "checkbox":
      return (
        <input readOnly disabled type="checkbox" defaultChecked={unwrapped} />
      );
  }
}
