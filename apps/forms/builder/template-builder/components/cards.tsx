import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HalfHeightGradient } from "./gradient-overlay";
import { SlashIcon } from "@radix-ui/react-icons";
import { withTemplateDefinition } from "@/builder/template-builder/with-template";
import { NodeSlot } from "@/builder/template-builder/node";
import { Media } from "./media";
import { TemplateBuilderWidgets } from "../widgets";
import { grida } from "@/grida";

const card_properties_definition = {
  badge: { type: "string" },
  tags: { type: "array", items: { type: "string" } },
  h1: { type: "string" },
  p: { type: "string" },
  date1: { type: "string" },
  date2: { type: "string" },
  n: { type: "number" },
  media: { type: "image" },
  // media: MediaSchema,
} satisfies grida.program.template.TemplateDefinition["properties"];

type CardUserProps = grida.program.schema.TInferredPropTypes<
  typeof card_properties_definition
>;

type CardMasterProps =
  grida.program.template.IBuiltinTemplateNodeReactComponentRenderProps<CardUserProps>;

export const Card_001 = withTemplateDefinition(
  ({
    props: { h1, p, date1, n, badge, media, date2, tags },
    style,
  }: CardMasterProps) => {
    return (
      <Card
        className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl"
        style={style}
      >
        <div className="flex overflow-hidden rounded-t-lg">
          {badge && (
            <div className="absolute z-10 top-0 left-0 py-4 px-4">
              <Badge>{badge}</Badge>
            </div>
          )}
          <Media
            type={media.type}
            src={media.src}
            alt={""}
            width={800}
            height={400}
            className="h-full w-full aspect-[4/3] object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="space-y-2 bg-background p-4">
          <NodeSlot
            component={TemplateBuilderWidgets.Text}
            // text={h1}
            node_id={".h1"}
          />
          {/* <h3 className="text-lg font-semibold text-foreground">{h1}</h3> */}
          <div className="text-sm text-muted-foreground">
            <span>{date1}</span>
            <span className="mx-2">·</span>
            <span>{date2}</span>
          </div>
          <div className="text-sm text-muted-foreground">{p}</div>
          <NodeSlot
            node_id="tags-layout"
            component={TemplateBuilderWidgets.Flex}
            style={{
              gap: 4,
            }}
          >
            {tags?.map((t, i) => <Badge key={i}>{t}</Badge>)}
          </NodeSlot>
        </div>
      </Card>
    );
  },
  "templates/components/cards/card-001",
  {
    name: "templates/components/cards/card-001",
    default: {
      h1: "Title",
      p: "Description",
      date1: "2021-01-01",
      n: 0,
      badge: "New",
      media: { type: "image", src: "" },
      date2: "2021-01-01",
      tags: ["tag1", "tag2"],
    },
    nodes: [
      {
        active: true,
        locked: false,
        type: "text",
        id: ".h1",
        name: "Title",
        text: "Title",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".p",
        name: "Description",
        text: "Description",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".date1",
        name: "Date 1",
        text: "2021-01-01",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".n",
        name: "Number",
        text: "0",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".badge",
        name: "Badge",
        text: "New",
      },
      {
        active: true,
        locked: false,
        type: "image",
        id: ".media",
        name: "Media",
        src: "",
        alt: "",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".date2",
        name: "Date 2",
        text: "2021-01-01",
      },
      {
        active: true,
        locked: false,
        type: "container",
        id: ".tags",
        name: "Tags",
        expanded: false,
      },
    ],
    type: "template",
    properties: card_properties_definition,
    version: "0.0.0",
  }
);

