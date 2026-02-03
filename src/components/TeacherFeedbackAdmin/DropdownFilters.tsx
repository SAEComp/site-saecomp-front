import DropDown, { IOption } from "../Inputs/DropDown";
import { semestre } from "./mock";
import SearchIcon from "@mui/icons-material/Search";
import { Status } from "../../services/teacherEval.service";
import Spinner from "../Spinner/Spinner";

interface IDropdownFiltersProps {
    teachersDropdownList: IOption[];
    coursesDropdownList: IOption[];
    selectedTeacher: IOption | null;
    selectedCourse: IOption | null;
    setSelectedTeacher: React.Dispatch<React.SetStateAction<IOption | null>>;
    setSelectedCourse: React.Dispatch<React.SetStateAction<IOption | null>>;

    selectedStatus: Status | null;
    setselectedStatus: React.Dispatch<React.SetStateAction<Status | null>>;

    selectedSemester: string | null;
    setselectedSemester: React.Dispatch<React.SetStateAction<string | null>>;

    searchAnswers: () => Promise<void>;
    searchLoading?: boolean;
}

const DropdownFilters = ({
    teachersDropdownList,
    coursesDropdownList,
    selectedTeacher,
    selectedCourse,
    setSelectedTeacher,
    setSelectedCourse,
    setselectedStatus,
    selectedStatus,
    selectedSemester,
    setselectedSemester,
    searchAnswers,
    searchLoading = false,
}: IDropdownFiltersProps) => {
    const statusOptions: IOption[] = [
        { id: 1, label: "Aprovado" },
        { id: 2, label: "Rejeitado" },
        { id: 3, label: "Pendente" },
    ];

    return (
        <div className="w-full flex justify-center flex-col md:flex-row gap-5 md:gap-5 lg:gap-[3%] px-[1vw] sm:px-[1vw] md:px-[1vw] lg:px-[5vw] xl:px-[2vw]">
            <DropDown
                className="w-full md:w-1/3 lg:w-1/4"
                options={statusOptions}
                placeholder={"Status"}
                searchable={true}
                showSubtitle={true}
                value={
                    statusOptions.find((value) => {
                        return value.label === selectedStatus;
                    }) ?? null
                }
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
                onChange={(value) => {
                    setselectedStatus((value?.label ?? null) as Status | null);
                }}
            />
            <DropDown
                className="w-full md:w-1/3 lg:w-1/4"
                options={teachersDropdownList}
                placeholder={"Professor(a)"}
                searchable={true}
                showSubtitle={true}
                value={selectedTeacher}
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
                onChange={setSelectedTeacher}
            />
            <DropDown
                className="w-full md:w-1/3 lg:w-1/4"
                options={coursesDropdownList}
                placeholder={"Disciplina"}
                searchable={true}
                showSubtitle={true}
                value={selectedCourse}
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
                onChange={setSelectedCourse}
            />
            <DropDown
                className="w-full md:w-1/3 lg:w-1/4"
                options={semestre}
                placeholder={"Semestre"}
                searchable={true}
                showSubtitle={true}
                value={
                    semestre.find((value) => {
                        return selectedSemester === value.label;
                    }) ?? null
                }
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
                onChange={(value) => {
                    setselectedSemester((value?.label ?? null) as string | null);
                }}
            />
            {searchLoading ? (
                <div className="w-full md:w-[108px] flex justify-center items-center">
                    <Spinner/>
                </div>
            ) : (<div onClick={searchAnswers}
                className="active:scale-95 cursor-pointer transition duration-150 ease-in-out shadow-md active:shadow-lg w-full md:w-[108px]  bg-black text-center flex items-center justify-center h-12 rounded-md">
                <SearchIcon htmlColor="white" />
            </div>)}
        </div>
    );
};

export default DropdownFilters;
