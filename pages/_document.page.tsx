import Document, {
  Html,
  Main,
  NextScript,
  Head,
  DocumentContext,
} from "next/document"
import Script from "next/script"

import NewRelicSnippet from "components/data/NewRelicSnippet"

class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <Script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid="b74842b6-6d68-458f-850a-6e36c45d5bc4"
            data-blockingmode="auto"
            type="text/javascript"
          ></Script>
          {/* <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
    /> */}
          <link rel="icon" href="data:;base64,iVBORw0KGgo=" />

          {process.env[
            `NEXT_PUBLIC_NEWRELIC_LOADER_CONFIG_${process.env.NEXT_PUBLIC_STAGE}`
          ] !== null && (
            <Script id="new-relic" strategy="afterInteractive">
              {NewRelicSnippet}
            </Script>
          )}
        </Head>
        <body className="antialiased font-medium bg-gray-50">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument
