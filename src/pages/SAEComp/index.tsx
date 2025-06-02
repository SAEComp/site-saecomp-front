import { ProjetosEmAcao, Centered, DualGrid } from "./styles";
import Header2 from "../../components/Header2";
import Projeto from "../../components/Projetos";
import ContactDir from "../../components/Contact";
import ContactSoc from "../../components/ContactSoc";
import WhatWeDo from "../../components/WhatWeDo";
import { Defaultmargin, DefaultTitle } from "../Default/styles"

const SAEcomp = () => {


   return (
      <>
         <Header2
            title="CONHEÇA A SECRETARIA ACADÊMICA"
            text="Oferecemos suporte acadêmico e representatividade frente aos órgãos da Universidade de São Paulo para todos os alunos de graduação do curso de Engenharia de Computação. Nossa organização é composta somente por alunos de graduação do curso de Engenharia de Computação, dessa forma, estamos inseridos no ambiente e no grupo que queremos impactar, alcançando nossos objetivos a partir da integração das turmas e dos indivíduos.
            "
            url="../../assets/img/background1.jpg"
         />

         <Defaultmargin><DefaultTitle style={{ color: '#238d41' }}>O QUE FAZEMOS</DefaultTitle></Defaultmargin>
         <Defaultmargin><WhatWeDo /></Defaultmargin>
         <div style={{ padding: "3rem 0 3rem 0" }}>
            <Defaultmargin><DefaultTitle style={{ color: '#238d41' }}>PROJETOS EM AÇÃO</DefaultTitle></Defaultmargin>
            <Centered>
               <ProjetosEmAcao>

                  <Projeto title="Drive da Eng Comp" text="Drive que reúne materiais, provas antigas e trabalhos disponibilizados pelos veteranos  das matérias que compõem a grade do curso." />
                  <Projeto title="Kit Bixo" text="Um conjunto de artigos elaborados especialmente para você começar o curso vestindo as cores de seu curso." />
                  <Projeto title="Portfólio de IC's" text="Um documento com todas as oportunidades de Iniciação Científica oferecidas por professores de diversos professores da USP." />
               </ProjetosEmAcao>

            </Centered>
         </div>

         <div style={{ padding: "3rem 0 3rem 0" }}>

            <Defaultmargin><DefaultTitle style={{ color: '#238d41' }}>CONVERSE COM A GENTE</DefaultTitle></Defaultmargin>
            <DualGrid>

               <div>
                  <Defaultmargin><ContactDir text="saecomp@usp.br" type="Email" /></Defaultmargin>
                  <Defaultmargin><ContactDir text="(16) 99317-2251" type="Telefone" /></Defaultmargin>
                  <Defaultmargin><ContactDir text="Sala 8-001 | Prédio da Eng Comp - USP Campus 2. São Carlos, Brasil" type="Endereço" /></Defaultmargin>
               </div>

               <div>
                  <Defaultmargin><ContactSoc text="SAEComp" type="Twitch" /></Defaultmargin>
                  <Defaultmargin><ContactSoc text="@saecomp.ec" type="Insta" /></Defaultmargin>
                  <Defaultmargin><ContactSoc text="@saecompusp" type="Twitter" /></Defaultmargin>
               </div>
            </DualGrid>

         </div>
      </>
   )
}

export default SAEcomp;