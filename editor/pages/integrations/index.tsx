import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { DefaultEditorWorkspaceLayout } from "layouts/default-editor-workspace-layout";
import { HomeHeading, HomeSidebar } from "components/home";

export default function IntegrationsPage() {
  return (
    <>
      <DefaultEditorWorkspaceLayout
        backgroundColor={"rgba(37, 37, 38, 1)"}
        leftbar={<HomeSidebar />}
      >
        <div style={{ padding: 80 }}>
          <>
            <HomeHeading>Integrations</HomeHeading>
            <p>Import From URL</p>
            <p>Assistant</p>
            <p>VSCode</p>
          </>
        </div>
      </DefaultEditorWorkspaceLayout>
    </>
  );
}
