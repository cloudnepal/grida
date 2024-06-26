import { grida_xsupabase_client } from "@/lib/supabase/server";
import { secureformsclient } from "@/lib/supabase/vault";
import { ConnectionSupabaseJoint, GridaSupabase } from "@/types";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { SupabaseStorageExtensions } from "@/lib/supabase/storage-ext";
import { render } from "@/lib/templating/template";
import type { XSupabaseStorageSchema } from "@/types";
import type { TemplateVariables } from "@/lib/templating";
import type { StorageError } from "@supabase/storage-js";
import assert from "assert";
import "core-js/features/map/group-by";

export async function createXSupabaseClient(
  supabase_project_id: number,
  config?: { service_role?: boolean }
): Promise<SupabaseClient<any, any>> {
  // fetch connection table
  const { data: supabase_project, error: supabase_project_err } =
    await grida_xsupabase_client
      .from("supabase_project")
      .select("*, tables:supabase_table(*)")
      .eq("id", supabase_project_id)
      .single();

  if (supabase_project_err || !supabase_project) {
    throw new Error("supabase_project not found");
  }
  const { sb_project_url, sb_anon_key } = supabase_project;

  let serviceRoleKey: string | null = null;
  if (config?.service_role) {
    const { data } = await secureFetchServiceKey(supabase_project.id);
    serviceRoleKey = data;
    assert(serviceRoleKey, "serviceRoleKey is required");
  }

  const apiKey = serviceRoleKey || sb_anon_key;

  const sbclient = createClient(sb_project_url, apiKey);

  return sbclient;
}

export async function secureFetchServiceKey(supabase_project_id: number) {
  return secureformsclient.rpc(
    "reveal_secret_connection_supabase_service_key",
    {
      p_supabase_project_id: supabase_project_id,
    }
  );
}

export async function secureCreateServiceKey(
  supabase_project_id: number,
  service_key: string
) {
  return secureformsclient.rpc(
    "create_secret_connection_supabase_service_key",
    {
      p_supabase_project_id: supabase_project_id,
      p_secret: service_key,
    }
  );
}

export class GridaXSupabaseService {
  constructor() {}

  async getConnection(
    conn: ConnectionSupabaseJoint
  ): Promise<GridaSupabase.SupabaseConnectionState | null> {
    const { supabase_project_id, main_supabase_table_id } = conn;

    const { data: supabase_project, error: supabase_project_err } =
      await grida_xsupabase_client
        .from("supabase_project")
        .select(`*, tables:supabase_table(*)`)
        .eq("id", supabase_project_id)
        .single();

    if (supabase_project_err) console.error(supabase_project_err);
    if (!supabase_project) {
      return null;
    }

    return {
      ...conn,
      supabase_project: supabase_project! as GridaSupabase.SupabaseProject,
      main_supabase_table_id,
      tables: supabase_project!.tables as any as GridaSupabase.SupabaseTable[],
      main_supabase_table:
        (supabase_project!.tables.find(
          (t) => t.id === main_supabase_table_id
        ) as any as GridaSupabase.SupabaseTable) || null,
    };
  }
}

export namespace XSupabase {
  //
  //

  export namespace Storage {
    export type CreateSignedUrlResult =
      | {
          data: { signedUrl: string };
          error: null;
        }
      | {
          data: null;
          error: StorageError;
        };

    export type CreateSignedUrlsResult =
      | {
          data: {
            error: string | null;
            path: string | null;
            signedUrl: string;
          }[];
          error: null;
        }
      | {
          data: null;
          error: StorageError;
        };

    export class ConnectedClient {
      constructor(public readonly storage: SupabaseClient["storage"]) {}

      async exists(storage: XSupabaseStorageSchema, row: Record<string, any>) {
        assert(storage.type === "x-supabase");
        const { bucket, path: pathtemplate } = storage;
        const renderedpath = renderpath(pathtemplate, {
          NEW: row,
          RECORD: row,
        });

        return await SupabaseStorageExtensions.exists(
          this.storage,
          bucket,
          renderedpath
        );
      }

      createSignedUrl(
        row: Record<string, any>,
        fieldstorage: XSupabaseStorageSchema
      ) {
        assert(fieldstorage.type === "x-supabase");
        const { bucket, path: pathtemplate } = fieldstorage;
        const renderedpath = renderpath(pathtemplate, {
          NEW: row,
          RECORD: row,
        });

        return this.storage.from(bucket).createSignedUrl(renderedpath, 60);
      }

      async createSignedUrls(
        row: Record<string, any>,
        fields: (XSupabaseStorageSchema & { id: string })[]
      ): Promise<Record<string, CreateSignedUrlsResult["data"]>> {
        // group fields by bucket
        const grouped_by_bucket = Map.groupBy(fields, (f) => f.bucket);

        const tasks: Promise<CreateSignedUrlsResult>[] = [];

        Array.from(grouped_by_bucket.entries()).map(
          async ([bucket, fields]: [string, XSupabaseStorageSchema[]]) => {
            const paths = fields.map((f) => {
              const renderedpath = renderpath(f.path, {
                NEW: row,
                RECORD: row,
              });
              return renderedpath;
            });
            tasks.push(this.storage.from(bucket).createSignedUrls(paths, 60));
          }
        );

        const resolved = await Promise.all(tasks);

        const result: Record<string, CreateSignedUrlsResult["data"]> = {};

        resolved.forEach((curr, index) => {
          if (!curr.error) {
            const field = fields[index];
            result[field.id] = curr.data;
          }
        });

        return result;
      }
    }

    export function renderpath<
      R extends Record<string, any> = Record<string, any>,
    >(
      pathtemplate: string,
      data: TemplateVariables.ConnectedDatasourcePostgresSelectRecordContext<R>
    ) {
      return render(pathtemplate, data);
    }
  }
}
