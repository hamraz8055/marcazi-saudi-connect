import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";

interface PageMetaProps {
  titleKey: string;
  descriptionKey?: string;
}

const PageMeta = ({ titleKey, descriptionKey }: PageMetaProps) => {
  const { t } = useI18n();
  
  useEffect(() => {
    document.title = `${t(titleKey)} | Marcazi`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && descriptionKey) {
      metaDesc.setAttribute("content", t(descriptionKey));
    }
  }, [titleKey, descriptionKey, t]);

  return null;
};

export default PageMeta;
