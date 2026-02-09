import type { MetadataRoute } from "next";
import { webBaseUrl } from "../src/urls";

const baseUrl = webBaseUrl.replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/contents", "/content/", "/store/", "/privacy-policy", "/terms-eula"],
        disallow: ["/reset-password/"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
