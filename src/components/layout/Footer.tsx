import Link from "next/link";

// Stubbed Footer — production version uses lucide icons + FooterNewsletter (client comp) + Logo.
export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #ddd", padding: "24px 16px", marginTop: 32, textAlign: "center", fontSize: 13, color: "#666" }}>
      <div>© 메종 드 탤런트</div>
      <nav style={{ marginTop: 8, display: "flex", gap: 16, justifyContent: "center" }}>
        <Link href="/about">소개</Link>
        <Link href="/terms">이용약관</Link>
        <Link href="/privacy">개인정보처리방침</Link>
      </nav>
    </footer>
  );
}
