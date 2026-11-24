import * as React from "react"
import { Button } from '@/components/ui/button';
type round_props = {
    rounds: number
    setRounds: (i: number)=> void
    rounds_selector: string
    setRounds_selector: (i: string)=> void
    play_page: string 
    setPlay_page: (i: string)=> void
    selected_round_number:string
    setSelected_round_number: (i: string)=> void
}



const RoundSelector:React.FC<round_props>=({rounds , setRounds , rounds_selector , setRounds_selector , setPlay_page, setSelected_round_number}) =>{
    const handling_inputvalue = (input: React.ChangeEvent<HTMLInputElement>):void =>{
        setRounds(Number(input.target.value));
    }
    const round_to_play_page = ()=>{
        setPlay_page("flex");
        setRounds_selector("hidden");
        setSelected_round_number(String(rounds));
    }
    


return(
            <div id="rounds-selector" className={`bg-[#D4C9BE] ${rounds_selector} justify-between items-center flex-col p-[12px] m-[12px] rounded-md`}>
            <p>How many rounds should this game have?</p>
            <input type="number" id="rounds-number" value={rounds} onChange={handling_inputvalue} min ="1" className="bg-[#FBF8EF] rounded-md m-[8px]"/>
            <Button onClick={round_to_play_page} id="round-Button" className="bg-[#1F5A98] m-[8px] px-[8px] items-center justify-center hover:bg-[#123458] cursor-pointer rounded-md">save</Button>

            </div>
)
}

export {RoundSelector , type round_props}
