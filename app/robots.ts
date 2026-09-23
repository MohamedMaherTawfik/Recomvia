import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/articles";

export default function robots(): MetadataRoute.Robots {
  return {rules:[{userAgent:"*",allow:"/",disallow:["/dashboard","/report","/fix-center","/support/inbox","/api/"]}],sitemap:`${SITE_URL}/sitemap.xml`,host:SITE_URL};
}
