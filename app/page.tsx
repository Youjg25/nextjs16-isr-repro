import Link from "next/link";

const STORE_SLUGS = ["store-a", "store-b", "store-c", "store-d", "store-e"];

export default function Home() {
  return (
    <main style={{ padding: 32, fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "0 auto" }}>
      <h1>Next.js 16 ISR + generateStaticParams repro</h1>

      <p>
        Open any link below after <code>npm run build &amp;&amp; npm start</code>. With{" "}
        <code>revalidate = 3600</code> + <code>generateStaticParams</code> + turbopack, the build-time SSG
        prerender silently produces an incomplete RSC payload and the page never finishes hydrating in
        production. Swap the page&apos;s <code>revalidate</code> export for{" "}
        <code>dynamic = &quot;force-dynamic&quot;</code> and the exact same JSX renders fine.
      </p>

      <section style={{ marginTop: 24 }}>
        <h2>❌ Broken — ISR (revalidate = 3600)</h2>
        <p style={{ fontSize: 14, color: "#555" }}>
          The browser logs <code>Error: Connection closed.</code> and the page content sits as a skeleton
          forever. Server returns HTTP 200; the failure is silent.
        </p>
        <ul>
          {STORE_SLUGS.map((slug) => (
            <li key={slug}>
              <Link href={`/guide/store/${slug}`}>/guide/store/{slug}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 24, fontSize: 13, color: "#666" }}>
        <h3>Reproduction</h3>
        <ol>
          <li>
            <code>npm install &amp;&amp; npm run build &amp;&amp; npm start</code> — or deploy to Vercel.
          </li>
          <li>Open any broken URL. The page header (this nav) renders, then content sits as a skeleton forever.</li>
          <li>Open DevTools → Console: <code>Error: Connection closed.</code></li>
          <li>
            <code>curl -H &quot;RSC: 1&quot; https://&lt;deployment&gt;/guide/store/store-a</code> — body contains{" "}
            <code>$L*</code> Suspense placeholders without their resolution chunks.
          </li>
          <li>
            Toggle the broken page from <code>revalidate</code> to <code>force-dynamic</code> in{" "}
            <code>app/guide/store/[slug]/page.tsx</code> — same page renders fine.
          </li>
        </ol>
      </section>
    </main>
  );
}
