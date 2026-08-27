import { LegalPage, type LegalSection } from './LegalPage';

const SECTIONS: LegalSection[] = [
  {
    heading: 'Overview',
    paragraphs: [
      'This Privacy Policy explains what information Soleri accesses when you connect your Spotify account, how that information is used and the choices you have. Soleri is designed to be privacy friendly: it reads your listening data to show you insights and does not build a profile of you beyond your current session.',
    ],
  },
  {
    heading: 'Information We Access',
    paragraphs: [
      'When you sign in with Spotify, Soleri requests read-only access to your Spotify profile (display name and user ID), your top tracks and artists, your recently played tracks and related metadata such as genres.',
      'Soleri never receives your Spotify password. Authentication is handled entirely by Spotify through OAuth.',
    ],
  },
  {
    heading: 'How Your Data Is Used',
    paragraphs: [
      'Your listening data is fetched from the Spotify Web API and processed in your browser to calculate the insights shown on your dashboard, such as listening stats, listening patterns, discovery rate and chart comparisons.',
      'If you use the QR sharing feature, a compact summary of your taste profile is encoded into the QR code you choose to share. Sharing is always initiated by you.',
    ],
  },
  {
    heading: 'Data Storage and Retention',
    paragraphs: [
      'Soleri does not operate a database of user listening history. Authentication tokens are kept in your browser session so you stay signed in, and insights are computed on demand each time you use the dashboard.',
      'Clearing your browser storage or revoking access in your Spotify settings removes Soleri’s access to your data.',
    ],
  },
  {
    heading: 'Data Sharing',
    paragraphs: [
      'We do not sell, rent or trade your personal information. Your data is not shared with third parties, except the requests made to the Spotify Web API and public chart sources needed to operate the service.',
    ],
  },
  {
    heading: 'Third Party Services',
    paragraphs: [
      'Soleri is built on the Spotify Web API and is hosted on Vercel. Your use of Spotify is governed by Spotify’s own Privacy Policy, and Vercel may collect standard technical logs such as IP addresses as part of hosting the site.',
    ],
  },
  {
    heading: 'Your Rights and Choices',
    paragraphs: [
      'You can disconnect Soleri at any time by revoking its access in your Spotify account settings under Apps. Because Soleri does not retain your listening history, revoking access and clearing your browser storage removes your data from the service.',
    ],
  },
  {
    heading: 'Changes to This Policy',
    paragraphs: [
      'We may update this policy from time to time. Material changes will be reflected by an updated effective date on this page.',
    ],
  },
  {
    heading: 'Contact',
    paragraphs: [
      'If you have questions about this policy or your data, contact us at daniel.liu8750@gmail.com.',
    ],
  },
];

export function PrivacyPage() {
  return <LegalPage title="Privacy Policy." effectiveDate="August 27, 2026" sections={SECTIONS} />;
}
