import InkDefs from '../components/InkDefs';
import Grain from '../components/Grain';
import { useTheme } from '../hooks/useTheme';
import MarketingStrip from './MarketingStrip';
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
  const { pref: themePref, cycle, set: setThemePref, glyph, label } = useTheme();

  return (
    <>
      <InkDefs />
      <Grain />
      <MarketingStrip
        themeGlyph={glyph}
        themeLabel={label}
        themePref={themePref}
        onThemeCycle={cycle}
        onThemeSet={setThemePref}
      />
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
    </>
  );
}
