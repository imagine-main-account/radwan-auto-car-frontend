import { useEffect } from "react";

function setMeta(selector: string, content: string) {
  document.head.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
}

/** Keeps <title> and the description / share tags in index.html in sync with content from the API. */
export function useDocumentMeta({
  title,
  description,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
}) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[property="og:title"]', title);
    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
    }
    if (image) setMeta('meta[property="og:image"]', image);
  }, [title, description, image]);
}
