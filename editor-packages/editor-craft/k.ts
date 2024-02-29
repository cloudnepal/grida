import type { WidgetType } from "./widgets";

export const widget_production_stage: {
  [key in WidgetType]: "prod" | "beta" | "soon" | "hidden";
} = {
  audio: "soon",
  badge: "soon",
  "builder-conditional": "soon",
  "builder-stream": "soon",
  button: "beta",
  camera: "soon",
  checkbox: "soon",
  chip: "soon",
  "chip-select": "soon",
  code: "soon",
  container: "prod",
  divider: "beta",
  "divider-vertical": "soon",
  flex: "beta",
  "flex flex-col": "beta",
  "flex flex-col wrap": "beta",
  "flex flex-row": "beta",
  "flex flex-row wrap": "beta",
  "flex wrap": "beta",
  html: "soon",
  icon: "beta",
  "icon-button": "soon",
  "icon-toggle": "soon",
  //
  iframe: "soon",
  image: "beta",
  "image-circle": "beta",
  link: "soon",
  list: "soon",
  "locale-select": "hidden",
  markdown: "soon",
  pagination: "soon",
  pdf: "soon",
  pincode: "soon",
  progress: "soon",
  "progress-circle": "soon",
  radio: "soon",
  rating: "soon",
  select: "soon",
  "self-stretch": "soon",
  signature: "soon",
  slider: "soon",
  staggered: "soon",
  stepper: "soon",
  switch: "soon",
  tabs: "soon",
  text: "beta",
  textfield: "beta",
  tooltip: "soon",
  video: "beta",
};
