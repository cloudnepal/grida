import * as monaco from "monaco-editor";
import { Monaco } from "@monaco-editor/react";
import { registerDocumentPrettier } from "@code-editor/prettier-services";
import { registerJsxHighlighter } from "@code-editor/jsx-syntax-highlight-services";
import { registerPresetTypes } from "./register-preset-types";

type CompilerOptions = monaco.languages.typescript.CompilerOptions;

export const initEditor = (
  editor: monaco.editor.IStandaloneCodeEditor,
  monaco: Monaco
) => {
  const { dispose: disposeJsxHighlighter } = registerJsxHighlighter(
    editor,
    monaco
  );

  const { dispose: disposePrettier } = registerDocumentPrettier(editor, monaco);

  const { dispose: dispostPresetTypesLoader } = registerPresetTypes();

  return () => {
    disposeJsxHighlighter();
    disposePrettier();
    dispostPresetTypesLoader();
  };
};

export const initMonaco = (monaco: Monaco) => {
  baseConfigure(monaco);
};

const baseConfigure = (monaco: Monaco) => {
  monaco.languages.typescript.typescriptDefaults.setMaximumWorkerIdleTime(-1);
  monaco.languages.typescript.javascriptDefaults.setMaximumWorkerIdleTime(-1);

  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  });

  // compiler options
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
  });

  /**
   * Configure the typescript compiler to detect JSX and load type definitions
   */

  const opts: CompilerOptions = {
    allowJs: true,
    allowSyntheticDefaultImports: true,
    alwaysStrict: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    noEmit: true,
    reactNamespace: "React",
    typeRoots: ["node_modules/@types"],
    jsx: monaco.languages.typescript.JsxEmit.React,
    allowNonTsExtensions: true,
    target: monaco.languages.typescript.ScriptTarget.ES2016,
    jsxFactory: "React.createElement",
  };

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(opts);
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(opts);
};
