import { useMemo } from "react";
import { useSelector } from "react-redux";
import DEFAULT_TRANSLATION_SET from "./translations/en-us.json";
import selectors from "../features/selectors";

export type SupportedLanguageCode = "en-us" | "es-mx" | "zh-cn";

export function createTranslator(languageCode: SupportedLanguageCode) {
  let translationSet: Record<string, string>;

  try {
    translationSet = require(`./translations/${languageCode}.json`);
  } catch (error) {
    translationSet = DEFAULT_TRANSLATION_SET;
  }

  return function translate(
    term: keyof typeof DEFAULT_TRANSLATION_SET,
    variables: Record<string, number | string> = {}
  ) {
    for (const variable of Object.keys(variables)) {
      if (!variable.startsWith("_")) {
        throw new Error(
          "Translation: Interpolated variables must be prefixed with an underscore."
        );
      }
    }

    let translation =
      translationSet[term] ||
      (DEFAULT_TRANSLATION_SET as Record<string, string>)[term] ||
      term;

    for (const [variable, value] of Object.entries(variables)) {
      const regularExpression = new RegExp(variable, "g");

      translation = translation.replace(regularExpression, value.toString());
    }

    return translation;
  };
}

export const useTranslation = () => {
  const { languageCode } = useSelector(selectors.selectSettings);
  const translate = useMemo(() => createTranslator(languageCode), [
    languageCode,
  ]);

  return translate;
};