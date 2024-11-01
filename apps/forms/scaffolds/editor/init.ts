import { editorbasepath } from "@/lib/forms/url";
import type {
  BaseDocumentEditorInit,
  BaseDocumentEditorState,
  SchemaDocumentEditorInit,
  EditorInit,
  FormDocumentEditorInit,
  EditorState,
  MenuItem,
  SiteDocumentEditorInit,
  IDataGridState,
  GDocTableID,
  GDocTable,
  TTablespace,
  TableXSBMainTableConnection,
  GDocSchemaTable,
  TableMenuItem,
} from "./state";
import { blockstreeflat } from "@/lib/forms/tree";
import { SYM_LOCALTZ, EditorSymbols } from "./symbols";
import { FormFieldDefinition, GridaXSupabase } from "@/types";
import { SupabasePostgRESTOpenApi } from "@/lib/supabase-postgrest";
import { nanoid } from "nanoid";
import { DataGridLocalPreferencesStorage } from "./storage/datagrid.storage";
import { Data } from "@/lib/data";
import * as samples from "@/theme/templates/formcollection/samples";
import { grida } from "@/grida";

export function initialEditorState(init: EditorInit): EditorState {
  switch (init.doctype) {
    case "v0_form":
      return initialFormEditorState(init);
    case "v0_site":
      return initialSiteEditorState(init);
    case "v0_schema":
      return initialDatabaseEditorState(init);
    default:
      throw new Error("unsupported doctype");
  }
}

const initial_sidebar_mode = {
  v0_form: "build",
  v0_site: "build",
  v0_schema: "data",
} as const;

function initialBaseDocumentEditorState(
  init: BaseDocumentEditorInit
): Omit<BaseDocumentEditorState, "documents" | "pages" | "selected_page_id"> {
  const basepath = editorbasepath({
    org: init.organization.name,
    proj: init.project.name,
  });

  return {
    basepath: basepath,
    doctype: init.doctype,
    document_id: init.document_id,
    document_title: init.document_title,
    organization: init.organization,
    project: init.project,
    user_id: init.user_id,
    cursor_id: nanoid(4), // 4 is enough for multiplayer
    saving: false,
    theme: init.theme,
    assets: {
      backgrounds: [],
    },
    row_editor: {
      open: false,
    },
    customer_editor: {
      open: false,
    },
    insertmenu: {
      open: false,
    },
    field_editor: {
      open: false,
    },
    dateformat: "datetime",
    datetz: SYM_LOCALTZ,
  };
}

export function initialDatagridState(
  view_id?: string
): Omit<IDataGridState, "datagrid_table_id"> {
  const cleared: Omit<IDataGridState, "datagrid_table_id"> = {
    datagrid_selected_rows: new Set(),
    datagrid_query: {
      ...Data.Relation.INITIAL_QUERY_STATE,
      q_text_search: {
        query: "",
        type: "websearch",
        column: null,
      },
    },
    datagrid_query_estimated_count: null,
    datagrid_isloading: false,
    datagrid_local_filter: {
      masking_enabled: false,
      empty_data_hidden: true,
    },
    datagrid_selected_cell: null,
  };

  if (view_id) {
    // used by reducer
    // TODO: it is a good practive to do this in a hook.
    // I'm too lazy to do it now.
    const pref = DataGridLocalPreferencesStorage.get(view_id);
    if (pref) {
      return {
        ...cleared,
        datagrid_local_filter: {
          ...cleared.datagrid_local_filter!,
          masking_enabled: pref.masking_enabled ?? false,
        },
        datagrid_query: {
          ...cleared.datagrid_query!,
          q_predicates: pref.predicates ?? [],
          q_orderby: pref.orderby ?? {},
        },
      };
    }
  }
  return cleared;
}

