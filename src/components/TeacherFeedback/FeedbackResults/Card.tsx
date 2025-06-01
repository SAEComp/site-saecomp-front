import {
  IFeedbacksResponse,
  IPagination,
} from "../../../interfaces/TeacherFeedback/feedback.interface";

import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

interface ICard {
  data: IPagination<IFeedbacksResponse> | null;
  setShowCard: React.Dispatch<React.SetStateAction<boolean>>;
}

const Card = ({ data, setShowCard }: ICard) => {
  const [InfoIndex, setInfoIndex] = useState(0);

  return (
    <div
      onClick={() => setShowCard(false)}
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
      {/* AQUI TA O CARD ORIGINAL*/}
      {/* <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full md:w-1/2 rounded-md p-8">
        <button onClick={() => setShowCard(false)}>fechar</button>
        <div>{JSON.stringify(data, null, 2)}</div>
      </div> */}

      {/* AQUI ESTA O MEU CARD */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#CD0000] h-[529px] w-[396px] rounded-3xl z-30">
        {/* tag 1 */}
        <div className=" bg-white rounded-3xl w-[52px] h-[22px] mt-[31px] ml-[20px] absolute text-center font-[400] text-[12px] font-inter">
          EESC
        </div>

        {/* tag 2*/}
        <div className=" bg-slate-200 rounded-3xl w-[52px] h-[22px] mt-[63px] ml-[20px] absolute text-center font-[400]  text-[12px] font-inter">
          ICMC
        </div>

        {/* x button */}
        <div
          onClick={() => setShowCard(false)}
          className=" bg-[#A60000] rounded-3xl w-[37px] h-[37px] mt-[19px] ml-[337px] absolute text-center font-inter flex items-center justify-center ">
          <CloseIcon className="" />
        </div>

        {/* profile */}
        <div className=" w-[253px] h-[253px] mt-[29px] ml-[70px] rounded-full absolute">
          <div className="w-[230px] h-[230px] mt-[12px] ml-[13px] bg-[#D9D9D9] rounded-full absolute flex justify-center items-center">
            <img src="./src/assets/img/perry.png" className="mx-auto" />
          </div>

          <div className="w-[253px] h-[253px] border-[6px] border-[#FFFFFF] rounded-full absolute" />
          <div className="w-[191px] h-[27px] mt-[151px] ml-[32px] rounded-[7px] absolute bg-[#CD0020] text-center font-inter">
            {data?.data[0].teacherName}
          </div>
        </div>

        {/* description */}
        <div className="bg-white rounded-3xl w-[396px] h-[313px] mt-[216px]  absolute">
          <div
            onClick={() => {
              setInfoIndex(0);
            }}
            className={`w-[126px] h-[160px] mt-[9px] ml-[9px] rounded-[40px] absolute text-[12px] text-center ${
              InfoIndex === 0 ? "bg-[#EEEEEE]" : "bg-[#bcbcbc]"
            } font-inter p-1`}>
            Informações <br /> Gerais
          </div>
          <div
            onClick={() => {
              setInfoIndex(1);
            }}
            className={`w-[126px] h-[160px] mt-[9px] ml-[135px] rounded-[40px] absolute text-[12px] text-center
              ${
                InfoIndex === 1 ? "bg-[#EEEEEE]" : "bg-[#bcbcbc]"
              } font-inter p-1`}>
            Aspectos <br /> Positivos
          </div>
          <div
            onClick={() => {
              setInfoIndex(2);
            }}
            className={`w-[126px] h-[160px] mt-[9px] ml-[260px] rounded-[40px] absolute text-[12px] text-center ${
              InfoIndex === 2 ? "bg-[#EEEEEE]" : "bg-[#bcbcbc]"
            } font-inter p-1`}>
            Aspectos <br /> Negativos
          </div>
          <div className="w-[377px] h-[248px] mt-[50px] ml-[9px] rounded-b-[40px] bg-[#EEEEEE] absolute" />
          <div className="w-[337px] h-[38px] mt-[59.5px] ml-[29px] rounded-[12px] bg-[#CD0000] absolute text-center font-inter p-1">
            {InfoIndex === 0
              ? data?.data[0].courseName
              : InfoIndex === 1
              ? data?.data[0].positiveAspects
              : data?.data[0].negativeAspects}
          </div>
          <div className="w-[350px] h-[1px] mt-[107.5px] ml-[23px] rounded-[1px] bg-black absolute" />
          <div className="w-[333px] h-[152px] mt-[121px] ml-[33px]  absolute font-inter">
            {InfoIndex === 0
              ? data?.data[0].additionalComments
              : InfoIndex === 1
              ? data?.data[0].positiveAspects
              : data?.data[0].negativeAspects}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
