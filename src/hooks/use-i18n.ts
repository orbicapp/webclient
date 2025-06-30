import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@/stores/settings-store";
import { useEffect } from "react";

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useSettingsStore();

  // Sync i18n language with settings store
  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Update settings store when i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      if (lng !== language) {
        setLanguage(lng);
      }
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [language, setLanguage, i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return {
    t,
    language: i18n.language,
    changeLanguage,
    isLoading: !i18n.isInitialized,
  };
};
