import type {
  Appearance,
  Customer,
  EndingPageI18nOverrides,
  EndingPageTemplateID,
  FontFamily,
  FormBlock,
  FormBlockType,
  FormFieldDefinition,
  FormFieldInit,
  FormMethod,
  FormPageBackgroundSchema,
  FormResponse,
  FormResponseField,
  FormResponseSession,
  FormResponseUnknownFieldHandlingStrategyType,
  FormStyleSheetV1Schema,
  FormsPageLanguage,
  GDocumentType,
  GridaSupabase,
  OrderBy,
} from "@/types";
import { SYM_LOCALTZ, EditorSymbols } from "./symbols";
import { ZodObject } from "zod";
import { Tokens } from "@/ast";
import React from "react";
import { ResourceTypeIconName } from "@/components/resource-type-icon";

export type GDocEditorRouteParams = {
  org: string;
  proj: string;
  id: string;
};

export type DraftID = `[draft]${string}`;
export const DRAFT_ID_START_WITH = "[draft]";
const ISDEV = process.env.NODE_ENV === "development";

export interface EditorFlatFormBlock<T = FormBlockType> extends FormBlock<T> {
  id: string | DraftID;
}

export interface BaseDocumentEditorInit {
  organization: {
    name: string;
    id: number;
  };
  project: {
    name: string;
    id: number;
  };
  document_id: string;
  document_title: string;
  doctype: GDocumentType;
  theme: EditorState["theme"];
}

export type EditorInit =
  | FormDocumentEditorInit
  | SiteDocumentEditorInit
  | DatabaseDocumentEditorInit;

export interface SiteDocumentEditorInit extends BaseDocumentEditorInit {
  doctype: "v0_site";
}

export interface DatabaseDocumentEditorInit extends BaseDocumentEditorInit {
  doctype: "v0_schema";
  tables: ReadonlyArray<{
    id: string;
    name: string;
    description: string | null;
    attributes: Array<FormFieldDefinition>;
  }>;
}

export interface FormDocumentEditorInit extends BaseDocumentEditorInit {
  doctype: "v0_form";
  form_id: string;
  campaign: EditorState["campaign"];
  form_security: EditorState["form_security"];
  ending: EditorState["ending"];
  connections?: {
    store_id?: number | null;
    supabase?: GridaSupabase.SupabaseConnectionState;
  };
  form_title: string;
  blocks: EditorFlatFormBlock[];
  fields: FormFieldDefinition[];
}

export interface DataGridFilterSettings {
  localsearch?: string; // local search uses fuse.js to available data
  masking_enabled: boolean;
  empty_data_hidden: boolean;
}

export type GDocTable = {
  /**
   * keyword indicating the row, singular form (will be made plural in the UI)
   * e.g. "row" "user" "session" "customer"
   */
  row_keyword: string;
  name: string;
  icon: ResourceTypeIconName;
  readonly: boolean;
  label: string;
} & (
  | {
      id: typeof EditorSymbols.Table.SYM_GRIDA_FORMS_RESPONSE_TABLE_ID;
    }
  | {
      id: typeof EditorSymbols.Table.SYM_GRIDA_FORMS_SESSION_TABLE_ID;
    }
  | {
      id: typeof EditorSymbols.Table.SYM_GRIDA_CUSTOMER_TABLE_ID;
    }
  | {
      id: typeof EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID;
    }
  | {
      id: typeof EditorSymbols.Table.SYM_GRIDA_X_SUPABASE_AUTH_USERS_TABLE_ID;
    }
  | GDocSchemaTable
);

export type GDocSchemaTable = {
  id: string;
  attributes: Array<FormFieldDefinition>;
};

export type GDocTableID = GDocTable["id"];

export interface MenuItem<ID> {
  section: string;
  id: ID;
  level?: number;
  label: string;
  icon: ResourceTypeIconName;
  href?: string;
}

export type TableType =
  | "response"
  | "customer"
  | "schema"
  | "x-supabase-auth.users";

export interface IDataGridState {
  /**
   * @global rows per page is not saved per table
   */
  datagrid_rows_per_page: number;
  datagrid_table_id: GDocTableID | null;
  datagrid_table_refresh_key: number;
  datagrid_isloading: boolean;
  datagrid_filter: DataGridFilterSettings;
  datagrid_orderby: { [key: string]: OrderBy };
  datagrid_selected_rows: Set<string>;
}

/**
 * Utility state for entity edit dialog. id shall be processed within the correct context.
 */
interface TGlobalEditorDialogState<T = never> {
  id?: string;
  refreshkey?: number;
  open: boolean;
  data?: T;
}

export type TVirtualRowData<T> = { [attributekey: string]: T };
export type TVirtualRow<T = Record<string, any>, M = Record<string, any>> = {
  id: string;
  data: TVirtualRowData<T>;
  meta: M;
};

/**
 * Utility state for global data stream state.
 */
export interface TGlobalDataStreamState<T> {
  readonly: boolean;
  realtime: boolean;
  stream?: Array<T>;
}

interface IRowEditorState {
  row_editor: TGlobalEditorDialogState;
}

interface ICustomerEditorState {
  customer_editor: TGlobalEditorDialogState;
}

