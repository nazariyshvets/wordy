import {
  useState,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

type LanguageCode =
  | "uk-UA"
  | "en-GB"
  | "de-DE"
  | "fr-FR"
  | "es-ES"
  | "pt-PT"
  | "pl-PL";

interface TrContextType {
  langCode: LanguageCode;
  setLangCode: Dispatch<SetStateAction<LanguageCode>>;
}

interface TrProviderProps {
  children?: ReactNode;
}

function isLanguageCode(code: string): code is LanguageCode {
  return [
    "uk-UA",
    "en-GB",
    "de-DE",
    "fr-FR",
    "es-ES",
    "pt-PT",
    "pl-PL",
  ].includes(code);
}

const TrContext = createContext<TrContextType | null>(null);

function TrProvider({ children }: TrProviderProps) {
  const [langCode, setLangCode] = useState<LanguageCode>(() => {
    const storedLangCode = localStorage.getItem("langCode") as LanguageCode;

    const initialLangCode = isLanguageCode(storedLangCode)
      ? storedLangCode
      : "uk-UA";

    return initialLangCode;
  });

  useEffect(() => {
    localStorage.setItem("langCode", langCode);
  }, [langCode]);

  return (
    <TrContext.Provider value={{ langCode, setLangCode }}>
      {children}
    </TrContext.Provider>
  );
}

export { TrContext, TrProvider, LanguageCode, TrContextType };
