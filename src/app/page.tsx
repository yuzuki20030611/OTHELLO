"use client";

import React, { useState, useEffect } from "react";

// 型定義（TypeScriptの型安全性のため）
type CellState = "black" | "white" | null; // マスの状態
type Board = CellState[][]; // ボード全体の型
type Player = "black" | "white"; // プレイヤーの型
type Position = [number, number]; // 位置の型

// ボードのサイズを定数で定義（変更しやすい）
const BOARD_SIZE = 6;

// ボードの初期状態を作成する関数
const createInitialBoard = (): Board => {
  // 6x6の空のボードを作成（nullで初期化）
  const board: Board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  // 中央に初期配置（6x6なので2,3の位置）
  board[2][2] = "white"; // 白石
  board[2][3] = "black"; // 黒石
  board[3][2] = "black"; // 黒石
  board[3][3] = "white"; // 白石

  return board;
};

export default function SimpleOthello() {
  // ゲームの状態を管理するstate
  const [board, setBoard] = useState<Board>(createInitialBoard); // ボードの状態
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true); // プレイヤーのターンかどうか
  const [playerScore, setPlayerScore] = useState<number>(2); // プレイヤーのスコア
  const [aiScore, setAiScore] = useState<number>(2); // AIのスコア

  // スコアを計算する関数
  const calculateScore = (
    board: Board
  ): { playerCount: number; aiCount: number } => {
    let playerCount = 0; // プレイヤー（黒）の石の数
    let aiCount = 0; // AI（白）の石の数

    // ボード全体をチェックして石の数を数える
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === "black") playerCount++;
        if (board[i][j] === "white") aiCount++;
      }
    }

    return { playerCount, aiCount };
  };

  // 石をひっくり返すことができるかチェックし、実際にひっくり返す関数
  const flipStones = (
    board: Board,
    row: number,
    col: number,
    player: Player
  ): Position[] => {
    const opponent: Player = player === "black" ? "white" : "black"; // 相手の色を決定

    // 8方向をチェック（上下左右と斜め4方向）
    const directions: Position[] = [
      [-1, -1],
      [-1, 0],
      [-1, 1], // 上の3方向
      [0, -1],
      [0, 1], // 左と右
      [1, -1],
      [1, 0],
      [1, 1], // 下の3方向
    ];

    let allFlipped: Position[] = []; // ひっくり返す石の位置を保存

    // 8方向それぞれをチェック
    directions.forEach(([deltaRow, deltaCol]) => {
      let flippedInThisDirection: Position[] = []; // この方向でひっくり返せる石
      let currentRow = row + deltaRow; // 次にチェックする行
      let currentCol = col + deltaCol; // 次にチェックする列

      // 盤面の範囲内で、相手の石が続く限りチェック
      while (
        currentRow >= 0 &&
        currentRow < BOARD_SIZE && // 行が範囲内
        currentCol >= 0 &&
        currentCol < BOARD_SIZE && // 列が範囲内
        board[currentRow][currentCol] === opponent // 相手の石がある
      ) {
        // 相手の石の位置を記録
        flippedInThisDirection.push([currentRow, currentCol]);
        currentRow += deltaRow; // さらに次の位置へ
        currentCol += deltaCol;
      }

      // この方向の最後に自分の石があるかチェック
      if (
        currentRow >= 0 &&
        currentRow < BOARD_SIZE && // 範囲内で
        currentCol >= 0 &&
        currentCol < BOARD_SIZE &&
        board[currentRow][currentCol] === player && // 自分の石があり
        flippedInThisDirection.length > 0 // 間に相手の石がある
      ) {
        // この方向の石をひっくり返し対象に追加
        allFlipped = allFlipped.concat(flippedInThisDirection);
      }
    });

    return allFlipped; // ひっくり返す石の位置を返す
  };

  // 有効な手（石を置ける場所）かどうかをチェック
  const isValidMove = (
    board: Board,
    row: number,
    col: number,
    player: Player
  ): boolean => {
    // すでに石が置かれている場合は無効
    if (board[row][col] !== null) return false;

    // 石をひっくり返せるかチェック
    const flipped = flipStones(board, row, col, player);
    return flipped.length > 0; // ひっくり返せる石があれば有効
  };

  // 石を置く処理（プレイヤーとAI共通）
  const makeMove = (row: number, col: number, player: Player): boolean => {
    // ボードをコピー（元のボードを変更しないため）
    const newBoard: Board = board.map((row) => [...row]);

    // ひっくり返す石の位置を取得
    const flippedStones = flipStones(newBoard, row, col, player);

    // 有効な手でない場合は何もしない
    if (flippedStones.length === 0) return false;

    // 新しい石を置く
    newBoard[row][col] = player;

    // ひっくり返す石を実際に変更
    flippedStones.forEach(([flipRow, flipCol]) => {
      newBoard[flipRow][flipCol] = player;
    });

    // ボードを更新
    setBoard(newBoard);

    // スコアを計算して更新
    const { playerCount, aiCount } = calculateScore(newBoard);
    setPlayerScore(playerCount);
    setAiScore(aiCount);

    return true; // 成功
  };

  // AI（コンピューター）の手を決定する処理
  const aiMove = (): void => {
    const availableMoves: Position[] = []; // AIが置ける場所のリスト

    // ボード全体をチェックして、AIが置ける場所を探す
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (isValidMove(board, i, j, "white")) {
          availableMoves.push([i, j]); // 置ける場所をリストに追加
        }
      }
    }

    // 置ける場所がある場合
    if (availableMoves.length > 0) {
      // ランダムに1つ選択（簡単なAI）
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      const [row, col] = availableMoves[randomIndex];

      // 少し遅延を入れてAIが考えているように見せる
      setTimeout(() => {
        makeMove(row, col, "white");
        setIsPlayerTurn(true); // プレイヤーのターンに戻す
      }, 1000); // 1秒後に実行
    } else {
      // AIが置ける場所がない場合、プレイヤーのターンに戻す
      setIsPlayerTurn(true);
    }
  };

  // プレイヤーのターンが終わったときにAIを動かす
  useEffect(() => {
    if (!isPlayerTurn) {
      aiMove();
    }
  }, [isPlayerTurn]); // isPlayerTurnが変わったときに実行

  // プレイヤーが石を置く処理
  const handlePlayerMove = (row: number, col: number): void => {
    // プレイヤーのターンでない場合は何もしない
    if (!isPlayerTurn) return;

    // 石を置く
    const success = makeMove(row, col, "black");

    // 成功した場合、AIのターンに変更
    if (success) {
      setIsPlayerTurn(false);
    }
  };

  // ゲームをリセットする関数
  const resetGame = (): void => {
    setBoard(createInitialBoard());
    setIsPlayerTurn(true);
    setPlayerScore(2);
    setAiScore(2);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
        {/* タイトル */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          シンプルオセロ（6×6）🔴⚫
        </h1>

        {/* ゲーム情報 */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">
            {isPlayerTurn ? "🔴 あなたのターン（黒）" : "⚪ AIのターン（白）"}
          </div>

          {/* スコア表示 */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-lg font-bold">🔴 あなた</div>
              <div className="text-2xl font-bold text-black">{playerScore}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">⚪ AI</div>
              <div className="text-2xl font-bold text-gray-600">{aiScore}</div>
            </div>
          </div>
        </div>

        {/* ゲーム盤 */}
        <div className="grid grid-cols-6 gap-1 bg-green-800 p-3 rounded-lg mb-4 mx-auto w-fit">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handlePlayerMove(rowIndex, colIndex)}
                disabled={!isPlayerTurn}
                className={`
                  w-12 h-12 bg-green-600 border border-green-700 rounded
                  flex items-center justify-center
                  hover:bg-green-500 transition-colors
                  ${
                    isValidMove(board, rowIndex, colIndex, "black") &&
                    isPlayerTurn
                      ? "ring-2 ring-yellow-400"
                      : ""
                  }
                  ${!isPlayerTurn ? "cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {/* 石の表示 */}
                {cell === "black" && (
                  <div className="w-10 h-10 bg-black rounded-full shadow-md"></div>
                )}
                {cell === "white" && (
                  <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full shadow-md"></div>
                )}
                {/* 置ける場所のヒント */}
                {cell === null &&
                  isValidMove(board, rowIndex, colIndex, "black") &&
                  isPlayerTurn && (
                    <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-50"></div>
                  )}
              </button>
            ))
          )}
        </div>

        {/* 勝敗判定 */}
        {playerScore + aiScore === BOARD_SIZE * BOARD_SIZE && (
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ゲーム終了！
            </h2>
            <p className="text-xl font-semibold">
              {playerScore > aiScore
                ? "🎉 あなたの勝利！"
                : playerScore < aiScore
                  ? "😅 AIの勝利！"
                  : "🤝 引き分け！"}
            </p>
          </div>
        )}

        {/* リセットボタン */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            新しいゲーム
          </button>
        </div>

        {/* 遊び方説明 */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold text-lg mb-2">🎮 遊び方</h3>
          <ul className="text-sm space-y-1">
            <li>• 黄色い丸が表示された場所に石を置けます</li>
            <li>• 相手の石を挟むと、挟まれた石があなたの色に変わります</li>
            <li>• AIは1秒後に自動で手を打ちます</li>
            <li>• すべてのマスが埋まったら、石の多い方が勝利！</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
