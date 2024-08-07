import { TemplateVariables } from "@/lib/templating";
import { fmt_local_index } from "@/utils/fmt";
import { en, ko, Faker } from "@faker-js/faker";
import { useMemo, useState } from "react";

const fakerlocales = {
  en: en,
  ko: ko,
};

function lngFallback(lng: "en" | "ko" | (string | {})) {
  return fakerlocales[lng as "en" | "ko"] || en;
}

export function mockContext({
  lang = "en",
  title,
}: Partial<TemplateVariables.FormResponseContext> & { lang?: string }) {
  const faker = new Faker({
    // @ts-ignore
    locale: lngFallback(lang),
  });

  const short_id = () =>
    faker.string.hexadecimal({
      length: {
        min: 1,
        max: 5,
      },
    });

  const response_index = faker.number.int(50);
  const context: TemplateVariables.FormResponseContext = {
    customer: {
      short_id: short_id(),
    },
    form_title: title || faker.lorem.words(3),
    title: title || faker.lorem.words(3),
    fields: {},
    language: "en",
    response: {
      short_id: short_id(),
      index: response_index,
      idx: fmt_local_index(response_index),
    },
    session: {},
  };

  return context;
}

export function useMockedContext(
  init: Partial<TemplateVariables.FormResponseContext>,
  config: {
    lang?: string;
    refreshKey?: string;
  }
) {
  const context = useMemo(
    () => mockContext({ ...init, lang: config.lang }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.refreshKey]
  );

  return context;
}
