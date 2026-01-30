import { passwordRules } from "../../../../src/shared/validation/password";
import pt from "../../../../src/shared/i18n/locales/pt-BR.json";

type TranslationMap = Record<string, any>;

const getTranslation = (key: string): string => {
  const parts = key.split(".");
  let current: any = pt as TranslationMap;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return key;
    }
  }
  return typeof current === "string" ? current : key;
};

export function getPasswordRulesLabels(): string[] {
  return passwordRules.map((rule) => getTranslation(rule.labelKey));
}
