export enum LanguageCodeEnum {
  en = 'en',
  pl = 'pl',
  uk = 'uk',
  da = 'da',
}

export const LanguageRecord: Record<LanguageCodeEnum, string> = {
  [LanguageCodeEnum.en]: 'English',
  [LanguageCodeEnum.uk]: 'Українська',
  [LanguageCodeEnum.pl]: 'Polski',
  [LanguageCodeEnum.da]: 'Dansk',
};

export const LANGUAGES: {
  code: LanguageCodeEnum;
  name: string;
}[] = Object.keys(LanguageRecord).map((code) => {
  return {
    code,
    name: LanguageRecord[code as keyof typeof LanguageCodeEnum],
  } as never;
});

export function isSupportedLanguageCodeEnum(
  code: string,
): code is LanguageCodeEnum {
  return Object.keys(LanguageCodeEnum).includes(code);
}
