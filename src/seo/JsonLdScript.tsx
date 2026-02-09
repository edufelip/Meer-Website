type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

export function serializeJsonLd(data: JsonLdValue): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

type JsonLdScriptProps = {
  data: JsonLdValue;
  id?: string;
};

export default function JsonLdScript({ data, id }: JsonLdScriptProps) {
  const hasArrayData = Array.isArray(data) && data.length > 0;
  const hasObjectData = !Array.isArray(data) && Object.keys(data).length > 0;
  if (!hasArrayData && !hasObjectData) return null;

  return (
    <script
      id={id}
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
