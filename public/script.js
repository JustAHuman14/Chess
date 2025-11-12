const socket = io();
const chess = new Chess();
const chessBoard = document.getElementById("chessboard");
const topLetters = document.querySelector(".top-letters");
const leftNumbers = document.querySelector(".left-numbers");
const statusElement = document.querySelector(".status");
let playerRole = null;
let sourceSquare = null;

const renderBoard = () => {
  chessBoard.innerHTML = "";
  const board = chess.board();

  board.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const squareElement = document.createElement("div");

      squareElement.classList.add(
        (colIndex + rowIndex) % 2 === 0 ? "bg-[#eeeed2]" : "bg-[#769656]",
        "flex",
        "justify-center",
        "items-center",
        "text-[38px]",
        playerRole === "b" ? "rotate-180" : "rotate-0"
      );
      chessBoard.appendChild(squareElement);

      if (col) {
        const pieceElement = document.createElement("p");
        pieceElement.innerText = getPiece(col);
        squareElement.appendChild(pieceElement);
        pieceElement.draggable = col.color == playerRole;
        pieceElement.addEventListener("dragstart", () => {
          sourceSquare = {
            col: `${String.fromCharCode(97 + colIndex)}`,
            row: `${8 - rowIndex}`,
          };
        });
      }

      squareElement.draggable = false;

      squareElement.addEventListener("dragover", (e) => e.preventDefault());

      squareElement.addEventListener("drop", () => {
        const targetSquare = {
          col: `${String.fromCharCode(97 + colIndex)}`,
          row: `${8 - rowIndex}`,
        };

        handleMove(sourceSquare, targetSquare);
      });
    });
  });
};

const getPiece = (piece) => {
  const pieces = {
    k: { w: "♔", b: "♚" },
    q: { w: "♕", b: "♛" },
    b: { w: "♗", b: "♝" },
    n: { w: "♘", b: "♞" },
    r: { w: "♖", b: "♜" },
    p: { w: "♙", b: "♟" },
  };

  return pieces[piece.type][piece.color] || "";
};

const handleMove = (source, target) => {
  const move = {
    from: `${source.col}${source.row}`,
    to: `${target.col}${target.row}`,
    promotion: "q",
  };

  socket.emit("move", move);
};

socket.on("playerRole", (role) => {
  playerRole = role;
  chessBoard.classList.add(role === "b" ? "rotate-180" : "rotate-0");

  if (playerRole === "b") {
    topLetters.innerHTML = `<span>h</span><span>g</span><span>f</span><span>e</span><span>d</span><span>c</span><span>b</span><span>a</span>`;
    leftNumbers.innerHTML = `<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>`;
  } else {
    topLetters.innerHTML = `<span>a</span><span>b</span><span>c</span><span>d</span><span>e</span><span>f</span><span>g</span><span>h</span>`;
    leftNumbers.innerHTML = `<span>8</span><span>7</span><span>6</span><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span>`;
  }
  renderBoard();
});

socket.on("move", (move) => {
  chess.move(move);
  renderBoard();
});

socket.on("boardState", (fen) => {
  chess.load(fen);
  renderBoard();
});

socket.on("playerLeft", (winner) => {
  if (winner === "w") {
    alert("Black left the game. White is the winner!");
  } else {
    alert("White left the game. Black is the winner!");
  }
  renderBoard();
});

socket.on("status", (status) => {
  if (status === "finding") {
    statusElement.textContent = "Looking for an opponent...";
  } else if (status === "connected") {
    statusElement.textContent = "Opponent connected!";

    setTimeout(() => {
      statusElement.innerHTML = "";
    }, 2000);

    renderBoard();
  } else {
    statusElement.textContent = "You are spectating the game...";
  }
  console.log(status);
});
