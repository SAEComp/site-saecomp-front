import DropDown from "../../Inputs/DropDown";
import { useState, useEffect } from "react";
import Spinner from "../../Spinner/Spinner";
import { Classes } from "../../../schemas/teacherEvaluation/output/evaluation.schema";
import { IOption } from "../../Inputs/DropDown";
import { GetPublicAnswersOut } from "../../../schemas/teacherEvaluation/output/answer.schema";
import { answersService } from "../../../services/answers.service";

export const distinct = <T,>(list: T[], key: keyof T): T[] => {
    return [...new Map(list.map(item => [item[key], item])).values()];
};


interface FilterProps {
    classes: Classes[];
    setAnswers: React.Dispatch<React.SetStateAction<GetPublicAnswersOut>>;
}


const Filter = ({ classes, setAnswers }: FilterProps) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [teachers, setTeachers] = useState<IOption[]>([]);
    const [courses, setCourses] = useState<IOption[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<IOption | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<IOption | null>(null);

    useEffect(() => {
        setTeachers(
            distinct(classes.map(q => ({
                id: q.teacherId,
                label: q.teacherName
            })), 'id')
        );
        setCourses(
            distinct(classes.map(q => ({
                id: q.courseId,
                label: q.courseName,
                subtitle: q.courseCode
            })), 'id')
        );
    }, [classes]);

    function changeTeacher(newTeacher: IOption | null) {
        setSelectedTeacher(newTeacher);
        setCourses(
            distinct(classes.filter(q => !newTeacher ? true : q.teacherId === newTeacher.id).map(q => ({
                id: q.courseId,
                label: q.courseName,
                subtitle: q.courseCode
            })), 'id')
        );
    }

    function changeCourse(newCourse: IOption | null) {
        setSelectedCourse(newCourse);
        setTeachers(
            distinct(classes.filter(q => !newCourse ? true : q.courseId === newCourse.id).map(q => ({
                id: q.teacherId,
                label: q.teacherName
            })), 'id')
        );
    }

    const fetchFilteredTeachers = async () => {
        setLoading(true);
        const _answers = await answersService.getAnswers(1, 10, selectedTeacher?.id as number ?? undefined, selectedCourse?.id as number ?? undefined);
        if (!_answers) {
            alert('erro');
            return;
        }
        setAnswers(_answers);
        setLoading(false);
    }

    return (
        <div
            className="w-full flex justify-center flex-col md:flex-row gap-5 md:gap-5 lg:gap-[3%] px-[1vw] sm:px-[1vw] md:px-[1vw] lg:px-[5vw] xl:px-[2vw]"
        >
            <DropDown
                className="w-full md:w-1/3 lg:w-1/4"
                options={teachers}
                placeholder={"Professor"}
                searchable={true}
                showSubtitle={true}
                value={selectedTeacher}
                searchFilter={(search, option) => {
                    const normalizedSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return (
                        option.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedSearch.toLowerCase()) ||
                        option.subtitle?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedSearch.toLowerCase())
                    ) ?? false;
                }}
                onChange={changeTeacher}
            />
            <DropDown
                className="w-full md:w-1/3 lg:w-1/4"
                options={courses}
                placeholder={"Curso"}
                searchable={true}
                showSubtitle={true}
                value={selectedCourse}
                searchFilter={(search, option) => {
                    const normalizedSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return (
                        option.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedSearch.toLowerCase()) ||
                        option.subtitle?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedSearch.toLowerCase())
                    ) ?? false;
                }}
                onChange={changeCourse}
            />
            <div
                className="w-full md:w-28 h-12 flex justify-center items-center"
            >
                {loading ? (
                    <Spinner />
                ) : (
                    <button
                        className="bg-black text-white px-5 rounded-md h-12 w-full"
                        onClick={fetchFilteredTeachers}
                    >
                        Filtrar
                    </button>
                )}
            </div>




        </div>
    )
}

export default Filter;