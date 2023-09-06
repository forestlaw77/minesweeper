import { useEffect, useState } from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import {
  BsEmojiDizzyFill,
  BsEmojiSunglassesFill,
  BsEmojiSmileFill,
} from "react-icons/bs";

/**
 * Props for the MinesCounter component.
 */
interface MinesCounterProps {
  mines: number /**< The total number of mines. */;
  handleClick: () => void /**< Callback function for button click. */;
  isGameStart: boolean /**< Indicates if the game has started. */;
  isGameOver: boolean /**< Indicates if the game is over. */;
  isGameWon: boolean /**< Indicates if the game is won. */;
}

/**
 * The MinesCounter component displays game-related information such as
 * the number of mines, game status, and elapsed time.
 */
const MinesCounter: React.FC<MinesCounterProps> = ({
  mines,
  handleClick,
  isGameStart,
  isGameOver,
  isGameWon,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: number | null = null;

    /**
     * Start the timer when the game is in progress and clear it when
     * the game is over or won.
     */
    if (!isGameOver && !isGameWon && isGameStart) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    /**
     * Clean up the timer when the component unmounts or when game conditions change.
     */
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isGameStart, isGameOver, isGameWon]);

  useEffect(() => {
    /**
     * Reset the elapsed time when the game starts.
     */
    !isGameStart && setElapsedTime(0);
  }, [isGameStart]);

  return (
    <HStack>
      <Box
        top="8px"
        width="80px"
        height="40px"
        margin="auto"
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="#1b1b1b"
        color="red"
        fontSize="43px"
        borderWidth="2px"
        borderColor="#d4d4d4 #3e3e3e #3e3e3e #d4d4d4"
      >
        {mines.toString().padStart(3, "0")}
      </Box>
      <Button onClick={handleClick} bgColor="black">
        {isGameOver ? (
          <BsEmojiDizzyFill size="2em" color="orange" />
        ) : isGameWon ? (
          <BsEmojiSunglassesFill size="2em" background="black" color="orange" />
        ) : (
          <BsEmojiSmileFill size="2em" background="black" color="orange" />
        )}
      </Button>
      <Box
        top="8px"
        width="80px"
        height="40px"
        margin="auto"
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="#1b1b1b"
        color="red"
        fontSize="43px"
        borderWidth="2px"
        borderColor="#d4d4d4 #3e3e3e #3e3e3e #d4d4d4"
      >
        {elapsedTime > 999 ? 999 : elapsedTime.toString().padStart(3, "0")}
      </Box>
    </HStack>
  );
};

export default MinesCounter;
