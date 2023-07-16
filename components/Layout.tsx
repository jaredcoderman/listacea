import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <div className="layout">{props.children}</div>
    <style jsx global>{`
      html {
        box-sizing: border-box;
      }

      :root {
        --main-button-bg: #76aed0;
        --bg: #ffffff;
        --secondary-button-bg: #e5c6b3;
        --main-button-color: #000000;
        --color: #010504;
      }

      .link {
        text-decoration: none;
        color: var(--geist-foreground);
        display: inline-block;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        padding: 0 3rem;
        font-size: 18px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol";
        background: var(--bg);
        color: var(--color);
      }

      @media only screen and (max-width: 800px) {
        body {
          font-size: 17px;
          padding: 0 1rem;
        }
      }

      input,
      textarea {
        font-size: 16px;
      }

      button {
        cursor: pointer;
      }
    `}</style>
    <style jsx>{`
      .layout {
        padding: 0 2rem;
      }
    `}</style>
  </div>
);

export default Layout;