export function table_to_sidebar_table_menu(
  tb: {
    id: GDocTableID;
    name: string;
    x_sb_main_table_connection?: TableXSBMainTableConnection;
  },
  {
    basepath,
    document_id,
  }: {
    basepath: string;
    document_id: string;
  }
): TableMenuItem {
  return {
    section: "Tables",
    id: tb.id,
    label: tb.name,
    icon: tb.x_sb_main_table_connection ? "supabase" : "table",
    href: tablehref(basepath, document_id, tb),
    layout: true,
    data: {
      readonly: tb.x_sb_main_table_connection
        ? SupabasePostgRESTOpenApi.table_methods_is_get_only(
            tb.x_sb_main_table_connection?.sb_postgrest_methods
          )
        : false,
      rules: {
        delete_restricted: false,
      },
    },
  };
}

/**
 * // FIXME: not ready
 * @deprecated @beta
 * @param init
 * @returns
 */
function initialDatabaseEditorState(
  init: SchemaDocumentEditorInit
): EditorState {
  const base = initialBaseDocumentEditorState(init);

  const tables: GDocTable[] = [...init.tables.map(schematableinit)];

  const sb_auth_users = {
    provider: "x-supabase-auth",
    id: EditorSymbols.Table.SYM_GRIDA_X_SUPABASE_AUTH_USERS_TABLE_ID,
    row_keyword: "user",
    icon: "supabase",
    name: "auth.users",
    label: "auth.users",
    description: null,
    readonly: true,
    rules: {
      delete_restricted: true,
    },
    view: "table",
  } satisfies GDocTable;

  const should_add_sb_auth_users =
    init.supabase_project && tables.some((t) => t.provider === "x-supabase");

  return {
    ...base,
    supabase_project: init.supabase_project,
    connections: {},
    pages: [],
    documents: {},
    sidebar: {
      mode: initial_sidebar_mode[init.doctype],
      mode_data: {
        tables: init.tables
          .map((t) =>
            table_to_sidebar_table_menu(t, {
              basepath: base.basepath,
              document_id: base.document_id,
            })
          )
          .concat(
            should_add_sb_auth_users
              ? [
                  {
                    id: EditorSymbols.Table
                      .SYM_GRIDA_X_SUPABASE_AUTH_USERS_TABLE_ID,
                    href: tablehref(
                      base.basepath,
                      base.document_id,
                      sb_auth_users
                    ),
                    label: "auth.users",
                    icon: "supabase",
                    section: "Tables",
                    data: {
                      readonly: true,
                      rules: {
                        delete_restricted: true,
                      },
                    },
                  } satisfies TableMenuItem,
                ]
              : []
          ),
        menus: [],
      },
    },
    ...initialDatagridState(),
    datagrid_table_id: init.tables.length > 0 ? init.tables[0].id : null,
    tables: tables.concat(should_add_sb_auth_users ? [sb_auth_users] : []),
    // @ts-expect-error TODO: clear
    tablespace: {
      // @ts-expect-error TODO: clear
      ...init.tables.reduce((acc: Record<GDocTableID, TTablespace>, t) => {
        // @ts-expect-error TODO: clear
        acc[t.id] = {
          provider: t.x_sb_main_table_connection ? "x-supabase" : "grida",
          readonly: false,
          realtime: true,
          stream: [],
          // @ts-expect-error TODO: clear
        } satisfies TTablespace;
        return acc;
      }, {}),
      [EditorSymbols.Table.SYM_GRIDA_X_SUPABASE_AUTH_USERS_TABLE_ID]:
        "noop" as never,
    },
    transactions: [],
  };
}

/**
 * // FIXME: not ready
 * @deprecated @beta
 * @param init
 * @returns
 */
function initialSiteEditorState(init: SiteDocumentEditorInit): EditorState {
  const base = initialBaseDocumentEditorState(init);
  // @ts-ignore
  return {
    ...base,
    pages: sitedocumentpagesinit({
      basepath: base.basepath,
      document_id: init.document_id,
    }),
    selected_page_id: "site/dev-collection",
    documents: {
      ["site/dev-collection"]: {
        editable: true,
        template: {
          name: "formcollection_sample_001_the_bundle",
          type: "template",
          properties: {},
          default: {},
          props: samples["formcollection_sample_001_the_bundle"] as any,
          overrides: {},
          version: "0.0.0",
          nodes: {},
        },
      },
    },
    sidebar: {
      mode: initial_sidebar_mode[init.doctype],
      mode_data: { tables: [], menus: [] },
    },
    tables: [],
  };
}

