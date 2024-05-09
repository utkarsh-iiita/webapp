"use client";

import { forwardRef } from "react";

import { Editor } from "@tinymce/tinymce-react";

interface TextEditorProps {
  height?: string;
  value: string;
}

function TextEditor(props: TextEditorProps, ref: any) {
  return (
    <Editor
      id="text-editor"
      onInit={(evt, editor) => (ref.current = editor)}
      initialValue={props.value}
      apiKey="nnc0722uwomht0eu21pjcp4g53v9z0fp26l7ak118jtz0lfv"
      init={{
        height: props.height ?? "90vmin",
        toolbar_sticky: true,
        toolbar_sticky_offset: 64,
        skin: "oxide-dark",
        content_css: "dark",
        statusbar: false,
        plugins: [
          "autolink",
          "lists",
          "advlist",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
          "quickbars",
        ],
        menubar: false,
        toolbar: [
          "styles| bold italic backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | code | help",
        ],
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:17px }",
      }}
    />
  );
}

export default forwardRef(TextEditor);
