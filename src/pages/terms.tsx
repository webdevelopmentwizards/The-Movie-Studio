import Head from "next/head";

import LegalPageLayout, {
  LegalBulletList,
  LegalContact,
  LegalSection,
  LegalText,
} from "@/components/LegalPage";
import PageHero from "@/components/PageHero";

const EFFECTIVE_DATE = "June 24, 2026";
const CONTACT_EMAIL = "info@themoviestudio.com";
const CONTACT_ADDRESS =
  "110 Tower, 110 S.E 6th Street, Suite #1700, Ft. Lauderdale, Florida 33301";
const GOVERNING_STATE = "California";

const TOC = [
  { id: "eligibility", label: "Eligibility" },
  { id: "account", label: "Account Registration" },
  { id: "payments", label: "Subscription & Payments" },
  { id: "content-usage", label: "Content Usage" },
  { id: "conduct", label: "User Conduct" },
  { id: "ip", label: "Intellectual Property" },
  { id: "advertising", label: "Advertising" },
  { id: "termination", label: "Termination" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "changes", label: "Changes to Terms" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact Information" },
];

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service — The Movie Studio</title>
        <meta
          name="description"
          content="The Movie Studio terms of service for mobile applications, websites, and streaming services."
        />
      </Head>

      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="The rules and guidelines for using The Movie Studio apps, websites, and streaming platform."
      />

      <LegalPageLayout
        effectiveDate={EFFECTIVE_DATE}
        relatedPage={{ href: "/privacy-policy", label: "Privacy Policy" }}
        toc={TOC}
        intro="Welcome to The Movie Studio. By using our Services, you agree to these Terms."
      >
        <LegalSection id="eligibility" number={1} title="Eligibility">
          <LegalText>
            You must be at least 13 years old to use the Services. If under 18,
            you must have parental consent.
          </LegalText>
        </LegalSection>

        <LegalSection id="account" number={2} title="Account Registration">
          <LegalText>You agree to:</LegalText>
          <LegalBulletList
            items={[
              "Provide accurate information",
              "Keep your login credentials secure",
              "Be responsible for all activity under your account",
            ]}
          />
          <LegalText>
            We reserve the right to suspend or terminate accounts.
          </LegalText>
        </LegalSection>

        <LegalSection id="payments" number={3} title="Subscription & Payments">
          <LegalBulletList
            items={[
              "Some content may require payment or subscription",
              "Payments are processed through third-party providers (e.g., Apple, Google)",
              "Subscriptions may auto-renew unless canceled",
              "All fees are non-refundable unless required by law.",
            ]}
          />
        </LegalSection>

        <LegalSection id="content-usage" number={4} title="Content Usage">
          <LegalText>
            All content provided is for personal, non-commercial use only.
          </LegalText>
          <LegalText>You may NOT:</LegalText>
          <LegalBulletList
            items={[
              "Copy, distribute, or resell content",
              "Record or reproduce streams",
              "Use content for public display without permission",
            ]}
          />
        </LegalSection>

        <LegalSection id="conduct" number={5} title="User Conduct">
          <LegalText>You agree not to:</LegalText>
          <LegalBulletList
            items={[
              "Violate laws",
              "Upload harmful or illegal content",
              "Attempt to hack or disrupt the platform",
            ]}
          />
        </LegalSection>

        <LegalSection id="ip" number={6} title="Intellectual Property">
          <LegalText>
            All content, trademarks, and branding belong to The Movie Studio or
            its licensors.
          </LegalText>
        </LegalSection>

        <LegalSection id="advertising" number={7} title="Advertising">
          <LegalText>
            The Services may include advertisements. By using the platform, you
            agree to receive such ads.
          </LegalText>
        </LegalSection>

        <LegalSection id="termination" number={8} title="Termination">
          <LegalText>
            We may suspend or terminate access at any time if you violate these
            Terms.
          </LegalText>
        </LegalSection>

        <LegalSection id="disclaimers" number={9} title="Disclaimers">
          <LegalText>
            The Services are provided &ldquo;as is&rdquo; without warranties of
            any kind.
          </LegalText>
          <LegalText>We do not guarantee:</LegalText>
          <LegalBulletList
            items={["Uninterrupted access", "Error-free performance"]}
          />
        </LegalSection>

        <LegalSection id="liability" number={10} title="Limitation of Liability">
          <LegalText>
            To the fullest extent permitted by law, The Movie Studio is not
            liable for:
          </LegalText>
          <LegalBulletList
            items={[
              "Indirect or incidental damages",
              "Loss of data or revenue",
            ]}
          />
        </LegalSection>

        <LegalSection id="changes" number={11} title="Changes to Terms">
          <LegalText>
            We may update these Terms at any time. Continued use means acceptance
            of changes.
          </LegalText>
        </LegalSection>

        <LegalSection id="governing-law" number={12} title="Governing Law">
          <LegalText>
            These Terms are governed by the laws of the United States and the
            State of {GOVERNING_STATE}.
          </LegalText>
        </LegalSection>

        <LegalSection id="contact" number={13} title="Contact Information">
          <LegalContact email={CONTACT_EMAIL} address={CONTACT_ADDRESS} />
        </LegalSection>
      </LegalPageLayout>
    </>
  );
}
