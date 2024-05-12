import "@/styles/globals.css";
import Layout from "./layout"
import type { AppProps } from "next/app";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {

  return(
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
