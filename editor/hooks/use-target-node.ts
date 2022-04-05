import React, { useEffect, useState } from "react";
import type { ReflectSceneNode } from "@design-sdk/core";
import { useEditorState } from "core/states";
import { DesignInput } from "@designto/config/input";

import { utils as _design_utils } from "@design-sdk/core";
const designq = _design_utils.query;

export function useTargetContainer() {
  const [t, setT] = useState<{ target: ReflectSceneNode; root: DesignInput }>({
    target: undefined,
    root: undefined,
  });
  const [state] = useEditorState();

  //
  useEffect(() => {
    const thisPageNodes = state.selectedPage
      ? state.design.pages.find((p) => p.id == state.selectedPage).children
      : null;

    const targetId =
      state?.selectedNodes?.length === 1 ? state.selectedNodes[0] : null;

    const container_of_target =
      designq.find_node_by_id_under_inpage_nodes(targetId, thisPageNodes) ||
      null;

    const root = thisPageNodes
      ? container_of_target &&
        (container_of_target.origin === "COMPONENT"
          ? DesignInput.forMasterComponent({
              master: container_of_target,
              all: state.design.pages,
              components: state.design.components,
            })
          : DesignInput.fromDesignWithComponents({
              design: container_of_target,
              components: state.design.components,
            }))
      : state.design?.input;

    const target =
      designq.find_node_by_id_under_entry(targetId, root?.entry) ?? root?.entry;

    setT({ target, root });
  }, [state?.selectedNodes, state?.selectedPage, state?.design?.pages]);

  return t;
}
