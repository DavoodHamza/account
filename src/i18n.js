import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ar from "./locales/ar.json";
import ga from "./locales/ga.json";
import ml from "./locales/ml.json";
import hi from "./locales/hi.json";
import ta from "./locales/ta.json";
import mn from "./locales/mn.json";

import kn from "./locales/kn.json";
import es from "./locales/es.json";
import it from "./locales/it.json";
import ko from "./locales/ko.json";
import th from "./locales/th.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import ja from "./locales/ja.json";
import ru from "./locales/ru.json";
import bn from "./locales/bn.json";
import id from "./locales/id.json";
import nl from "./locales/nl.json";
import pa from "./locales/pa.json";
import pl from "./locales/pl.json";
import pt from "./locales/pt.json";
import si from "./locales/si.json";
import tr from "./locales/tr.json";
import sv from "./locales/sv.json";
import cn from "./locales/cn.json";
import te from "./locales/te.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ar: {
        translation: ar,
      },
      mn: {
        translation: mn,
      },
      ga: {
        translation: ga,
      },
      ml: {
        translation: ml,
      },
      hi: {
        translation: hi,
      },
      ta: {
        translation: ta,
      },
      kn: {
        translation: kn,
      },
      es: {
        translation: es,
      },
      it: {
        translation: it,
      },
      ko: {
        translation: ko,
      },
      th: {
        translation: th,
      },
      fr: {
        translation: fr,
      },
      de: {
        translation: de,
      },
      ja: {
        translation: ja,
      },

      ru: {
        translation: ru,
      },
      bn: {
        translation: bn,
      },
      id: {
        translation: id,
      },
      nl: {
        translation: nl,
      },
      pa: {
        translation: pa,
      },
      pl: {
        translation: pl,
      },
      pt: {
        translation: pt,
      },
      si: {
        translation: si,
      },
      tr: {
        translation: tr,
      },
      sv: {
        translation: sv,
      },
      cn: {
        translation: cn,
      },
      te: {
        translation: te,
      },
    },
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["navigator"],
    },
  });

export default i18n;