interface IEditorDateContextState {
  dateformat: "date" | "time" | "datetime";
  datetz: typeof SYM_LOCALTZ | string;
}

interface IEditorSidebarState {
  sidebar: {
    mode: "project" | "build" | "data" | "connect";
    mode_data: {
      tables: MenuItem<GDocTableID>[];
      menus: MenuItem<GDocTableID>[];
    };
  };
}

interface IEditorGlobalSavingState {
  saving: boolean;
}

interface IEditorAssetsState {
  assets: {
    backgrounds: {
      name: string;
      title: string;
      embed: string;
      preview: [string] | [string, string];
    }[];
  };
}

interface IInsertionMenuState {
  insertmenu: TGlobalEditorDialogState;
}

export interface BaseDocumentEditorState
  extends IEditorGlobalSavingState,
    IEditorDateContextState,
    IEditorAssetsState,
    IInsertionMenuState,
    IFieldEditorState,
    ICustomerEditorState,
    IRowEditorState {
  basepath: string;
  organization: {
    name: string;
    id: number;
  };
  project: {
    name: string;
    id: number;
  };
  document_id: string;
  document_title: string;
  doctype: GDocumentType;
  document: {
    pages: MenuItem<string>[];
    selected_page_id?: string;
    nodes: any[];
    templatesample?: string;
    templatedata: {
      [key: string]: {
        text?: Tokens.StringValueExpression;
        template_id: string;
        attributes?: Omit<
          React.HtmlHTMLAttributes<HTMLDivElement>,
          "style" | "className"
        >;
        properties?: { [key: string]: Tokens.StringValueExpression };
        style?: React.CSSProperties;
      };
    };
    selected_node_id?: string;
    selected_node_type?: string;
    selected_node_schema?: ZodObject<any> | null;
    selected_node_default_properties?: Record<string, any>;
    selected_node_default_style?: React.CSSProperties;
    selected_node_default_text?: Tokens.StringValueExpression;
    selected_node_context?: Record<string, any>;
  };
  theme: {
    is_powered_by_branding_enabled: boolean;
    lang: FormsPageLanguage;
    appearance: Appearance;
    palette?: FormStyleSheetV1Schema["palette"];
    fontFamily: FontFamily;
    customCSS?: FormStyleSheetV1Schema["custom"];
    section?: FormStyleSheetV1Schema["section"];
    background?: FormPageBackgroundSchema;
  };
}

interface IFieldEditorState {
  field_editor: TGlobalEditorDialogState<{
    draft: Partial<FormFieldInit> | null;
  }>;
}

interface ITablespaceEditorState {
  tables: Array<GDocTable>;
  /**
   * you can find the records for the table data here
   *
   * `{[table_id]: { stream: [{ id, data: {...}, meta }]} }`
   */
  tablespace: {
    [EditorSymbols.Table
      .SYM_GRIDA_FORMS_RESPONSE_TABLE_ID]: TGlobalDataStreamState<
      TVirtualRow<FormResponseField, FormResponse>
    >;
    [EditorSymbols.Table
      .SYM_GRIDA_FORMS_SESSION_TABLE_ID]: TGlobalDataStreamState<FormResponseSession>;
    [EditorSymbols.Table
      .SYM_GRIDA_CUSTOMER_TABLE_ID]: TGlobalDataStreamState<Customer>;
    [EditorSymbols.Table.SYM_GRIDA_FORMS_X_SUPABASE_MAIN_TABLE_ID]: never;
    [EditorSymbols.Table.SYM_GRIDA_X_SUPABASE_AUTH_USERS_TABLE_ID]: never;
  } & Record<string, TGlobalDataStreamState<TVirtualRow>>;
}

export interface FormEditorState
  extends BaseDocumentEditorState,
    IEditorSidebarState,
    ITablespaceEditorState,
    IDataGridState {
  form_id: string;
  form_title: string;
  connections: {
    store_id?: number | null;
    supabase?: GridaSupabase.SupabaseConnectionState;
  };
  campaign: {
    max_form_responses_by_customer: number | null;
    is_max_form_responses_by_customer_enabled: boolean;
    max_form_responses_in_total: number | null;
    is_max_form_responses_in_total_enabled: boolean;
    is_force_closed: boolean;
    is_scheduling_enabled: boolean;
    scheduling_open_at: string | null;
    scheduling_close_at: string | null;
    scheduling_tz?: string;
  };
  form_security: {
    unknown_field_handling_strategy: FormResponseUnknownFieldHandlingStrategyType;
    method: FormMethod;
  };
  ending: {
    is_redirect_after_response_uri_enabled: boolean;
    redirect_after_response_uri: string | null;
    is_ending_page_enabled: boolean;
    ending_page_template_id: EndingPageTemplateID | null;
    ending_page_i18n_overrides: EndingPageI18nOverrides | null;
  };

  blocks: EditorFlatFormBlock[];

  fields: FormFieldDefinition[];

  available_field_ids: string[];
  focus_block_id?: string | null;

  x_supabase_main_table?: {
    schema: GridaSupabase.JSONSChema;
    // we need a single pk for editor operations
    gfpk: string | undefined;
    pks: string[];
    rows: GridaSupabase.XDataRow[];
  };
}

export type EditorState = FormEditorState;
