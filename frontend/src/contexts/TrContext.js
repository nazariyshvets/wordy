import { useState, useEffect, createContext } from "react";

const TrContext = createContext();

function TrProvider({ children }) {
  const [langCode, setLangCode] = useState(
    localStorage.getItem("langCode") || "uk-UA"
  );

  useEffect(() => {
    localStorage.setItem("langCode", langCode);
  }, [langCode]);

  return (
    <TrContext.Provider value={{ langCode, setLangCode }}>
      {children}
    </TrContext.Provider>
  );
}

export { TrContext, TrProvider };
