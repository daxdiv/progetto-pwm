import { type StylesConfig } from "react-select";

const selectStylesConfig: StylesConfig = {
  control: provided => ({
    ...provided,
    outline: "none",
    backgroundColor: "#1f2937",
    borderWidth: "2px",
    borderColor: "#6b7280",
    color: "#fff",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#059669",
    },
  }),
  option: provided => ({
    ...provided,
    backgroundColor: "#1f2937",
    color: "#fff",
    fontSize: "0.75rem",
    "&:hover": {
      backgroundColor: "#4B5563",
      cursor: "pointer",
    },
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: "#1f2937",
    color: "#fff",
    fontSize: "0.75rem",
  }),
  singleValue: provided => ({
    ...provided,
    color: "#fff",
    fontSize: "0.75rem",
  }),
};

const multiSelectStylesConfig: StylesConfig = {
  ...selectStylesConfig,
  multiValue: provided => ({
    ...provided,
    backgroundColor: "#6b7280",
    color: "red",
    fontSize: "0.75rem",
    fontWeight: 400,
  }),
};

export { selectStylesConfig, multiSelectStylesConfig };
