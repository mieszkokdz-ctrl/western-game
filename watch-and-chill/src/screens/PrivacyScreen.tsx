import LegalDocument from '../components/LegalDocument';
import { PRIVACY_LAST_UPDATED, PRIVACY_SECTIONS } from '../legal/privacyContent';

export default function PrivacyScreen() {
  return <LegalDocument title="Polityka Prywatności" lastUpdated={PRIVACY_LAST_UPDATED} sections={PRIVACY_SECTIONS} />;
}
