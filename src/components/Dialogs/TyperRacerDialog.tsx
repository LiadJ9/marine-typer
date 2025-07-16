import { useEffect, useRef, useState, type ChangeEvent, type FC } from 'react';
import { MOBY_QUOTES } from '../../consts';
import { useFishStore, useSettingsStore } from '../../stores';

enum GameState {
  NotStarted,
  InProgress,
  Finished,
  Loading,
  Failed,
}

interface TyperRacerDialogProps {
  onSuccess: () => void;
}

export const TyperRacerDialog: FC<TyperRacerDialogProps> = ({ onSuccess }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.Loading);
  const [sentence, setSentence] = useState('');
  const [typedValue, setTypedValue] = useState('');
  const [wpm, setWPM] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const textInputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<Date | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const updateWPM = useSettingsStore((s) => s.updateWPM);
  const averageWPM = useSettingsStore((s) => s.averageWPM);
  const setCaughtFish = useFishStore((s) => s.setCaughtFish);
  const caughtFish = useFishStore((s) => s.caughtFish);
  const addFish = useFishStore((s) => s.addFish);

  const fetchQuote = () => {
    const randomQuote =
      MOBY_QUOTES[Math.floor(Math.random() * MOBY_QUOTES.length)];
    setSentence(randomQuote);

    const words = randomQuote.split(' ').length;
    const baseTime = (words / (averageWPM > 0 ? averageWPM : 20)) * 60;
    const calculatedTimeLimit = Math.ceil(baseTime * 1.5);
    setTimeLeft(calculatedTimeLimit);
    setGameState(GameState.NotStarted);
  };

  useEffect(() => {
    fetchQuote();
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameState === GameState.InProgress) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerIntervalRef.current!);
            setGameState(GameState.Failed);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  }, [gameState]);

  const startGame = () => {
    if (gameState === GameState.NotStarted) {
      setGameState(GameState.InProgress);
      startTimeRef.current = new Date();
      textInputRef.current?.focus();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTypedValue(value);

    if (value.trim() === sentence.trim()) {
      endGame();
    }
  };

  const endGame = () => {
    if (startTimeRef.current) {
      const endTime = new Date();
      const timeDifference =
        (endTime.getTime() - startTimeRef.current.getTime()) / 1000;
      const wordCount = sentence.split(' ').length;
      const wordsPerMinute = (wordCount / timeDifference) * 60;
      setWPM(wordsPerMinute.toFixed(2));
      updateWPM(wordsPerMinute);
    }
    setGameState(GameState.Finished);
  };

  const claimPrize = () => {
    if (gameState === GameState.Finished) {
      onSuccess();
      addFish(caughtFish!);
    } else {
      setCaughtFish(null);
    }
  };

  const renderCharacters = () => {
    return sentence.split('').map((char, index) => {
      let className = 'text-gray-500';
      if (index < typedValue.length) {
        className =
          char === typedValue[index]
            ? 'text-green-500'
            : 'text-red-500 bg-red-200';
      }
      if (index === typedValue.length) {
        className = 'border-b-2 border-blue-500 animate-pulse';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className='bg-gray-900 text-white p-2 rounded-lg shadow-xl '>
      <>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl leading-relaxed tracking-wider'>
            Reel it in!
          </h1>
          {gameState === GameState.InProgress && (
            <div className='text-2xl font-bold text-yellow-400'>
              {timeLeft}s
            </div>
          )}
        </div>
        <div
          className='text-xl leading-relaxed tracking-wider p-4 border-2 border-gray-700 rounded-md mb-6 cursor-text'
          onClick={() => textInputRef.current?.focus()}
        >
          {renderCharacters()}
        </div>

        <input
          ref={textInputRef}
          type='text'
          value={typedValue}
          onChange={handleInputChange}
          disabled={gameState !== GameState.InProgress}
          className='bg-gray-800 text-white w-full p-3 rounded-md border-2 border-transparent focus:outline-none focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed'
          placeholder={
            gameState === GameState.NotStarted
              ? "Click 'Start' to begin..."
              : ''
          }
        />

        <div className='mt-6 flex justify-center items-center space-x-4'>
          {gameState === GameState.NotStarted && (
            <button
              onClick={startGame}
              className='bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105'
            >
              Start
            </button>
          )}
          {gameState === GameState.Finished && (
            <button
              onClick={claimPrize}
              className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105'
            >
              Claim Prize
            </button>
          )}
          {gameState === GameState.Failed && (
            <div className='mt-6 text-center'>
              <h2 className='text-3xl font-bold text-red-500'>Time's Up!</h2>
              <p className='text-gray-400'>
                The fish got away. Better luck next time!
              </p>
            </div>
          )}
        </div>

        {wpm && (
          <div className='mt-6 text-center'>
            <h2 className='text-3xl font-bold text-yellow-400'>{wpm} WPM</h2>
            <p className='text-gray-400'>Congratulations! You caught a fish!</p>
          </div>
        )}
      </>
    </div>
  );
};

export default TyperRacerDialog;
