import type { MetadataRoute } from "next";
import { webBaseUrl } from "../src/urls";

const baseUrl = webBaseUrl.replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/app-ads.txt", "/contents", "/content/", "/store/", "/privacy-policy", "/terms-eula", "/support"],
        disallow: ["/reset-password/"]
      },
      {
        userAgent: "Googlebot",
        allow: ["/app-ads.txt"]
      },
      {
        userAgent: "AdsBot-Google",
        allow: ["/app-ads.txt"]
      },
      {
        userAgent: "Mediapartners-Google",
        allow: ["/app-ads.txt"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
