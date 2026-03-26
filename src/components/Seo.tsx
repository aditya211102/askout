import { useEffect, useId } from "react";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

type JsonLd = Record<string, unknown>;

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  robots?: string;
  jsonLd?: JsonLd[];
}

const upsertMeta = (attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

const Seo = ({
  title,
  description,
  keywords,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  robots = "index,follow",
  jsonLd = [],
}: SeoProps) => {
  const instanceId = useId().replace(/:/g, "");

  useEffect(() => {
    const canonicalUrl = new URL(path ?? window.location.pathname, SITE_URL).toString();
    const resolvedTitle = title ?? SITE_NAME;

    document.title = resolvedTitle;

    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", keywords);
    upsertMeta("name", "author", SITE_NAME);
    upsertMeta("name", "robots", robots);
    upsertMeta("property", "og:title", resolvedTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:type", type);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", resolvedTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertLink("canonical", canonicalUrl);

    const scriptIds = jsonLd.map((_, index) => `seo-jsonld-${instanceId}-${index}`);
    jsonLd.forEach((schema, index) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptIds[index];
      script.text = JSON.stringify(schema);
      const existing = document.getElementById(script.id);
      if (existing) existing.remove();
      document.head.appendChild(script);
    });

    return () => {
      scriptIds.forEach((scriptId) => document.getElementById(scriptId)?.remove());
    };
  }, [description, image, instanceId, jsonLd, keywords, path, robots, title, type]);

  return null;
};

export default Seo;
