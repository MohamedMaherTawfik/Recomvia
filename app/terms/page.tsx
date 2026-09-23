import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/app/components/policy-page";
import { SITE_URL } from "@/lib/articles";

export const metadata: Metadata = {
  title: { absolute: "Recomvia Private Beta Terms" },
  description: "Terms governing the Recomvia private beta.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return <PolicyPage eyebrow="Private beta" title="Terms of Use" intro="These terms govern the current evaluation release. The beta is not yet a paid production service.">
    <PolicySection title="Beta status"><p>Recomvia currently provides a live website-readiness scanner, saved evidence reports, research content, and support. AI answer-surface measurement, billing, Fix Credit consumption, and direct website application are not active unless a screen explicitly states otherwise.</p></PolicySection>
    <PolicySection title="Authorized use"><p>You may analyze only public websites that you own, manage, or are otherwise authorized to assess. You must not use Recomvia to probe private networks, evade access controls, overload services, submit unlawful material, impersonate another person, or interfere with other accounts.</p></PolicySection>
    <PolicySection title="Measurement limits"><p>A readiness score describes observable website signals in a defined run. It is not a ranking, guarantee, recommendation, citation, legal conclusion, or promise of commercial performance. Actual AI visibility must be supported by named surfaces, prompts, markets, timestamps, runs, and stored evidence.</p></PolicySection>
    <PolicySection title="Changes and availability"><p>Beta features, limits, and methodology can change as they are tested. Recomvia may pause a scan or account to protect security, data integrity, cost controls, or other users. Methodology changes that affect comparability will receive a new version.</p></PolicySection>
    <PolicySection title="Content and responsibility"><p>You retain responsibility for decisions and website changes made from a report. Recomvia research and generated recommendations require professional review where accuracy, regulation, safety, or contractual obligations matter.</p></PolicySection>
    <PolicySection title="Contact"><p>Questions, data requests, and beta issues can be submitted through the <Link href="/contact" className="font-bold text-blue-700">Recomvia contact page</Link>. Final merchant, governing-law, liability, and business-identity terms will be published before any public paid checkout is enabled.</p></PolicySection>
  </PolicyPage>;
}
