import "@/styles/globals.css";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import Layout from "./layout"
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {

  return(
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
