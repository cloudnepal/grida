import React, { useEffect, useState } from "react";
import { canvas } from "../../components";
import { tokenize } from "@designto/token";
import {
  JsonTree,
  WidgetTree,
} from "../../components/visualization/json-visualization/json-tree";
import { DefaultEditorWorkspaceLayout } from "../../layout/default-editor-workspace-layout";
import { LayerHierarchy } from "../../components/editor-hierarchy";
import { WorkspaceContentPanelGridLayout } from "../../layout/panel/workspace-content-panel-grid-layout";
import { WorkspaceContentPanel } from "../../layout/panel";
import { WorkspaceBottomPanelDockLayout } from "../../layout/panel/workspace-bottom-panel-dock-layout";
import { useDesign } from "../../query-hooks";
import {
  ImageRepository,
  MainImageRepository,
} from "@design-sdk/core/assets-repository";
import { RemoteImageRepositories } from "@design-sdk/figma-remote/lib/asset-repository/image-repository";
import LoadingLayout from "../../layout/loading-overlay";

export default function FigmaToReflectWidgetTokenPage() {
  const design = useDesign();

  if (!design) {
    return <LoadingLayout />;
  }

  //
  //
  MainImageRepository.instance = new RemoteImageRepositories(design.file);
  MainImageRepository.instance.register(
    new ImageRepository(
      "fill-later-assets",
      "grida://assets-reservation/images/"
    )
  );
  //
  //

  let tokenTree;
  if (design.reflect) {
    tokenTree = tokenize(design.reflect);
  }

  console.info("=".repeat(24), "tokenize result", "=".repeat(24));
  console.info("tokenize result >> design.remote", design.remote);
  console.info("tokenize result >> design.figma", design.figma);
  console.info("tokenize result >> design.reflect", design.reflect);
  console.info("tokenize result >> tokenTree", tokenTree);
  console.info("=".repeat(64));

  return (
    <>
      <DefaultEditorWorkspaceLayout
        leftbar={<LayerHierarchy data={design.reflect} />}
      >
        <WorkspaceContentPanelGridLayout>
          <WorkspaceContentPanel>
            <canvas.FigmaEmbedCanvas
              src={{ url: design.url }}
              width="100%"
              height="100%"
            />
          </WorkspaceContentPanel>

          <WorkspaceBottomPanelDockLayout>
            <WorkspaceContentPanel>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "stretch",
                }}
              >
                <div style={{ flex: 1 }}>
                  <WidgetTree data={design.figma} />
                </div>
                <div style={{ flex: 1 }}>
                  <WidgetTree data={design.reflect} />
                </div>
                <div style={{ flex: 1 }}>
                  <JsonTree hideRoot data={tokenTree} />
                </div>
              </div>
            </WorkspaceContentPanel>
          </WorkspaceBottomPanelDockLayout>
        </WorkspaceContentPanelGridLayout>
      </DefaultEditorWorkspaceLayout>
    </>
  );
}
