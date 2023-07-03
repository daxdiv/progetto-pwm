import { type StylesConfig } from "react-select";

/**
 * Configurazione per lo stile dei select (select singola)
 */
const selectStylesConfig: StylesConfig = {
  control: provided => ({
    ...provided,
    outline: "none",
    backgroundColor: "#1f2937",
    borderWidth: "2px",
    borderColor: "#6b7280",
    color: "#ffffff",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#059669",
    },
  }),
  option: provided => ({
    ...provided,
    backgroundColor: "#1f2937",
    color: "#ffffff",
    fontSize: "0.75rem",
    "&:hover": {
      backgroundColor: "#4B5563",
      cursor: "pointer",
    },
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: "#1f2937",
    color: "#ffffff",
    fontSize: "0.75rem",
  }),
  singleValue: provided => ({
    ...provided,
    color: "#ffffff",
    // color: "blue",
    fontSize: "0.75rem",
  }),
};

/**
 * Configurazione per lo stile dei select (select multipla)
 */
const multiSelectStylesConfig: StylesConfig = {
  ...selectStylesConfig,
  multiValue: provided => ({
    ...provided,
    backgroundColor: "#374151",
    color: "#ff0000",
    fontSize: "0.75rem",
    fontWeight: 400,
  }),
  multiValueLabel: provided => ({
    ...provided,
    color: "#ffffff",
    fontSize: "0.75rem",
    fontWeight: 400,
  }),
};

export { selectStylesConfig, multiSelectStylesConfig };
