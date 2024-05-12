"use server";

import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";
import { ZJSONForm } from "@/types/zod";

export async function generate(input: string) {
  const stream = createStreamableValue({});

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai("gpt-4-1106-preview"),
      prompt: input,
      schema: ZJSONForm,
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject as any);
    }

    stream.done();
  })();

  return { output: stream.value };
}
