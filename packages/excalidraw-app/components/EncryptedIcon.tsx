import { shield } from "../../excalidraw/components/icons";
import { Tooltip } from "../../excalidraw/components/Tooltip";
import { useI18n } from "../../excalidraw/i18n";

export const EncryptedIcon = () => {
  const { t } = useI18n();

  return (
    <a
      className="encrypted-icon tooltip"
      href="https://blog.excalidraw.com/end-to-end-encryption/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("encrypted.link")}
    >
      <Tooltip label={t("encrypted.tooltip")} long={true}>
        {shield}
      </Tooltip>
    </a>
  );
};
