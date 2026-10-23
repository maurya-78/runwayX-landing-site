import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security — RunwayX",
  description: "How RunwayX keeps your startup's financial data secure with Firebase and per-startup access rules.",
};

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-32">
        <h1 className="text-4xl font-medium tracking-tight">Security</h1>

        <div className="mt-2 rounded-lg bg-gold/15 px-4 py-3 text-sm text-ink/70">
          <strong>Notice:</strong> This is placeholder content pending legal review. It describes our current security practices at a high level.
        </div>

        <div className="mt-10 space-y-8 text-ink/70 leading-relaxed [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mb-3">
          <section>
            <h2>1. Infrastructure</h2>
            <p>
              RunwayX is built with Flutter and runs on Android and iOS. All backend services run on Firebase (Google Cloud Platform), which provides enterprise-grade infrastructure security, including automatic scaling, DDoS protection, and 99.95% uptime SLA.
            </p>
          </section>

          <section>
            <h2>2. Data Isolation</h2>
            <p>
              Each startup workspace in RunwayX is isolated with per-startup access rules enforced at the database level through Firebase Security Rules. Only members you have explicitly invited can see your financial numbers. There is no cross-startup data access.
            </p>
          </section>

          <section>
            <h2>3. Encryption</h2>
            <p>
              All data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption provided by Firebase and Google Cloud. API calls between the app and our backend are authenticated with Firebase Authentication tokens.
            </p>
          </section>

          <section>
            <h2>4. Authentication</h2>
            <p>
              RunwayX uses Firebase Authentication for secure sign-in. We support email/password authentication and plan to add social sign-in options. Sessions are managed with short-lived tokens that are automatically refreshed.
            </p>
          </section>

          <section>
            <h2>5. Access Control</h2>
            <p>
              Team members are assigned roles (Admin, Co-founder, Member) that determine their permissions. Admins can invite or remove members, approve expenses, and manage budgets. Members can only log expenses and view data they are authorised to see.
            </p>
          </section>

          <section>
            <h2>6. Receipt and AI Data</h2>
            <p>
              Scanned receipts are processed to extract amounts, vendor names, and dates. AI CFO queries are processed using your startup&apos;s data only and are not shared across workspaces. We do not use your financial data to train AI models.
            </p>
          </section>

          <section>
            <h2>7. Reporting Vulnerabilities</h2>
            <p>
              If you discover a security vulnerability, please report it to our team. We take all reports seriously and will work to resolve issues promptly.
            </p>
          </section>
        </div>

        <div className="mt-16 border-t border-line pt-8">
          <Link href="/#top" className="text-sm font-medium text-ink/50 transition-colors hover:text-ink">
            ← Back to RunwayX
          </Link>
        </div>
      </main>
    </>
  );
}
