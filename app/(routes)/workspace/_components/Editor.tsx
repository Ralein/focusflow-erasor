"use client";
import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
// @ts-ignore
import Header from "@editorjs/header";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import Checklist from "@editorjs/checklist";
// @ts-ignore
import Paragraph from "@editorjs/paragraph";
// @ts-ignore
import Warning from "@editorjs/warning";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { FILE } from "../../dashboard/_components/FileList";
import GenerateTool from "@/app/api/generateTool";
import SpeechToText from "./SpeechToText";
import TextToSpeech from "./TextToSpeech";
import { Separator } from "@/components/ui/separator";

const rawDocument = {
  time: 1550476186479,
  blocks: [
    {
      data: { text: "Document Name", level: 2 },
      id: "123",
      type: "header",
    },
    {
      data: { level: 4 },
      id: "1234",
      type: "header",
    },
  ],
  version: "2.8.1",
};

function Editor({ onSaveTrigger, fileId, fileData }: { onSaveTrigger: any; fileId: any; fileData: FILE }) {
  const ref = useRef<EditorJS>();
  const updateDocument = useMutation(api.files.updateDocument);

  useEffect(() => {
    fileData && initEditor();
  }, [fileData]);

  useEffect(() => {
    onSaveTrigger && onSaveDocument();
  }, [onSaveTrigger]);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      data: fileData?.document ? JSON.parse(fileData.document) : rawDocument,
      tools: {
        header: {
          class: Header,
          shortcut: "CMD+SHIFT+H",
          config: { placeholder: "Enter a Header" },
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: { defaultStyle: "unordered" },
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        generate: GenerateTool,
        paragraph: Paragraph,
        warning: Warning,
      },
    });
    ref.current = editor;
  };

  const onSaveDocument = () => {
    if (ref.current) {
      ref.current
        .save()
        .then((outputData) => {
          const filteredBlocks = outputData.blocks.filter((block) => block.data.text?.trim());

          updateDocument({
            _id: fileId,
            document: JSON.stringify({ ...outputData, blocks: filteredBlocks }),
          })
            .then(() => {
              toast("Document Updated!");

              ref.current?.blocks.clear();
              ref.current?.render({ blocks: filteredBlocks });
            })
            .catch(() => {
              toast("Server Error!");
            });
        })
        .catch((error) => {
          console.log("Saving failed: ", error);
        });
    }
  };

  // ✅ Inserts text into the currently focused block or creates a new one if needed
  const insertSpeechToText = (text: string) => {
    if (!ref.current) return;

    ref.current.blocks.insert("paragraph", { text }); // ✅ Inserts text in real-time
    ref.current.blocks.getBlockByIndex(ref.current.blocks.getBlocksCount() - 1)?.holder?.scrollIntoView(); // ✅ Scroll to the new block
  };

  return (
    <div>
      <div className="toolbar flex gap-2 p-2">
        <SpeechToText onTextGenerated={insertSpeechToText} /> {/* ✅ Real-time insertion */}
        <TextToSpeech getText={async () => {
          if (!ref.current) return "";
          const outputData = await ref.current.save();
          return outputData.blocks.map((block) => block.data.text).join(". ");
        }} />
      </div>
      <Separator className="border shadow-sm" />
      <div id="editorjs" className="ml-20"></div>
    </div>
  );
}

export default Editor;