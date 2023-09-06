import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import MineSweeper from "./features/game/components/MineSweeper";

const theme = {
  config: {
    initialColorMode: "dard",
    useSystemColorMode: false,
  },
  /**
   * Custom color theme for Chakra UI.
   */
  colors: {
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
};

// Render the MineSweeper component inside the ChakraProvider with the custom theme.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={extendTheme(theme)}>
      <MineSweeper />
    </ChakraProvider>
  </React.StrictMode>
);

/*
 * main
 *  |
 *  +-- MineSweeper
 *       |
 *       +-- StartScreen
 *       |
 *       +-- GameBoard
 *            |
 *            +-- MinesCounter
 *            |
 *            +-- MainBoard(Cell)
 *            |
 *            +-- MessageBoard
 */
