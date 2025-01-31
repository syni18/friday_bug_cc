import { useSetAtom } from "jotai";
import React from "react";
import { appLangCodeAtom } from "../App";
import { useI18n } from "../../excalidraw/i18n";
import { languages } from "../../excalidraw/i18n";

export const LanguageList = ({ style }: { style?: React.CSSProperties }) => {
  const { t, langCode } = useI18n();
  const setLangCode = useSetAtom(appLangCodeAtom);

  return (
    <select
      className="dropdown-select dropdown-select__language"
      onChange={({ target }) => setLangCode(target.value)}
      value={langCode}
      aria-label={t("buttons.selectLanguage")}
      style={style}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};
