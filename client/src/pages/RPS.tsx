import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RoundSelector } from '../components/Set_Rounds';
import { Score } from '../components/Score';
import { RevealScore } from '../components/Reveal_score';
import { PlayerTurn } from '../components/Player_choice';

// import { useAuth } from '../context/AuthContext'; todo

const RPS = () => {
    // const navigate = useNavigate();

    // // todo: navigate buttons handling


    const [rounds,setRounds]= useState(1);
    const [rounds_played,setRounds_played]= useState(0);
    const [rounds_selector, setRounds_selector]=useState("flex");
    const [play_page, setPlay_page]=useState("hidden");
    const [game_over, setGame_over]=useState("hidden");
    const [selected_round_number,setSelected_round_number]=useState(0);
    const [bot_choice, setBot_choice] = useState(-1);
    const [player_choice, setPlayer_choice] = useState(-1);
    const [bot_value, setBot_value] = useState(0);
    const [player_value, setPlayer_value] = useState(0);
    const [draw_score,setDraw_score]=useState(0);
    const [player_result,setPlayer_result]=useState<string>("");
    const [bot_result,setBot_result]=useState<string>("");
    const [player_result_text,setPlayer_result_text]=useState<string>("not taken yet");
    const [bot_result_text,setBot_result_text]=useState<string>("not taken yet");
    


    return (
        <div className="bg-[#F1EFEC] flex justify-center items-center flex-col h-screen">
            <h1 className="text-2xl text-dark-blue"><b>Rock Paper Scissor</b></h1>
            <div id="play-page" className={`${play_page} justify-center items-center flex-col h-screen w-full`}>
                <Score 
                    bot_choice={bot_choice}
                    setBot_choice={setBot_choice}
                    player_choice={player_choice}
                    setPlayer_choice={setPlayer_choice}
                    bot_value={bot_value}
                    setBot_value={setBot_value}
                    player_value={player_value}
                    setPlayer_value={setPlayer_value}
                    rounds_played={rounds_played}
                    setRounds_played={setRounds_played}
                    selected_round_number={selected_round_number}
                    game_over={game_over}
                    setGame_over={setGame_over}
                    draw_score={draw_score}
                    setDraw_score={setDraw_score}
                />
                <PlayerTurn 
                    setPlayer_choice={setPlayer_choice}
                    setBot_choice={setBot_choice}
                    player_result={player_result}
                    setPlayer_result={setPlayer_result} 
                    bot_result={bot_result}
                    setBot_result={setBot_result}
                    player_result_text={player_result_text}
                    setPlayer_result_text={setPlayer_result_text}
                    bot_result_text={bot_result_text}
                    setBot_result_text={setBot_result_text}
                />
            
            </div>
            <RoundSelector
                rounds={rounds}
                setRounds={setRounds}
                rounds_selector={rounds_selector}
                setRounds_selector={setRounds_selector}
                play_page={play_page}
                setPlay_page={setPlay_page}
                selected_round_number={selected_round_number.toString()}
                setSelected_round_number={(val) => setSelected_round_number(Number(val))}
            />
            <RevealScore
                bot_choice={bot_choice}
                player_choice={player_choice}
                bot_value={bot_value}
                player_value={player_value}
                rounds_played={rounds_played}
                selected_round_number={selected_round_number}
                game_over={game_over}
                setGame_over={setGame_over}
                setPlay_page={setPlay_page}
                setBot_choice={setBot_choice}
                setPlayer_choice={setPlayer_choice}
                setBot_value={setBot_value}
                setPlayer_value={setPlayer_value}
                setRounds_played={setRounds_played}
                setSelected_round_number={setSelected_round_number}
                setRounds_selector={setRounds_selector}
                setRounds={setRounds}
                draw_score={draw_score}
                setDraw_score={setDraw_score}
                player_result={player_result}
                setPlayer_result={setPlayer_result} 
                bot_result={bot_result}
                setBot_result={setBot_result}
                player_result_text={player_result_text}
                setPlayer_result_text={setPlayer_result_text}
                bot_result_text={bot_result_text}
                setBot_result_text={setBot_result_text}
            />
            
        </div>
    )

}

export default RPS;