import React from "react";
import CardExtras from '../CardExtras';
import { SubtitleCont, ContentSection, Container, LinkSocial } from "./styles";

const CardExtraScreen = () => {
    return (
        <ContentSection>
            <Container id='t18'>
                <SubtitleCont><b>Extracurriculares</b></SubtitleCont>

                <CardExtras 
                    title="Atlética CAASO" 
                    text="A Atlética CAASO foi fundada em 1954, um ano depois do Centro Acadêmico Armando de Salles Oliveira. Tendo o porco como nosso símbolo, somos o grupo do campus responsável pela promoção e incentivo ao esporte. Por meio da organização de torneios universitários e festas, propiciamos a integração dos alunos do CAASO. Nossa atlética é dividida em cinco áreas, sendo elas, Esportes; Eventos; Administrativo; Marketing e Social. Além disso, atualmente a atlética conta com mais de 500 atletas divididos em​ ​mais de 40 modalidades diferentes."
                    url="img2"
                />

                <CardExtras 
                    title="BAJA - Projetos em Engenharia de Computação" 
                    text="O projeto é um desafio aos estudantes de engenharia de todo o mundo de desenvolver e construir um protótipo off-road, normatizado internacionalmente, passando por todas as etapas do desenvolvimento de um produto, aplicando, assim, os conhecimentos adquiridos em sala de aula em um exemplo real de engenharia.Sendo a pioneira do projeto no Brasil, com mais de 25 anos de história a Equipe detém 8 títulos nacionais (nenhuma outra equipe brasileira possui mais títulos nacionais do que a EESC USP Baja SAE), sendo a atual bicampeã nacional e atual campeã regional. Desde sua fundação mantém um compromisso de sempre manter a competitividade e inovação, buscando estar sempre entre as melhores equipes do Brasil e do Mundo."
                    url="img3"
                />

                <CardExtras 
                    title="Cajuteria" 
                    text={<>Sejam bem-vindos calouros! Nós somos a torcida dos nossos atletas e com nossos instrumentos botamos o ginásio inteiro à loucura durante os jogos universitários! No CAASO somos a Cajuteria, uma das mais legais baterias do Brasil inteiro. Nós torcemos em jogos, apresentamos musicais em festas e formaturas, competimos em torneios, tocamos em carnaval e muito mais! Para participar é só acessar o nosso <LinkSocial target="_blank" href="https://www.instagram.com/cajuteria_caaso">Instagram</LinkSocial> para conhecer mais!Esperamos vocês!</>}
                    url="img12"
                />

                <CardExtras 
                    title="Campanha USP do Agasalho - Projetos em Engenharia de Computação" 
                    text="A Campanha USP do Agasalho é um projeto social voluntário formado por alunos das universidades de São Carlos. O projeto arrecada e doa roupas para mais de 40 instituições carentes de São Carlos e região. Além disso, por meio de visitas e atividades sociais, visa diminuir a distância entre a universidade e a comunidade, aproximando todas as pessoas envolvidas com o projeto, de forma a gerar um impacto social positivo para todos. Venha conhecer mais sobre a Campanha nas palestras de apresentação."
                    url="img4"
                />

                <CardExtras 
                    title="EESC Finance" text={<>O EESC Finance é o clube de mercado financeiro da USP São Carlos, fundado em 2018 por cinco estudantes. O clube tem como objetivo preparar seus membros para atuar nas principais áreas do mercado financeiro, como Equity Research, Investment Banking, Asset Management, Private Equity e Venture Capital. Por meio de um processo estruturado de capacitação, aliado ao acesso a competições de alto nível e à proximidade com o mercado, o EESC Finance consolidou-se como um clube reconhecido por sua excelência técnica e formação de talentos. Para mais informações, acesse nosso <LinkSocial target="_blank" href="https://www.instagram.com/eescfinance/">Instagram</LinkSocial> ou <LinkSocial target="_blank" href="https://www.eescfinance.com/">Site</LinkSocial></>}  url="img17"
                />

                <CardExtras 
                    title="EESC Jr." 
                    text="A EESC jr. é a Empresa júnior de Engenharia e Arquitetura do campus. Aqui vivenciamos o dia-a-dia de uma empresa de consultoria já na graduação. Muito além disso, temos como nosso propósito tornar o Brasil um país mais empreendedor com a missão de Transformar Vidas por meio de Engenharia e Arquitetura. Atualmente executamos projetos em 6 áreas: Ambiental, Arq/Civil, Materiais, Mecânica/Mecatrônica, Produção e Tecnologia e também contamos com a área de backoffice; comercial (vendas e marketing), inovação e gestão (pessoas/performance e jurídico/financeiro). Vem conhecer mais sobre o nosso time!"
                    url="img5"
                />

                <CardExtras 
                    title="EESC-USP AeroDesign" 
                    text="A EESC jr. é a Empresa júnior de Engenharia e Arquitetura do campus. Aqui vivenciamos o dia-a-dia de uma empresa de consultoria já na graduação. Muito além disso, temos como nosso propósito tornar o Brasil um país mais empreendedor com a missão de Transformar Vidas por meio de Engenharia e Arquitetura. Atualmente executamos projetos em 6 áreas: Ambiental, Arq/Civil, Materiais, Mecânica/Mecatrônica, Produção e Tecnologia e também contamos com a área de backoffice; comercial (vendas e marketing), inovação e gestão (pessoas/performance e jurídico/financeiro). Vem conhecer mais sobre o nosso time!"
                    url="img8"
                />

                <CardExtras 
                    title="EESC USP- Formula SAE" 
                    text="A EESC jr. é a Empresa júnior de Engenharia e Arquitetura do campus. Aqui vivenciamos o dia-a-dia de uma empresa de consultoria já na graduação. Muito além disso, temos como nosso propósito tornar o Brasil um país mais empreendedor com a missão de Transformar Vidas por meio de Engenharia e Arquitetura. Atualmente executamos projetos em 6 áreas: Ambiental, Arq/Civil, Materiais, Mecânica/Mecatrônica, Produção e Tecnologia e também contamos com a área de backoffice; comercial (vendas e marketing), inovação e gestão (pessoas/performance e jurídico/financeiro). Vem conhecer mais sobre o nosso time!"
                    url="img7"
                />

                <CardExtras 
                    title="EESC-USP Mileage" 
                    text="Desenvolvemos veículos de alta eficiência energética e veículos autônomos, visando sempre tecnologia e sustentabilidade."
                    url="img6"
                />

                <CardExtras 
                    title="Efestus" 
                    text="A EESC jr. é a Empresa júnior de Engenharia e Arquitetura do campus. Aqui vivenciamos o dia-a-dia de uma empresa de consultoria já na graduação. Muito além disso, temos como nosso propósito tornar o Brasil um país mais empreendedor com a missão de Transformar Vidas por meio de Engenharia e Arquitetura. Atualmente executamos projetos em 6 áreas: Ambiental, Arq/Civil, Materiais, Mecânica/Mecatrônica, Produção e Tecnologia e também contamos com a área de backoffice; comercial (vendas e marketing), inovação e gestão (pessoas/performance e jurídico/financeiro). Vem conhecer mais sobre o nosso time!"
                    url="img9"
                />

                <CardExtras 
                    title="Enactus USP - São Carlos" 
                    text={<>A Enactus é uma organização sem fins lucrativos presente em 36 países que une estudantes, líderes executivos e acadêmicos visando ao empoderamento de comunidades em vulnerabilidade socioeconômica através do Empreendedorismo Social.Nosso time faz parte dessa rede e atualmente conta com 4 projetos na cidade de São Carlos, buscando mudar a realidade ao nosso redor e impactar a sociedade nos pilares social, econômico e ambiental.Buscamos tornar estudantes e comunidades agentes de mudança na sociedade por meio da ação empreendedora sustentável, compartilhando oportunidades e impactando vidas.Para saber mais sobre nosso time e nossos projetos, assista a uma de nossas Palestras de Apresentação (dias 02 a 05 de março) e acesse nosso <LinkSocial target="_blank" href="https://www.instagram.com/time_uspsc/">Instagram</LinkSocial></>}
                    url="img10"
                />

                <CardExtras 
                    title="Fellowship of the Game" 
                    text={<>Fellowship of the Game é um grupo de desenvolvimento de jogos associado ao Instituto de Ciências Matemáticas e Computação - ICMC. Nosso objetivo é complementar o currículo acadêmico através da produção de jogos e da organização de eventos gratuitos e abertos para a comunidade como minicursos e a USP Game Link. Realizamos também Gamenights para integrar as pessoas do nosso instituto!Como um desenvolvedor de jogos você poderá aprender a programar, desenhar Artes 2D e 3D, criar roteiros, desenvolver Game Design, realizar publicação de jogos em plataformas, criar música, ter liderança, realizar eventos e muito mais!Para mais informação acesse o nosso <LinkSocial target="_blank" href="https://www.fog.icmc.usp.br/">Site</LinkSocial></>}
                    url="img11"
                />

                <CardExtras 
                    title="Ganesh" 
                    text="O Ganesh é um grupo de estudo e extensão focado em segurança de informação, atualmente estudamos temas como Criptografia, Pentest, segurança Web e em Redes, Engenharia Reversa em softwares e malwares, Hardware Hacking, além de outros temas voltados à segurança. Participamos também de 'competições hackers', conhecidas como CTFs. Além disso, o grupo organiza palestras dentro e fora da universidade, e realiza de projetos visando levar conhecimento sobre segurança da informação para diversos públicos."
                    url="img16"
                />

                <CardExtras 
                    title="Grupo SEMEAR" 
                    text="O Grupo SEMEAR é uma organização estudantil da Escola de Engenharia de São Carlos (EESC) da Universidade de São Paulo (USP) voltada para o desenvolvimento de projetos de robótica, desde robôs autônomos e drones, até robôs de combate e iniciativas sociais de divulgação técnico-científica em engenharia e robótica. Nossa visão é construir um grupo de excelência em engenharia e de referência nacional em robótica. A cada ano nos aproximamos desse sonho, venha nos ajudar com isso!"
                    url="img13"
                />

                <CardExtras 
                    title="IEEE Student Branch" 
                    text={<>O IEEE é uma organização internacional dedicada à incentivar o uso da tecnologia em prol da sociedade. No ramo de São Carlos, temos a Computer Society, com projetos em Desenvolvimento web/mobile, Inteligência Artificial aplicada a jogos e visão computacional. Além de projetos em outras áreas como energia renovável e robótica.Sigam as nossas páginas nas redes sociais, como <LinkSocial target="_blank" href="https://www.instagram.com/ieeeuspsc/">Instagram</LinkSocial></>}
                    url="img14"
                />

                <CardExtras 
                    title="Iniciativas Mercado" 
                    text="O grupo Iniciativas Mercado é uma Empresa Júnior de eventos que tem como principal objetivo organizar e promover eventos alinhados ao mercado de trabalho, dando a oportunidade de jovens universitários se desenvolverem pessoal e profissionalmente. Nosso intuito é impactar diretamente os estudantes em nosso meio, para que tenham conhecimento e qualificação para adentrar no mercado. Somos responsáveis por organizar a Feira Mercado, o maior evento com a temática de mercado de trabalho voltado para o público universitário da região. Além da Feira Mercado, também desenvolvemos outros eventos para ajudar graduandos a conhecerem mais esse cenário e a se prepararem para o mercado de trabalho, promovendo capacitação e divulgação de informações."
                    url="img18"
                />

                <CardExtras 
                    title="iTeam USP São Carlos" 
                    text="Entidade destinada a promover a internacionalização na USP São Carlos. Para tanto, faz a recepção dos intercambistas estrangeiros que vêm para São Carlos e os ajuda a se aclimatar mais facilmente à chegada ao Brasil, por meio de programas como o Housing e Buddy Program. O iTeam USP São Carlos também realiza eventos em que incentiva os estudantes a buscarem experiências internacionais, seja por meio de intercâmbios ou outros meios."
                    url="img15"
                />

                <CardExtras 
                    title="Projeto Semente" 
                    text="O Projeto Semente visa o aprendizado com tecnologia para crianças em condições de vulnerabilidade social, por meio de aulas de robótica e empreendedorismo. Junto com o Projeto Pequeno Cidadão, incentivamos o gosto pela ciência e a inserção dos jovens no mundo das inovações!"
                    url="img19"
                />

                <CardExtras 
                    title="RAIA" 
                    text={<>Temos o prazer de anunciar a fundação da RAIA, uma organização sem fins lucrativos com um propósito ambicioso: ajudar a tornar o Brasil um protagonista no campo da Inteligência Artificial (IA). Nosso grupo de extensão atua na formação de membros em competências técnicas de Inteligência Artificial e Liderança, por meio do desenvolvimento de Projetos de Impacto com IA e atividades que envolvem a comunidade externa — como organização de hackathons, seminários, conferências e iniciativas educacionais. Conheça mais sobre nosso trabalho: Acesse nosso <LinkSocial target="_blank" href="https://grupo-raia.org/">Site</LinkSocial></>}
                    url="img1"
                />

                <CardExtras 
                    title="TOPUS Projetos Aeroespaciais" 
                    text="O TOPUS é um grupo extracurricular que projeta e constrói foguetes, realiza pesquisas relacionadas ao assunto, organiza eventos sociais e participa de competições. Prezamos pela expansão do setor aeroespacial brasileiro e pelos positivos impactos sociais que podemos causar na sociedade a nossa volta por meio de integração e distribuição dos nossos conhecimentos.A utilização das placas de Arduíno embarcadas no foguete requer uma equipe preparada e disposta a aprender sempre. Esse ano estamos com projetos maiores que demandam mais sensores e programações mais complexas. Portanto, alunos que gostem de impressão de circuitos, programação ou foguetes em geral são bem vindos no nosso Processo seletivo! Para acompanhar o PS, siga nossa página no facebook"
                    url="img20"
                />

                <CardExtras 
                    title="Tupã" 
                    text={<>Fundada em 2012, a Equipe EESC/USP Tupã é uma equipe de fórmula estudantil que projeta e constrói carros elétricos de corrida visando competir na Fórmula SAE, maior competição estudantil do mundo. Visando ser exemplo de desempenho e precursores na mobilidade limpa, nos apresentamos como uma oportunidade para os alunos da USP de desenvolver habilidades como trabalho em equipe, organização, gestão, administração e liderança. Além disso a aprendizagem de conhecimentos técnicos como manufatura, desenho e simulação em softwares 3D, usinagem, seleção de materiais, montagem de circuitos eletrônicos e programação. Gostou? Venha fazer história e trabalhar com o Tupã. Para nos conhecer melhor, acesse nosso <LinkSocial target="_blank" href="https://www.facebook.com/usptupa/">Facebook</LinkSocial> </>}
                    url="img21"
                />

                <CardExtras 
                    title="Warthog Robotics" 
                    text="O Warthog Robotics é um grupo de pesquisa, desenvolvimento e extensão em Robótica Móvel da USP - São Carlos. Formado por cerca de 140 alunos de graduação e pós-graduação de diversos cursos do campus. As atividades desenvolvidas englobam áreas como: Eletrônica Embarcada, Mecânica, Materiais, Software, Visão Computacional, Inteligência Artificial, Gerenciamento de Projetos, Gestão de Pessoas, Marketing, entre outras. Aplicamos nossos projetos em competições de futebol de robôs, robôs assistenciais e combate de robôs, obtendo grandes resultados!"
                    url="img22"
                />

                <CardExtras 
                    title="Women in Tech - WiT" 
                    text="Diante da alta evasão de mulheres em cursos os quais são minoria, a maior parte deles ligados à tecnologia, o Women in Tech tem como objetivo realizar eventos, reuniões e debates com a finalidade de discutir a falta de representatividade feminina nas áreas de ciência e tecnologia, assim como incentivar mais mulheres a ingressarem na área."
                    url="img23"
                />

                <CardExtras 
                    title="Yanagi Taiko" 
                    text="O Yanagi Taiko é um grupo de São Carlos dedicado à prática da arte milenar do taiko (tambores japoneses), que envolve, além das batidas ritmadas nos tambores, movimentos corporais e a utilização de instrumentos e acessórios que levam o sentimento e a história que a música se propõe a passar aos espectadores. O Yanagi Taiko proporciona a prática do Taiko através de treinos de música e condicionamento físico, num ambiente onde se preza a amizade e o crescimento enquanto tocadores e enquanto pessoas."
                    url="img24"
                />

                <CardExtras 
                    title="Zenith Aerospace" 
                    text="O Zenith EESC-USP é um grupo extracurricular da Escola de Engenharia de São Carlos fundado no ano de 2014, com o objetivo de desenvolver e difundir tecnologias existentes no setor aeroespacial nacional. Formado por alunos de diversos cursos do campus da USP São Carlos, a equipe do Zenith utiliza do seu encanto pelo espaço para desenvolver pesquisas, produtos e serviços voltados para esta área."
                    url="img25"
                />
            </Container>
        </ContentSection>
    )
}

export default CardExtraScreen;