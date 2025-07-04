import { useReducer, useCallback } from "react";
import { Question } from "../../../schemas/adminQuestions.schema";

export interface IQuestionEdit extends Question {
    editing: boolean;
    required: boolean;
}

interface IQuestionEditList {
    questions: IQuestionEdit[];
    nextId: number;
    activeCount: number;
}

type Action =
    | { type: 'SET_STATE'; state: IQuestionEdit[] }
    | { type: 'ADD_QUESTION'; }
    | { type: 'DELETE_QUESTION'; questionId: number; }
    | { type: 'COPY_QUESTION'; questionId: number; }
    | { type: 'MOVE_QUESTION_UP'; questionId: number; }
    | { type: 'MOVE_QUESTION_DOWN'; questionId: number; }
    | { type: 'SET_QUESTION_REQUIRED'; questionId: number; required: boolean; }
    | { type: 'SET_QUESTION_EDITING'; questionId: number; editing: boolean; }
    | { type: 'SET_QUESTION_TEXT'; questionId: number; text: string; }
    | { type: 'SET_QUESTION_COMPONENTTYPE'; questionId: number; componentType: Question['type']; }
    | { type: 'SET_QUESTION_ACTIVE'; questionId: number; active: boolean}



const createNewQuestionEdit = (nextId: number, activeCount: number): IQuestionEdit => ({
    id: nextId,
    question: "Sua pergunta",
    type: "text",
    active: true,
    order: activeCount+1,
    isScore: false,
    editing: false,
    required: false
});

const initialState: IQuestionEditList = {
    questions: [],
    nextId: -1,
    activeCount: 0
}

const comp = (q1: IQuestionEdit, q2: IQuestionEdit) => {
    if ( q1.active && q2.active ) return q1.order!-q2.order!;
    if ( q1.active ) return -1;
    if ( q2.active ) return 1;
    return 0;
}

const order = (questions: IQuestionEdit[] ) => {
    return questions.map( (q,j) =>({
            ...q,
            order: q.active? j+1 : null,
        }))
}

const questionEditReducer = (state: IQuestionEditList, action: Action):IQuestionEditList => {
    switch (action.type) {
        case 'SET_STATE':
            return{
                questions: action.state.sort(comp),
                nextId: -1,
                activeCount: action.state.reduce( (acc, cur) => (cur.active? acc+1 : acc), 0)
            }
        case 'ADD_QUESTION':
            return {
                ...state,
                questions: [
                    ...state.questions,
                    createNewQuestionEdit(state.nextId, state.activeCount)
                ].sort(comp),
                nextId: state.nextId-1,
                activeCount: state.activeCount+1
            }
        case 'DELETE_QUESTION':{
            return{
                ...state,
                questions: order(
                    state.questions.filter( q => q.id !== action.questionId )
                ),
                activeCount: state.activeCount-1
            }
        }
        case 'COPY_QUESTION':{
            const currentIndex = state.questions.findIndex( q => q.id===action.questionId);
            if(!currentIndex) return state;
            const currentQuestion = state.questions[currentIndex];
            if(!currentQuestion || currentQuestion.order===null) return state;

            const newQuestion = {
                ...currentQuestion,
                id: state.nextId,
                order: currentQuestion.order+1,
            }
            return{
                ...state,
                questions: order([
                    ...state.questions.slice(0, currentIndex+1),
                    newQuestion,
                    ...state.questions.slice(currentIndex+1)
                ]),
                activeCount: state.activeCount+1,
                nextId: state.nextId-1, 
            }
        }   
        case 'MOVE_QUESTION_UP':
            return{
                ...state,
                questions: order(
                    state.questions.map( q => ({
                        ...q,
                        order: q.id===action.questionId? q.order!-1.5 : q.order,
                    })).sort(comp)
                )
            }
        case 'MOVE_QUESTION_DOWN':
            return{
                ...state,
                questions: order(
                    state.questions.map( q => ({
                        ...q,
                        order: q.id===action.questionId? q.order!+1.5 : q.order,
                    })).sort(comp)
                )
            }
        case 'SET_QUESTION_COMPONENTTYPE':
            return{
                ...state,
                questions: state.questions.map( q => ({
                    ...q,
                    type: q.id===action.questionId? action.componentType : q.type,
                }))   
            }
        case 'SET_QUESTION_EDITING':
            return{
                ...state,
                questions: state.questions.map( q => ({
                    ...q,
                    editing: q.id===action.questionId? action.editing : q.editing,
                })) 
            }
        case 'SET_QUESTION_REQUIRED':
            return{
                ...state,
                questions: state.questions.map( q => ({
                    ...q,
                    required: q.id===action.questionId? action.required : q.required,
                })) 
            }
        case 'SET_QUESTION_TEXT':
            return{
                ...state,
                questions: state.questions.map( q => ({
                    ...q,
                    question: q.id===action.questionId? action.text : q.question,
                })) 
            }
        case 'SET_QUESTION_ACTIVE':
            return{
                ...state,
                questions: state.questions.map( q => ({
                    ...q,
                    active: q.id===action.questionId? action.active : q.active,
                })).sort(comp)
            }
    }
}

export default function useQuestionEdit() {
    const [state, dispatch] = useReducer(questionEditReducer, initialState);
    const setQuestionList = useCallback(
        (questions: IQuestionEdit[]) =>
            dispatch ({type: 'SET_STATE', state: questions}),
        []
    )
    const addQuestion = useCallback(
        () =>
            dispatch({type: 'ADD_QUESTION'}),
        []
    )
    const deleteQuestion = useCallback(
        (id: number) =>
            dispatch ({type: 'DELETE_QUESTION', questionId: id}),
        []
    ) 
    const copyQuestion = useCallback(
        (id: number) =>
            dispatch ({type: 'COPY_QUESTION', questionId: id}),
        []
    ) 
    const moveQuestionUp = useCallback(
        (id: number) =>
            dispatch ({type: 'MOVE_QUESTION_UP', questionId: id}),
        []
    ) 
    const moveQuestionDown = useCallback(
        (id: number) =>
            dispatch ({type: 'MOVE_QUESTION_DOWN', questionId: id}),
        []
    ) 
    const setQuestionRequired = useCallback(
      (id: number , required: boolean) =>
            dispatch ({type: 'SET_QUESTION_REQUIRED', questionId:id , required: required}),
        []  
    ) 
    const setQuestionEditing = useCallback(
        (id: number , editing: boolean) =>
            dispatch ({type: 'SET_QUESTION_EDITING', questionId:id , editing: editing}),
        []  
    )
    const setQuestionText = useCallback(
        (id: number , question: string) =>
            dispatch ({type: 'SET_QUESTION_TEXT', questionId:id , text: question}),
        []  
    ) 
    const setQuestionType = useCallback(
        (id: number , type: Question['type']) =>
            dispatch ({type: 'SET_QUESTION_COMPONENTTYPE', questionId:id , componentType: type}),
        []  
    ) 
    const setQuestionActive = useCallback(
        (id: number , active: boolean) =>
            dispatch ({type: 'SET_QUESTION_ACTIVE', questionId:id , active: active}),
        []  
    ) 
    return{
        state,
        setQuestionList,
        addQuestion,
        deleteQuestion,
        copyQuestion,
        moveQuestionUp,
        moveQuestionDown,
        setQuestionRequired,
        setQuestionEditing,
        setQuestionText,
        setQuestionType,
        setQuestionActive
    }
}
