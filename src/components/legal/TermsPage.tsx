import { LegalPage, type LegalSection } from './LegalPage';

const SECTIONS: LegalSection[] = [
  {
    heading: 'Acceptance of Terms',
    paragraphs: [
      'By accessing or using Soleri, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.',
    ],
  },
  {
    heading: 'Description of Service',
    paragraphs: [
      'Soleri is a music analytics dashboard that connects to your Spotify account and presents insights about your listening habits, including top tracks, artists, genres, listening patterns and comparisons with public chart data.',
      'Soleri is an independent project and is not affiliated with, endorsed by or sponsored by Spotify AB. Spotify is a trademark of Spotify AB.',
    ],
  },
  {
    heading: 'Spotify Account Access',
    paragraphs: [
      'Soleri uses Spotify OAuth to request read-only access to your account. We never see or store your Spotify password, and Soleri cannot modify your library, playlists or account settings.',
      'You may revoke Soleri’s access at any time from your Spotify account settings under Apps.',
    ],
  },
  {
    heading: 'Acceptable Use',
    paragraphs: [
      'You agree to use Soleri only for personal, non-commercial purposes and in compliance with applicable laws. You must not attempt to disrupt the service, access other users’ data or use the service to infringe the rights of others.',
    ],
  },
  {
    heading: 'Intellectual Property',
    paragraphs: [
      'The Soleri name, logo and interface are the property of the project author. Music metadata, artwork and related content remain the property of their respective owners, including Spotify and the rights holders it represents.',
    ],
  },
  {
    heading: 'Third Party Services',
    paragraphs: [
      'Soleri relies on third party services, including the Spotify Web API and public chart data. Your use of Spotify through Soleri is also governed by Spotify’s own Terms of Use and Privacy Policy.',
    ],
  },
  {
    heading: 'Disclaimer of Warranties',
    paragraphs: [
      'Soleri is provided as is and as available, without warranties of any kind, express or implied. We do not guarantee that the service will be uninterrupted, accurate or error free.',
    ],
  },
  {
    heading: 'Limitation of Liability',
    paragraphs: [
      'To the maximum extent permitted by law, Soleri and its author shall not be liable for any indirect, incidental or consequential damages arising from your use of the service.',
    ],
  },
  {
    heading: 'Changes to These Terms',
    paragraphs: [
      'We may update these terms from time to time. Material changes will be reflected by an updated effective date on this page. Continued use of the service after changes constitutes acceptance of the revised terms.',
    ],
  },
  {
    heading: 'Contact',
    paragraphs: [
      'If you have questions about these terms, contact us at daniel.liu8750@gmail.com.',
    ],
  },
];

export function TermsPage() {
  return <LegalPage title="Terms of Service." effectiveDate="August 27, 2026" sections={SECTIONS} />;
}
