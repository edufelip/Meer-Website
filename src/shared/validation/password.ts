export type PasswordRule = {
  id: string;
  labelKey: string;
  errorKey: string;
  test: (value: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
  {
    id: "minLength",
    labelKey: "validation.password.minLength.label",
    errorKey: "validation.password.minLength.error",
    test: (value) => value.length >= 6
  },
  {
    id: "uppercase",
    labelKey: "validation.password.uppercase.label",
    errorKey: "validation.password.uppercase.error",
    test: (value) => /[A-Z]/.test(value)
  },
  {
    id: "number",
    labelKey: "validation.password.number.label",
    errorKey: "validation.password.number.error",
    test: (value) => /[0-9]/.test(value)
  },
  {
    id: "special",
    labelKey: "validation.password.special.label",
    errorKey: "validation.password.special.error",
    test: (value) => /[^A-Za-z0-9]/.test(value)
  }
];

export function validatePassword(value: string): { valid: boolean; errorKey?: string } {
  for (const rule of passwordRules) {
    if (!rule.test(value)) {
      return { valid: false, errorKey: rule.errorKey };
    }
  }
  return { valid: true };
}
