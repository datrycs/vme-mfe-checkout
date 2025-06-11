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
          {/* <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
    /> */}
          <link rel="icon" href="data:;base64,iVBORw0KGgo=" />


          {process.env.NEXT_PUBLIC_COOKIEBOT_ID && (
            <>
              <script
                data-cookieconsent="ignore"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag() {
                      dataLayer.push(arguments)
                    }
                    gtag("consent", "default", {
                      ad_storage: "denied",
                      analytics_storage: "denied",
                      functionality_storage: "denied",
                      personalization_storage: "denied",
                      security_storage: "granted",
                      wait_for_update: 500
                    });
                    gtag("set", "ads_data_redaction", true);
                    gtag("set", "url_passthrough", true);
                  `,
                }}
              />
              <script
                id="Cookiebot"
                src="https://consent.cookiebot.com/uc.js"
                data-cbid={process.env.NEXT_PUBLIC_COOKIEBOT_ID}
                type="text/javascript"
                async
              />
            </>
          )}

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
