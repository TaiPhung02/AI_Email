"use client";

import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Text } from "@tiptap/extension-text";
import EditorMenuBar from "./editor-menubar";
import { Separator } from "@/components/ui/separator";

type Props = {};

const EmailEditor = (props: Props) => {
  const [value, setValue] = React.useState<string>("");

  const CustomText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Meta-j": () => {
          console.log("Meta-j");
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit, CustomText],
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      <div className="flex border-b p-4 py-2">
        <EditorMenuBar editor={editor} />
      </div>

      <div className="prose w-full px-4">
        <EditorContent
          editor={editor}
          value={value}
          placeholder="Write your email here..."
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between px-4 py-3"></div>
    </div>
  );
};

export default EmailEditor;
