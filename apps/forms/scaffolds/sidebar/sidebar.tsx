"use client";

import React from "react";
import { CodeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEditorState } from "../editor";
import { DatabaseIcon, HammerIcon, PlugIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  SidebarMenuItem,
  SidebarMenuItemLabel,
  SidebarMenuList,
  SidebarRoot,
  SidebarSection,
  SidebarSectionHeaderItem,
  SidebarSectionHeaderLabel,
} from "@/components/sidebar";
import { ModeDesign } from "./sidebar-mode-blocks";
import { editorlink } from "@/lib/forms/url";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "../workspace";
import { ResourceTypeIcon } from "@/components/resource-type-icon";
import * as Dialog from "@radix-ui/react-dialog";
import { ModeInsertBlocks } from "./sidebar-mode-insert";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeData } from "./sidebar-mode-data";
import { ModeConnect } from "./sidebar-mode-connect";

export function Sidebar() {
  const [state, dispatch] = useEditorState();
  const { is_insert_menu_open: is_add_block_panel_open } = state;

  const onSidebarModeChange = (mode: string) => {
    dispatch({
      type: "editor/sidebar/mode",
      mode: mode as any,
    });
  };

  const openInsertMenu = (open: boolean) => {
    dispatch({
      type: "editor/panels/insert-menu",
      open: open,
    });
  };

  if (is_add_block_panel_open) {
    return (
      <Dialog.Root open={is_add_block_panel_open} onOpenChange={openInsertMenu}>
        <Dialog.Content>
          <SidebarRoot>
            <ModeInsertBlocks />
          </SidebarRoot>
        </Dialog.Content>
      </Dialog.Root>
    );
  }

  return (
    <SidebarRoot>
      <Tabs value={state.sidebar.mode} onValueChange={onSidebarModeChange}>
        <header className="sticky h-12 px-2 flex justify-center items-center top-0 bg-background border-b z-10">
          <TabsList className="w-full max-w-full">
            <TabsTrigger value="project">
              <ResourceTypeIcon type="project" className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="build">
              <HammerIcon className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="data">
              <DatabaseIcon className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="connect">
              <PlugIcon className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>
        </header>
        <TabsContent value="project">
          <ModeProjectHiearchy />
        </TabsContent>
        <TabsContent value="build">
          <ModeDesign />
        </TabsContent>
        <TabsContent value="data">
          <ModeData />
        </TabsContent>
        <TabsContent value="connect">
          <ModeConnect />
        </TabsContent>
      </Tabs>
    </SidebarRoot>
  );
}

function ModeProjectHiearchy() {
  const { state: workspace } = useWorkspace();
  const { documents, loading } = workspace;
  const [state] = useEditorState();
  const { basepath, project } = state;
  const current_project_documents = documents.filter(
    (d) => d.project_id === project.id
  );
  console.log("loading", loading);
  return (
    <>
      <SidebarSection>
        <SidebarSectionHeaderItem>
          <SidebarSectionHeaderLabel>
            <span>{project.name}</span>
          </SidebarSectionHeaderLabel>
        </SidebarSectionHeaderItem>
        <SidebarMenuList>
          {loading ? (
            <>
              <div className="w-full grid gap-2">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
              </div>
            </>
          ) : (
            <>
              {current_project_documents.map((d) => (
                <Link
                  key={d.id}
                  href={editorlink("form/edit", {
                    document_id: d.id,
                    basepath,
                  })}
                >
                  <SidebarMenuItem muted selected={d.id === state.document_id}>
                    <ResourceTypeIcon
                      type={d.doctype}
                      className="inline align-middle min-w-4 w-4 h-4 me-2"
                    />
                    <SidebarMenuItemLabel>{d.title}</SidebarMenuItemLabel>
                  </SidebarMenuItem>
                </Link>
              ))}
            </>
          )}
        </SidebarMenuList>
      </SidebarSection>
    </>
  );
}

function ModeSettings() {
  const [state] = useEditorState();
  const { form_id, organization, project } = state;
  return (
    <>
      <SidebarSection>
        <SidebarSectionHeaderItem>
          <SidebarSectionHeaderLabel>
            <span>Settings</span>
          </SidebarSectionHeaderLabel>
        </SidebarSectionHeaderItem>
        <SidebarMenuList>
          {/* <Link
            href={editorlink("settings/general", {
              proj: project.name,
              org: organization.name,
              form_id,
            })}
          >
            <SidebarMenuItem>
              <GearIcon className="inline align-middle w-4 h-4 me-2" />
              General
            </SidebarMenuItem>
          </Link> */}
        </SidebarMenuList>
      </SidebarSection>
      <SidebarSection>
        <SidebarSectionHeaderItem>
          <SidebarSectionHeaderLabel>
            <span>Developers</span>
          </SidebarSectionHeaderLabel>
        </SidebarSectionHeaderItem>
        <SidebarMenuList>
          {/* <Link href={`settings/api`}> */}
          <SidebarMenuItem disabled>
            <CodeIcon className="inline align-middle w-4 h-4 me-2" />
            API Keys
            <Badge variant="outline" className="ms-auto">
              enterprise
            </Badge>
          </SidebarMenuItem>
          {/* </Link> */}
        </SidebarMenuList>
      </SidebarSection>
    </>
  );
}
