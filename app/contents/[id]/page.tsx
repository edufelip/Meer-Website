import { permanentRedirect, redirect } from "next/navigation";
import { buildLegacyContentRedirectPath } from "../../../src/siteContents/legacyRoute";

type LegacyContentDetailPageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function LegacyContentDetailPage({ params, searchParams }: LegacyContentDetailPageProps) {
  const redirectPath = buildLegacyContentRedirectPath(params.id, searchParams);
  if (!redirectPath) {
    redirect("/contents");
  }

  permanentRedirect(redirectPath);
}
