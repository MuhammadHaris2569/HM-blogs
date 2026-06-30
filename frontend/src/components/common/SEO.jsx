import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, type = 'website' }) => {
  const siteTitle = title ? `${title} | HM Blogs` : 'HM Blogs — Read • Learn • Inspire';
  const desc = description || 'HM Blogs is a modern publishing platform to read, learn, and share ideas that inspire.';
  const siteUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://hmblogs.com');
  const img = image || 'https://hmblogs.com/og-image.png';

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={siteUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:site_name" content="HM Blogs" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
};

export default SEO;
