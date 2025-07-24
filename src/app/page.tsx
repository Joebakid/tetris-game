"use client"

import type React from "react"
import { WalletConnect } from "@/components/wallet-connect"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pause, Play, RotateCw, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"

// Tetris piece definitions
const PIECES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "#00f0f0",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#f0f000",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#a000f0",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "#00f000",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "#f00000",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#0000f0",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#f0a000",
  },
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const EMPTY_BOARD = Array(BOARD_HEIGHT)
  .fill(null)
  .map(() => Array(BOARD_WIDTH).fill(0))

interface GamePiece {
  shape: number[][]
  color: string
  x: number
  y: number
  type: keyof typeof PIECES
}

interface GameState {
  board: number[][]
  currentPiece: GamePiece | null
  nextPiece: GamePiece | null
  heldPiece: GamePiece | null
  canHold: boolean
  score: number
  level: number
  lines: number
  isPlaying: boolean
  isPaused: boolean
  gameOver: boolean
}

const getRandomPiece = (): keyof typeof PIECES => {
  const pieces = Object.keys(PIECES) as (keyof typeof PIECES)[]
  return pieces[Math.floor(Math.random() * pieces.length)]
}

const createPiece = (type: keyof typeof PIECES): GamePiece => ({
  shape: PIECES[type].shape,
  color: PIECES[type].color,
  x: Math.floor(BOARD_WIDTH / 2) - Math.floor(PIECES[type].shape[0].length / 2),
  y: 0,
  type,
})

const rotatePiece = (piece: GamePiece): GamePiece => {
  const rotated = piece.shape[0].map((_, index) => piece.shape.map((row) => row[index]).reverse())
  return { ...piece, shape: rotated }
}

const isValidPosition = (board: number[][], piece: GamePiece, dx = 0, dy = 0): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = piece.x + x + dx
        const newY = piece.y + y + dy

        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false
        }

        if (newY >= 0 && board[newY][newX]) {
          return false
        }
      }
    }
  }
  return true
}

const placePiece = (board: number[][], piece: GamePiece): number[][] => {
  const newBoard = board.map((row) => [...row])

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.y + y
        const boardX = piece.x + x
        if (boardY >= 0) {
          newBoard[boardY][boardX] = 1
        }
      }
    }
  }

  return newBoard
}

const clearLines = (board: number[][]): { newBoard: number[][]; linesCleared: number } => {
  const newBoard = board.filter((row) => row.some((cell) => cell === 0))
  const linesCleared = BOARD_HEIGHT - newBoard.length

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0))
  }

  return { newBoard, linesCleared }
}

const getGhostPiece = (board: number[][], piece: GamePiece): GamePiece => {
  let ghostY = piece.y
  while (isValidPosition(board, { ...piece, y: ghostY + 1 })) {
    ghostY++
  }
  return { ...piece, y: ghostY }
}

