import LegalDocument from '../components/LegalDocument';
import { TERMS_LAST_UPDATED, TERMS_SECTIONS } from '../legal/termsContent';

export default function TermsScreen() {
  return <LegalDocument title="Regulamin" lastUpdated={TERMS_LAST_UPDATED} sections={TERMS_SECTIONS} />;
}
