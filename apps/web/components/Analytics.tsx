"use client";

import { useEffect } from "react";
import Script from "next/script";

/**
 * Componente de Analytics que carrega scripts e inicializa tracking
 */
export default function Analytics() {
  const ga4Id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const analyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false";

  useEffect(() => {
    if (!analyticsEnabled) {
      console.log("[Analytics] Analytics desabilitado");
      return;
    }

    // Inicializar Plausible se configurado
    if (plausibleDomain && typeof window !== "undefined") {
      (window as any).plausible =
        (window as any).plausible ||
        function () {
          ((window as any).plausible.q = (window as any).plausible.q || []).push(arguments);
        };
    }
  }, [analyticsEnabled, plausibleDomain]);

  if (!analyticsEnabled) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 */}
      {ga4Id && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* Plausible Analytics */}
      {plausibleDomain && (
        <Script
          strategy="afterInteractive"
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
        />
      )}
    </>
  );
}

