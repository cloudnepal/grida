import { produce, type Draft } from "immer";

import type {
  BuilderAction,
  //
  TemplateEditorSetTemplatePropsAction,
  DocumentEditorNodeSelectAction,
  DocumentEditorNodePointerEnterAction,
  DocumentEditorNodePointerLeaveAction,
  NodeChangeAction,
  NodeOrderAction,
  NodeToggleAction,
  TemplateNodeOverrideChangeAction,
} from "../action";
import type { IDocumentEditorState, SurfaceRaycastTargeting } from "../types";
import { grida } from "@/grida";
import assert from "assert";
import { documentquery } from "../document-query";
import nodeReducer from "./node.reducer";
import surfaceReducer from "./surface.reducer";
import { v4 } from "uuid";
import { self_insertNode } from "./methods";

export default function documentReducer<S extends IDocumentEditorState>(
  state: S,
  action: BuilderAction
): S {
  if (!state.editable) return state;
  switch (action.type) {
    case "document/insert": {
      const { prototype } = action;

      return produce(state, (draft) => {
        function self_instanciateNodePrototype<S extends IDocumentEditorState>(
          draft: Draft<S>,
          parentNodeId: string,
          nodePrototype: grida.program.nodes.NodePrototype
        ): string {
          const nodeId = v4();

          // Create the parent node
          // @ts-expect-error
          const newNode: grida.program.nodes.Node = {
            ...nodePrototype,
            id: nodeId,
            name: nodePrototype.name ?? nodePrototype.type,
            locked: nodePrototype.locked ?? false,
            active: nodePrototype.active ?? true,
            type: nodePrototype.type,
            children:
              nodePrototype.type === "container" ||
              nodePrototype.type === "component" ||
              nodePrototype.type === "template_instance" ||
              nodePrototype.type === "instance"
                ? []
                : undefined,
          };

          // Insert the parent node into the document first
          self_insertNode(draft, parentNodeId, newNode);

          // Recursively process children and register them after the parent
          if ("children" in nodePrototype) {
            (newNode as grida.program.nodes.i.IChildren).children =
              nodePrototype.children.map((childPrototype) =>
                self_instanciateNodePrototype(draft, nodeId, childPrototype)
              );
          }

          return nodeId;
        }

        // Insert the prototype as the root node under the document's root
        self_instanciateNodePrototype(draft, draft.document.root_id, prototype);

        // after
        draft.cursor_mode = { type: "cursor" };
        // TODO:
        draft.selected_node_id = undefined;
      });
    }
    case "document/canvas/backend/html/event/node-overlay/corner-radius-handle/on-drag":
    case "document/canvas/backend/html/event/node-overlay/corner-radius-handle/on-drag-end":
    case "document/canvas/backend/html/event/node-overlay/corner-radius-handle/on-drag-start":
    case "document/canvas/backend/html/event/node-overlay/resize-handle/on-drag":
    case "document/canvas/backend/html/event/node-overlay/resize-handle/on-drag-end":
    case "document/canvas/backend/html/event/node-overlay/resize-handle/on-drag-start":
    case "document/canvas/backend/html/event/node-overlay/rotation-handle/on-drag":
    case "document/canvas/backend/html/event/node-overlay/rotation-handle/on-drag-end":
    case "document/canvas/backend/html/event/node-overlay/rotation-handle/on-drag-start":
    case "document/canvas/backend/html/event/on-click":
    case "document/canvas/backend/html/event/on-drag":
    case "document/canvas/backend/html/event/on-drag-end":
    case "document/canvas/backend/html/event/on-drag-start":
    case "document/canvas/backend/html/event/on-key-down":
    case "document/canvas/backend/html/event/on-key-up":
    case "document/canvas/backend/html/event/on-pointer-down":
    case "document/canvas/backend/html/event/on-pointer-move":
    case "document/canvas/backend/html/event/on-pointer-move-raycast":
    case "document/canvas/backend/html/event/on-pointer-up":
    case "document/canvas/content-edit-mode/try-enter":
    case "document/canvas/content-edit-mode/try-exit":
    case "document/canvas/cursor-mode": {
      return surfaceReducer(state, action);
    }
    case "document/template/set/props": {
      const { data } = <TemplateEditorSetTemplatePropsAction>action;

      return produce(state, (draft) => {
        const root_template_instance = documentquery.__getNodeById(
          draft,
          draft.document.root_id!
        );
        assert(root_template_instance.type === "template_instance");
        root_template_instance.props = data;
      });
    }
    case "document/node/select": {
      const { node_id } = <DocumentEditorNodeSelectAction>action;

      return produce(state, (draft) => {
        draft.selected_node_id = node_id;
      });
    }
    case "document/node/on-pointer-enter": {
      const { node_id } = <DocumentEditorNodePointerEnterAction>action;
      return produce(state, (draft) => {
        draft.hovered_node_id = node_id;
      });
    }
    case "document/node/on-pointer-leave": {
      const { node_id } = <DocumentEditorNodePointerLeaveAction>action;
      return produce(state, (draft) => {
        if (draft.hovered_node_id === node_id) {
          draft.hovered_node_id = undefined;
        }
      });
    }
    // case "document/template/change/props": {
    //   const { props: partialProps } = <TemplateEditorChangeTemplatePropsAction>(
    //     action
    //   );

    //   return produce(state, (draft) => {
    //     draft.template.props = {
    //       ...(draft.template.props || {}),
    //       ...partialProps,
    //     } as grida.program.schema.Props;
    //   });
    // }

    case "node/change/active":
    case "node/change/locked":
    case "node/change/name":
    case "node/change/userdata":
    case "node/change/positioning":
    case "node/change/positioning-mode":
    case "node/change/size":
    case "node/change/component":
    case "node/change/href":
    case "node/change/target":
    case "node/change/src":
    case "node/change/props":
    case "node/change/opacity":
    case "node/change/rotation":
    case "node/change/cornerRadius":
    case "node/change/fill":
    case "node/change/border":
    case "node/change/fit":
    case "node/change/padding":
    case "node/change/layout":
    case "node/change/direction":
    case "node/change/mainAxisAlignment":
    case "node/change/crossAxisAlignment":
    case "node/change/gap":
    case "node/change/mainAxisGap":
    case "node/change/crossAxisGap":
    case "node/change/style":
    case "node/change/fontSize":
    case "node/change/fontWeight":
    case "node/change/fontFamily":
    case "node/change/letterSpacing":
    case "node/change/lineHeight":
    case "node/change/textAlign":
    case "node/change/textAlignVertical":
    case "node/change/maxlength":
    case "node/change/text": {
      const { node_id } = <NodeChangeAction>action;
      return produce(state, (draft) => {
        const node = documentquery.__getNodeById(draft, node_id);
        assert(node, `node not found with node_id: "${node_id}"`);
        draft.document.nodes[node_id] = nodeReducer(node, action);

        // font family specific hook
        if (action.type === "node/change/fontFamily") {
          if (action.fontFamily) {
            draft.googlefonts.push({ family: action.fontFamily });
          }
        }
      });
    }
    //
    case "node/order/back":
    case "node/order/front": {
      const { node_id } = <NodeOrderAction>action;
      return produce(state, (draft) => {
        const parent_id = documentquery.getParentId(
          draft.document_ctx,
          node_id
        );
        if (!parent_id) return; // root node case
        const parent_node: Draft<grida.program.nodes.i.IChildren> =
          documentquery.__getNodeById(
            draft,
            parent_id
          ) as grida.program.nodes.i.IChildren;

        const childIndex = parent_node.children!.indexOf(node_id);
        assert(childIndex !== -1, "node not found in children");

        switch (action.type) {
          case "node/order/back": {
            // change the children id order - move the node_id to the first (first is the back)
            parent_node.children!.splice(childIndex, 1);
            parent_node.children!.unshift(node_id);
            break;
          }
          case "node/order/front": {
            // change the children id order - move the node_id to the last (last is the front)
            parent_node.children!.splice(childIndex, 1);
            parent_node.children!.push(node_id);
            break;
          }
        }
      });
    }
    //
    case "node/toggle/locked": {
      return produce(state, (draft) => {
        const { node_id } = <NodeToggleAction>action;
        const node = documentquery.__getNodeById(draft, node_id);
        assert(node, `node not found with node_id: "${node_id}"`);
        node.locked = !node.locked;
      });
    }
    case "node/toggle/active": {
      return produce(state, (draft) => {
        const { node_id } = <NodeToggleAction>action;
        const node = documentquery.__getNodeById(draft, node_id);
        assert(node, `node not found with node_id: "${node_id}"`);
        node.active = !node.active;
      });
    }
    //
    case "document/template/override/change/*": {
      const { template_instance_node_id, action: __action } = <
        TemplateNodeOverrideChangeAction
      >action;

      return produce(state, (draft) => {
        const { node_id } = __action;
        const template_instance_node = documentquery.__getNodeById(
          draft,
          template_instance_node_id
        );

        assert(
          template_instance_node &&
            template_instance_node.type === "template_instance"
        );

        const nodedata = template_instance_node.overrides[node_id] || {};
        template_instance_node.overrides[node_id] = nodeReducer(
          nodedata,
          __action
        );
      });
    }
    //
    //
    //
    case "document/schema/property/define": {
      return produce(state, (draft) => {
        const root_node = documentquery.__getNodeById(
          draft,
          draft.document.root_id
        );
        assert(root_node.type === "component");

        const property_name =
          action.name ??
          "new_property_" + Object.keys(root_node.properties).length + 1;
        root_node.properties[property_name] = action.definition ?? {
          type: "string",
        };
      });
    }
    case "document/schema/property/rename": {
      const { name, newName } = action;
      return produce(state, (draft) => {
        const root_node = documentquery.__getNodeById(
          draft,
          draft.document.root_id
        );
        assert(root_node.type === "component");

        // check for conflict
        if (root_node.properties[newName]) {
          return;
        }

        root_node.properties[newName] = root_node.properties[name];
        delete root_node.properties[name];
      });
    }
    case "document/schema/property/update": {
      return produce(state, (draft) => {
        const root_node = documentquery.__getNodeById(
          draft,
          draft.document.root_id
        );
        assert(root_node.type === "component");

        root_node.properties[action.name] = action.definition;
      });
    }
    case "document/schema/property/delete": {
      return produce(state, (draft) => {
        const root_node = documentquery.__getNodeById(
          draft,
          draft.document.root_id
        );
        assert(root_node.type === "component");

        delete root_node.properties[action.name];
      });
    }

    default: {
      throw new Error(
        `unknown action type: "${(action as BuilderAction).type}"`
      );
    }
  }

  return state;
}
