import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="de">
      <body style={{ background: "#030712", color: "#fff", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#A78BFA", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "16px" }}>404</p>
          <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px" }}>Seite nicht gefunden</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "24px" }}>Page not found</p>
          <Link href="/de" style={{ color: "#A78BFA", textDecoration: "underline" }}>
            Zurück zur Startseite
          </Link>
        </div>
      </body>
    </html>
  );
}
