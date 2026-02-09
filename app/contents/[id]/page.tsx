import { redirect } from "next/navigation";

type LegacyContentDetailPageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

export default function LegacyContentDetailPage({ params, searchParams }: LegacyContentDetailPageProps) {
  const decodedId = safeDecode(params.id);
  if (!decodedId) {
    redirect("/contents");
  }

  const targetId = encodeURIComponent(decodedId);
  const query = new URLSearchParams();

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item != null) query.append(key, item);
        }
      } else if (value != null) {
        query.set(key, value);
      }
    }
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";
  redirect(`/content/${targetId}${suffix}`);
}
