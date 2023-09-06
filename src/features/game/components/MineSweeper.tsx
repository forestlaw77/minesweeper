import { useState } from "react";
import { Box, Button, VStack, Image, Text } from "@chakra-ui/react";
import GameBoard from "./GameBoard";

/**
 * The MineSweeper component is the entry point for the Mine Sweeper game.
 * It controls the start and end of the game.
 */
const MineSweeper = () => {
  // State to manage the game's start status
  const [gameStart, setGameStart] = useState(false);

  // Handler when the Start button is clicked
  const handleClick = () => {
    setGameStart(true);
  };

  /**
   * The StartScreen component renders the start screen of the game.
   * It provides the player with the option to start the game.
   */
  const StartScreen = () => {
    return (
      <VStack align="center">
        <Image
          borderRadius="full"
          boxSize="375px"
          src="./jigenbakudan_kaitai_bougo.png"
          alt="Mine Sweeper"
        />
        <Text fontWeight="bold" fontSize="x-large">
          Mine Sweeper
        </Text>
        <Button onClick={handleClick}>Start</Button>
      </VStack>
    );
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
      {/* Toggle display based on whether the game has started */}
      {gameStart ? <GameBoard /> : <StartScreen />}
    </Box>
  );
};

export default MineSweeper;
