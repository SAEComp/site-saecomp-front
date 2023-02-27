import styled from "styled-components";
import dark from "../../themes/dark";

export const Container = styled.div`
    background:${dark.text};
    color:${dark.background};
    padding-top: 10vh;
    padding-bottom: 10vw;
    h1{
        margin-bottom:2.5rem;
        color:#003CC5;

        font-size:2rem;
    }
`;
export const WhatIsDiv = styled.div`
    
   

    margin-left: 10rem;
    max-width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    @media(max-width: 1080px){
      margin: 0 auto;
      max-width: 80%;
    }
`;

export const Grid = styled.div`
    max-height: 100vh;
    display:grid;
    grid-template-columns:1fr  1fr;
    grid-gap:1.25rem;
    position: relative;
    @media(max-width: 1080px){
            
            grid-template-columns:none;
            grid-gap:none;
            display: flex;
            flex-direction: column;
            align-items: center;
            .svg-logo{
                height: 100%;
            }
     
        }

    >div{

        >p{    
            max-width: 80vw;
            color: #545454;
            font-size: 1.5rem;
            font-family: "Oxygen";
            margin-bottom: 1.2vw;
            @media (max-width: 1080px) {
            font-size: 1rem;
            }  
        }

        >div {
            display:flex;
            justify-content:center;
            align-items: center;

            >button{
            width:17.5rem;
            height:3rem;

            font-size:1rem;
        }
        
        
    }

    .svg-logo{
        max-width:30vw;
    }
}
`;