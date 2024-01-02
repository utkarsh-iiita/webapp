import { type Metadata } from "next";

export default function seo({
  title = "",
  desc = "IIIT Allahabad's placement portal. This is a portal for students to register and track their placement activities.",
  img = "images/logo192.png",
}): Metadata {
  return {
    title: title + (title ? " · " : "") + "Utkarsh IIITA",
    description: desc,
    manifest: "/manifest.json",
    icons: "/favicon.ico",
    twitter: {
      card: "summary_large_image",
      site: title || "Utkarsh IIITA",
      description: desc,
      images: img,
    },
  }
}


// old meta data code for reference:

/*
return (
  <Head>
    <title>{title + (title ? " · " : "") + "Utkarsh IIITA"} </title>
    <meta name="theme-color" content={theme.palette.background.default} />
    <meta
      name="title"
      content={title + (title ? " · " : "") + "Utkarsh IIITA"}
    />
    <meta name="description" content={desc} />
    <link rel="manifest" href="/manifest.json" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-icon.png">
      {" "}
    </link>

    <meta property="og:type" content="website" />
    <meta property="og:title" content={title || "Utkarsh IIITA"} />
    <meta property="og:description" content={desc} />
    <meta property="og:image" itemProp="image" content={img} />

    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content={title || "Utkarsh IIITA"} />
    <meta property="twitter:description" content={desc} />
    <meta property="twitter:image" content={img} />
  </Head>
);
*/