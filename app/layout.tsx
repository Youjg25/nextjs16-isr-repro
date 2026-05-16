import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js 16 ISR + generateStaticParams repro",
  description: "Minimal reproduction of incomplete RSC payload on SSG prerender.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
