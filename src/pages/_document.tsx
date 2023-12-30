import {
  type DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

import type { DocumentHeadTagsProps } from "@mui/material-nextjs/v13-pagesRouter";
import {
  documentGetInitialProps,
  DocumentHeadTags,
} from "@mui/material-nextjs/v14-pagesRouter";

export default function MyDocument(
  props: DocumentProps & DocumentHeadTagsProps,
) {
  return (
    <Html>
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = documentGetInitialProps;
