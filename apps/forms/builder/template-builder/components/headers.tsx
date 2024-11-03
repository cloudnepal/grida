import { GridaLogo } from "@/components/grida-logo";
import { NodeElement } from "../node";
import { TemplateBuilderWidgets } from "../widgets";

export function Header_001({ logo }: { logo?: string }) {
  return (
    <NodeElement
      // name="Header"
      node_id="header"
      // component={TemplateBuilderWidgets.flex}
      style={{
        backgroundColor: { r: 0, g: 0, b: 0, a: 0 },
        top: 0,
        left: 0,
        // right: 0,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        // zIndex: 10,
      }}
    >
      <NodeElement
        node_id="logo"
        // name="Logo"
        // component={TemplateBuilderWidgets.container}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="logo" className="w-full h-5 object-contain" />
      </NodeElement>
    </NodeElement>
  );
}
