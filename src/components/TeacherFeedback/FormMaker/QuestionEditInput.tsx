import { IQuestionEdit } from "./useQuestionEdit";
import QuestionComponent from "../Form/QuestionComponent";
import TextInput from "../../Inputs/TextInput";
import SliderInput from "../../Inputs/SliderInput";
import NumberInput from "../../Inputs/NumberInput";

const QuestionEditInput = ({ q }: { q: IQuestionEdit }) => {
    switch (q.type) {
        case 'text':
            return (
                <TextInput
                    multiline={true}
                    rows={4}
                    label='Sua resposta'
                />
            )

        case 'slider':
            return (
                <SliderInput
                    value={0}
                    setValue={() => null}
                />
            )
        case 'numeric':
            return (
                <div
                className="flex w-full justify-center"
                > 
                    <NumberInput 
                    mobile={true}
                    max={1}
                    /> 
                </div>
            );
    }
}

export default QuestionEditInput;