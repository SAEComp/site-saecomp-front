import DropdownFilters from "./DropdownFilters";
import ReviewList from "./ReviewList";
import CardEdition from "./CardEdition";
import { teacherEvalService } from "../../services/teacherEval.service";
import { useState, useEffect } from "react";
import { Classes } from "../../schemas/teacherEvaluation/output/evaluation.schema";
import { IOption } from "../Inputs/DropDown";
import { distinct } from "../../utils/distinct";
import { Status } from "../../services/teacherEval.service";
import { GetAdminAnswersOut, GetAdminAnswerDetailsOut } from "../../schemas/teacherEvaluation/output/adminAnswer.schema";
import CloseIcon from "@mui/icons-material/Close";

const translatedStatus: Record<string, Status> = {
    Aprovado: "approved",
    Pendente: "pending",
    Rejeitado: "rejected",
};

const FeedbackEdition = () => {
    const [teachersCoursesDropdown, setTeachersCoursesDropdown] = useState<
        Classes[]
    >([]);
    const [techersDropdownList, setTeachersDropdownList] = useState<IOption[]>(
        []
    );
    const [coursesDropdownList, setCoursesDropdownList] = useState<IOption[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<IOption | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<IOption | null>(null);
    const [answersPage, setAnswersPage] = useState<number>(1);

    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

    const [answersList, setAnswersList] = useState<GetAdminAnswersOut | null>(
        null
    );
    const [searchLoading, setSearchLoading] = useState<boolean>(false);

    const [detailedAnswer, setDetailedAnswer] =
        useState<GetAdminAnswerDetailsOut | null>(null);

    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

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

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const searchAnswers = async () => {
        setSearchLoading(true);

        setAnswersPage(1);

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
            setSearchLoading(false);
            return;
        }
        setAnswersList(answers);
        if (answers.answers.length === 0) {
            setDetailedAnswer(null);
            setSearchLoading(false);
            return;
        }
        searchDetailedAnswer(answers.answers[0]?.evaluationId ?? -1);
        setSearchLoading(false);
    };

    const loadMoreAnswers = async () => {
        if (!answersList) return;

        const nextPage = answersPage + 1;
        setAnswersPage(curr => curr + 1);
        const answers = await teacherEvalService.getAdminAnswers(
            nextPage,
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
        setAnswersList({
            ...answers,
            answers: [...answersList.answers, ...answers.answers],
            isLastPage: answers.isLastPage,
        });

    }

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

    useEffect(() => {
        const handleWindowScroll = () => {
            if (loading || !answersList || answersList.isLastPage) return;
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.body.offsetHeight - 200;
            if (scrollPosition >= threshold) {
                setLoading(true);
                Promise.resolve(loadMoreAnswers()).finally(() => setLoading(false));
            }
        };
        window.addEventListener("scroll", handleWindowScroll);
        return () => window.removeEventListener("scroll", handleWindowScroll);
    }, [loading, answersList, loadMoreAnswers]);

    const handleReviewSelect = (id: number) => {
        searchDetailedAnswer(id);
        if (isMobile) setShowPopup(true);
        console.log(detailedAnswer)
    }

    const handleClosePopup = () => setShowPopup(false);

    return (
        <div className="flex flex-col bg-green-500 w-full">
            <div className="flex flex-row justify-center gap-[5%] mt-[10px] mx-[5%]">
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
                    searchLoading={searchLoading}
                />
            </div>
            <div className="flex flex-row  mx-[5%] my-[20px] gap-[5%] justify-around">
                <div
                    className="h-fit w-[300px] bg-green-700 rounded-lg"
                    style={{ minHeight: "300px" }}
                >
                    <div className="flex flex-col w-full h-full p-2">
                        <ReviewList
                            detailedAnswerIndex={detailedAnswer?.evaluationId ?? -1}
                            onReviewClick={handleReviewSelect}
                            answersList={answersList}
                        />
                        {loading && (
                            <div className="flex justify-center my-4">
                                <span className="text-gray-500">Carregando...</span>
                            </div>
                        )}
                    </div>
                </div>
                {!isMobile && (
                    <div
                        className="w-[130px] sm:w-[260px] md:w-[390px] lg:w-[60%] xl:w-[70%] 2xl:w-[80%] sticky top-[100px]"
                        style={{ alignSelf: "flex-start" }}
                    >
                        <CardEdition detailedAnswer={detailedAnswer} setDetailedAnswer={setDetailedAnswer} />
                    </div>
                )}
            </div>
            {isMobile && showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="rounded-lg p-4 w-[95vw] max-h-[90vh] overflow-y-auto relative">
                        <button
                            className="absolute top-5 right-6 text-gray-700 text-2xl"
                            onClick={handleClosePopup}
                            aria-label="Fechar"
                        >
                            <CloseIcon fontSize="inherit" />
                        </button>
                        <CardEdition detailedAnswer={detailedAnswer} setDetailedAnswer={setDetailedAnswer} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackEdition;
