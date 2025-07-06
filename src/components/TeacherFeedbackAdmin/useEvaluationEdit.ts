
import { useReducer, useCallback } from "react";
import { GetAdminAnswerDetailsOut } from "../../schemas/adminAnswers.schema";

type Action =
    | { type: 'SET_STATE'; newState: GetAdminAnswerDetailsOut }
    | { type: 'SET_EDITED_ANSWER'; questionId: number; editedAnswer: string }
    | { type: 'SET_EVALUATION_STATUS'; newStatus: 'approved' | 'rejected' | 'pending' }
    | { type: 'RESET_EDITED_ANSWER'; questionId: number }
    | { type: 'RESET_STATE' };



const initialState: GetAdminAnswerDetailsOut = {
    evaluationId: -1,
    userName: '',
    userEmail: '',
    userNusp: '',
    status: 'pending',
    approvedBy: null,
    answers: []
};

const formReducer = (state: GetAdminAnswerDetailsOut, action: Action): GetAdminAnswerDetailsOut => {
    switch (action.type) {
        case 'SET_STATE':
            return action.newState;

        case 'SET_EDITED_ANSWER':
            return {
                ...state,
                answers: state.answers.map(answer =>
                    answer.questionId === action.questionId
                        ? { ...answer, editedAnswer: action.editedAnswer }
                        : answer
                )
            };

        case 'SET_EVALUATION_STATUS':
            return {
                ...state,
                status: action.newStatus
            };
        case 'RESET_EDITED_ANSWER':
            return {
                ...state,
                answers: state.answers.map(answer =>
                    answer.questionId === action.questionId
                        ? { ...answer, editedAnswer: null }
                        : answer
                )
            };
        case 'RESET_STATE':
            return initialState;

        default:
            return state;
    }
}

export default function useEvaluationEdit() {
    const [state, dispatch] = useReducer(formReducer, initialState);
    const setEvaluation = useCallback(
        (evaluation: GetAdminAnswerDetailsOut) => {
            dispatch({ type: 'SET_STATE', newState: evaluation });
        },
        []
    );

    const setEditedAnswer = useCallback(
        (questionId: number, editedAnswer: string) => {
            dispatch({ type: 'SET_EDITED_ANSWER', questionId, editedAnswer });
        },
        []
    );

    const resetEditedAnswer = useCallback(
        (questionId: number) => {
            dispatch({ type: 'RESET_EDITED_ANSWER', questionId });
        },
        []
    );

    const setEvaluationStatus = useCallback(
        (newStatus: 'approved' | 'rejected' | 'pending') => {
            dispatch({ type: 'SET_EVALUATION_STATUS', newStatus });
        },
        []
    );

    const resetState = useCallback(() => {
        dispatch({ type: 'RESET_STATE' });
    }, []);

    return {
        state,
        setEvaluation,
        setEditedAnswer,
        resetEditedAnswer,
        setEvaluationStatus,
        resetState
    };

}
