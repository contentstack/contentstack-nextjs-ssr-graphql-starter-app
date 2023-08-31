import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import Tooltip from "./tool-tip";
import Skeleton from "react-loading-skeleton";
import { HeaderProps } from "../typescript/layout";

export default function Header({ header }: { header: HeaderProps }) {
  const router = useRouter();
  const [headerData] = useState(header);

  return (
    <header className="header">
      <div className="note-div">
        {headerData?.notification_bar.show_announcement ? (
          typeof headerData.notification_bar.announcement_text === "string" && (
            <div {...(headerData.notification_bar.$?.announcement_text as {})}>
              {parse(headerData.notification_bar.announcement_text)}
            </div>
          )
        ) : (
          <Skeleton />
        )}
      </div>
      <div className="max-width header-div">
        <div className="wrapper-logo">
          {headerData ? (
            <Link href="/" className="logo-tag" title="Contentstack">
              <img
                className="logo"
                src={headerData.logo.url}
                alt={headerData.title}
                title={headerData.title}
                {...(headerData.logo.$?.url as {})}
              />
            </Link>
          ) : (
            <Skeleton width={150} />
          )}
        </div>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        <label className="menu-icon" htmlFor="menu-btn">
          <span className="navicon" />
        </label>
        <nav className="menu">
          <ul className="nav-ul header-ul">
            {headerData ? (
              headerData.navigation_menu.map((list) => {
                const className =
                  router.asPath === list.page_reference[0].url ? "active" : "";
                return (
                  <li
                    key={list.label}
                    className="nav-li"
                    {...(list.page_reference[0].$?.url as {})}
                  >
                    <Link
                      href={list.page_reference[0].url}
                      className={className}
                    >
                      {list.label}
                    </Link>
                  </li>
                );
              })
            ) : (
              <Skeleton width={300} />
            )}
          </ul>
        </nav>

        <div className="json-preview">
          <Tooltip
            content="JSON Preview"
            direction="top"
            dynamic={false}
            delay={200}
            status={0}
          >
            <span data-bs-toggle="modal" data-bs-target="#staticBackdrop">
              <img src="/json.svg" alt="JSON Preview icon" />
            </span>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
