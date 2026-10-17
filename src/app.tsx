import { useEffect, useState } from "preact/hooks";

function isPossible(grid: (number | null)[]) {
    let can = true;
    if ([1, 3, 4, 6, 9, 11, 12, 14].includes(grid.findIndex((v) => v === 16))) can = false;
    for (let i = 0; i < 16; i++) {
        let num = grid.indexOf(i + 1);
        if (num === i) continue;
        grid[num] = grid[i];
        grid[i] = i + 1;
        can = !can;
    }
    return can;
}

function randomizedDefault() {
    const grid = Array.from({ length: 16 }).map((_, i) => i + 1);
    const shuffled = grid.sort(() => Math.random() - 0.5);
    if (!isPossible([...shuffled])) {
        const one = shuffled.indexOf(1);
        const two = shuffled.indexOf(2);
        const temp = shuffled[one];
        shuffled[one] = shuffled[two];
        shuffled[two] = temp;
    }
    return shuffled.map((v) => {
        if (v === 16) return null;
        return v;
    });
}

export function App() {
    const [grid, setGrid] = useState(randomizedDefault());
    const [startTime, setStartTime] = useState(Date.now());
    const [isStarted, setIsStarted] = useState(false);
    const [currentTimer, setCurrentTimer] = useState(0);
    useEffect(() => {
        const isComplete = grid.every((v, i) => {
            if (v === null) return i === 15;
            return v === i + 1;
        });
        if (isComplete) {
            let seconds = (Date.now() - startTime) / 1000;
            let minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;
            alert(`You won! Your clear time is ${minutes}:${seconds}!`);
            setGrid(randomizedDefault());
            setIsStarted(false);
        }
    }, [grid]);
    useEffect(() => {
        if (!isStarted) return;
        const interval = setInterval(() => {
            setCurrentTimer((Date.now() - startTime) / 1000);
        }, 20);
        return () => clearInterval(interval);
    }, [isStarted]);
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <div className="flex flex-col justify-center items-center mb-4">
                    <button
                        onClick={() => {
                            setGrid(randomizedDefault());
                            setIsStarted(false);
                        }}
                        className="text-2xl bg-gray-500 text-white p-2 rounded-md shadow-md w-[20vw] md:w-[10vw] mb-2"
                    >
                        Reset
                    </button>
                    {isStarted ? (
                        <p className="text-2xl p-0">Time: {currentTimer}</p>
                    ) : (
                        <p className="text-2xl p-0">Time: 0</p>
                    )}
                </div>
                <div className="grid grid-rows-4 grid-cols-4 gap-2 md:gap-4">
                    {grid.map((k, i) => (
                        <Card
                            key={i}
                            visible={k !== null}
                            onClick={() => {
                                if (!isStarted) {
                                    setStartTime(Date.now());
                                    setIsStarted(true);
                                }
                                const index = grid.findIndex((v) => v === k);
                                const nullIndex = grid.findIndex((v) => v === null);
                                if (
                                    index === nullIndex - 1 ||
                                    index === nullIndex + 1 ||
                                    index === nullIndex - 4 ||
                                    index === nullIndex + 4
                                ) {
                                    const newGrid = [...grid];
                                    newGrid[index] = null;
                                    newGrid[nullIndex] = k;
                                    setGrid(newGrid);
                                }
                            }}
                        >
                            {k}
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

function Card({
    children,
    visible,
    onClick,
}: {
    children: number | null;
    visible: boolean;
    onClick?: () => void;
}) {
    return (
        <>
            <div
                className={`w-22.5 h-22.5 md:w-37.5 md:h-37.5 mx-auto ${
                    visible ? "rounded-md shadow-md overflow-hidden bg-gray-500" : "bg-white"
                } flex justify-center items-center`}
                onClick={onClick}
            >
                {visible && <p className="text-3xl md:text-6xl text-white">{children}</p>}
            </div>
        </>
    );
}
