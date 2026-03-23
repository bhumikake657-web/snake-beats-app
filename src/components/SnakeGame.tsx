import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Pause, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  onEvent: (msg: string) => void;
  speed: number;
}

export default function SnakeGame({ onScoreChange, onEvent, speed }: SnakeGameProps) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [powerUp, setPowerUp] = useState<{ x: number, y: number, type: 'SHIELD' | 'SLOW' } | null>(null);
  const [hasShield, setHasShield] = useState(false);
  const [isSlowed, setIsSlowed] = useState(false);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const currentSpeed = isSlowed ? speed * 2 : speed;

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setPowerUp(null);
    setHasShield(false);
    setIsSlowed(false);
    setIsGameOver(false);
    setIsPaused(false);
    onScoreChange(0);
    onEvent('SYSTEM_REBOOT_SUCCESSFUL');
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    let collision = false;
    let ateFood = false;
    let caughtPowerUp = false;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        if (hasShield) {
          collision = false;
          return prevSnake;
        }
        collision = true;
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        ateFood = true;
      } else {
        newSnake.pop();
      }

      // Check power-up collision
      if (powerUp && newHead.x === powerUp.x && newHead.y === powerUp.y) {
        caughtPowerUp = true;
      }

      return newSnake;
    });

    if (collision) {
      if (hasShield) {
        setHasShield(false);
        onEvent('SHIELD_DEPLETED_COLLISION_AVOIDED');
      } else {
        setIsGameOver(true);
        onEvent('CRITICAL_FAILURE_NEURAL_LINK_SEVERED');
      }
    }

    if (ateFood) {
      setFood(generateFood());
      onEvent('DATA_PACKET_ABSORBED');
      if (Math.random() > 0.8 && !powerUp) {
        setPowerUp({ ...generateFood(), type: Math.random() > 0.5 ? 'SHIELD' : 'SLOW' });
        onEvent('ANOMALY_DETECTED_IN_SECTOR');
      }
    }

    if (caughtPowerUp && powerUp) {
      if (powerUp.type === 'SHIELD') {
        setHasShield(true);
        onEvent('INTEGRITY_SHIELD_ACTIVE');
      } else {
        setIsSlowed(true);
        onEvent('TEMPORAL_DILATION_INITIATED');
        setTimeout(() => {
          setIsSlowed(false);
          onEvent('TEMPORAL_DILATION_TERMINATED');
        }, 5000);
      }
      setPowerUp(null);
    }
  }, [direction, food, generateFood, isGameOver, isPaused, hasShield, powerUp, onEvent]);

  useEffect(() => {
    onScoreChange(snake.length - 3);
  }, [snake.length, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => {
            const newState = !prev;
            onEvent(newState ? 'PROCESS_HALTED_BY_USER' : 'PROCESS_RESUMED_BY_USER');
            return newState;
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, currentSpeed);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, currentSpeed]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="w-full flex justify-end mb-2">
        <button
          onClick={() => setIsPaused(prev => {
            const newState = !prev;
            onEvent(newState ? 'PROCESS_HALTED_BY_USER' : 'PROCESS_RESUMED_BY_USER');
            return newState;
          })}
          className="jarring-btn !p-1 !px-2 flex items-center gap-2 text-[10px]"
          title={isPaused ? 'RESUME_PROCESS' : 'HALT_PROCESS'}
        >
          {isPaused ? <Play size={12} /> : <Pause size={12} />}
          <span className="font-pixel">{isPaused ? 'RESUME' : 'PAUSE'}</span>
        </button>
      </div>
      <div 
        className="grid bg-black/80 neon-border rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: '400px',
          height: '400px',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;
          const isPowerUp = powerUp?.x === x && powerUp?.y === y;

          return (
            <div
              key={i}
              className={`w-full h-full border border-cyan/10 transition-all duration-100 ${
                isSnakeHead ? (hasShield ? 'bg-white shadow-[0_0_15px_#ffffff]' : 'bg-cyan shadow-[0_0_10px_#00ffff]') + ' z-20 scale-110' : 
                isSnakeBody ? 'bg-cyan/50 z-10' : 
                isFood ? 'bg-magenta shadow-[0_0_15px_#ff00ff] animate-ping' : 
                isPowerUp ? 'bg-white shadow-[0_0_20px_#ffffff] animate-bounce' : ''
              }`}
            />
          );
        })}
      </div>

      {(isGameOver || isPaused) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md border-4 border-magenta">
          <h2 className={`glitch-text text-3xl mb-8 ${isGameOver ? 'text-magenta' : 'text-cyan'}`} data-text={isGameOver ? 'SYSTEM_CRASH' : 'PROCESS_HALTED'}>
            {isGameOver ? 'SYSTEM_CRASH' : 'PROCESS_HALTED'}
          </h2>
          <button
            onClick={isGameOver ? resetGame : () => {
              setIsPaused(false);
              onEvent('PROCESS_RESUMED_BY_USER');
            }}
            className="jarring-btn"
          >
            {isGameOver ? 'REBOOT_CORE' : 'RESUME_UPLINK'}
          </button>
          <p className="mt-6 text-[8px] font-pixel text-cyan/50 uppercase">
            INPUT_REQUIRED: [ARROWS] // [SPACE]
          </p>
        </div>
      )}
    </div>
  );
}
