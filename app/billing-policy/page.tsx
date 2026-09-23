import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/app/components/policy-page";
import { SITE_URL } from "@/lib/articles";

export const metadata: Metadata = {
  title: { absolute: "Recomvia Beta Billing Policy" },
  description: "Current payment, subscription, cancellation, refund, and Fix Credit status for the Recomvia private beta.",
  alternates: { canonical: `${SITE_URL}/billing-policy` },
};

export default function BillingPolicyPage() {
  return <PolicyPage eyebrow="Commercial transparency" title="Billing, Cancellation & Credits" intro="No payment is collected and no Fix Credits are issued in the current private beta.">
    <PolicySection title="Current status"><p>The prices displayed for Starter, Essential, Growth, Pro, Agency, credit packs, and expert services are validation hypotheses. Checkout, subscriptions, renewals, and credit purchases are disabled until live operating costs and safeguards have been verified.</p></PolicySection>
    <PolicySection title="Before billing opens"><p>Recomvia will publish exact plan limits, billing intervals, included prompts and surfaces, overage treatment, tax handling, cancellation timing, refund eligibility, credit validity, and the legal merchant identity before accepting payment.</p></PolicySection>
    <PolicySection title="Planned credit principle"><p>Purchased Fix Credits will be recorded in an append-only ledger and tied to a specific action. A failed action must release or reverse its reservation. Cancellation of a subscription will not silently confiscate purchased credits, although Fix Center access can require an active Essential or higher plan under the published validity rules.</p></PolicySection>
    <PolicySection title="No accidental charge"><p>Buttons on the private-beta pricing and Fix Center pages either join the beta, request human contact, or preview a catalog item. They do not create a purchase. If you receive an unexpected payment request claiming to be Recomvia, report it through the <Link href="/contact" className="font-bold text-blue-700">contact page</Link>.</p></PolicySection>
  </PolicyPage>;
}