function initialFormEditorState(init: FormDocumentEditorInit): EditorState {
  // prepare initial available_field_ids
  const field_ids = init.fields.map((f) => f.id);
  const block_referenced_field_ids = init.blocks
    .map((b) => b.form_field_id)
    .filter((id) => id !== null) as string[];
  const block_available_field_ids = field_ids.filter(
    (id) => !block_referenced_field_ids.includes(id)
  );

  const is_main_table_supabase =
    !!init.connections?.supabase?.main_supabase_table;

  const base = initialBaseDocumentEditorState(init);

  const { basepath, document_id } = base;

  const tables = init.connections?.supabase?.main_supabase_table
    ? {
        [EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID]: {
          id: EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID,
          provider: "x-supabase",
          row_keyword: "row",
          icon: "supabase",
          name: init.connections.supabase.main_supabase_table.sb_table_name,
          label: init.connections.supabase.main_supabase_table.sb_table_name,
          description: null,
          readonly: false,
          x_sb_main_table_connection: xsb_table_conn_init({
            sb_table_id: init.connections.supabase.main_supabase_table.id,
            ...init.connections.supabase.main_supabase_table,
          })!,
          rules: {
            delete_restricted: true,
          },
          view: "table",
        } satisfies GDocTable,
      }
    : {
        [EditorSymbols.Table.SYM_GRIDA_FORMS_RESPONSE_TABLE_ID]: {
          id: EditorSymbols.Table.SYM_GRIDA_FORMS_RESPONSE_TABLE_ID,
          provider: "grida",
          row_keyword: "response",
          icon: "table",
          name: "response",
          label: "Responses",
          description: null,
          readonly: false,
          rules: {
            delete_restricted: true,
          },
          view: "table",
        } satisfies GDocTable,
        [EditorSymbols.Table.SYM_GRIDA_FORMS_SESSION_TABLE_ID]: {
          id: EditorSymbols.Table.SYM_GRIDA_FORMS_SESSION_TABLE_ID,
          provider: "custom",
          row_keyword: "session",
          icon: "table",
          name: "session",
          label: "Sessions",
          description: null,
          readonly: true,
          rules: {
            delete_restricted: true,
          },
          view: "table",
        } satisfies GDocTable,
        [EditorSymbols.Table.SYM_GRIDA_CUSTOMER_TABLE_ID]: {
          id: EditorSymbols.Table.SYM_GRIDA_CUSTOMER_TABLE_ID,
          provider: "custom",
          row_keyword: "customer",
          icon: "user",
          name: "customer",
          label: "Customers",
          description: null,
          readonly: true,
          rules: {
            delete_restricted: true,
          },
          view: "table",
        } satisfies GDocTable,
      };

  const tablemenus = init.connections?.supabase?.main_supabase_table
    ? [
        {
          id: EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID,
          href: tablehref(
            basepath,
            document_id,
            (tables as any)[
              EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID
            ]
          ),
          label: "Responses",
          icon: "supabase",
          section: "Tables",
          data: {
            readonly: false,
            rules: {
              delete_restricted: true,
            },
          },
        } satisfies TableMenuItem,
      ]
    : [
        {
          id: EditorSymbols.Table.SYM_GRIDA_FORMS_RESPONSE_TABLE_ID,
          href: tablehref(
            basepath,
            document_id,
            (tables as any)[
              EditorSymbols.Table.SYM_GRIDA_FORMS_RESPONSE_TABLE_ID
            ]
          ),
          label: "Responses",
          icon: "table",
          section: "Tables",
          data: {
            readonly: false,
            rules: {
              delete_restricted: true,
            },
          },
        } satisfies TableMenuItem,
        {
          id: EditorSymbols.Table.SYM_GRIDA_FORMS_SESSION_TABLE_ID,
          href: tablehref(
            basepath,
            document_id,
            (tables as any)[
              EditorSymbols.Table.SYM_GRIDA_FORMS_SESSION_TABLE_ID
            ]
          ),
          label: "Sessions",
          icon: "table",
          section: "Tables",
          data: {
            readonly: true,
            rules: {
              delete_restricted: true,
            },
          },
        } satisfies TableMenuItem,
        {
          id: EditorSymbols.Table.SYM_GRIDA_CUSTOMER_TABLE_ID,
          href: tablehref(
            basepath,
            document_id,
            (tables as any)[EditorSymbols.Table.SYM_GRIDA_CUSTOMER_TABLE_ID]
          ),
          label: "Customers",
          icon: "user",
          section: "Tables",
          data: {
            readonly: true,
            rules: {
              delete_restricted: true,
            },
          },
        } satisfies TableMenuItem,
      ];

  const tableids = Object.getOwnPropertySymbols(tables);
  const values = tableids.map((id) => (tables as any)[id]);

  return {
    ...base,
    supabase_project: init.connections?.supabase?.supabase_project ?? null,
    connections: {
      store_id: init.connections?.store_id,
      supabase: init.connections?.supabase,
    },
    theme: init.theme,
    sidebar: {
      mode: initial_sidebar_mode[init.doctype],
      mode_data: {
        tables: tablemenus,
        menus: [
          {
            id: `/${basepath}/${document_id}/data/analytics`,
            section: "Analytics",
            href: `/${basepath}/${document_id}/data/analytics`,
            icon: "chart",
            label: "Realtime",
            data: {},
          },
        ],
      },
    },
    tables: values,

    blocks: blockstreeflat(init.blocks),
    pages: formdocumentpagesinit({
      basepath: base.basepath,
      document_id: init.document_id,
    }),
    selected_page_id: "form",
    documents: {
      "form/startpage": init.start
        ? {
            editable: true,
            template: init.start,
          }
        : undefined,
    },
    form: {
      form_id: init.form_id,
      form_title: init.form_title,
      campaign: init.campaign,
      ending: init.ending,
      fields: init.fields,
      form_security: init.form_security,
      available_field_ids: block_available_field_ids,
    },
    tablespace: {
      [EditorSymbols.Table.SYM_GRIDA_FORMS_RESPONSE_TABLE_ID]: {
        provider: "grida",
        readonly: false,
        realtime: true,
        stream: [],
      },
      [EditorSymbols.Table.SYM_GRIDA_FORMS_SESSION_TABLE_ID]: {
        provider: "custom",
        readonly: true,
        stream: undefined,
        realtime: false,
      },
      [EditorSymbols.Table.SYM_GRIDA_CUSTOMER_TABLE_ID]: {
        provider: "custom",
        readonly: true,
        stream: undefined,
        realtime: false,
      },
      [EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID]: {
        provider: "x-supabase",
        readonly: true,
        stream: [],
        realtime: false,
      },
      // noop
      [EditorSymbols.Table.SYM_GRIDA_X_SUPABASE_AUTH_USERS_TABLE_ID]:
        "noop" as never,
    },
    transactions: [],
    ...initialDatagridState(),
    datagrid_table_id: is_main_table_supabase
      ? EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID
      : EditorSymbols.Table.SYM_GRIDA_FORMS_RESPONSE_TABLE_ID,
  };
}

