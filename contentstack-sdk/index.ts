import ContentstackLivePreview from "@contentstack/live-preview-utils";
import getConfig from "next/config";
import {
  customHostUrl,
  initializeContentStackSdk,
  isValidCustomHostUrl,
} from "./utils";

const { publicRuntimeConfig } = getConfig();
const envConfig = process.env.CONTENTSTACK_API_KEY
  ? process.env
  : publicRuntimeConfig;

let customHostBaseUrl = envConfig.CONTENTSTACK_API_HOST as string;
customHostBaseUrl = customHostUrl(customHostBaseUrl);

// SDK initialization
const Stack = initializeContentStackSdk();

// set host url only for custom host or non prod base url's
if (isValidCustomHostUrl(customHostBaseUrl)) {
  Stack.setHost(customHostBaseUrl);
}

// Setting LP if enabled
ContentstackLivePreview.init({
  //@ts-ignore
  stackSdk: Stack,
  clientUrlParams: {
    host: envConfig.CONTENTSTACK_APP_HOST,
  },
  stackDetails: {
    apiKey: envConfig.CONTENTSTACK_API_KEY,
    environment: envConfig.CONTENTSTACK_ENVIRONMENT,
  },
  enable: envConfig.CONTENTSTACK_LIVE_PREVIEW === "true",
  ssr: true,
})?.catch((err) => console.error(err));

export const renderOption = {
  span: (node: any, next: any) => next(node.children),
};
