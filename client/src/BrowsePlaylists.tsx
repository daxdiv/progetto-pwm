import CenteredContainer from "./components/ui/CenteredContainer";
import Input from "./components/ui/Input";
import PlaylistCard from "./components/PlaylistCard";
import Select from "react-select";
import Toggle from "react-toggle";
import { Triangle } from "react-loader-spinner";
import { selectStylesConfig } from "./utils/selectStylesConfig";
import { toast } from "react-hot-toast";
import usePublicPlaylists from "./hooks/usePublicPlaylists";
import { useState } from "react";

type FilterCriteria = "track-name" | "tags" | "artist";

function BrowsePlaylists() {
  const [sortDateAsc, setSortDateAsc] = useState(true);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>("track-name");
  const [searchValue, setSearchValue] = useState("");
  const { playlists, isLoading, error, isRefetching } = usePublicPlaylists();

  const handleFilterCriteriaChange = (e: { value: FilterCriteria; label: string }) => {
    if (!e) return;

    setFilterCriteria(e.value);
  };

  if (error) {
    toast.error(error.message);
  }

  return (
    <>
      <CenteredContainer className="flex-col gap-2">
        {!error && !isLoading && !isRefetching && (
          <h1 className="text-emerald-600 border-b border-b-emerald-600 mb-2 mt-12 text-lg font-normal md:text-xl lg:text-3xl md:font-bold lg:fot-bold">
            Sfoglia playlist pubbliche
          </h1>
        )}

        {(isLoading || isRefetching) && (
          <Triangle
            height="80"
            width="80"
            color="#059669"
            ariaLabel="triangle-loading"
            visible={true}
          />
        )}

        {error && (
          <>
            <p className="text-red-500">{error.message}</p>
            <a
              href="/"
              className="text-emerald-600 hover:underline"
            >
              Torna alla home
            </a>
          </>
        )}
        {!isLoading && !isRefetching && (!playlists || !playlists.length) && (
          <>
            <p className="text-gray-500 text-xl">Nessuna playlist trovata</p>
            <a
              href="/"
              className="text-emerald-600 hover:underline text-sm"
            >
              Torna alla home
            </a>
          </>
        )}

        {!error && !isLoading && !isRefetching && playlists && playlists.length > 0 && (
          <>
            <div className="font-normal text-sm mb-2 flex gap-3">
              <div className="flex justify-center items-center">
                Più recenti
                <Toggle
                  className="ml-1"
                  defaultChecked={sortDateAsc}
                  icons={false}
                  onChange={() => setSortDateAsc(!sortDateAsc)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 md:gap-3 lg:gap-3 justify-center items-center md:flex-row lg:flex-row">
              <label
                htmlFor="filtro"
                className="text-xs font-normal"
              >
                Filtra per
              </label>
              <Select
                styles={selectStylesConfig}
                className="w-56"
                placeholder="Ricerca per"
                id="filtro"
                defaultValue={{ value: "track-name", label: "Titolo canzone" }}
                options={[
                  { value: "track-name", label: "Titolo canzone" },
                  { value: "tags", label: "Tag" },
                  { value: "artist", label: "Cantante" },
                ]}
                onChange={e => {
                  handleFilterCriteriaChange(
                    e as { value: FilterCriteria; label: string }
                  );
                }}
              />
              <Input
                type="text"
                size="sm"
                placeholder="Cerca playlist"
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchValue(e.target.value)
                }
              />
            </div>
          </>
        )}

        <div className="flex flex-col mt-3 gap-2 md:grid md:grid-cols-3 lg:grid lg:grid-cols-3">
          {!error &&
            !isLoading &&
            !isRefetching &&
            playlists &&
            playlists
              .sort((p1, p2) => {
                const date1 = new Date(p1.createdAt);
                const date2 = new Date(p2.createdAt);
                if (sortDateAsc) {
                  return date1.getTime() - date2.getTime();
                } else {
                  return date2.getTime() - date1.getTime();
                }
              })
              .filter(p => {
                if (!searchValue) return true;
                switch (filterCriteria) {
                  case "track-name":
                    return p.tracks.some(t =>
                      t.name.toLowerCase().startsWith(searchValue.toLowerCase())
                    );
                  case "tags":
                    return p.tags.some(t =>
                      t.toLowerCase().startsWith(searchValue.toLowerCase())
                    );
                  case "artist":
                    return p.tracks.some(t =>
                      t.artists.some(a =>
                        a.toLowerCase().startsWith(searchValue.toLowerCase())
                      )
                    );
                  default:
                    return true;
                }
              })
              .map(p => (
                <PlaylistCard
                  key={p.id}
                  playlist={p}
                  saveable
                  extended
                />
              ))}
        </div>
      </CenteredContainer>
    </>
  );
}

export default BrowsePlaylists;
