import { AiOutlineSearch } from "react-icons/ai";
import AsyncSelect from "react-select/async";
import debounce from "debounce";
import { multiSelectStylesConfig } from "../utils/selectStylesConfig";
import { toast } from "react-hot-toast";
import { useState } from "react";

type SelectOption = { value: string; label: string };
type Props = {
  setSelectedArtists: React.Dispatch<React.SetStateAction<Set<string>>>;
};

function SelectArtists({ setSelectedArtists }: Props) {
  const [artists, setArtists] = useState<SelectOption[]>([]);

  const handleFetchArtists = async (inputValue: string) => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SPOTIFY_BASE_URL
        }/search?q=${inputValue}&type=artist&market=IT&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return [];
      }

      setArtists(
        data.artists.items.map((artist: { name: string; id: string }) => ({
          value: artist.name,
          label: artist.name,
        }))
      );
    } catch (_error) {
      toast.error("Errore durante la ricerca degli artisti");
    }
  };
  const loadOptionsCb = (inputValue: string, cb: (options: SelectOption[]) => void) => {
    handleFetchArtists(inputValue);
    cb(artists);
  };

  const debounced = debounce(loadOptionsCb, 1000);

  return (
    <>
      <p className="text-xs font-normal">Artisti preferiti:*</p>
      <div className="flex gap-3">
        <AsyncSelect
          isMulti
          loadOptions={debounced}
          className="text-xs w-56"
          styles={multiSelectStylesConfig}
          placeholder="Cerca i tuoi artisti preferiti"
          noOptionsMessage={() => "Nessun artista trovato, digita per cercare"}
          components={{
            DropdownIndicator: () => (
              <AiOutlineSearch className="text-emerald-600 text-lg mr-2" />
            ),
            IndicatorSeparator: () => null,
          }}
          loadingMessage={() => "Caricamento..."}
          onChange={selected => {
            console.log(selected);
            setSelectedArtists(
              new Set(selected?.map(s => (s as { value: string; label: string }).value))
            );
          }}
        />
      </div>
    </>
  );
}

export default SelectArtists;