export const Card_002 = withTemplateDefinition(
  ({
    props: { h1, p, date1, n, badge, media, date2, tags },
    style,
  }: CardMasterProps) => {
    return (
      <Card
        className="relative overflow-hidden flex-1 flex flex-col justify-end gap-6 text-foreground w-auto aspect-[4/4]"
        style={style}
      >
        <Media
          type={media.type}
          src={media.src}
          // alt={media.alt}
          width={800}
          height={800}
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <HalfHeightGradient />
        {badge && (
          <div className="absolute top-0 left-0 py-4 px-4">
            <Badge>{badge}</Badge>
          </div>
        )}
        <div className="text-background flex flex-col gap-1 z-20 py-8 px-4 pr-10">
          <div className="flex flex-row items-center gap-2">
            <div className="flex gap-2 items-center justify-between">
              <span>{date1}</span>
            </div>
            <SlashIcon />
            <span>
              <strong>{n}</strong>
            </span>
          </div>
          <h1 className="text-3xl font-bold break-keep max-w-[80%]">{h1}</h1>
          <p className="text-xs font-regular opacity-80">{p}</p>
        </div>
      </Card>
    );
  },
  "templates/components/cards/card-002",
  {
    name: "templates/components/cards/card-002",
    default: {
      h1: "Title",
      p: "Description",
      date1: "2021-01-01",
      n: 0,
      badge: "New",
      media: { type: "image", src: "" },
      date2: "2021-01-01",
      tags: ["tag1", "tag2"],
    },
    nodes: [
      {
        active: true,
        locked: false,
        type: "text",
        id: ".h1",
        name: "Title",
        text: "Title",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".p",
        name: "Description",
        text: "Description",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".date1",
        name: "Date 1",
        text: "2021-01-01",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".n",
        name: "Number",
        text: "0",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".badge",
        name: "Badge",
        text: "New",
      },
      {
        active: true,
        locked: false,
        type: "image",
        id: ".media",
        name: "Media",
        src: "",
        alt: "",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".date2",
        name: "Date 2",
        text: "2021-01-01",
      },
      {
        active: true,
        locked: false,
        type: "container",
        id: ".tags",
        name: "Tags",
        expanded: false,
      },
    ],
    type: "template",
    properties: card_properties_definition,
    version: "0.0.0",
  }
);