function sitedocumentpagesinit({
  basepath,
  document_id,
}: {
  basepath: string;
  document_id: string;
}): MenuItem<string>[] {
  return [
    {
      section: "Pages",
      id: "site/dev-collection",
      label: "home",
      href: `/${basepath}/${document_id}/design`,
      icon: "file",
      data: {},
    },
  ];
}

function formdocumentpagesinit({
  basepath,
  document_id,
}: {
  basepath: string;
  document_id: string;
}): MenuItem<string>[] {
  return [
    {
      section: "Design",
      id: "campaign",
      label: "Campaign",
      href: `/${basepath}/${document_id}/form`,
      icon: "folder",
      data: {},
    },
    // TODO: not ready
    {
      section: "Design",
      id: "form/startpage",
      label: "Cover",
      href: `/${basepath}/${document_id}/form/start`,
      icon: "file",
      level: 1,
      data: {},
    },
    {
      section: "Design",
      id: "form",
      label: "Main",
      href: `/${basepath}/${document_id}/form/edit`,
      icon: "file",
      level: 1,
      data: {},
    },
    {
      section: "Design",
      id: "ending",
      label: "Ending",
      href: `/${basepath}/${document_id}/form/end`,
      icon: "file",
      level: 1,
      data: {},
    },
    {
      section: "Results",
      id: "results",
      label: "Results",
      href: `/${basepath}/${document_id}/data/responses`,
      icon: "folder",
      data: {},
    },
    {
      section: "Results",
      id: "responses",
      label: "Responses",
      href: `/${basepath}/${document_id}/data/responses`,
      icon: "table",
      level: 1,
      data: {},
    },
  ];
}

