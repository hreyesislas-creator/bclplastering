interface JsonLdProps {
  data: object | object[];
  /** Optional id, useful when multiple JSON-LD blocks live on the same page. */
  id?: string;
}

/**
 * Renders an inline `<script type="application/ld+json">` block.
 * Safe for server components — no client-side cost.
 */
export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, (_k, v) => (v === undefined ? undefined : v)),
      }}
    />
  );
}
