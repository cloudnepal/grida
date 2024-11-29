import { grida } from "@/grida";

export namespace widget_presets {
  export const row = {
    type: "container",
    name: "row",
    width: 100,
    height: "auto",
    position: "relative",
    style: {},
    zIndex: 0,
    opacity: 1,
    cornerRadius: 0,
    layout: "flex",
    direction: "horizontal",
    mainAxisAlignment: "start",
    crossAxisAlignment: "start",
    expanded: true,
    mainAxisGap: 16,
    crossAxisGap: 16,
    padding: 0,
    children: [
      {
        type: "rectangle",
        name: "a",
        width: 100,
        height: 100,
        position: "relative",
        zIndex: 0,
        opacity: 1,
        cornerRadius: 0,
        fill: {
          type: "solid",
          color: { r: 0, g: 0, b: 0, a: 1 },
        },
        effects: [],
      },
      {
        type: "rectangle",
        name: "b",
        width: 100,
        height: 100,
        position: "relative",
        zIndex: 0,
        opacity: 1,
        cornerRadius: 0,
        fill: {
          type: "solid",
          color: { r: 0, g: 0, b: 0, a: 1 },
        },
        effects: [],
      },
      {
        type: "rectangle",
        name: "c",
        width: 100,
        height: 100,
        position: "relative",
        zIndex: 0,
        opacity: 1,
        cornerRadius: 0,
        fill: {
          type: "solid",
          color: { r: 0, g: 0, b: 0, a: 1 },
        },
        effects: [],
      },
    ],
  } satisfies grida.program.nodes.NodePrototype;
}
