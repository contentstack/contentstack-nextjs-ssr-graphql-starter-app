import ContentstackLivePreview from "@contentstack/live-preview-utils";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const envConfig = process.env.CONTENTSTACK_API_KEY
  ? process.env
  : publicRuntimeConfig;

// Setting LP if enabled
ContentstackLivePreview.init({
  enable: envConfig.CONTENTSTACK_LIVE_PREVIEW === "true",
})?.catch((err) => console.error(err));
