import React, { useEffect, type Dispatch, type SetStateAction } from 'react';

type TimerProps = {
    time: number;
    setTime: Dispatch<SetStateAction<number>>;
    isRunning: boolean;
};

export const Timer: React.FC<TimerProps> = ({ time, setTime, isRunning }) => {
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, setTime]);

    return (
        <div>
            Time: {Math.floor(time / 60)}:{time % 60 < 10 ? '0' : ''}{time % 60}
        </div>
    );
};