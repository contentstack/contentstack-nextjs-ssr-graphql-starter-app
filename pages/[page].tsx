import React, { useState } from "react";
import RenderComponents from "../components/render-components";
import { getPageRes } from "../helper";
import Skeleton from "react-loading-skeleton";
import { Props } from "../typescript/pages";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { page } = props;
  const [getEntry] = useState(page);

  return getEntry.page_components ? (
    <RenderComponents
      pageComponents={getEntry.page_components}
      contentTypeUid="page"
      entryUid={getEntry.uid}
      locale={getEntry.locale}
    />
  ) : (
    <Skeleton count={3} height={300} />
  );
}

export const getServerSideProps: GetServerSideProps<{
  page: Props["page"];
}> = async ({ params }) => {
  if (!params || !params.page) return { notFound: true };

  try {
    const entryUrl = params.page.includes("/")
      ? (params.page as string)
      : `/${params.page}`;
    const entryRes = await getPageRes(entryUrl);

    if (!entryRes) throw new Error("404");

    return {
      props: {
        page: entryRes,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};
