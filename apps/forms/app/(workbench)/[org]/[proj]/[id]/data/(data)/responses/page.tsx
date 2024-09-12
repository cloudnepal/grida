"use client";

import Invalid from "@/components/invalid";
import {
  useDatagridTable,
  useEditorState,
  useFormFields,
} from "@/scaffolds/editor";
import {
  FormResponseFeedProvider,
  FormResponseSyncProvider,
  FormXSupabaseMainTableFeedProvider,
  FormXSupabaseMainTableSyncProvider,
} from "@/scaffolds/editor/feed";
import {
  GDocFormsXSBTable,
  GDocTable,
  GDocTableID,
} from "@/scaffolds/editor/state";
import { EditorSymbols } from "@/scaffolds/editor/symbols";
import { CurrentTable } from "@/scaffolds/editor/utils/switch-table";
import { GridEditor } from "@/scaffolds/grid-editor";
import { GridData } from "@/scaffolds/grid-editor/grid-data";
import { GFResponseRow } from "@/scaffolds/grid/types";
import { useMemo } from "react";

export default function FormResponsesPage() {
  const [state] = useEditorState();
  const { doctype, datagrid_table_id } = state;

  if (doctype !== "v0_form") {
    return <Invalid />;
  }

  return (
    <CurrentTable
      table={EditorSymbols.Table.SYM_GRIDA_FORMS_WHATEVER_MAIN_TABLE_INDICATOR}
    >
      {/* wait until state fully change */}
      {allowedtable(datagrid_table_id) && <SwitchGridEditor />}
    </CurrentTable>
  );
}

function SwitchGridEditor() {
  const [state] = useEditorState();
  const { datagrid_table_id } = state;

  switch (datagrid_table_id) {
    case EditorSymbols.Table.SYM_GRIDA_FORMS_RESPONSE_TABLE_ID:
      return (
        <>
          <FormResponseFeedProvider />
          <FormResponseSyncProvider />
          <FormResponseGridEditor />
        </>
      );
    case EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID:
      return (
        <>
          <FormXSupabaseMainTableFeedProvider />
          <FormXSupabaseMainTableSyncProvider />
          <ModeXSBMainTable />
        </>
      );
    default:
      return <Invalid />;
  }
}

function FormResponseGridEditor() {
  const [state, dispatch] = useEditorState();
  const {
    form,
    tablespace,
    datagrid_local_filter: datagrid_filter,
    datagrid_table_id,
  } = state;

  const tb = useDatagridTable<GDocTable>();

  const fields = useFormFields();

  const responses_stream =
    tablespace[EditorSymbols.Table.SYM_GRIDA_FORMS_RESPONSE_TABLE_ID].stream;

  const { systemcolumns, columns } = useMemo(
    () =>
      GridData.columns({
        table_id: EditorSymbols.Table.SYM_GRIDA_FORMS_RESPONSE_TABLE_ID,
        fields,
      }),
    [fields]
  );

  // Transforming the responses into the format expected by react-data-grid
  const { filtered, inputlength } = useMemo(() => {
    return GridData.rows({
      form_id: form.form_id,
      // TODO: types with symbols not working ?
      table: datagrid_table_id as any,
      fields: fields,
      filter: datagrid_filter,
      responses: responses_stream ?? [],
    });
  }, [
    form.form_id,
    datagrid_table_id,
    fields,
    responses_stream,
    datagrid_filter,
  ]);

  return (
    <>
      <GridEditor
        systemcolumns={systemcolumns}
        columns={columns}
        rows={filtered as GFResponseRow[]}
        readonly={false}
        selection={"on"}
        deletion={"on"}
      />
    </>
  );
}

function ModeXSBMainTable() {
  const [state, dispatch] = useEditorState();

  const {
    form,
    tablespace,
    datagrid_local_filter: datagrid_filter,
    datagrid_table_id,
  } = state;

  const tb = useDatagridTable<GDocFormsXSBTable>();

  const fields = useFormFields();

  const stream =
    tablespace[EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID]
      .stream;

  const { systemcolumns, columns } = useMemo(
    () =>
      datagrid_table_id
        ? GridData.columns({
            table_id:
              EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID,
            fields,
            x_table_constraints: {
              pk: tb?.x_sb_main_table_connection.pk,
              pks: tb?.x_sb_main_table_connection.pks ?? [],
            },
          })
        : { systemcolumns: [], columns: [] },
    [datagrid_table_id, fields, tb]
  );

  const { filtered } = useMemo(() => {
    return GridData.rows({
      form_id: form.form_id,
      table: EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID,
      fields: fields,
      filter: datagrid_filter,
      data: {
        pks: tb?.x_sb_main_table_connection.pks ?? [],
        rows: stream ?? [],
      },
    });
  }, [form.form_id, fields, tb, stream, datagrid_filter]);

  if (!tb) {
    return <Invalid />;
  }

  return (
    <>
      <GridEditor
        systemcolumns={systemcolumns}
        columns={columns}
        rows={filtered as GFResponseRow[]}
        readonly={tb.readonly}
        selection="on"
        deletion="on"
      />
    </>
  );
}

function allowedtable(table: GDocTableID | null): boolean {
  return (
    table === EditorSymbols.Table.SYM_GRIDA_FORMS_RESPONSE_TABLE_ID ||
    table === EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID
  );
}
