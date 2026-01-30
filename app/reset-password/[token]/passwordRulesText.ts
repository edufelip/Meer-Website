import { passwordRules } from "../../../../src/shared/validation/password";
import pt from "../../../../src/shared/i18n/locales/pt-BR.json";

type TranslationMap = Record<string, unknown>;

const isRecord = (value: unknown): value is TranslationMap => {
  return typeof value === "object" && value !== null;
};

const getTranslation = (key: string): string => {
  const parts = key.split(".");
  let current: unknown = pt as TranslationMap;
  for (const part of parts) {
    if (isRecord(current) && Object.prototype.hasOwnProperty.call(current, part)) {
      current = (current as TranslationMap)[part];
    } else {
      return key;
    }
  }
  return typeof current === "string" ? current : key;
};

export function getPasswordRulesLabels(): string[] {
  return passwordRules.map((rule) => getTranslation(rule.labelKey));
}

export function getPasswordRuleErrorMessage(errorKey?: string): string | null {
  if (!errorKey) return null;
  const message = getTranslation(errorKey);
  return message === errorKey ? null : message;
}
