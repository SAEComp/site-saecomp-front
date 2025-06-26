import QuestionComponent from "../Form/QuestionComponent";
// import DropDown from "./Inputs/DropDown";
import TextInput from "../../Inputs/TextInput";
import SliderInput from "../../Inputs/SliderInput";
import { disciplinas, docentes } from "../Form/mock";
import { Question } from "../../../schemas/adminQuestions.schema"
import DropDown from "../../Inputs/DropDown";
import { ComponentProps, useEffect, useState } from "react";
import NumberInput from "../../Inputs/NumberInput";
import QuestionEditComponent from "./QuestionEditComponents";
import { ComponentType } from "react";
import { adminQuestionsService } from "../../../services/adminQuestions.service";
import questionTypes from "../../../types/questionTypes";
import { set } from "zod";
import { Next } from "react-bootstrap/esm/PageItem";

interface IQuestionEdit extends Question {
    editing: boolean;
    required: boolean;
}

const questionEditInitialState: IQuestionEdit = {
    id: -1,
    question: "Sua pergunta",
    type: "text",
    active: true,
    order: 0,
    isScore: false,
    editing: false,
    required: false
}

const questionOptions = [
    { id: 0, label: "Texto" },
    { id: 1, label: "Numérico" },
    { id: 2, label: "Seleção" }

]

let nextId = -1;