export const Card_003 = withTemplateDefinition(
  ({
    props: { h1, p, date1, n, badge, media, date2, tags },
    style,
  }: CardMasterProps) => {
    return (
      <Card className="p-4" style={style}>
        <NodeSlot
          component={TemplateBuilderWidgets.Flex}
          node_id="root"
          style={{
            gap: 4,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div className="flex-1 flex flex-col gap-1 z-20">
            <NodeSlot
              node_id="header-layout"
              component={TemplateBuilderWidgets.Flex}
              style={{
                gap: 4,
                flexDirection: "column",
              }}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex gap-2 items-center justify-between">
                  <span>{date1}</span>
                </div>
                <span>
                  <strong>{n}</strong>
                </span>
              </div>
              <h1 className="text-lg font-bold break-keep">{h1}</h1>
            </NodeSlot>
            <p className="text-xs font-regular opacity-80">{p}</p>
            <NodeSlot
              node_id="tags-layout"
              component={TemplateBuilderWidgets.Flex}
              style={{
                gap: 4,
              }}
            >
              {tags?.map((t, i) => <Badge key={i}>{t}</Badge>)}
            </NodeSlot>
          </div>
          <NodeSlot
            node_id="media-layout"
            component={TemplateBuilderWidgets.Container}
            style={
              {
                width: 80,
                height: 80,
                borderRadius: 8,
                overflow: "hidden",
              } satisfies React.CSSProperties
            }
          >
            <Media
              type={media.type}
              src={media.src}
              // alt={media.alt}
              width={400}
              height={400}
              className="object-cover w-full h-full"
            />
          </NodeSlot>
        </NodeSlot>
      </Card>
    );
  },
  "templates/components/cards/card-003",
  {
    name: "templates/components/cards/card-003",
    default: {
      h1: "Title",
      p: "Description",
      date1: "2021-01-01",
      n: 0,
      badge: "New",
      media: { type: "image", src: "" },
      date2: "2021-01-01",
      tags: ["tag1", "tag2"],
    },
    nodes: [
      {
        active: true,
        locked: false,
        type: "text",
        id: ".h1",
        name: "Title",
        text: "Title",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".p",
        name: "Description",
        text: "Description",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".date1",
        name: "Date 1",
        text: "2021-01-01",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".n",
        name: "Number",
        text: "0",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".badge",
        name: "Badge",
        text: "New",
      },
      {
        active: true,
        locked: false,
        type: "image",
        id: ".media",
        name: "Media",
        src: "",
        alt: "",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".date2",
        name: "Date 2",
        text: "2021-01-01",
      },
      {
        active: true,
        locked: false,
        type: "container",
        id: ".tags",
        name: "Tags",
        expanded: false,
      },
    ],
    type: "template",
    properties: card_properties_definition,
    version: "0.0.0",
  }
);

const hero_card_properties_definition = {
  media: { type: "image" },
  h1: { type: "string" },
  p: { type: "string" },
} satisfies grida.program.template.TemplateDefinition["properties"];

type HeroCardProps = grida.program.schema.TInferredPropTypes<
  typeof hero_card_properties_definition
>;

type HeroCardMasterProps =
  grida.program.template.IBuiltinTemplateNodeReactComponentRenderProps<HeroCardProps>;

export const Hero_001 = withTemplateDefinition(
  function Hero_001({ props: { h1, p, media }, style }: HeroCardMasterProps) {
    return (
      <header style={style}>
        <div className="relative">
          <Media
            type={media.type}
            src={media.src}
            // alt={media.alt}
            width={800}
            height={400}
            className="w-full aspect-[3/4] @5xl/preview:aspect-video object-cover -z-10"
          />
          {/* <video
            className="w-full aspect-[3/4] @5xl/preview:aspect-video object-cover -z-10"
            autoPlay
            loop
            muted
            playsInline
            src={props.media}
          /> */}
          <div className="absolute bottom-8 bg-background max-w-md container py-4">
            <h1 className="text-4xl font-semibold">{h1}</h1>
            <p className="text-lg">{p}</p>
          </div>
        </div>
      </header>
    );
  },
  "templates/components/cards/hero-001",
  {
    name: "templates/components/cards/hero-001",
    default: {
      h1: "Title",
      p: "Description",
      media: { type: "image", src: "" },
    },
    nodes: [
      {
        active: true,
        locked: false,
        type: "text",
        id: ".h1",
        name: "Title",
        text: "Title",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".p",
        name: "Description",
        text: "Description",
      },
      {
        active: true,
        locked: false,
        type: "image",
        id: ".media",
        name: "Media",
        src: "",
        alt: "",
      },
    ],
    type: "template",
    properties: hero_card_properties_definition,
    version: "0.0.0",
  }
);

export const Hero_002 = withTemplateDefinition(
  function Hero_002({ props: { h1, p, media }, style }: HeroCardMasterProps) {
    return (
      <header style={style} className="relative aspect-[3/4]">
        {media && (
          <Media
            type={media.type}
            src={media.src}
            // alt={media.alt}
            width={800}
            height={400}
            className="w-full h-full object-cover -z-10"
          />
        )}
        <HalfHeightGradient />
        <div className="text-background absolute bottom-8 max-w-md container py-4">
          <h1 className="text-4xl font-semibold">{h1}</h1>
          <p className="text-lg">{p}</p>
        </div>
      </header>
    );
  },
  "templates/components/cards/hero-002",
  {
    name: "templates/components/cards/hero-002",
    default: {
      h1: "Title",
      p: "Description",
      media: { type: "image", src: "" },
    },
    nodes: [
      {
        active: true,
        locked: false,
        type: "text",
        id: ".h1",
        name: "Title",
        text: "Title",
      },
      {
        active: true,
        locked: false,
        type: "text",
        id: ".p",
        name: "Description",
        text: "Description",
      },
      {
        active: true,
        locked: false,
        type: "image",
        id: ".media",
        name: "Media",
        src: "",
        alt: "",
      },
    ],
    type: "template",
    properties: hero_card_properties_definition,
    version: "0.0.0",
  }
);