export function schematableinit(table: {
  id: string;
  name: string;
  description?: string | null;
  attributes: FormFieldDefinition[];
  x_sb_main_table_connection?: TableXSBMainTableConnection;
}): GDocSchemaTable {
  if (table.x_sb_main_table_connection) {
    // table shall be readonly if it is a view or if it has no primary key
    // we don't support patch operations without pk
    const readonly =
      SupabasePostgRESTOpenApi.table_methods_is_get_only(
        table.x_sb_main_table_connection.sb_postgrest_methods
      ) || table.x_sb_main_table_connection.pk === undefined;

    return {
      provider: "x-supabase",
      id: table.id,
      name: table.name,
      label: table.name,
      description: table.description || null,
      readonly: readonly,
      row_keyword: "row",
      icon: "supabase",
      attributes: table.attributes,
      x_sb_main_table_connection: table.x_sb_main_table_connection,
      rules: {
        delete_restricted: false,
      },
      view: "table",
    } satisfies GDocSchemaTable;
  } else {
    return {
      provider: "grida",
      id: table.id,
      name: table.name,
      label: table.name,
      description: table.description || null,
      readonly: false,
      row_keyword: "row",
      icon: "table",
      attributes: table.attributes,
      rules: {
        delete_restricted: false,
      },
      view: "table",
    } satisfies GDocSchemaTable;
  }
}

export function xsb_table_conn_init(conn?: {
  supabase_project_id: number;
  sb_schema_name: string;
  sb_table_name: string;
  sb_table_id: number;
  sb_table_schema: GridaXSupabase.JSONSChema;
  sb_postgrest_methods: GridaXSupabase.XSBPostgrestMethod[];
}): TableXSBMainTableConnection | undefined {
  // TODO: need inspection - will supbaseconn present even when main table is not present?
  // if yes, we need to adjust the state to be nullable
  if (!conn) return undefined;

  const def: Data.Relation.TableDefinition = {
    name: conn.sb_table_name,
    ...SupabasePostgRESTOpenApi.parse_supabase_postgrest_schema_definition(
      conn.sb_table_schema
    ),
  };

  return {
    supabase_project_id: conn.supabase_project_id,
    sb_table_id: conn.sb_table_id,
    sb_schema_name: conn.sb_schema_name as string,
    sb_table_name: conn.sb_table_name as string,
    sb_table_schema: conn.sb_table_schema,
    sb_postgrest_methods: conn.sb_postgrest_methods,
    pks: def.pks,
    pk: def.pks[0],
    definition: def,
  } satisfies TableXSBMainTableConnection;
}

function tablehref(
  basepath: string,
  document_id: string,
  table: {
    id: GDocTableID;
    name: string;
  }
) {
  switch (table.id) {
    case EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID:
    case EditorSymbols.Table.SYM_GRIDA_FORMS_RESPONSE_TABLE_ID:
      return `/${basepath}/${document_id}/data/responses`;
    case EditorSymbols.Table.SYM_GRIDA_FORMS_SESSION_TABLE_ID:
      return `/${basepath}/${document_id}/data/responses/sessions`;
    case EditorSymbols.Table.SYM_GRIDA_CUSTOMER_TABLE_ID:
      return `/${basepath}/${document_id}/data/customers`;
    case EditorSymbols.Table.SYM_GRIDA_X_SUPABASE_AUTH_USERS_TABLE_ID:
      return `/${basepath}/${document_id}/data/x/auth.users`;
  }

  // v0_schema table
  return `/${basepath}/${document_id}/data/table/${table.name}`;
}
