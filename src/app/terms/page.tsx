import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — RunwayX",
  description: "Terms of Service for RunwayX, the financial operating system for startups.",
};

export default function TermsPage(
  
) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-32">
        <h1 className="text-4xl font-medium tracking-tight">Terms of Service</h1>

        <div className="mt-2 rounded-lg bg-gold/15 px-4 py-3 text-sm text-ink/70">
          <strong>Notice:</strong> This is placeholder content pending legal review. It does not constitute legal advice.
        </div>

        <div className="mt-10 space-y-8 text-ink/70 leading-relaxed [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mb-3">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By downloading, installing or using the RunwayX mobile application (&ldquo;App&rdquo;), you agree to these Terms of Service. RunwayX is a Flutter-based application available on Android and iOS.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              RunwayX helps startups track expenses, monitor burn rate, estimate runway, manage team members with role-based access, scan receipts, and access an AI-powered CFO for financial insights.
            </p>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>
              You must create an account to use RunwayX. You are responsible for maintaining the security of your account credentials. Each startup workspace operates with per-startup access rules — only members you invite can see your financial data.
            </p>
          </section>

          <section>
            <h2>4. Data Storage</h2>
            <p>
              All data is stored securely on Firebase with per-startup access rules. We do not share your financial data with third parties except as necessary to provide the service.
            </p>
          </section>

          <section>
            <h2>5. Acceptable Use</h2>
            <p>
              You agree to use RunwayX only for lawful business purposes. You may not attempt to reverse-engineer the application, access another startup&apos;s data, or use the service to process transactions for illegal activities.
            </p>
          </section>

          <section>
            <h2>6. AI CFO Disclaimer</h2>
            <p>
              The AI CFO feature provides financial insights based on your logged data. It is not a substitute for professional financial advice. RunwayX is not liable for decisions made based on AI-generated responses.
            </p>
          </section>

          <section>
            <h2>7. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of RunwayX after changes constitutes acceptance of the updated terms.
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
