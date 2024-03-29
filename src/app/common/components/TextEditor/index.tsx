"use client";

import { Editor } from "@tinymce/tinymce-react";

export default function App() {
  return (
    <Editor
      apiKey="ah9w9dtmhnrt5yhzobg11p0jj9sdldd1x64lj89aipllnqn6"
      init={{
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
