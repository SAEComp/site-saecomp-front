import QuestionComponent from "../TeacherFeedback/Form/QuestionComponent";
import SaveIcon from "@mui/icons-material/Save";
import { GetAdminAnswerDetailsOut } from "../../schemas/teacherEvaluation/output/adminAnswer.schema";
import { useEffect } from "react";
import useEvaluationEdit from "./useEvaluationEdit";
import { componentTypes } from "../TeacherFeedback/Form/Questions";
import { IOption } from "../Inputs/DropDown";
import DropDown from "../Inputs/DropDown";
import { teacherEvalService } from "../../services/teacherEval.service";

import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { toast } from "sonner";
export interface ICardEditionProps {
    detailedAnswer: GetAdminAnswerDetailsOut | null;
    setDetailedAnswer: React.Dispatch<React.SetStateAction<GetAdminAnswerDetailsOut | null>>;
}

const CardEdition = ({ detailedAnswer, setDetailedAnswer }: ICardEditionProps) => {
    const evaluationEdit = useEvaluationEdit();

    const statusOptions: IOption[] = [
        { id: 1, label: "Aprovado", subtitle: 'approved' },
        { id: 2, label: "Rejeitado", subtitle: 'rejected' },
        { id: 3, label: "Pendente", subtitle: 'pending' },
    ];
    useEffect(() => {
        if (detailedAnswer) {
            evaluationEdit.setEvaluation(detailedAnswer);
        } else evaluationEdit.resetState();
    }
        , [detailedAnswer]);

    async function saveEditedEvaluation() {
        const result = await teacherEvalService.updateAnswer({
            status: evaluationEdit.state.status,
            answers: evaluationEdit.state.answers.map(answer => ({
                questionId: answer.questionId,
                editedAnswer: answer.editedAnswer ?? answer.answer,
            }))
        },
            evaluationEdit.state.evaluationId
        )
        if (!result) {
            toast.error("Erro ao salvar a avaliação");
            return;
        }
        toast.success("Avaliação salva com sucesso");
        setDetailedAnswer(await teacherEvalService.getAdminAnswerDetails(evaluationEdit.state.evaluationId));
    }

    return (
        <div className="flex flex-col gap-4 p-3 w-full h-fit bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-black">
                Edição de Avaliação
            </h2>
            <div className="bg-[#F1F1F1] rounded-3xl py-6 px-4 flex justify-between gap-3">
                <DropDown
                    className="md:w-1/2 w-full"
                    options={statusOptions}
                    placeholder={"Status"}
                    searchable={false}
                    showSubtitle={false}
                    clearable={false}
                    value={statusOptions.find(el => el.subtitle === evaluationEdit.state.status) ?? null}
                    onChange={(value) => {
                        evaluationEdit.setEvaluationStatus(value?.subtitle as 'approved' | 'rejected' | 'pending')
                    }}
                />
                {evaluationEdit.state.evaluationId >= 0 && (<div
                    className="bg-black rounded-lg flex justify-center items-center p-2 cursor-pointer group aspect-square"
                    title="Salvar"
                onClick={saveEditedEvaluation}
                >
                    <SaveIcon className="text-white group-hover:scale-110 duration-200 transition-transform ease-in-out h-6 w-6" />
                </div>)}
            </div>
            <div className="flex flex-col gap-4">
                {evaluationEdit.state.answers.map((answer) => (
                    <QuestionComponent
                        key={answer.questionId}
                        label={answer.question}
                        component={componentTypes[answer.questionType]}
                        componentProps={{
                            multiline: true,
                            rows: 4,
                            label: 'Sua resposta',
                            value: answer.answer || ''
                        }}
                        component2={componentTypes[answer.questionType]}
                        componentProps2={{
                            multiline: true,
                            rows: 4,
                            label: 'Resposta editada',
                            value: answer.editedAnswer ?? answer.answer,
                            onChange: (newValue: string) => {
                                evaluationEdit.setEditedAnswer(answer.questionId, String(newValue));
                            }
                        }}
                    >
                        <div className="flex flex-col justify-between mt-2">
                            <hr className="h-px bg-slate-700 w-full mb-2" />
                            <div className="flex justify-between px-1">
                                <div>Resposta editada:</div>
                                {answer.editedAnswer !== null && (<div
                                    className="bg-black rounded-lg flex justify-center items-center p-1 cursor-pointer group"
                                    title="Voltar resposta original"
                                    onClick={() => evaluationEdit.resetEditedAnswer(answer.questionId)}
                                >
                                    <RestartAltIcon className="text-white group-hover:animate-spinOnce h-4 w-4" />
                                </div>)}
                            </div>
                        </div>
                    </QuestionComponent>
                ))}
            </div>

        </div>
    );
};

export default CardEdition;
