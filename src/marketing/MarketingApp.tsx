import './marketing.css';
import MarketingHeader from './MarketingHeader';
import StickyCTA from './StickyCTA';
import Footer from './Footer';
import HeroPitch from './sections/HeroPitch';
import Services from './sections/Services';
import Process from './sections/Process';
import FAQ from './sections/FAQ';
import ContactCTA from './sections/ContactCTA';

export default function MarketingApp() {
  return (
    <div className="mp-root">
      <MarketingHeader />
      <main id="main" tabIndex={-1}>
        <HeroPitch />
        <Services />
        <Process />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
      <StickyCTA />
      <div className="ink-wipe" aria-hidden="true" />
    </div>
  );
}
