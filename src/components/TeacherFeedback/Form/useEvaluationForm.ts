
import { useReducer, useCallback } from "react";
import { IEvaluation } from "../../../schemas/teacherEvaluation/input/evaluation.schema";

interface IForm {
    currentEvaluation: number;
    totalEvaluations: number;
    evaluations: IEvaluation[];
}

type Action =
    | { type: 'SET_CURRENT_EVALUATION'; currentEvaluationIndex: number }
    | { type: 'SET_TOTAL_EVALUATIONS'; totalEvaluations: number }
    | { type: 'REMOVE_EVALUATION'; evaluationIndex: number }
    | { type: 'UPDATE_EVALUATION_CLASS'; evaluationIndex: number; classId?: number; teacherId?: number; courseId?: number }
    | { type: 'UPDATE_ANSWER'; evaluationIndex: number; questionId: number; answer: string }
    | { type: 'RESET_FORM' };


const createEmptyEvaluation = (): IEvaluation => ({
    classId: -1,
    answers: [],
});

const initialState: IForm = {
    currentEvaluation: 0,
    totalEvaluations: 1,
    evaluations: [createEmptyEvaluation()]
};

const formReducer = (state: IForm, action: Action): IForm => {
    switch (action.type) {
        case 'SET_CURRENT_EVALUATION':
            return {
                ...state,
                currentEvaluation: Math.min(
                    Math.max(action.currentEvaluationIndex, 0),
                    state.totalEvaluations - 1
                )
            };

        case 'SET_TOTAL_EVALUATIONS': {
            const total = Math.max(1, action.totalEvaluations);
            let evaluations = [...state.evaluations];

            if (total > evaluations.length) {
                evaluations = [
                    ...evaluations,
                    ...Array.from({ length: total - evaluations.length }, createEmptyEvaluation),
                ];
            } else if (total < evaluations.length) {
                evaluations = evaluations.slice(0, total);
            }

            return {
                currentEvaluation: Math.min(state.currentEvaluation, total - 1),
                totalEvaluations: total,
                evaluations,
            };
        }

        case 'REMOVE_EVALUATION': {
            if (state.evaluations.length === 1) return state;

            const evaluations = state.evaluations.filter((_, i) => i !== action.evaluationIndex);
            const total = evaluations.length;

            return {
                currentEvaluation: Math.min(state.currentEvaluation, total - 1),
                totalEvaluations: total,
                evaluations,
            };
        }
        case 'UPDATE_EVALUATION_CLASS':
            return {
                ...state,
                evaluations: state.evaluations.map((ev, i) => ({
                    ...ev,
                    classId: i === action.evaluationIndex ? action.classId : ev.classId,
                    teacherId: i === action.evaluationIndex ? action.teacherId : ev.teacherId,
                    courseId: i === action.evaluationIndex ? action.courseId : ev.courseId,
                }))
            }
        case 'UPDATE_ANSWER':
            return {
                ...state,
                evaluations: state.evaluations.map((ev, i) => ({
                    ...ev,
                    answers: i !== action.evaluationIndex ? ev.answers : (
                        ev.answers.some(an => an.questionId === action.questionId) ?
                            ev.answers.map(an => ({
                                ...an,
                                answer: an.questionId === action.questionId ? action.answer : an.answer
                            })) :
                            [...ev.answers, {
                                questionId: action.questionId,
                                answer: action.answer
                            }]
                    )
                }))
            }
        case 'RESET_FORM':
            return initialState;

        default:
            return state;
    }
}

export default function useEvaluationForm() {
    const [state, dispatch] = useReducer(formReducer, initialState);
    const setCurrentEvaluation = useCallback(
        (index: number) =>
            dispatch({ type: "SET_CURRENT_EVALUATION", currentEvaluationIndex: index }),
        []
    );

    const setTotalEvaluations = useCallback(
        (total: number) => dispatch({ type: "SET_TOTAL_EVALUATIONS", totalEvaluations: total }),
        []
    );

    const removeEvaluation = useCallback(
        (index: number) => dispatch({ type: "REMOVE_EVALUATION", evaluationIndex: index }),
        []
    );

    const updateEvaluationClass = useCallback(
        (evaluationIndex: number, classId?: number, teacherId?: number, courseId?: number) =>
            dispatch({ type: "UPDATE_EVALUATION_CLASS", evaluationIndex, classId, teacherId, courseId }),
        []
    );

    const updateAnswer = useCallback(
        (evaluationIndex: number, questionId: number, answer: string) =>
            dispatch({ type: "UPDATE_ANSWER", evaluationIndex, questionId, answer }),
        []
    );

    const resetForm = useCallback(() => dispatch({ type: "RESET_FORM" }), []);

    return {
        state,
        setCurrentEvaluation,
        setTotalEvaluations,
        removeEvaluation,
        updateEvaluationClass,
        updateAnswer,
        resetForm,
    };

}
