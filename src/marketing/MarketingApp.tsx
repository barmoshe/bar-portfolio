import Grain from '../components/Grain';
import InkDefs from '../components/InkDefs';
import { useTheme } from '../hooks/useTheme';
import MarketingStrip from './MarketingStrip';
import HeroPitch from './sections/HeroPitch';
import Services from './sections/Services';
import Process from './sections/Process';
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
        <Services />
        <Process />
        <ContactCTA />
      </main>
      <div className="ink-wipe" aria-hidden="true" />
    </>
  );
}
