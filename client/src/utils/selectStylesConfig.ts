import { type StylesConfig } from "react-select";

const selectStylesConfig: StylesConfig = {
  control: provided => ({
    ...provided,
    borderWidth: "2px",
    backgroundColor: "#374151",
    // borderColor: "#6b7280",
    borderColor: "#6b7280",
    outline: "none",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 400,
    minHeight: "1.5rem",
    cursor: "pointer",
  }),
  option: provided => ({
    ...provided,
    backgroundColor: "#374151",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 400,
    "&:hover": {
      backgroundColor: "#4B5563",
      cursor: "pointer",
    },
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: "#059669",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 400,
  }),
  singleValue: provided => ({
    ...provided,
    backgroundColor: "#6b7280",
    fontSize: "0.75rem",
    fontWeight: 400,
  }),
  placeholder: provided => ({
    ...provided,
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 400,
  }),
  multiValue: provided => ({
    ...provided,
    backgroundColor: "#6b7280",
    color: "red",
    fontSize: "0.75rem",
    fontWeight: 400,
  }),
};

export default selectStylesConfig;