const QuestionsEdit = () => {
    const [questList, setQuestList] = useState<IQuestionEdit[]>([]);


    useEffect(() => {
        const getQuestionsDB = async () => {
            const newQuestList = await adminQuestionsService.getQuestionList();
            if (newQuestList === null) {
                console.log("vish");
                return;
            };
            setQuestList(newQuestList.map(q => ({
                ...q,
                editing: false,
                required: false
            })));
            sortQuestListByActive();
        }
        getQuestionsDB().catch(console.error);
    }, [])

    const sortQuestListByOrder = () => {
        const comp = (q1: IQuestionEdit, q2: IQuestionEdit) => {
            if (q1.order === null) {
                if (q2.order === null) return 0;
                else return 1;
            }
            else {
                if (q2.order === null || q1.order > q2.order) return -1;
                else return 1;
            }
        }

        const sortedQuestList = questList.map(q => q).sort(comp);
        return sortedQuestList;
    }

    const sortQuestListByActive = () => {
        const comp = (q1: IQuestionEdit, q2: IQuestionEdit) => {
            if (q1.active) {
                if (q2.active) return 0;
                else return -1;
            }
            else {
                if (q2.active) return 1;
                else return 0;
            }
        }

        const sortedQuestList = questList.map(q => q).sort(comp);
        return sortedQuestList;
    }

    const getMaxOrder = () => {
        const filteredQuestList = questList.map(q => (
            q.order
        )).filter(q => q != null);

        const getMax = (a: number, b: number) => Math.max(a, b);

        const maxOrder = filteredQuestList.reduce(getMax, -1);

        return maxOrder;
    }

    const dropDownPlaceholder = (quest: IQuestionEdit) => {
        switch (quest.type) {
            case 'text':
                return "Texto"
            case 'numeric':
                return "Numérico"
            case 'slider':
                return "Seleção"
        }
    }

    const dropDownType = (id: number | string) => {
        switch (id) {
            case 0:
                return "text"
            case 1:
                return "numeric"
            case 2:
                return "slider"
            default: "text"
        }
        return "text"
    }

    const dropDownChange = (newvalue: number | string, index: number) => {
        const newQuestion: IQuestionEdit = {
            ...questList[index],
            type: dropDownType(newvalue)
        }

        const newQuestList = questList.map((q, j) => (
            index === j ? newQuestion : q
        ))

        setQuestList(newQuestList)

    }

    const insertQuestionAt = (quest: IQuestionEdit, index: number) => {
        const newQuestList = [
            ...questList.slice(0, index),
            quest,
            ...questList.slice(index)
        ]
        setQuestList(newQuestList)
    }

    const addQuestionButton = () => {

        const maxOrder = getMaxOrder();

        const newQuestion = {
            ...questionEditInitialState,
            id: nextId--,
            order: maxOrder + 1
        }

        insertQuestionAt(newQuestion, maxOrder + 1)
    }

    const upB = (index: number) => {

        const maxOrder = getMaxOrder();

        if (index === 0 || index > maxOrder) return;
        else {
            const q1 = {
                ...questList[index - 1],
                order: index
            };
            const q2 = {
                ...questList[index],
                order: index - 1
            };
            const nextQuestList = [
                ...questList.slice(0, index - 1),
                q2,
                q1,
                ...questList.slice(index + 1)
            ]
            setQuestList(nextQuestList)
        }
    }

    const deleteB = (index: number) => {
        const newQuestList = questList.map((q, j) => {
            if (j === index) {
                const newQuest = {
                    ...q,
                    active: false,
                    order: null,
                    editing: false
                }
                return newQuest;
            }
            else {
                if (q.order != null && q.active === true && j > index) {
                    const newQuest = {
                        ...q,
                        order: q.order - 1
                    }
                    return newQuest;
                }
                return q;
            }
        }).filter(q => !(q.active == false && q.id <= -1))

        setQuestList(newQuestList);
        sortQuestListByActive();
    }

    const copyB = (index: number) => {
        const newQuestion = {
            ...questList[index],
            order: questList[index].order ? questList[index].order + 1 : null,
            id: nextId--
        };

        insertQuestionAt(newQuestion, index + 1);

        const newQuestList = questList.map((q, j) => (
            j > index + 1 && q.order != null && q.active ? { ...q, order: q.order + 1 } : q
        ));

        setQuestList(newQuestList)

    }

    const editB = (index: number) => {
        const newQuestList = questList.map((q, j) =>
            index == j ? { ...questList[index], editing: !questList[index].editing } : q
        )
        setQuestList(newQuestList)
    }

    const requiredB = (index: number) => {
        const newQuestList = questList.map((q, j) => (
            index == j ? { ...questList[index], required: !questList[index].required } : q
        ))

        setQuestList(newQuestList)
    }

    const componentSelector = (q: IQuestionEdit) => {
        switch (q.type) {
            case 'text':
                return (
                    <div
                        className="border-2"
                    >
                        <QuestionEditComponent
                            label={q.question}
                            component={TextInput}
                            componentProps={{
                                multiline: true,
                                rows: 4,
                                label: 'Sua resposta'
                            }}
                        />
                    </div>
                )

            case 'slider':
                return (
                    <div>
                        <QuestionEditComponent
                            label={q.question}
                            component={SliderInput}
                            componentProps={{
                                value: 0,
                                setValue: () => null
                            }}
                        />
                    </div>
                )
            case 'numeric':
                return (
                    <div>
                        <QuestionEditComponent
                            label={q.question}
                            component={NumberInput}
                            componentProps={{
                            }}
                        />
                    </div>
                );
        }
    }

    const handleQuestionChange = (e: string, index: number) => {
        const newQuestion = {
            ...questList[index],
            question: e
        }

        const newQuestList = questList.map((q, j) =>
            index === j ? newQuestion : q
        )

        setQuestList(newQuestList)
    }

    const editingBox = (quest: IQuestionEdit, index: number) => {
        return (
            <div
                className="bg-[#F1F1F1] rounded-3xl flex flex-col gap-5 p-5 border-2"
            >
                <TextInput
                    label="Sua pergunta..."
                    value={quest.question}
                    multiline={true}
                    rows={4}
                    onChange={(e) => { handleQuestionChange(e, index) }}
                />
            </div>
        )
    }


    const renderQuestEdit = (quest: IQuestionEdit, index: number) => {
        if (quest.active) {
            if (quest.editing) {
                return editingBox(quest, index);
            }
            else {
                return componentSelector(quest);
            }
        }
        return null;
    }

    return (
        <div
            className="flex flex-col gap-5"
        >
            <div
                className="flex flex-col gap-5"
            >
                {questList.map((quest, i) => (
                    <div key={quest.id}>

                        {quest.id} {quest.order}

                        <div
                            className="bg-[#F1F1F1] rounded-3xl flex flex-col"
                        >

                            <div
                                className=" grid grid-cols-3 gap-5 justify-between py-1"
                            >
                                <button
                                    onClick={() => { editB(i) }}
                                >
                                    {quest.editing ? "Confirmar Alterações" : "Editar Pergunta"}
                                </button>

                                <div>
                                    <button
                                        onClick={() => { upB(i) }}
                                    >
                                        [↑]
                                    </button>
                                    <button
                                        onClick={() => { upB(i + 1) }}
                                    >
                                        [↓]
                                    </button>
                                </div>

                                <DropDown
                                    options={questionOptions}
                                    placeholder={dropDownPlaceholder(quest)}
                                    value={null}
                                    onChange={(newValue) => (
                                        dropDownChange(newValue?.id ?? 0, i))
                                    }
                                />

                            </div>
                            {renderQuestEdit(quest, i)}


                            <div
                                className="flex flex-row justify-between px-10"
                            >

                                <button
                                    onClick={() => { requiredB(i) }}
                                >
                                    Pergunta obrigatória {quest.required ? "( O )" : "(   )"}
                                </button>

                                <button
                                    onClick={() => { copyB(i) }}
                                >
                                    copy
                                </button>

                                <button
                                    onClick={() => { deleteB(i) }}
                                >
                                    delete
                                </button>



                            </div>



                        </div>

                    </div>
                ))}
            </div>

            <button
                className="align-self-center flex justify-center align-center bg-white rounded-xl box-border border-8 my-10 w-20 h-20"
                onClick={() => { addQuestionButton() }}
            >
                <text
                    className="box-border -mt-1 font-bold text-center text-6xl align-top"
                >
                    +
                </text>
            </button>
        </div>
    )
};

export default QuestionsEdit;