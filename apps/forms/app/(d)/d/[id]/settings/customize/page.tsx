import React from "react";
import { createServerComponentClient } from "@/lib/supabase/server";
import { FormPageLanguagePreferences } from "@/scaffolds/settings/form-page-language-preferences";
import { RedirectPreferences } from "@/scaffolds/settings/redirect-preferences";
import {
  MaxRespoonses,
  RestrictNumberOfResponseByCustomer,
} from "@/scaffolds/settings/response-preferences";
import { cookies } from "next/headers";
import {
  Sector,
  SectorBlocks,
  SectorDescription,
  SectorHeader,
  SectorHeading,
} from "@/components/preferences";
import { notFound } from "next/navigation";
import { CustomPoweredByBrandingPreferences } from "@/scaffolds/settings/custom-powered-by-branding-preferences";

export default async function FormsCustomizeSettingsPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();

  const form_id = params.id;

  const supabase = createServerComponentClient(cookieStore);

  const { data } = await supabase
    .from("form")
    .select()
    .eq("id", form_id)
    .single();

  if (!data) {
    return notFound();
  }

  const {
    default_form_page_language,
    is_powered_by_branding_enabled,
    redirect_after_response_uri,
    is_redirect_after_response_uri_enabled,
    max_form_responses_by_customer,
    is_max_form_responses_by_customer_enabled,
    max_form_responses_in_total,
    is_max_form_responses_in_total_enabled,
  } = data!;

  return (
    <main className="max-w-2xl mx-auto">
      <Sector>
        <SectorHeader>
          <SectorHeading>Language</SectorHeading>
        </SectorHeader>
        <FormPageLanguagePreferences
          form_id={form_id}
          init={{
            default_form_page_language,
          }}
        />
      </Sector>
      <Sector>
        <SectorHeader>
          <SectorHeading>Responses</SectorHeading>
          <SectorDescription>
            Manage how responses are collected and protected
          </SectorDescription>
        </SectorHeader>
        <SectorBlocks>
          <RestrictNumberOfResponseByCustomer
            form_id={form_id}
            init={{
              is_max_form_responses_by_customer_enabled,
              max_form_responses_by_customer,
            }}
          />
          <MaxRespoonses
            form_id={form_id}
            init={{
              is_max_form_responses_in_total_enabled,
              max_form_responses_in_total,
            }}
          />
        </SectorBlocks>
      </Sector>
      <Sector>
        <SectorHeader>
          <SectorHeading>Redirection</SectorHeading>
          <SectorDescription>
            Customize redirection url after submission
          </SectorDescription>
        </SectorHeader>
        <RedirectPreferences
          form_id={form_id}
          init={{
            is_redirect_after_response_uri_enabled:
              is_redirect_after_response_uri_enabled,
            redirect_after_response_uri: redirect_after_response_uri ?? "",
          }}
        />
      </Sector>
      <Sector>
        <SectorHeader>
          <SectorHeading>Branding</SectorHeading>
          <SectorDescription>
            Opt-out from Grida branding on built-in pages
          </SectorDescription>
        </SectorHeader>
        <CustomPoweredByBrandingPreferences
          form_id={form_id}
          init={{
            is_powered_by_branding_enabled,
          }}
        />
      </Sector>
    </main>
  );
}
