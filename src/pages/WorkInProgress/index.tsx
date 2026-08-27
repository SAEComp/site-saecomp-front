import pelucia from "../../assets/img/pelucia.png";

const WorkInProgress = () => {
    return(
        <section className="m-4 gap-8 flex flex-col flex-nowrap justify-center items-center text-[2.5rem]">
            <h1 className="text-center font-bold text-green-500">Ainda estamos trabalhando nisso...</h1>
            <img src={pelucia} className="max-h-60 max-w-60 object-contain" alt="Perry de pelúcia"/>
            <h2 className="text-center text-[1rem] text-neutral-700">A SAEComp está dando o máximo no desenvolvimento desta seção. Acompanhe em breve!</h2>
        
        </section>
    );
}

export default WorkInProgress;
