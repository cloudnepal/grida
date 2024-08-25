import { PrivateEditorApi } from "@/lib/private";
import { SupabasePostgRESTOpenApi } from "@/lib/supabase-postgrest";
import { createRouteHandlerXSBClient } from "@/lib/supabase/server";
import { GridaSupabase } from "@/types";
import { EditorApiResponse } from "@/types/private/api";
import { DontCastJsonProperties } from "@/types/supabase-ext";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface Context {
  params: {};
}

export async function POST(req: NextRequest, context: Context) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerXSBClient(cookieStore);

  const data: PrivateEditorApi.SupabaseConnection.CreateProjectConnectionRequest =
    await req.json();
  const { project_id, sb_project_url, sb_anon_key } = data;

  const { sb_project_reference_id, sb_schema_definitions } =
    await SupabasePostgRESTOpenApi.fetch_supabase_postgrest_swagger({
      url: sb_project_url,
      anonKey: sb_anon_key,
      schemas: ["public"],
    });

  // 1. create supabase project
  const { data: supabase_project, error: supabase_project_err } = await supabase
    .from("supabase_project")
    .insert({
      project_id: project_id,
      sb_anon_key,
      sb_project_reference_id,
      sb_public_schema: sb_schema_definitions["public"],
      sb_schema_definitions,
      sb_schema_names: ["public"],
      sb_project_url,
    })
    .select()
    .single();

  if (supabase_project_err) {
    console.error(supabase_project_err);
    return NextResponse.error();
  }

  return NextResponse.json({
    data: supabase_project as DontCastJsonProperties<
      GridaSupabase.SupabaseProject,
      "sb_public_schema" | "sb_schema_definitions"
    >,
  } satisfies EditorApiResponse<GridaSupabase.SupabaseProject>);
}
