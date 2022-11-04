/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import htm from "htm";
import { h } from "preact";
import render from "preact-render-to-string";

const html = htm.bind(h);

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response(
        `<!DOCTYPE html>
<html>
<title>Year Progress SVG</title>
<h1>Year Progress SVG</title>
</html>
`,
        { headers: { "content-type": "text/html" } }
      );
    }

    if (url.pathname === "/progress.svg") {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const end = new Date(now.getFullYear() + 1, 0, 0);
      const percentage = Math.round(
        ((now.getTime() - start.getTime()) /
          (end.getTime() - start.getTime())) *
          100
      );
      return new Response(
        `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
        ${render(createSVG(percentage) as any)}`,
        {
          headers: { "content-type": "image/svg+xml" },
        }
      );
    }

    return new Response("Not Found", { status: 404 });
  },
};

const createSVG = (percentage: number) => {
  percentage = Math.max(0, Math.min(100, percentage));
  percentage = Math.floor(percentage * 10) / 10;

  return html`<svg
    width=${1040}
    height="103.99997"
    viewBox="0 0 275.16667 27.516659"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="a"
        x1="10.354899"
        y1="22.651342"
        x2="299.86063"
        y2="22.651342"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0.91391398,0,0,0.64339551,0.82815907,4.1845399)"
      >
        <stop style=${{ stopColor: "#3465a4", stopOpacity: 1 }} offset=${0} />
        <stop
          style=${{ stopColor: "#7d5e79", stopOpacity: 1 }}
          offset=${0.75}
        />
        <stop style=${{ stopColor: "#c6574e", stopOpacity: 1 }} offset=${1} />
      </linearGradient>
    </defs>
    <g transform="translate(-4.9999838,-4.9999819)">
      <rect
        style=${{
          fill: "#000000",
          fillOpacity: "0.012012",
          stroke: "#3c3c3c",
          strokeWidth: "3.48662",
          strokeLinecap: "square",
          strokeLinejoin: "round",
          strokeDasharray: "none",
          strokeOpacity: 1,
        }}
        width="271.68005"
        height="24.030039"
        x="6.7432938"
        y="6.7432919"
      />
      <rect
        style=${{
          fill: "url(#a)",
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: "4.98903",
          strokeDasharray: "none",
          strokeOpacity: 1,
          paintOrder: "stroke fill markers",
        }}
        width="264.58334"
        height="16.933332"
        x="10.291647"
        y="10.291645"
        clip-path="url(#clip)"
      />
      <text
        style=${{
          fontStyle: "normal",
          fontVariant: "normal",
          fontWeight: "normal",
          fontStretch: "normal",
          fontSize: "25.4px",
          fontFamily: "sans-serif",
          InkscapeFontSpecification: '"sans-serif, Normal"',
          fontVariantLigatures: "normal",
          fontVariantCaps: "normal",
          fontVariantNumeric: "normal",
          fontVariantEastAsian: "normal",
          mixBlendMode: "hard-light",
          fill: "#eeeeec",
          fillOpacity: "0.834835",
          stroke: "#2e3436",
          strokeWidth: "2.64583",
          strokeLinecap: "square",
          strokeLinejoin: "round",
          strokeDasharray: "none",
          strokeOpacity: 1,
          paintOrder: "stroke fill markers",
        }}
        x="125.55626"
        y="22.611311"
      >
        <tspan
          style=${{
            fontStyle: "normal",
            fontVariant: "normal",
            fontWeight: "normal",
            fontStretch: "normal",
            fontSize: "11.2889px",
            fontFamily: "Helvetica",
            InkscapeFontSpecification: '"Helvetica, Normal"',
            fontVariantLigatures: "normal",
            fontVariantCaps: "normal",
            fontVariantNumeric: "normal",
            fontVariantEastAsian: "normal",
            fill: "#eeeeec",
            fillOpacity: "0.834835",
            stroke: "#2e3436",
            strokeWidth: "2.64583",
            strokeDasharray: "none",
          }}
          x="125.55626"
          y="22.611311"
        >
          ${percentage}%
        </tspan>
      </text>
    </g>
    <clipPath id="clip">
      <rect width=${`${percentage}%`} height="100%" />
    </clipPath>
  </svg>`;
};
