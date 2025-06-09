import React from "react";
import {WhatwedoDiv,WhatwedoDiv2,WhatwedoDiv3, Container  } from "./styles";
import CardWhatwedo from '../CardWhatwedo'


const WhatWeDo:React.FC = ()=> {
  return (
      <Container>
        <WhatwedoDiv>
          <CardWhatwedo url = "img1" text = "Organizamos diversos minicursos para dentro e fora da USP"></CardWhatwedo>
          <CardWhatwedo url = "img2" text = "Cuidamos da recepção e integração dos bixos todos os anos"></CardWhatwedo>
        </WhatwedoDiv>
        <WhatwedoDiv2>
          <CardWhatwedo url = "img3" text = "Gamenights, sessões de filmes, festas e muitos outros eventos"></CardWhatwedo>
          <CardWhatwedo url = "img4" text = "Coletamos feedbacks sobre os professores para podermos melhorar o curso"></CardWhatwedo>
        </WhatwedoDiv2>
        <WhatwedoDiv3>
          <CardWhatwedo url = "img5" text = "Planejamos e vendemos os produtos da Engenharia de Computação"></CardWhatwedo>
          <CardWhatwedo url = "img6" text = "Fazemos parte do grupo que criou o site da Engenharia de Computação"></CardWhatwedo>
        </WhatwedoDiv3>
      </Container>
  );
}


export default WhatWeDo;

