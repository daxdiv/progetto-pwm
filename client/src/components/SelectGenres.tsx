import Select from "react-select";
import { Triangle } from "react-loader-spinner";
import { multiSelectStylesConfig } from "../utils/selectStylesConfig";

type Props = {
  data: string[];
  isLoading?: boolean;
  preferredGenres: Set<string>;
  setPreferredGenres: React.Dispatch<React.SetStateAction<Set<string>>>;
};

function SelectGenres({
  data,
  isLoading = false,
  preferredGenres,
  setPreferredGenres,
}: Props) {
  return (
    <>
      {isLoading ? (
        <Triangle
          height="30"
          width="30"
          color="#059669"
          ariaLabel="triangle-loading"
          visible={true}
        />
      ) : (
        <>
          <p className="text-sm font-normal">Generi musicali preferiti:*</p>

          <Select
            isMulti
            styles={multiSelectStylesConfig}
            placeholder="Generi preferiti"
            options={data.map(g => ({
              value: g,
              label: g.charAt(0).toUpperCase() + g.slice(1),
            }))}
            defaultValue={Array.from(preferredGenres).map(g => ({
              value: g,
              label: g.charAt(0).toUpperCase() + g.slice(1),
            }))}
            onChange={selectedGenres => {
              setPreferredGenres(
                new Set(
                  selectedGenres.map(g => (g as { value: string; label: string }).value)
                )
              );
            }}
          />
        </>
      )}
    </>
  );
}

export default SelectGenres;
