import { HeaderBixo } from './styles';
import { Button } from "../../components/Button/styles";
import TopicosManual from "../../components/TopicosManual";
import CardExtraScreen from "../../components/CardExtraScreen";
import Perry from "../../components/Perry";
import logo from "../../assets/img/header_024.png";
import BurgerBixo from "./BurgerBixo"

const Manual = ()=>{
   let clientH = document.documentElement.clientHeight;
   const scrollbar = () => {
      window.scrollTo({top: clientH, behavior: 'smooth'});
    }
    return(
       <>
            <BurgerBixo/>
            <HeaderBixo>
               <img src={logo} alt="Perry 023"/>
               <Button style={{padding: "2rem"}} onClick = {scrollbar}>O que fazer para não ser um bixo burro?</Button>
            </HeaderBixo>
            <TopicosManual />
            <Perry />
            <CardExtraScreen />

       </>
    )
}

export default Manual;
