import React, { useState } from "react";
import BlogList from "../../components/blog-list";
import RenderComponents from "../../components/render-components";
import { getPageRes, getBlogListRes } from "../../helper";

import ArchiveRelative from "../../components/archive-relative";
import Skeleton from "react-loading-skeleton";
import { Page, PostPage, Context } from "../../typescript/pages";

export default function Blog({
  page,
  posts,
  archivePost,
}: {
  page: Page;
  posts: PostPage;
  archivePost: PostPage;
}) {
  const [getBanner] = useState(page);

  return (
    <>
      {getBanner.page_components ? (
        <RenderComponents
          pageComponents={getBanner.page_components}
          blogPost
          contentTypeUid="page"
          entryUid={getBanner.uid}
          locale={getBanner.locale}
        />
      ) : (
        <Skeleton height={400} />
      )}
      <div className="blog-container">
        <div className="blog-column-left">
          {posts ? (
            posts.map((blogList, index) => (
              <BlogList bloglist={blogList} key={index} />
            ))
          ) : (
            <Skeleton height={400} width={400} count={3} />
          )}
        </div>
        <div className="blog-column-right">
          {getBanner && getBanner.page_components[1].widget && (
            <h2>{getBanner.page_components[1].widget.title_h2}</h2>
          )}
          {archivePost ? (
            <ArchiveRelative blogs={archivePost} />
          ) : (
            <Skeleton height={600} width={300} />
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: Context) {
  try {
    const page = await getPageRes(context.resolvedUrl);
    const { archivedBlogs, recentBlogs } = await getBlogListRes();

    return {
      props: {
        pageUrl: context.resolvedUrl,
        page,
        posts: recentBlogs,
        archivePost: archivedBlogs,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
