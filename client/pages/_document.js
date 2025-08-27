import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" type="image/png" href="fav.svg" />
          <meta
            name="google-site-verification"
            content="adCFriqoB3IQiZ1Vg_gH7sq0otH1mQGfWbseW4WFNaY"
          />
        </Head>
        <body>

        <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-PMPHFRTQ"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          <Main />
          <NextScript />
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PMPHFRTQ');`,
            }}
          />
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
          <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('keydown', function (e) {
                if (e.target.type === 'number' && ['e', 'E', '+', '-', '.'].includes(e.key)) {
                  e.preventDefault();
                }
              });

              document.addEventListener('paste', function (e) {
                if (e.target.type === 'number') {
                  const paste = (e.clipboardData || window.clipboardData).getData('text');
                  if (!/^\d+$/.test(paste)) {
                    e.preventDefault();
                  }
                }
              });

              
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('wheel', function (e) {
                if (document.activeElement.type === 'number' && document.activeElement === e.target) {
                  e.preventDefault();
                }
              }, { passive: false });
            `,
          }}
        />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
