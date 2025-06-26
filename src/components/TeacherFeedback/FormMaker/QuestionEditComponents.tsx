import { ComponentType } from "react";

interface IQuestionEditContainer<ComponentProps> {
    label: string;
    component: ComponentType<ComponentProps>;
    componentProps: ComponentProps;
    sx?: React.CSSProperties;
}


const QuestionEditComponent = <ComponentProps extends {}>({
    label,
    component: Component,
    componentProps,
    sx
}: IQuestionEditContainer<ComponentProps>) => {
    return (
        <div
            className="bg-[#F1F1F1] rounded-3xl flex flex-col gap-5 p-5"
            style={sx}
        >
            <div
                className="font-inter text-wrap w-max"
            >
                {label}
            </div>
            <Component {...componentProps} />

        </div>
    )
}

export default QuestionEditComponent;
