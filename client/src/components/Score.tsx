import * as React from "react"
import { useEffect, useState } from 'react';
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils"

type score_props = {
    bot_choice : number
    setBot_choice : (i:number)=> void 
    player_choice : number
    setPlayer_choice : (i:number)=> void 
    bot_value : number
    setBot_value : (i:number)=> void 
    player_value : number
    setPlayer_value : (i:number)=> void 
    rounds_played : number
    setRounds_played : (i:number)=> void 
    selected_round_number : number
    game_over: string
    setGame_over: (i:string)=> void 
    draw_score: number
    setDraw_score: (i:number)=> void 
}


const Score:React.FC<score_props>= ({bot_choice ,setBot_choice ,player_choice, setPlayer_choice, bot_value ,setBot_value ,player_value, setPlayer_value, rounds_played ,setRounds_played,selected_round_number,game_over,setGame_over,draw_score,setDraw_score})=>{

    
    useEffect(()=>{
        if(Math.abs(bot_choice - player_choice) == 1){
            if(bot_choice > player_choice){
                setBot_value(bot_value+1);
                setRounds_played(rounds_played+1);
                console.log("b")
            }
            else{
                setPlayer_value(player_value+1);
                setRounds_played(rounds_played+1);
                console.log("p")
            }
        }else{
            if(bot_choice > player_choice){
                setPlayer_value(player_value+1);
                setRounds_played(rounds_played+1);
                console.log("p")
            }
            else if (bot_choice < player_choice){
                setBot_value(bot_value+1);
                setRounds_played(rounds_played+1);
                console.log("b")
            }
            else {
                if(player_choice!=-1&&bot_choice!=-1){
                    setDraw_score(draw_score+1);
                    setRounds_played(rounds_played+1);
                }
            }
        }
        setBot_choice(-1);
        setPlayer_choice(-1);
    
    
    },[bot_choice , player_choice]);
    
    return(
        <>
        <div id="rounds" className=" bg-[#D4C9BE] p-[12px] m-[12px] w-[240px] w-full flex justify-center items-center flex-col">
            <div className="flex justify-center items-center">
                <h2 className="text-blue-900 text-[20px]"><b>Total rounds :</b></h2>
                <b><h2 id="selected-round-number" className="text-blue-900 text-[20px]">{selected_round_number}</h2></b>
            </div>
            <div className="flex justify-center items-center">
                <h3> rounds played :</h3>
                <h3 id="rounds-played">{rounds_played} </h3>
            </div>
            </div>
            <div id="score-board" className=" bg-[#D4C9BE] p-[12px] m-[12px] w-full flex items-center justify-center">
            <div id="score-box" className="flex flex-wrap justify-center items-center w-[80%]">
                <div id="player" className="flex flex-col justify-center items-center bg-[#123458] p-[12px] m-[12px] rounded-md w-[40%] h-[120px] min-w-[120px] text-[white]">
                    <img id="player-img"/> 
                    <p className="text-[11px]">player (you)</p>
                    <p className="text-[11px]">score:</p>
                    <p id="player-value" className="text-[11px]">{player_value}</p>
                </div>
                <div id="bot" className="flex flex-col justify-center items-center bg-[#123458] p-[12px] m-[12px] rounded-md w-[40%] h-[120px] min-w-[120px] text-[white]">
                    <img id="bot-img"/>
                    <p className="text-[11px]">bot</p>
                    <p className="text-[11px]">score:</p>
                    <p id="bot-value" className="text-[11px]">{bot_value}</p>
                </div>
            </div>
        </div>
        </>
        
    )
}

export {Score , type score_props}