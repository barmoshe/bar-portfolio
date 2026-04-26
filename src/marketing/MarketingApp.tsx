import './marketing.css';
import MarketingHeader from './MarketingHeader';
import StickyCTA from './StickyCTA';
import Footer from './Footer';
import HeroPitch from './sections/HeroPitch';
import AudienceBento from './sections/AudienceBento';
import Services from './sections/Services';
import Process from './sections/Process';
import Proof from './sections/Proof';
import FAQ from './sections/FAQ';
import ContactCTA from './sections/ContactCTA';

export default function MarketingApp() {
  return (
    <div className="mp-root">
      <MarketingHeader />
      <main id="main" tabIndex={-1}>
        <HeroPitch />
        <AudienceBento />
        <Services />
        <Process />
        <Proof />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
      <StickyCTA />
      <div className="ink-wipe" aria-hidden="true" />
    </div>
  );
}
