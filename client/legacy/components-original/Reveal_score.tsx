import * as React from "react"
import { useEffect, useState } from 'react';
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils"
import { PlayAgain } from '@/components/Play_again';


type revealscore_props = {
    bot_choice : number
    player_choice : number
    bot_value : number
    player_value : number
    rounds_played : number
    selected_round_number : number
    game_over: string
    setGame_over: (i:string)=> void 
    setPlay_page: (i:string)=> void 
    setBot_choice: (i:number)=> void 
    setPlayer_choice: (i:number)=> void 
    setBot_value: (i:number)=> void 
    setPlayer_value: (i:number)=> void 
    setRounds_played: (i:number)=> void 
    setSelected_round_number: (i:number)=> void 
    setRounds_selector: (i:string)=> void 
    setRounds: (i:number)=> void 
    draw_score: number
    setDraw_score:(i:number)=> void 
    player_result: string
    setPlayer_result: (i:string)=> void 
    bot_result: string
    setBot_result: (i:string)=> void 
    player_result_text: string
    setPlayer_result_text: (i:string)=> void 
    bot_result_text: string
    setBot_result_text: (i:string)=> void 

}


const RevealScore:React.FC<revealscore_props>= ({setSelected_round_number,setRounds_played,setPlayer_value,setBot_value,setPlayer_choice,setBot_choice,bot_choice ,player_choice,bot_value ,player_value,rounds_played ,selected_round_number,game_over,setGame_over,setPlay_page,setRounds_selector,setRounds,draw_score,setDraw_score,player_result,setPlayer_result,bot_result,setBot_result,player_result_text,setPlayer_result_text,bot_result_text,setBot_result_text})=>{
    const [win,setWin]=useState("hidden");
    const [lose,setLose]=useState("hidden");
    const [draw,setDraw]=useState("hidden");
    const [playerwin,setPlayerWin]=useState(0);
    const [playerlose,setPlayerLose]=useState(0);
    const [botwin,setBotWin]=useState(0);
    const [botlose,setBotLose]=useState(0);
    
    useEffect(()=>{
        
        if(selected_round_number == rounds_played && rounds_played!=0){
            setGame_over("flex");
        if(player_value>bot_value){
            setWin("flex");
        }
        else if(player_value<bot_value){
            setLose("flex");
        }
        else{
            setDraw("flex");
        }
        setPlayerWin(player_value);
        setBotWin(bot_value);
        setPlay_page("hidden");
    
    }},[selected_round_number , rounds_played]);

    function start_again(){       
    setRounds_played(0);
    setBot_value(0);
    setBot_choice(-1);
    setPlayer_value(0);
    setPlayer_choice(-1);
    setSelected_round_number(0);
    setWin("hidden");
    setLose("hidden");
    setDraw("hidden");
    setGame_over("hidden");
    setRounds_selector("flex");
    setSelected_round_number(0);
    setRounds(1);
    setDraw_score(0);
    setPlayer_result("");
    setBot_result("");
    setPlayer_result_text("not taken yet");
    setBot_result_text("not taken yet");
    }
    
    return(
        <>
        <div id="game-over" className={` bg-[#D4C9BE] p-[12px] m-[12px] rounded-md max-w-[500px] w-[90%] ${game_over} justify-center items-center flex-col`}>
            <div id="win" className={`text-green-900 text-[20px] ${win}`}>
                <h3><b>You Win</b></h3>
            </div>
            <div id="lose" className={`text-red-900 text-[20px] ${lose}`}>
                <h3><b>You Lose</b></h3>
            </div>
            <div id="draw" className={`text-blue-900 text-[20px] ${draw}`}>
                <h3><b>Draw</b></h3>
            </div>
            <div id="result" className="bg-[#FBF8EF] w-[90%] h-[90%] rounded-md m-[16px] p-[8px] flex justify-center gap-[50px] items-center flex-wrap">
                <div id="player-result">
                    <h4><b>player result:</b></h4>
                    <p>number of wins: {playerwin}</p>
                </div>
                <div id="bot-result">
                    <h4><b>bot result:</b></h4>
                    <p>number of wins: {botwin}</p>
                </div>
            </div>
            <div className="bg-[#FBF8EF] w-[90%] h-[90%] rounded-md mx-[16px] mb-[16px] p-[8px] flex justify-center gap-[50px] items-center flex-wrap">
                <p>number of rounds with a tie: {draw_score}</p>
            </div>
            <div>
                <Button onClick={start_again} id="play-again"  className="bg-[#1F5A98] m-[8px] p-[8px] items-center justify-center hover:bg-[#123458] cursor-pointer rounded-md">
                    play again
                </Button>
                
            </div>
        </div>

        </>
        
    )
}

export {RevealScore , type revealscore_props}