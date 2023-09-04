import useTr from "../hooks/useTr";
import { FooterTr } from "../translations/componentsTr";
import LanguageSelect from "./LanguageSelect";
import "../css/Footer.css";

function Footer() {
  const { langCode } = useTr();

  return (
    <footer>
      <p className="footer--copy">
        &copy; {FooterTr.allRightsReserved[langCode]}
      </p>
      <LanguageSelect />
    </footer>
  );
}

export default Footer;
