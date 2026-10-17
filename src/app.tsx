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

function solvedDefault() {
    return Array.from({ length: 16 }).map((_, i) => (i === 15 ? null : i + 1));
}

const isDebug =
    typeof location !== "undefined" && new URLSearchParams(location.search).has("debug");

export function App() {
    const [grid, setGrid] = useState(randomizedDefault());
    const [startTime, setStartTime] = useState(Date.now());
    const [hasStarted, setHasStarted] = useState(false);
    const [currentTimer, setCurrentTimer] = useState(0);
    const [clearTimeString, setClearTimeString] = useState<string | null>(null);
    useEffect(() => {
        const isComplete = grid.every((v, i) => {
            if (v === null) return i === 15;
            return v === i + 1;
        });
        if (isComplete) {
            const seconds = (Date.now() - startTime) / 1000;
            const minutes = Math.floor(seconds / 60);
            setClearTimeString(`${minutes}:${Math.floor((1000 * seconds) % 60) / 1000}`);
            setHasStarted(false);
        }
    }, [grid]);
    useEffect(() => {
        if (!hasStarted) return;
        const interval = setInterval(() => {
            setCurrentTimer(Math.floor(Date.now() - startTime) / 1000);
        }, 20);
        return () => clearInterval(interval);
    }, [hasStarted]);
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <div className="flex flex-col justify-center items-center mb-4">
                    <button
                        onClick={() => {
                            setGrid(randomizedDefault());
                            setHasStarted(false);
                            setClearTimeString(null);
                        }}
                        className="text-2xl bg-gray-500 text-white p-2 rounded-md shadow-md w-[20vw] md:w-[10vw] mb-2"
                    >
                        Reset
                    </button>
                    {isDebug && (
                        <button
                            onClick={() => setGrid(solvedDefault())}
                            className="text-2xl bg-red-500 text-white p-2 rounded-md shadow-md w-[20vw] md:w-[10vw] mb-2"
                        >
                            Solve now
                        </button>
                    )}
                    <p className="text-2xl p-0">Time: {hasStarted ? currentTimer : 0}</p>
                </div>
                <div className="relative">
                    {clearTimeString && (
                        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center">
                            <div className="rounded-md bg-gray-200 p-2">
                                <p className="text-3xl font-bold text-gray-800">You won!</p>
                                <p className="text-xl text-gray-800">
                                    Your clear time is {clearTimeString}!
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-rows-4 grid-cols-4 gap-2 md:gap-4">
                        {grid.map((k, i) => (
                            <Card
                                key={i}
                                visible={k !== null}
                                onClick={() => {
                                    if (clearTimeString) return;
                                    const index = grid.findIndex((v) => v === k);
                                    const nullIndex = grid.findIndex((v) => v === null);
                                    const row = Math.floor(index / 4);
                                    const col = index % 4;
                                    const nullRow = Math.floor(nullIndex / 4);
                                    const nullCol = nullIndex % 4;
                                    const isAdjacent =
                                        (row === nullRow && Math.abs(col - nullCol) === 1) ||
                                        (col === nullCol && Math.abs(row - nullRow) === 1);
                                    if (isAdjacent) {
                                        if (!hasStarted) {
                                            setStartTime(Date.now());
                                            setHasStarted(true);
                                            setClearTimeString(null);
                                        }
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
