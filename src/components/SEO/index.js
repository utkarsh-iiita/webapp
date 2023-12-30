import Head from 'next/head';
import { useTheme } from '@mui/material';
import { API_URL } from '@/utils/API/request';

export default function SEO({
  title = '',
  desc = "IIIT Allahabad's placement portal. This is a portal for students to register and track their placement activities.",
  img = 'images/logo192.png',
}) {
  let baseUrl = API_URL.split('/api')[0];
  const theme = useTheme();
  return (
    <Head>
      <title>{title + (title ? ' · ' : '') + 'Utkarsh IIITA'}</title>
      <meta name="theme-color" content={theme.palette.background.default} />
      <meta
        name="title"
        content={title + (title ? ' · ' : '') + 'Utkarsh IIITA'}
      />
      <meta name="description" content={desc} />
      <link rel="manifest" href="/manifest.json" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-icon.png"></link>
      <link rel="preconnect" href={baseUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title || 'Utkarsh IIITA'} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" itemProp="image" content={img} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title || 'Utkarsh IIITA'} />
      <meta property="twitter:description" content={desc} />
      <meta property="twitter:image" content={img} />
    </Head>
  );
}
