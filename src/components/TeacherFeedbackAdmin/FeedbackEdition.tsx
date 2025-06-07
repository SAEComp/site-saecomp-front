import DropdownFilters from "./DropdownFilters";
import ReviewList from "./ReviewList";
import CardEdition from "./CardEdition";

const FeedbackEdition = () => {
  return (
    <div className="flex flex-col bg-green-500 w-full">
      {/* div 1 */}
      <div className="flex flex-row justify-center gap-[5%] mt-[10px] mx-[5%]">
        {/* dropdowns de filtros  + botao de search*/}
        <DropdownFilters />
      </div>

      {/* lista de cards com scroll bar */}
      {/* OVERFLOW-SCROW */}
      <div className="flex flex-row  mx-[5%] my-[20px] gap-[5%] justify-around">
        <div className=" h-[1104px] w-[300px] bg-green-700 rounded-lg overflow-hidden">
        <ReviewList />
        </div>

        {/* visualização do card selecionado */}
        <div className="  w-[130px] sm:w-[260px] md:w-[390px] lg:w-[60%] xl:w-[70%] 2xl:w-[80%] ">
          < CardEdition />
        </div>
      </div>
    </div>
  );
};

export default FeedbackEdition;
