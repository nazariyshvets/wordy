import { useContext } from "react";
import Select from "react-select";
import CountryFlag from "react-country-flag";
import { TrContext } from "../contexts/TrContext";

const options = [
  {
    value: "uk-UA",
    label: "Українська",
    icon: <CountryFlag countryCode="UA" svg />,
  },
  {
    value: "en-GB",
    label: "English",
    icon: <CountryFlag countryCode="GB" svg />,
  },
  {
    value: "de-DE",
    label: "Deutsch",
    icon: <CountryFlag countryCode="DE" svg />,
  },
  {
    value: "fr-FR",
    label: "Français",
    icon: <CountryFlag countryCode="FR" svg />,
  },
  {
    value: "es-ES",
    label: "Español",
    icon: <CountryFlag countryCode="ES" svg />,
  },
  {
    value: "pt-PT",
    label: "Português",
    icon: <CountryFlag countryCode="PT" svg />,
  },
  {
    value: "pl-PL",
    label: "Polski",
    icon: <CountryFlag countryCode="PL" svg />,
  },
];

const formatOptionLabel = ({ label, icon }) => (
  <div style={{ display: "flex", columnGap: "0.5rem" }}>
    {icon}
    <span style={{ color: "#010101" }}>{label}</span>
  </div>
);

function LanguageSelect() {
  const { langCode, setLangCode } = useContext(TrContext);

  function handleChange(selectedOption) {
    setLangCode(selectedOption.value);
  }

  const defaultValue = options.find((option) => option.value === langCode);

  return (
    <Select
      defaultValue={defaultValue}
      options={options}
      formatOptionLabel={formatOptionLabel}
      menuPlacement="top"
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          border: "none",
          backgroundColor: "#fefdfd",
          boxShadow: "none",
          "&:hover": {
            border: "none",
          },
        }),
        option: (baseStyles, { isFocused, isSelected }) => ({
          ...baseStyles,
          backgroundColor: isSelected
            ? "#fc6601"
            : isFocused
            ? "#b1aebb"
            : "transparent",
          cursor: "pointer",
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: "#fefdfd",
        }),
      }}
      isSearchable={false}
      onChange={handleChange}
    />
  );
}

export default LanguageSelect;
