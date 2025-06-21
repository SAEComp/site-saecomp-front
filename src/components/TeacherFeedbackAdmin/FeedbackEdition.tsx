import DropdownFilters from "./DropdownFilters";
import ReviewList from "./ReviewList";
import CardEdition from "./CardEdition";
import { teacherEvalService } from "../../services/teacherEval.service";
import { useState, useEffect } from "react";
import { IGetTeachersCourses } from "../../interfaces/teacherEvalService.interface";
import { IOption } from "../Inputs/DropDown";
import { distinct } from "../../utils/distinct";
import { Status } from "../../services/teacherEval.service";
import {
    GetAdminAnswersOut,
    GetAdminAnswerDetailsOut,
} from "../../schemas/adminAnswers.schema";

const FeedbackEdition = () => {
    const [teachersCoursesDropdown, setTeachersCoursesDropdown] = useState<
        IGetTeachersCourses[]
    >([]);
    const [techersDropdownList, setTeachersDropdownList] = useState<IOption[]>(
        []
    );
    const [coursesDropdownList, setCoursesDropdownList] = useState<IOption[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<IOption | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<IOption | null>(null);

    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

    const [answersList, setAnswersList] = useState<GetAdminAnswersOut | null>(
        null
    );

    const [detailedAnswer, setDetailedAnswer] =
        useState<GetAdminAnswerDetailsOut | null>(null);

    const fetchTeachersCourses = async () => {
        const courses = await teacherEvalService.getTeachersCourses();
        if (!courses) {
            console.error("Failed to fetch teachers' courses");
            return;
        }
        setTeachersCoursesDropdown(courses);

        setTeachersDropdownList(
            distinct(
                courses.map((item) => ({
                    id: item.teacherId,
                    label: item.teacherName,
                })),
                "id"
            )
        );

        setCoursesDropdownList(
            distinct(
                courses.map((item) => ({
                    id: item.courseId,
                    label: item.courseName,
                    subtitle: item.courseCode,
                })),
                "id"
            )
        );
    };

    useEffect(() => {
        fetchTeachersCourses();
        searchAnswers();
        searchDetailedAnswer(-1);
    }, []);

    useEffect(() => {
        setTeachersDropdownList(
            distinct(
                teachersCoursesDropdown
                    .filter((value) =>
                        selectedCourse === null
                            ? true
                            : value.courseId === selectedCourse?.id
                    )
                    .map((value) => ({
                        id: value.teacherId,
                        label: value.teacherName,
                    })),
                "id"
            )
        );
    }, [selectedCourse]);

    useEffect(() => {
        setCoursesDropdownList(
            distinct(
                teachersCoursesDropdown
                    .filter((value) =>
                        selectedTeacher === null
                            ? true
                            : value.teacherId === selectedTeacher?.id
                    )
                    .map((value) => ({
                        id: value.courseId,
                        label: value.courseName,
                        subtitle: value.courseCode,
                    })),
                "id"
            )
        );
    }, [selectedTeacher]);

    const searchAnswers = async () => {
        const translatedStatus: Record<string, Status> = {
            Aprovado: "approved",
            Pendente: "pending",
            Rejeitado: "rejected",
        };

        const answers = await teacherEvalService.getAdminAnswers(
            1,
            10,
            selectedTeacher?.id as number | undefined,
            selectedCourse?.id as number | undefined,
            selectedStatus === null ? undefined : translatedStatus[selectedStatus],
            selectedSemester ?? undefined
        );
        if (!answers) {
            console.error("Failed to fetch answers");
            return;
        }
        setAnswersList(answers);
        if (answers.answers.length === 0) {
            setDetailedAnswer(null);
            return;
        }
        searchDetailedAnswer(answers.answers[0]?.evaluationId ?? -1);
    };

    const searchDetailedAnswer = async (id = -1) => {
        if (id === -1) {
            setDetailedAnswer(null);
            return;
        }
        const answers = await teacherEvalService.getAdminAnswerDetails(id);
        if (!answers) {
            console.error("Failed to fetch answers");
            return;
        }
        setDetailedAnswer(answers);
        console.log(answers);
    };



    const handleReviewSelect = (id: number) => {
        searchDetailedAnswer(id);
        console.log(detailedAnswer)
    }



    return (
        <div className="flex flex-col bg-green-500 w-full">
            {/* div 1 */}
            <div className="flex flex-row justify-center gap-[5%] mt-[10px] mx-[5%]">
                {/* dropdowns de filtros  + botao de search*/}
                <DropdownFilters
                    teachersDropdownList={techersDropdownList}
                    coursesDropdownList={coursesDropdownList}
                    selectedTeacher={selectedTeacher}
                    selectedCourse={selectedCourse}
                    setSelectedTeacher={setSelectedTeacher}
                    setSelectedCourse={setSelectedCourse}
                    selectedStatus={selectedStatus}
                    setselectedStatus={setSelectedStatus}
                    selectedSemester={selectedSemester}
                    setselectedSemester={setSelectedSemester}
                    searchAnswers={searchAnswers}
                />
            </div>

            {/* lista de cards com scroll bar */}
            {/* OVERFLOW-SCROW */}
            <div className="flex flex-row  mx-[5%] my-[20px] gap-[5%] justify-around">
                <div className="h-[100vh] w-[260px] sm:w-[300px] md:w-[300px] lg:w-[20%] xl:w-[20%] 2xl:w-[20%] bg-green-700 rounded-lg">
                    <ReviewList
                        detailedAnswerIndex={detailedAnswer?.evaluationId ?? -1}
                        onReviewClick={handleReviewSelect}
                        answersList={answersList}
                    />
                </div>

                {/* visualização do card selecionado */}
                <div className="  w-[130px] sm:w-[260px] md:w-[390px] lg:w-[60%] xl:w-[70%] 2xl:w-[80%] ">
                    <CardEdition detailedAnswer={detailedAnswer} setDetailedAnswer={setDetailedAnswer} />
                </div>
            </div>
        </div>
    );
};

export default FeedbackEdition;
