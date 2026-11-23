import * as React from "react"
import { useEffect, useState } from 'react';
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils"
import rockIcon from "../components/images/rock.svg";
import paperIcon from "../components/images/paper.svg";
import scissorIcon from "../components/images/scissor.svg";
import { Score } from './Score';


type player_props = {
    setPlayer_choice : (i:number)=> void 
    setBot_choice : (i:number)=> void 
    player_result: string
    setPlayer_result: (i:string)=> void 
    bot_result: string
    setBot_result: (i:string)=> void 
    player_result_text: string
    setPlayer_result_text: (i:string)=> void 
    bot_result_text: string
    setBot_result_text: (i:string)=> void 
}


const PlayerTurn:React.FC<player_props>= ({setPlayer_choice,setBot_choice,player_result,setPlayer_result,bot_result,setBot_result,player_result_text,setPlayer_result_text,bot_result_text,setBot_result_text})=>{
    

    const result_of_round = (player_choice:number,bot_choice:number)=>{
        if (player_choice==-1){
            setPlayer_result("");
            setPlayer_result_text("not taken yet");
        }
        if (player_choice==0){
            setPlayer_result(rockIcon);
            setPlayer_result_text("rock");
        }
        if (player_choice==1){
            setPlayer_result(paperIcon);
            setPlayer_result_text("paper");
        }
        if (player_choice==2){
            setPlayer_result(scissorIcon);
            setPlayer_result_text("scissor");
        }

        if (bot_choice==-1){
            setPlayer_result("");
            setPlayer_result_text("not taken yet");
        }
        if (bot_choice==0){
            setBot_result(rockIcon);
            setBot_result_text("rock");
        }
        if (bot_choice==1){
            setBot_result(paperIcon);
            setBot_result_text("paper");
        }
        if (bot_choice==2){
            setBot_result(scissorIcon);
            setBot_result_text("scissor");
        }

    }

    const player_played_r = ()=>{
        setPlayer_choice(0);
        let random_number=Math.floor(Math.random()*3);
        setBot_choice(random_number);
        console.log("p-0");
        console.log("b-",random_number);
        result_of_round(0,random_number);
    }
    const player_played_p = ()=>{
        setPlayer_choice(1);
        let random_number=Math.floor(Math.random()*3);
        setBot_choice(random_number);
        console.log("p-1");
        console.log("b-",random_number);
        result_of_round(1,random_number);
    }
    const player_played_s = ()=>{
        setPlayer_choice(2);
        let random_number=Math.floor(Math.random()*3);
        setBot_choice(random_number);
        console.log("p-2");
        console.log("b-",random_number);
        result_of_round(2,random_number);
    }
    
    return(
        <div className="flex flex-col items-center w-full justify-center">
        <div id="game" className=" bg-[#D4C9BE] p-[12px] m-[12px] flex flex-wrap gap-[8px] items-center w-full justify-center">
            <div className="flex flex-col w-[30%] rounded-md justify-center items-center min-w-[120px]">
                <Button id="rock" onClick={player_played_r} className="w-full flex flex-col justify-center items-center h-[164px] px-[0px]">
                    <img src={rockIcon} className="w-[120px]"/>
                    <p className="flex flex-col w-full py-[8px] bg-[#123458] rounded-b-md justify-end items-center">rock</p>
                </Button>
            </div>
            <div className="flex flex-col w-[30%] rounded-md justify-center items-center min-w-[120px]">
                <Button id="paper" onClick={player_played_p} className="w-full flex flex-col justify-center items-center h-[164px] px-[0px]">
                    <img src={paperIcon} className="w-[120px]"/>
                    <p className="flex flex-col w-full py-[8px] bg-[#123458] rounded-b-md justify-end items-center">paper</p>
                </Button>
            </div>
            <div className="flex flex-col w-[30%] rounded-md justify-center items-center min-w-[120px]">
                <Button id="scissor" onClick={player_played_s} className="w-full flex flex-col justify-center items-center h-[164px] px-[0px]">
                    <img src={scissorIcon} className="w-[120px]"/>
                    <p className="flex flex-col w-full py-[8px] bg-[#123458] rounded-b-md justify-end items-center">scissor</p>
                </Button>
            </div>
        </div>
        <div id="this-round-result" className=" bg-[#D4C9BE] p-[12px] m-[12px] flex flex-wrap gap-[8px] items-center w-full justify-center h-auto">
            <div id="player_chose" className="w-[40%] flex flex-col justify-center items-center h-[164px] px-[0px] bg-primary rounded-md gap-[8px] min-w-[120px] mb-[8px]">
                <div className="w-[120px] h-[120px]">
                    <img src={player_result} className="w-[120px] rotate-90"/>
                </div>
                <p className="flex flex-col w-full text-[white] py-[8px] bg-[#123458] rounded-b-md justify-end items-center">your choice is {player_result_text}</p>
            </div>
            <div id="bot_chose" className="w-[40%] flex flex-col justify-center items-center h-[164px] px-[0px] bg-primary rounded-md gap-[8px] min-w-[120px] mb-[8px]">
                <div className="w-[120px] h-[120px]">
                    <img src={bot_result} className="w-[120px] rotate-270"/>
                </div>
                <p className="flex flex-col w-full text-[white] py-[8px] bg-[#123458] rounded-b-md justify-end items-center">bot choice is {bot_result_text}</p>
            </div>
        </div>
        </div>
        
        
        
    )
}

export {PlayerTurn , type player_props}