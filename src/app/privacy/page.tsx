import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — RunwayX",
  description: "Privacy Policy for RunwayX. Learn how we handle your startup's financial data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-32">
        <h1 className="text-4xl font-medium tracking-tight">Privacy Policy</h1>

        <div className="mt-2 rounded-lg bg-gold/15 px-4 py-3 text-sm text-ink/70">
          <strong>Notice:</strong> This is placeholder content pending legal review. It does not constitute legal advice.
        </div>

        <div className="mt-10 space-y-8 text-ink/70 leading-relaxed [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mb-3">
          <section>
            <h2>1. Information We Collect</h2>
            <p>
              RunwayX collects the information you provide when creating your account (name, email) and the financial data you log (expenses, funds, team members). We also collect basic usage analytics to improve the app.
            </p>
          </section>

          <section>
            <h2>2. How We Store Your Data</h2>
            <p>
              All data is stored on Firebase with per-startup access rules. Only members you have explicitly invited to your startup workspace can view your financial numbers. Data is encrypted in transit and at rest.
            </p>
          </section>

          <section>
            <h2>3. How We Use Your Data</h2>
            <p>
              Your financial data is used solely to provide RunwayX&apos;s features: expense tracking, burn rate calculations, runway estimation, team management, receipt scanning results, and AI CFO responses. We do not sell your data.
            </p>
          </section>

          <section>
            <h2>4. Third-Party Services</h2>
            <p>
              RunwayX uses Firebase (Google Cloud) for authentication and data storage. Receipt scanning and AI CFO features may use third-party AI services to process your data. These services are bound by their own privacy policies and our data processing agreements.
            </p>
          </section>

          <section>
            <h2>5. Data Retention</h2>
            <p>
              Your data is retained as long as your account is active. You can request deletion of your account and all associated data at any time by contacting our support team.
            </p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>
              You have the right to access, correct, export, or delete your personal data. You can manage team access from within the app to control who sees your startup&apos;s financial information.
            </p>
          </section>

          <section>
            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of significant changes through the app or via email.
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
