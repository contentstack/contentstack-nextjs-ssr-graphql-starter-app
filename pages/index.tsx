import React, { useState } from "react";
import RenderComponents from "../components/render-components";
import { getPageRes, getPathOnly } from "../helper";
import Skeleton from "react-loading-skeleton";
import { Props } from "../typescript/pages";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { page } = props;

  const [getEntry] = useState(page);

  return getEntry ? (
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
}> = async (context) => {
  try {
    const entryUrl = getPathOnly(context.resolvedUrl);
    const entryRes = await getPageRes(entryUrl);

    return {
      props: {
        page: entryRes,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
