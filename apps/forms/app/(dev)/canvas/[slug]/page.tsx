"use client";

import React, { useEffect, useReducer, useState } from "react";
import {
  SidebarRoot,
  SidebarSection,
  SidebarSectionHeaderItem,
  SidebarSectionHeaderLabel,
} from "@/components/sidebar";
import { SelectedNodeProperties } from "@/scaffolds/sidecontrol/sidecontrol-selected-node";
import { NodeHierarchyList } from "@/scaffolds/sidebar/sidebar-node-hierarchy-list";
import {
  StandaloneDocumentEditor,
  StandaloneDocumentEditorContent,
  CanvasEventTarget,
  CanvasOverlay,
  standaloneDocumentReducer,
  initDocumentEditorState,
  useEventTarget,
  CursorMode,
} from "@/builder";
import docs from "../static";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { GridaLogo } from "@/components/grida-logo";
import { DevtoolsPanel } from "@/builder/devtools";
import { FontFamilyListProvider } from "@/scaffolds/sidecontrol/controls/font-family";
import { useGoogleFontsList } from "@/builder/google.fonts";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  BoxIcon,
  CircleIcon,
  CursorArrowIcon,
  DownloadIcon,
  FigmaLogoIcon,
  FileIcon,
  FrameIcon,
  ImageIcon,
  TextIcon,
} from "@radix-ui/react-icons";
import KeyboardInputOverlay from "@/builder/devtools/keyboard-input-overlay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogState } from "@/components/hooks/use-dialog-state";
import { ImportFromFigmaDialog } from "../import-from-figma";
import { iofigma } from "@/grida/io-figma";
import { saveAs } from "file-saver";
import { ImportFromGridaFileJsonDialog } from "../import-from-grida-file";
import { v4 } from "uuid";

export default function CanvasPlaygroundPage({
  params,
}: {
  params: { slug: string };
}) {
  const importFromFigmaDialog = useDialogState("import-from-figma");
  const importFromJson = useDialogState("import-from-json", {
    refreshkey: true,
  });
  const fonts = useGoogleFontsList();
  const slug = params.slug;
  const [state, dispatch] = useReducer(
    standaloneDocumentReducer,
    initDocumentEditorState({
      editable: true,
      // @ts-expect-error
      document: docs[slug].document,
    })
  );

  const onExport = () => {
    const documentData = {
      document: state.document,
    };

    const blob = new Blob([JSON.stringify(documentData, null, 2)], {
      type: "application/json",
    });

    saveAs(blob, `${v4()}.grida`);
  };

  return (
    <main className="w-screen h-screen overflow-hidden">
      <ImportFromGridaFileJsonDialog
        key={importFromJson.refreshkey}
        {...importFromJson}
        onImport={(res) => {
          dispatch({
            type: "document/reset",
            state: initDocumentEditorState({
              editable: true,
              document: res,
            }),
          });
        }}
      />
      <ImportFromFigmaDialog
        {...importFromFigmaDialog}
        onImport={(res) => {
          dispatch({
            type: "document/reset",
            state: initDocumentEditorState({
              editable: true,
              document: iofigma.restful.map.document(
                res.document as any,
                res.images
              ),
            }),
          });
        }}
      />
      <StandaloneDocumentEditor initial={state} dispatch={dispatch}>
        <div className="flex w-full h-full">
          <aside>
            <SidebarRoot>
              <SidebarSection className="mt-4">
                <span>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <GridaLogo className="inline-block w-4 h-4 me-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={importFromFigmaDialog.openDialog}
                      >
                        <FigmaLogoIcon className="w-3.5 h-3.5 me-2 inline-block" />
                        Import from Figma
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={importFromJson.openDialog}>
                        <FileIcon className="w-3.5 h-3.5 me-2 inline-block" />
                        Import from .grida
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onExport}>
                        <DownloadIcon className="w-3.5 h-3.5 me-2 inline-block" />
                        Save as .grida
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <span className="font-bold text-xs">Canvas Playground</span>
                </span>
              </SidebarSection>
              <SidebarSection className="mt-4">
                <ExampleSelection value={slug} />
              </SidebarSection>
              <hr />
              <SidebarSection>
                <SidebarSectionHeaderItem>
                  <SidebarSectionHeaderLabel>Layers</SidebarSectionHeaderLabel>
                </SidebarSectionHeaderItem>
                <NodeHierarchyList />
              </SidebarSection>
            </SidebarRoot>
          </aside>
          <div className="w-full h-full flex flex-col relative">
            <CanvasEventTarget className="relative w-full h-full no-scrollbar overflow-y-auto bg-transparent">
              <CanvasOverlay />
              <div className="w-full h-full flex bg-background items-center justify-center">
                <div className="shadow-lg rounded-xl border overflow-hidden">
                  <StandaloneDocumentEditorContent />
                </div>
              </div>
              <div className="absolute bottom-20 left-0 right-0 flex items-center justify-center z-50 pointer-events-none">
                <Toolbar />
              </div>
              <div className="fixed bottom-20 left-10 flex items-center justify-center z-50 pointer-events-none">
                <KeyboardInputOverlay />
              </div>
            </CanvasEventTarget>
            <DevtoolsPanel />
          </div>
          <aside className="h-full">
            <SidebarRoot side="right">
              <FontFamilyListProvider fonts={fonts}>
                {state.selected_node_id && <SelectedNodeProperties />}
              </FontFamilyListProvider>
            </SidebarRoot>
          </aside>
        </div>
      </StandaloneDocumentEditor>
    </main>
  );
}

function ExampleSelection({ value }: { value: string }) {
  const router = useRouter();
  return (
    <Select
      defaultValue={value}
      onValueChange={(v) => {
        router.push(`/canvas/${v}`);
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">1</SelectItem>
        <SelectItem value="2">2</SelectItem>
      </SelectContent>
    </Select>
  );
}

function Toolbar() {
  const { setCursorMode, cursor_mode } = useEventTarget();

  return (
    <div className="rounded-full flex gap-4 border bg-background shadow px-4 py-2 pointer-events-auto">
      <ToggleGroup
        onValueChange={(v) => {
          setCursorMode(
            v
              ? toolbar_value_to_cursormode(v as ToolbarToolType)
              : { type: "cursor" }
          );
        }}
        value={cursormode_to_toolbar_value(cursor_mode)}
        defaultValue="cursor"
        type="single"
      >
        <ToggleGroupItem value="cursor">
          <CursorArrowIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="rectangle">
          <BoxIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="ellipse">
          <CircleIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="text">
          <TextIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="container">
          <FrameIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="image">
          <ImageIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

type ToolbarToolType =
  | "cursor"
  | "rectangle"
  | "ellipse"
  | "text"
  | "container"
  | "image";

function cursormode_to_toolbar_value(cm: CursorMode): ToolbarToolType {
  switch (cm.type) {
    case "cursor":
      return "cursor";
    case "insert":
      return cm.node;
  }
}

function toolbar_value_to_cursormode(tt: ToolbarToolType): CursorMode {
  switch (tt) {
    case "cursor":
      return { type: "cursor" };
    default:
      return { type: "insert", node: tt };
  }
}
