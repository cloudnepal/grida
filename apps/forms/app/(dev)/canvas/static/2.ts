import { grida } from "@/grida";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  root_id: "playground",
  nodes: {
    playground: {
      id: "playground",
      name: "playground",
      type: "container",
      active: true,
      locked: false,
      expanded: true,
      opacity: 1,
      zIndex: 0,
      position: "relative",
      width: 960,
      height: 540,
      fill: { type: "solid", color: { r: 0, g: 0, b: 0, a: 1 } },
      style: {
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      },
      children: ["card_1_bg", "card_2_bg", "card_3_bg"],
    },
    card_1_bg: {
      id: "card_1_bg",
      name: "card_1_bg",
      type: "image",
      active: true,
      locked: false,
      opacity: 1,
      zIndex: -1,
      width: 300,
      height: 510,
      position: "absolute",
      top: 15,
      left: 15,
      fill: { type: "solid", color: { r: 255, g: 255, b: 255, a: 0.1 } },
      style: {},
    },
    card_2_bg: {
      id: "card_2_bg",
      name: "card_2_bg",
      type: "image",
      active: true,
      locked: false,
      opacity: 1,
      zIndex: -1,
      width: 300,
      height: 510,
      position: "absolute",
      top: 15,
      left: 330,
      fill: { type: "solid", color: { r: 255, g: 255, b: 255, a: 0.1 } },
      style: {},
    },
    card_3_bg: {
      id: "card_3_bg",
      name: "card_3_bg",
      type: "image",
      active: true,
      locked: false,
      opacity: 1,
      zIndex: -1,
      width: 300,
      height: 510,
      position: "absolute",
      top: 15,
      left: 645,
      fill: { type: "solid", color: { r: 255, g: 255, b: 255, a: 0.1 } },
      style: {},
    },
  },
} satisfies grida.program.document.IDocumentDefinition;
