import i18n from "i18next";
import { customLogger } from 'logger'

import { initReactI18next } from "react-i18next";
import { customLogger } from "../logger";
var enJson = require("../assets/lang/en-US.json");
var wpToolbar = document.querySelector("html[class='wp-toolbar']");
var wpLang = "en-US";
if (wpToolbar) {
  wpLang = wpToolbar.getAttribute("lang");
}
customLogger("wpLang >>>>>", wpLang);

var lang = "";
try {
  lang = require("../assets/lang/" + wpLang + ".json");
} catch (ex) {
  lang = enJson;
  wpLang = "en";
}
const resources = {
  en: {
    translation: enJson,
  },
  [wpLang]: {
    translation: lang,
  },
};
i18n.use(initReactI18next).init({
  lng: wpLang, //default language
  fallbackLng: "en",
  debug: true,
  resources: resources,
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
  },
  react: {
    wait: true,
  },
});

export default i18n;