export default function TetrisGame() {
  const [gameState, setGameState] = useState<GameState>({
    board: EMPTY_BOARD,
    currentPiece: null,
    nextPiece: null,
    heldPiece: null,
    canHold: true,
    score: 0,
    level: 1,
    lines: 0,
    isPlaying: false,
    isPaused: false,
    gameOver: false,
  })

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const dropTimeRef = useRef(1000)

  const startGame = useCallback(() => {
    const firstPiece = createPiece(getRandomPiece())
    const nextPiece = createPiece(getRandomPiece())

    setGameState({
      board: EMPTY_BOARD,
      currentPiece: firstPiece,
      nextPiece,
      heldPiece: null,
      canHold: true,
      score: 0,
      level: 1,
      lines: 0,
      isPlaying: true,
      isPaused: false,
      gameOver: false,
    })
  }, [])

  const pauseGame = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }))
  }, [])

  const movePiece = useCallback((dx: number, dy: number) => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isPaused || prev.gameOver) return prev

      if (isValidPosition(prev.board, prev.currentPiece, dx, dy)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            x: prev.currentPiece.x + dx,
            y: prev.currentPiece.y + dy,
          },
        }
      }

      return prev
    })
  }, [])

  const rotatePieceInGame = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isPaused || prev.gameOver) return prev

      const rotated = rotatePiece(prev.currentPiece)

      if (isValidPosition(prev.board, rotated)) {
        return {
          ...prev,
          currentPiece: rotated,
        }
      }

      return prev
    })
  }, [])

  const hardDrop = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isPaused || prev.gameOver) return prev

      const ghost = getGhostPiece(prev.board, prev.currentPiece)
      const dropDistance = ghost.y - prev.currentPiece.y

      return {
        ...prev,
        currentPiece: ghost,
        score: prev.score + dropDistance * 2,
      }
    })
  }, [])

  const holdPiece = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || !prev.canHold || prev.isPaused || prev.gameOver) return prev

      if (prev.heldPiece) {
        const newCurrent = createPiece(prev.heldPiece.type)
        const newHeld = createPiece(prev.currentPiece.type)

        return {
          ...prev,
          currentPiece: newCurrent,
          heldPiece: newHeld,
          canHold: false,
        }
      } else {
        const newHeld = createPiece(prev.currentPiece.type)
        const newCurrent = prev.nextPiece ? createPiece(prev.nextPiece.type) : createPiece(getRandomPiece())
        const newNext = createPiece(getRandomPiece())

        return {
          ...prev,
          currentPiece: newCurrent,
          nextPiece: newNext,
          heldPiece: newHeld,
          canHold: false,
        }
      }
    })
  }, [])

  const dropPiece = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isPaused || prev.gameOver) return prev

      if (isValidPosition(prev.board, prev.currentPiece, 0, 1)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            y: prev.currentPiece.y + 1,
          },
        }
      } else {
        // Place piece and check for game over
        const newBoard = placePiece(prev.board, prev.currentPiece)
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)

        const newLines = prev.lines + linesCleared
        const newLevel = Math.floor(newLines / 10) + 1
        const lineScore = [0, 40, 100, 300, 1200][linesCleared] * newLevel

        const nextPiece = createPiece(getRandomPiece())

        // Check for game over
        if (!isValidPosition(clearedBoard, prev.nextPiece!)) {
          return {
            ...prev,
            board: clearedBoard,
            gameOver: true,
            isPlaying: false,
          }
        }

        return {
          ...prev,
          board: clearedBoard,
          currentPiece: prev.nextPiece,
          nextPiece,
          score: prev.score + lineScore,
          lines: newLines,
          level: newLevel,
          canHold: true,
        }
      }
    })
  }, [])

  // Game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.gameOver) {
      dropTimeRef.current = Math.max(50, 1000 - (gameState.level - 1) * 50)

      gameLoopRef.current = setInterval(() => {
        dropPiece()
      }, dropTimeRef.current)

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current)
        }
      }
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, gameState.level, dropPiece])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default for game keys
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "a", "s", "d", "w", "c", "p"].includes(e.key)) {
        e.preventDefault()
      }

      if (!gameState.isPlaying || gameState.gameOver) return

      switch (e.key.toLowerCase()) {
        case "arrowleft":
        case "a":
          movePiece(-1, 0)
          break
        case "arrowright":
        case "d":
          movePiece(1, 0)
          break
        case "arrowdown":
        case "s":
          movePiece(0, 1)
          break
        case "arrowup":
        case "w":
          rotatePieceInGame()
          break
        case " ":
          hardDrop()
          break
        case "c":
          holdPiece()
          break
        case "p":
          pauseGame()
          break
      }
    }

    // Add both keydown and keyup listeners for better responsiveness
    document.addEventListener("keydown", handleKeyPress)

    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [gameState.isPlaying, gameState.gameOver, movePiece, rotatePieceInGame, hardDrop, holdPiece, pauseGame])

  // Ensure the game can receive keyboard input
  useEffect(() => {
    // Focus the document when the game starts
    if (gameState.isPlaying) {
      document.body.focus()
    }
  }, [gameState.isPlaying])

  const renderBoard = () => {
    const displayBoard = gameState.board.map((row) => [...row])

    // Add current piece to display
    if (gameState.currentPiece) {
      // Add ghost piece
      const ghost = getGhostPiece(gameState.board, gameState.currentPiece)
      for (let y = 0; y < ghost.shape.length; y++) {
        for (let x = 0; x < ghost.shape[y].length; x++) {
          if (ghost.shape[y][x]) {
            const boardY = ghost.y + y
            const boardX = ghost.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              if (!displayBoard[boardY][boardX]) {
                displayBoard[boardY][boardX] = 2 // Ghost piece
              }
            }
          }
        }
      }

      // Add current piece
      for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
        for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
          if (gameState.currentPiece.shape[y][x]) {
            const boardY = gameState.currentPiece.y + y
            const boardX = gameState.currentPiece.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = 3 // Current piece
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 border border-gray-600 ${
              cell === 1
                ? "bg-blue-500"
                : cell === 2
                  ? "bg-gray-400 opacity-30"
                  : cell === 3
                    ? "bg-red-500"
                    : "bg-gray-900"
            }`}
          />
        ))}
      </div>
    ))
  }

  const renderPiece = (piece: GamePiece | null, size = "w-4 h-4") => {
    if (!piece) return null

    return (
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)` }}>
        {piece.shape.flat().map((cell, index) => (
          <div key={index} className={`${size} border border-gray-600 ${cell ? "bg-blue-500" : "bg-gray-900"}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white p-2 sm:p-4 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Add wallet connection */}
        <div className="mb-4">
          <WalletConnect />
        </div>

        <h1 className="text-xl sm:text-4xl font-bold text-center mb-2 sm:mb-8">Advanced Tetris</h1>

        <div className="flex flex-col gap-2 sm:gap-4">
          {/* Mobile Stats Bar */}
          <div className="flex justify-between items-center lg:hidden bg-gray-700 rounded-lg p-2 mx-auto max-w-sm">
            <div className="text-sm font-semibold">Score: {gameState.score.toLocaleString()}</div>
            <div className="flex gap-2">
              {!gameState.isPlaying ? (
                <Button
                  onClick={startGame}
                  size="sm"
                  className="min-w-[80px] touch-manipulation"
                  onTouchStart={(e) => e.preventDefault()}
                >
                  {gameState.gameOver ? "New Game" : "Start"}
                </Button>
              ) : (
                <Button
                  onClick={pauseGame}
                  onTouchStart={pauseGame}
                  size="sm"
                  className="min-w-[80px] touch-manipulation bg-blue-600 hover:bg-blue-700"
                >
                  {gameState.isPaused ? (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 justify-center items-start">
            {/* Left Panel - Hold & Controls (Desktop) */}
            <div className="hidden lg:flex flex-col gap-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">Hold (C)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="w-20 h-20 flex items-center justify-center">{renderPiece(gameState.heldPiece)}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">Controls</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-xs space-y-1">
                  <div>←→: Move</div>
                  <div>↓: Soft Drop</div>
                  <div>↑: Rotate</div>
                  <div>Space: Hard Drop</div>
                  <div>C: Hold</div>
                  <div>P: Pause</div>
                </CardContent>
              </Card>
            </div>

            {/* Game Board */}
            <div className="flex flex-col items-center w-full">
              <div className="bg-gray-900 p-1 sm:p-4 border-2 border-gray-600 mb-1 overflow-visible mx-auto">
                <div className="transform scale-95 sm:scale-100 lg:scale-100 origin-top">{renderBoard()}</div>
              </div>

              {/* Mobile Controls */}
              <div className="lg:hidden w-full max-w-sm mx-auto mt-1">
                {/* Top row - Hold and Rotate */}
                <div className="flex justify-between mb-2">
                  <Button
                    size="sm"
                    onClick={holdPiece}
                    disabled={!gameState.canHold || !gameState.isPlaying}
                    className="px-3 py-2 text-sm touch-manipulation"
                  >
                    Hold
                  </Button>
                  <Button size="sm" onClick={rotatePieceInGame} className="px-4 py-2 touch-manipulation">
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={hardDrop} className="px-3 py-2 text-sm touch-manipulation">
                    Drop
                  </Button>
                </div>

                {/* Movement controls */}
                <div className="flex justify-center items-center gap-2">
                  <Button size="sm" onClick={() => movePiece(-1, 0)} className="px-4 py-3 touch-manipulation">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex flex-col gap-1">
                    <Button size="sm" onClick={() => movePiece(0, 1)} className="px-4 py-2 touch-manipulation">
                      <ArrowDown className="w-5 h-5" />
                    </Button>
                  </div>
                  <Button size="sm" onClick={() => movePiece(1, 0)} className="px-4 py-3 touch-manipulation">
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Panel - Next & Stats (Desktop) */}
            <div className="hidden lg:flex flex-col gap-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">Next</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="w-20 h-20 flex items-center justify-center">{renderPiece(gameState.nextPiece)}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">Stats</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2 text-sm">
                  <div>Score: {gameState.score.toLocaleString()}</div>
                  <div>Level: {gameState.level}</div>
                  <div>Lines: {gameState.lines}</div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                {!gameState.isPlaying ? (
                  <Button onClick={startGame} className="w-full text-lg py-3">
                    {gameState.gameOver ? "🎮 New Game" : "🎮 Start Game"}
                  </Button>
                ) : (
                  <Button onClick={pauseGame} className="w-full">
                    {gameState.isPaused ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Resume Game
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Game
                      </>
                    )}
                  </Button>
                )}

                <Button onClick={holdPiece} disabled={!gameState.canHold || !gameState.isPlaying} className="w-full">
                  Hold Piece (C)
                </Button>
              </div>
            </div>
          </div>
        </div>

        {gameState.gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="bg-gray-800 border-gray-600 w-full max-w-sm">
              <CardContent className="text-center space-y-4 p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-red-400">Game Over!</h2>
                <div className="space-y-2 text-sm sm:text-base">
                  <div>Final Score: {gameState.score.toLocaleString()}</div>
                  <div>Level Reached: {gameState.level}</div>
                  <div>Lines Cleared: {gameState.lines}</div>
                </div>
                <Button onClick={startGame} className="w-full">
                  Play Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {gameState.isPaused && gameState.isPlaying && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="bg-gray-800 border-gray-600 w-full max-w-sm">
              <CardContent className="text-center p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Paused</h2>
                <Button onClick={pauseGame} className="w-full">
                  Resume Game
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
