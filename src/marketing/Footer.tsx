import { useLang } from './LangContext';

export default function Footer() {
  const { t } = useLang();
  const { footer } = t;

  return (
    <footer className="mp-footer">
      <p>
        {footer.text}
        <a href={import.meta.env.BASE_URL}>{footer.portfolioLink}</a>
      </p>
    </footer>
  );
}
