import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "./styles.css";

const SNAKE_SIZE_INIT = 100;
const SNAKE_JUMP = 5;
const SNAKE_HEAD_SIZE = 10;

interface SnakeSize {
  id: string;
  leftPosition: number;
  rightPosition: number;
  topPosition: number;
  isRotate: boolean;
}

interface DeafultGameSettings {
  sankeSizeArray: SnakeSize[];
  score: number;
  clickCounter: number;
  boardSize: string;
}

const deafultGameSettings: DeafultGameSettings = {
  sankeSizeArray: Array.from("x".repeat(SNAKE_SIZE_INIT)).map(
    (item, index) => ({
      id: `${item}-${index}`,
      leftPosition: index,
      rightPosition: 0,
      topPosition: 0,
      isRotate: false
    })
  ),
  score: 0,
  clickCounter: 0,
  boardSize: "35x35"
};

const Board = styled.div`
  border: 5px solid red;
  padding: 5px;

  position: relative;
  width: 350px;
  height: 350px;
`;

const SnakeBox = styled.div`
  background: green;
  width: 1px;
  height: 5px;

  position: absolute;
  right: ${({ rightPosition }) => rightPosition}px;
  top: ${({ topPosition }) => topPosition}px;
  left: ${({ leftPosition }) => leftPosition}px;
  transform: ${({ isRotate }) => isRotate && `rotate(91deg)`};
  transform-origin: center;
`;

const SnakeContainer = styled.div`
  width: ${SNAKE_SIZE_INIT}px;
  position: relative;
`;

const rotateSnakeBox = (snakeArray: SnakeSize[], headSize: number) => {
  const snakeHeadIndex = snakeArray.length - headSize;
  const newSnakeSizeArray = snakeArray.map((item, index) => {
    const isIndexHead = index >= snakeHeadIndex;
    return {
      ...item,
      topPosition: isIndexHead ? snakeArray.length - index : item.topPosition,
      leftPosition: isIndexHead
        ? snakeArray[snakeHeadIndex - 1].leftPosition
        : item.leftPosition,
      isRotate: isIndexHead
    };
  });
  return newSnakeSizeArray;
};

export default function App() {
  const [gameSettings, setGameSettings] = useState(deafultGameSettings);
  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowRight": {
        return setGameSettings((prevState) => {
          const { sankeSizeArray } = prevState;
          const newSnakeSizeArray = sankeSizeArray.map((item) => ({
            ...item,
            leftPosition: item.leftPosition + SNAKE_JUMP
          }));
          return {
            ...prevState,
            sankeSizeArray: newSnakeSizeArray
          };
        });
      }
      case "ArrowLeft": {
        return setGameSettings((prevState) => {
          const { sankeSizeArray } = prevState;
          const newSnakeSizeArray = sankeSizeArray.map((item, index) => ({
            ...item,
            leftPosition: item.leftPosition - SNAKE_JUMP
          }));
          return {
            ...prevState,
            sankeSizeArray: newSnakeSizeArray
          };
        });
      }
      case "ArrowDown": {
        return setGameSettings((prevState) => {
          const newSnakeSizeArray = rotateSnakeBox(
            prevState.sankeSizeArray,
            SNAKE_HEAD_SIZE + prevState.clickCounter
          );
          return {
            ...prevState,
            sankeSizeArray: newSnakeSizeArray,
            clickCounter: prevState.clickCounter++
          };
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="App">
      <Board>
        <SnakeContainer>
          {gameSettings.sankeSizeArray.map((snake, index) => {
            return (
              <SnakeBox
                key={snake.id}
                rightPosition={snake.rightPosition}
                leftPosition={snake.leftPosition}
                topPosition={snake.topPosition}
                isRotate={snake.isRotate}
              />
            );
          })}
        </SnakeContainer>
      </Board>
    </div>
  );
}
