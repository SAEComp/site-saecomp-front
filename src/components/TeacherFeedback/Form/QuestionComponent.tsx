import { ComponentType } from "react";

interface IQuestionContainer<ComponentProps> {
    label: string;
    component: ComponentType<ComponentProps>;
    componentProps: ComponentProps;
    component2?: ComponentType<ComponentProps>;
    componentProps2?: ComponentProps;
    required?: boolean;
    children?: React.ReactNode;
    sx?: React.CSSProperties;
}


const QuestionComponent = <ComponentProps extends {}>({
    label,
    component: Component,
    componentProps,
    component2: Component2,
    componentProps2,
    children,
    required = false,
    sx
}: IQuestionContainer<ComponentProps>) => {
    return (
        <div
            className="bg-[#F1F1F1] rounded-3xl flex flex-col gap-5 p-5"
            style={sx}
        >
            <div className="flex relative">
                <span
                    className={`font-inter text-lg text-red-500 absolute -left-2 -top-3 ${required ? 'block' : 'hidden'}`}
                >*</span>
                <span
                    className="font-inter"
                >
                    {label}
                </span>

            </div>
            <Component {...componentProps} />
            {children}
            {Component2 && componentProps2 && (
                <Component2 {...componentProps2} />
            )}
        </div>
    )
}

export default QuestionComponent;
