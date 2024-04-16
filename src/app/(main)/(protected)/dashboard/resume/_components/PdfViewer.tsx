"use client";

import { useEffect, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFViewer(props: { file: File | null | string }) {
  const [pdfBase64, setPdfBase64] = useState(null);

  const options = useMemo(
    () => ({
      cMapUrl: "cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "standard_fonts/",
    }),
    [],
  );

  useEffect(() => {
    if (props.file) {
      if (typeof props.file === "string") {
        setPdfBase64(props.file);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPdfBase64(e.target.result);
        };
        reader.readAsDataURL(props.file);
      }
    }
  }, [props.file]);

  const file = useMemo(
    () => ({
      url: pdfBase64,
    }),
    [pdfBase64],
  );

  if (!pdfBase64) return <></>;

  return (
    <div className="h-48 overflow-hidden relative">
      <div className="absolute left-1/2 -translate-x-1/2">
        <Document file={file} options={options} renderMode="canvas">
          <Page
            className="!bg-transparent flex flex-row items-center justify-center"
            key={1}
            pageNumber={1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            width={540}
          />
        </Document>
      </div>
    </div>
  );
}
