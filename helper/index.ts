import * as Utils from "@contentstack/utils";
import { addEditableTags } from "@contentstack/utils";
import { Page, BlogPosts } from "../typescript/pages";
import getConfig from "next/config";
import { FooterProps, HeaderProps } from "../typescript/layout";
import { getEntry, getEntryByUrl, renderOption } from "../contentstack-sdk";

const { publicRuntimeConfig } = getConfig();
const envConfig = process.env.CONTENTSTACK_API_KEY
  ? process.env
  : publicRuntimeConfig;

const liveEdit = envConfig.CONTENTSTACK_LIVE_EDIT_TAGS === "true";
import ContentstackLivePreview from "@contentstack/live-preview-utils";

const graphqlUrl = new URL(
  `https://dev11-graphql.csnonprod.com/stacks/${process.env.CONTENTSTACK_API_KEY}?environment=${process.env.CONTENTSTACK_ENVIRONMENT}`
);

const GRAPHQL_HOST_NAME = "dev11-graphql.csnonprod.com";
const LIVE_PREVIEW_HOST_NAME = "dev11-preview.csnonprod.com";

function getHeaders() {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append(
    "access_token",
    process.env.CONTENTSTACK_DELIVERY_TOKEN as string
  );
  return headers;
}

const gqlRequest = async (
  gql: string,
  options?: {
    variables?: Record<string, any>;
    operationName?: string;
  }
) => {
  const hash = ContentstackLivePreview.hash;
  const headers = getHeaders();

  if (hash) {
    headers.append("live_preview", hash);
    headers.append(
      "authorization",
      process.env.CONTENTSTACK_MANAGEMENT_TOKEN as string
    );
    graphqlUrl.hostname = LIVE_PREVIEW_HOST_NAME;
  } else {
    graphqlUrl.hostname = GRAPHQL_HOST_NAME;
  }

  const body: Record<string, any> = {
    query: gql,
  };

  body.variables = options?.variables || null;
  if (options?.operationName) {
    body.operationName = options.operationName;
  }

  const res = await fetch(graphqlUrl.toString(), {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  return res;
};

export const getHeaderRes = async (): Promise<HeaderProps> => {
  const gql = `
query HeaderQuery {
  all_header {
    total
    items {
      title
      logoConnection {
        edges {
          node {
            url
            filename
          }
        }
      }
      navigation_menu {
        label
        page_referenceConnection {
          totalCount
          edges {
            node {
              ... on Page {
                title
                url
              }
            }
          }
        }
      }
      notification_bar {
        show_announcement
        announcement_text {
          json
        }
      }
      system {
        uid
      }
    }
  }
}
`;

  const res = await gqlRequest(gql);

  const data = await res.json();

  console.log("dddddddddddddddddddddddddd", data);
  const header = data.data.all_header.items[0];

  const transformed = {
    ...header,
    logo: header.logoConnection.edges[0].node,
    navigation_menu: header.navigation_menu.map((item: any) => ({
      ...item,
      page_reference: item.page_referenceConnection.edges.map(
        (edge: any) => edge.node
      ),
    })),
    uid: header.system.uid,
    notification_bar: {
      ...header.notification_bar,
    },
  };

  Utils.GQL.jsonToHTML({
    entry: transformed,
    paths: ["notification_bar.announcement_text"],
    renderOption: renderOption,
  });

  liveEdit && Utils.addEditableTags(transformed, "header", true);

  return transformed;
};

export const getFooterRes = async (): Promise<FooterProps> => {
  const gql = `
query FooterQuery {
  all_footer {
    total
    items {
      title
      logoConnection {
        edges {
          node {
            url
            filename
          }
        }
      }
      navigation {
        link {
          href
          title
        }
      }
      social {
        social_share {
          link {
            href
            title
          }
          iconConnection {
            edges {
              node {
                url
                filename
              }
            }
          }
        }
      }
      copyright {
        json
      }
      system {
        uid
      }
    }
  }
}

`;

  const res = await gqlRequest(gql);

  const data = await res.json();

  const footer = data.data.all_footer.items[0];

  const transformed = {
    ...footer,
    logo: footer.logoConnection.edges[0].node,
    social: {
      social_share: footer.social.social_share.map((item: any) => ({
        ...item,
        icon: item.iconConnection.edges[0].node,
      })),
    },
    uid: footer.system.uid,
    copyright: {
      ...footer.copyright,
    },
  };

  Utils.GQL.jsonToHTML({
    entry: transformed,
    paths: ["copyright"],
    renderOption: renderOption,
  });

  liveEdit && Utils.addEditableTags(transformed, "footer", true);
  return transformed as FooterProps;
};

export const getPageRes = async (entryUrl: string): Promise<Page> => {
  const response = (await getEntryByUrl({
    contentTypeUid: "page",
    entryUrl,
    referenceFieldPath: ["page_components.from_blog.featured_blogs"],
    jsonRtePath: [
      "page_components.from_blog.featured_blogs.body",
      "page_components.section_with_buckets.buckets.description",
      "page_components.section_with_html_code.description",
    ],
  })) as Page[];
  liveEdit && addEditableTags(response[0], "page", true);
  return response[0];
};

export const getBlogListRes = async (): Promise<BlogPosts[]> => {
  const response = (await getEntry({
    contentTypeUid: "blog_post",
    referenceFieldPath: ["author", "related_post"],
    jsonRtePath: ["body"],
  })) as BlogPosts[][];
  liveEdit &&
    response[0].forEach((entry) => addEditableTags(entry, "blog_post", true));
  return response[0];
};

export const getBlogPostRes = async (entryUrl: string): Promise<BlogPosts> => {
  const response = (await getEntryByUrl({
    contentTypeUid: "blog_post",
    entryUrl,
    referenceFieldPath: ["author", "related_post"],
    jsonRtePath: ["body", "related_post.body"],
  })) as BlogPosts[];
  liveEdit && addEditableTags(response[0], "blog_post", true);
  return response[0];
};
