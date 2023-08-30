import React, { useState, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import DevTools from "./devtools";
import {
  HeaderProps,
  FooterProps,
  PageProps,
  Posts,
  ChilderenProps,
} from "../typescript/layout";

export default function Layout({
  header,
  footer,
  page,
  blogPost,
  blogList,
  children,
}: {
  header: HeaderProps;
  footer: FooterProps;
  page: PageProps;
  blogPost: Posts;
  blogList: Posts;
  children: ChilderenProps;
}) {
  const [getLayout, setLayout] = useState({ header, footer });
  const jsonObj: any = { header, footer };
  page && (jsonObj.page = page);
  blogPost && (jsonObj.blog_post = blogPost);
  blogList && (jsonObj.blog_post = blogList);

  useEffect(() => {
    if (footer && header) {
      setLayout({ header: header, footer: footer });
    }
  }, [header, footer]);

  return (
    <>
      {header ? <Header header={getLayout.header} /> : ""}
      <main className="mainClass">
        <>
          {children}
          {Object.keys(jsonObj).length && <DevTools response={jsonObj} />}
        </>
      </main>
      {footer ? <Footer footer={getLayout.footer} /> : ""}
    </>
  );
}
