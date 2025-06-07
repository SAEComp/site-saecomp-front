import DropDown from "../Inputs/DropDown";
import { docentes, disciplinas, status, semestre } from "./mock";
import SearchIcon from "@mui/icons-material/Search";

const DropdownFilters = () => {
  return (
    <div className="w-full flex justify-center flex-col md:flex-row gap-5 md:gap-5 lg:gap-[3%] px-[1vw] sm:px-[1vw] md:px-[1vw] lg:px-[5vw] xl:px-[2vw]">
      <DropDown
        className="w-full md:w-1/3 lg:w-1/4"
        options={status}
        placeholder={"Status"}
        searchable={true}
        showSubtitle={true}
        value={null}
        searchFilter={(search, option) => {
          const normalizedSearch = search
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          return (
            (option.label
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(normalizedSearch.toLowerCase()) ||
              option.subtitle
                ?.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(normalizedSearch.toLowerCase())) ??
            false
          );
        }}
        onChange={() => {}}
      />
      <DropDown
        className="w-full md:w-1/3 lg:w-1/4"
        options={docentes}
        placeholder={"Professor(a)"}
        searchable={true}
        showSubtitle={true}
        value={null}
        searchFilter={(search, option) => {
          const normalizedSearch = search
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          return (
            (option.label
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(normalizedSearch.toLowerCase()) ||
              option.subtitle
                ?.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(normalizedSearch.toLowerCase())) ??
            false
          );
        }}
        onChange={() => {}}
      />
      <DropDown
        className="w-full md:w-1/3 lg:w-1/4"
        options={disciplinas}
        placeholder={"Disciplina"}
        searchable={true}
        showSubtitle={true}
        value={null}
        searchFilter={(search, option) => {
          const normalizedSearch = search
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          return (
            (option.label
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(normalizedSearch.toLowerCase()) ||
              option.subtitle
                ?.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(normalizedSearch.toLowerCase())) ??
            false
          );
        }}
        onChange={() => {}}
      />
      <DropDown
        className="w-full md:w-1/3 lg:w-1/4"
        options={semestre}
        placeholder={"Semestre"}
        searchable={true}
        showSubtitle={true}
        value={null}
        searchFilter={(search, option) => {
          const normalizedSearch = search
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          return (
            (option.label
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(normalizedSearch.toLowerCase()) ||
              option.subtitle
                ?.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(normalizedSearch.toLowerCase())) ??
            false
          );
        }}
        onChange={() => {}}
      />
      <div className="active:scale-95 transition duration-150 ease-in-out shadow-md active:shadow-lg w-full md:w-[108px]  bg-black text-center flex items-center justify-center h-12 rounded-md">
        <SearchIcon htmlColor="white" />
      </div>
    </div>
  );
};

export default DropdownFilters;