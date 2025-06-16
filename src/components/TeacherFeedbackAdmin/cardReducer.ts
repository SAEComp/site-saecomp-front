import React, { useReducer, useEffect } from "react";
import IcardEditionProps from "./FeedbackEdition"; // Importa a interface ICardEditionProps
import { GetAdminAnswerDetailsOut } from "../../schemas/adminAnswers.schema";

interface IReviewState {
  originalData: GetAdminAnswerDetailsOut | null;
  editedData: GetAdminAnswerDetailsOut | null;
  dataBeforeReset: GetAdminAnswerDetailsOut | null;
  componentStatus: string;
  error: string | null;
}

type Action =
  | { type: "INITIALIZE_DATA"; payload: GetAdminAnswerDetailsOut }
  | { type: "UPDATE_STATUS"; payload: "pending" | "approved" | "rejected" }
  | { type: "UPDATE_ANSWER"; payload: { questionId: number; answer: string } }
  | { type: "RESET_CHANGES" }
  | { type: "SAVE_START" }
  | { type: "SAVE_SUCCESS" }
  | { type: "SAVE_ERROR"; payload: string }
  | { type: "UNDO_RESET" }; // <-- NOVA AÇÃO

const initialState: IReviewState = {
  originalData: null,
  editedData: null,
    dataBeforeReset: null,
  componentStatus: "idle",
  error: null,
};

// O reducer que contém TODA a nossa lógica de estado
const reviewReducer = (state: IReviewState, action: Action): IReviewState => {
  switch (action.type) {
    case "INITIALIZE_DATA":
      return {
        ...state,
        originalData: action.payload,
        editedData: action.payload, // Começa igual ao original
        componentStatus: "idle",
        error: null,
      };
    case "UPDATE_STATUS":
      if (!state.editedData) return state;
      return {
        ...state,
        editedData: { ...state.editedData, status: action.payload },
      };

    case "UPDATE_ANSWER":
      if (!state.editedData) return state;
      return {
        ...state,
        editedData: {
          ...state.editedData,
          answers: state.editedData.answers.map((ans) =>
            ans.questionId === action.payload.questionId
              ? { ...ans, answer: action.payload.answer }
              : ans
          ),
        },
      };

    case "RESET_CHANGES":
      return {
        ...state,
        editedData: state.originalData, // Volta para a cópia original
      };

    case "SAVE_START":
      return { ...state, componentStatus: "saving", error: null };

    case "SAVE_SUCCESS":
      if (!state.editedData) return state;
      // Importante: Após salvar, o dado editado se torna o novo "original"
      return {
        ...state,
        componentStatus: "idle",
        originalData: state.editedData,
      };

    case "SAVE_ERROR":
      return { ...state, componentStatus: "error", error: action.payload };

    case "UNDO_RESET":
      return {
        ...state,
        editedData: state.dataBeforeReset,
        dataBeforeReset: null, // Só pode ser usado uma vez
      };

    default:
      return state;
  }
};

export function useReviewReducer(initialData: GetAdminAnswerDetailsOut | null) {
  const [state, dispatch] = useReducer(reviewReducer, initialState);
  return { state, dispatch };
}
