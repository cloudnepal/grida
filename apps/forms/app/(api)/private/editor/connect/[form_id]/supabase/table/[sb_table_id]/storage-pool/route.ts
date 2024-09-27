import { createRouteHandlerClient } from "@/lib/supabase/server";
import { get_grida_table_x_supabase_table_connector } from "@/services/x-supabase";
import {
  XSupabaseStorageCrossBucketTaskPooler,
  XSupabaseStorageTaskPoolerResult,
} from "@/services/x-supabase/xsb-storage-pooler";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    form_id: string;
    sb_table_id: string;
  };
};

interface XSBStorageBulkResolverRequest {
  pkcol: string;
  rows: Record<string, any>[];
}

export async function POST(req: NextRequest, context: Context) {
  const cookieStore = cookies();
  const grida_forms_client = createRouteHandlerClient(cookieStore);
  const { form_id, sb_table_id: _sb_table_id } = context.params;
  const sb_table_id = parseInt(_sb_table_id);

  const body: XSBStorageBulkResolverRequest = await req.json();

  const { grida_table, main_supabase_table, x_client, x_storage_client } =
    await get_grida_table_x_supabase_table_connector({
      form_id,
      sb_table_id: sb_table_id,
      client: grida_forms_client,
    });

  const { fields } = grida_table;

  const pooler = new XSupabaseStorageCrossBucketTaskPooler(x_storage_client);
  pooler.queue(fields, body.rows, body.pkcol);

  const xsb_storage_files: XSupabaseStorageTaskPoolerResult | null =
    await pooler.resolve();

  return NextResponse.json({ data: xsb_storage_files });
}
