import React, { useState, useEffect } from "react";
import RenderComponents from "../components/render-components";
import { getPageRes } from "../helper";
import Skeleton from "react-loading-skeleton";
import { Props, Context } from "../typescript/pages";

export default function Home(props: Props) {
  const { page, entryUrl } = props;

  const [getEntry, setEntry] = useState(page);

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

export async function getServerSideProps(context: Context) {
  try {
    const entryRes = await getPageRes(context.resolvedUrl);
    return {
      props: {
        entryUrl: context.resolvedUrl,
        page: entryRes,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}
