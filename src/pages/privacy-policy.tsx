import Head from "next/head";

import LegalPageLayout, {
  LegalBulletList,
  LegalContact,
  LegalEmailLink,
  LegalSection,
  LegalSubheading,
  LegalText,
} from "@/components/LegalPage";
import PageHero from "@/components/PageHero";

const EFFECTIVE_DATE = "June 24, 2026";
const CONTACT_EMAIL = "info@themoviestudio.com";
const CONTACT_ADDRESS =
  "110 Tower, 110 S.E 6th Street, Suite #1700, Ft. Lauderdale, Florida 33301";

const TOC = [
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Your Information" },
  { id: "sharing", label: "Sharing of Information" },
  { id: "third-party", label: "Third-Party Services" },
  { id: "data-retention", label: "Data Retention" },
  { id: "privacy-rights", label: "Your Privacy Rights" },
  { id: "children", label: "Children's Privacy" },
  { id: "data-security", label: "Data Security" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact Us" },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — The Movie Studio</title>
        <meta
          name="description"
          content="The Movie Studio privacy policy for mobile applications, websites, and streaming services."
        />
      </Head>

      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your information across our apps, websites, and streaming services."
      />

      <LegalPageLayout
        effectiveDate={EFFECTIVE_DATE}
        relatedPage={{ href: "/terms", label: "Terms of Service" }}
        toc={TOC}
        intro={
          <>
            The Movie Studio (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
            &ldquo;us&rdquo;) respects your privacy and is committed to
            protecting your personal information. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you use our mobile applications, websites, and streaming services
            (collectively, the &ldquo;Services&rdquo;).
          </>
        }
      >
        <LegalSection
          id="information-we-collect"
          number={1}
          title="Information We Collect"
        >
          <LegalSubheading>Personal Information You Provide</LegalSubheading>
          <LegalBulletList
            items={[
              "Name",
              "Email address",
              "Account login credentials",
              "Payment information (processed securely by third-party providers)",
            ]}
          />

          <LegalSubheading>Automatically Collected Information</LegalSubheading>
          <LegalBulletList
            items={[
              "Device type and identifiers",
              "IP address",
              "Operating system",
              "App usage data",
              "Viewing activity and watch history",
            ]}
          />

          <LegalSubheading>Cookies & Tracking Technologies</LegalSubheading>
          <LegalText>We use cookies and similar technologies to:</LegalText>
          <LegalBulletList
            items={[
              "Maintain login sessions",
              "Personalize content",
              "Deliver relevant advertisements",
            ]}
          />
          <LegalText>
            Third-party partners (analytics and ad providers) may also collect
            information.
          </LegalText>
        </LegalSection>

        <LegalSection id="how-we-use" number={2} title="How We Use Your Information">
          <LegalText>We use your information to:</LegalText>
          <LegalBulletList
            items={[
              "Provide and operate the app",
              "Personalize your experience",
              "Recommend content",
              "Process payments",
              "Send service-related notifications",
              "Improve performance and features",
              "Deliver targeted advertisements",
            ]}
          />
        </LegalSection>

        <LegalSection id="sharing" number={3} title="Sharing of Information">
          <LegalText>We may share your information with:</LegalText>
          <LegalBulletList
            items={[
              "Service providers (hosting, analytics, payments)",
              "Advertising partners",
              "Legal authorities when required",
            ]}
          />
          <LegalText>
            We do not sell your personal information for direct monetary gain,
            but we may share data for advertising purposes.
          </LegalText>
        </LegalSection>

        <LegalSection id="third-party" number={4} title="Third-Party Services">
          <LegalText>
            Our app may integrate with third-party services (such as analytics
            tools, payment processors, and ad networks). These services operate
            under their own privacy policies.
          </LegalText>
        </LegalSection>

        <LegalSection id="data-retention" number={5} title="Data Retention">
          <LegalText>
            We retain your information only as long as necessary to:
          </LegalText>
          <LegalBulletList
            items={[
              "Provide services",
              "Comply with legal obligations",
              "Resolve disputes",
            ]}
          />
        </LegalSection>

        <LegalSection id="privacy-rights" number={6} title="Your Privacy Rights">
          <LegalText>
            Depending on your location, you may have the right to:
          </LegalText>
          <LegalBulletList
            items={[
              "Access your data",
              "Request deletion",
              "Correct inaccurate information",
              "Opt out of targeted advertising",
            ]}
          />
          <LegalText>
            To exercise your rights, contact us at:{" "}
            <LegalEmailLink email={CONTACT_EMAIL} />
          </LegalText>
        </LegalSection>

        <LegalSection id="children" number={7} title="Children's Privacy">
          <LegalText>
            The Movie Studio does not knowingly collect personal information from
            children under 13. If we become aware of such data, we will delete
            it promptly.
          </LegalText>
        </LegalSection>

        <LegalSection id="data-security" number={8} title="Data Security">
          <LegalText>
            We use commercially reasonable safeguards to protect your data.
            However, no system is 100% secure.
          </LegalText>
        </LegalSection>

        <LegalSection id="changes" number={9} title="Changes to This Policy">
          <LegalText>
            We may update this Privacy Policy at any time. Continued use of the
            Services means you accept those changes.
          </LegalText>
        </LegalSection>

        <LegalSection id="contact" number={10} title="Contact Us">
          <LegalContact email={CONTACT_EMAIL} address={CONTACT_ADDRESS} />
        </LegalSection>
      </LegalPageLayout>
    </>
  );
}
