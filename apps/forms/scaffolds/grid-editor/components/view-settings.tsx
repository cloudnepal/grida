"use client";

import React, { useCallback, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommitIcon, GearIcon } from "@radix-ui/react-icons";
import { format, startOfDay, addSeconds } from "date-fns";
import { format as formatTZ } from "date-fns-tz";
import { useDatagridTable, useEditorState } from "@/scaffolds/editor";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { editorlink } from "@/lib/forms/url";
import {
  EditorSymbols,
  SYM_LOCALTZ,
  tztostr,
} from "@/scaffolds/editor/symbols";
import { PaletteIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ResourceTypeIcon } from "@/components/resource-type-icon";
import { DataViewType } from "@/scaffolds/editor/state";

// dummy example date - happy star wars day!
const starwarsday = new Date(new Date().getFullYear(), 4, 4);

export function GridViewSettings() {
  const tb = useDatagridTable();

  const simulator_available =
    tb?.id === EditorSymbols.Table.SYM_GRIDA_FORMS_RESPONSE_TABLE_ID ||
    tb?.id === EditorSymbols.Table.SYM_GRIDA_FORMS_SESSION_TABLE_ID;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center">
          <Badge variant="outline" className="cursor-pointer">
            <GearIcon />
          </Badge>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel>View Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <LayoutMenu />
        <DropdownMenuSeparator />
        <DropdownMenuLabel inset className="text-xs text-muted-foreground">
          Data Consistency & Protection
        </DropdownMenuLabel>
        {/* empty data filter */}
        <_EmptyDataHidden />

        {/* data masking */}
        <_MaskingEnabled />
        <DropdownMenuSeparator />
        <DropdownMenuLabel inset className="text-xs text-muted-foreground">
          Date Format
        </DropdownMenuLabel>
        {/* date format */}
        <_DateFormat />
        <DropdownMenuSeparator />
        <DropdownMenuLabel inset className="text-xs text-muted-foreground">
          Date Timezone
        </DropdownMenuLabel>
        {/* tz */}
        <_TimeZone />

        {simulator_available && <_DoctypeFormsSimulator />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LayoutMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <DropdownMenuItem className="relative pl-8">
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <PaletteIcon className="w-4 h-4" />
          </span>
          Layout & Design
        </DropdownMenuItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        <_LayoutMenuContent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const _view_types = [
  {
    type: "table",
    label: "Table",
    icon: "table",
  },
  {
    type: "gallery",
    label: "Gallery",
    icon: "gallery",
  },
  {
    type: "list",
    label: "List",
    icon: "list",
  },
  {
    type: "chart",
    label: "Chart",
    icon: "chart",
  },
] as const;

function _LayoutMenuContent() {
  const [state, dispatch] = useEditorState();
  const tb = useDatagridTable();

  const onLayoutChange = useCallback(
    (value: string) => {
      if (!tb) return;
      if (!value) return;
      dispatch({
        type: "editor/data-grid/table/view",
        table_id: tb.id,
        table_view_type: value as DataViewType,
      });
    },
    [dispatch]
  );

  return (
    <div>
      <section className="px-2">
        <ToggleGroup
          type="single"
          value={tb?.view}
          onValueChange={onLayoutChange}
          className="grid grid-cols-4 gap-1"
        >
          {_view_types.map((view, i) => (
            <ToggleGroupItem
              key={i}
              value={view.type}
              variant="outline"
              className="w-16 h-16 flex-col gap-1"
            >
              <ResourceTypeIcon type={view.icon} className="w-6 h-6" />
              <span className="text-muted-foreground text-xs">
                {view.label}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </section>
    </div>
  );
}

function _EmptyDataHidden() {
  const [state, dispatch] = useEditorState();

  const { datagrid_local_filter: datagrid_filter } = state;

  return (
    <DropdownMenuCheckboxItem
      checked={datagrid_filter.empty_data_hidden}
      onCheckedChange={(checked) => {
        dispatch({
          type: "editor/data-grid/local-filter",
          empty_data_hidden: checked,
        });
      }}
    >
      Hide records with empty data
    </DropdownMenuCheckboxItem>
  );
}

function _MaskingEnabled() {
  const [state, dispatch] = useEditorState();

  const { datagrid_local_filter: datagrid_filter } = state;

  return (
    <DropdownMenuCheckboxItem
      checked={datagrid_filter.masking_enabled}
      onCheckedChange={(checked) => {
        dispatch({
          type: "editor/data-grid/local-filter",
          masking_enabled: checked,
        });
      }}
    >
      Mask data
    </DropdownMenuCheckboxItem>
  );
}

function _DateFormat() {
  const [state, dispatch] = useEditorState();
  const tb = useDatagridTable();

  const {
    doctype,
    datetz,
    dateformat,
    datagrid_local_filter: datagrid_filter,
    datagrid_table_id,
  } = state;

  return (
    <DropdownMenuRadioGroup
      value={dateformat}
      onValueChange={(value) => {
        dispatch({
          type: "editor/data-grid/dateformat",
          dateformat: value as any,
        });
      }}
    >
      <DropdownMenuRadioItem value="date">
        Date
        <DropdownMenuShortcut>
          {starwarsday.toLocaleDateString()}
        </DropdownMenuShortcut>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="time">
        Time
        <DropdownMenuShortcut>
          {starwarsday.toLocaleTimeString()}
        </DropdownMenuShortcut>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="datetime">
        Date Time
        <DropdownMenuShortcut className="ms-4">
          {starwarsday.toLocaleString()}
        </DropdownMenuShortcut>
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  );
}

function _TimeZone() {
  const [state, dispatch] = useEditorState();

  const { doctype, datetz } = state;

  const tzoffset = useMemo(
    () => s2Hmm(new Date().getTimezoneOffset() * -1 * 60),
    []
  );

  return (
    <DropdownMenuRadioGroup
      value={tztostr(datetz, "browser")}
      onValueChange={(tz) => {
        switch (tz) {
          case "browser":
            dispatch({ type: "editor/data-grid/tz", tz: SYM_LOCALTZ });
            return;
          default:
            dispatch({ type: "editor/data-grid/tz", tz: tz });
            return;
        }
      }}
    >
      <DropdownMenuRadioItem value="browser">
        Local Time
        <DropdownMenuShortcut>(UTC+{tzoffset})</DropdownMenuShortcut>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="UTC">
        UTC Time
        <DropdownMenuShortcut>(UTC+0)</DropdownMenuShortcut>
      </DropdownMenuRadioItem>
      {doctype === "v0_form" && <_DoctypeFormsCampaignTZ />}
    </DropdownMenuRadioGroup>
  );
}

function _DoctypeFormsSimulator() {
  const [state, dispatch] = useEditorState();

  return (
    <>
      <DropdownMenuSeparator />
      <Link
        href={editorlink("data/simulator", {
          basepath: state.basepath,
          document_id: state.document_id,
        })}
        target="_blank"
      >
        <DropdownMenuItem className="cursor-pointer">
          <CommitIcon className="inline align-middle me-2" />
          Open Simulator
        </DropdownMenuItem>
      </Link>
    </>
  );
}

function _DoctypeFormsCampaignTZ() {
  const [state] = useEditorState();

  const {
    form: {
      campaign: { scheduling_tz },
    },
  } = state;

  const tzoffset_scheduling_tz = useMemo(
    () =>
      scheduling_tz
        ? formatTZ(new Date(), "XXX", { timeZone: scheduling_tz })
        : undefined,
    [scheduling_tz]
  );

  return (
    <DropdownMenuRadioItem
      disabled={!scheduling_tz}
      value={scheduling_tz ?? "N/A"}
    >
      Scheduling Time
      {scheduling_tz && (
        <DropdownMenuShortcut className="text-end">
          {scheduling_tz}
          <br />
          (UTC{tzoffset_scheduling_tz})
        </DropdownMenuShortcut>
      )}
    </DropdownMenuRadioItem>
  );
}

function s2Hmm(s: number) {
  const now = new Date();
  const startOfDayDate = startOfDay(now);
  const updatedDate = addSeconds(startOfDayDate, s);
  const formattedTime = format(updatedDate, "H:mm");

  return formattedTime;
}
