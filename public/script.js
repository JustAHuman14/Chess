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

        pieceElement.classList.add(col.color === "w" ? "white" : "black");

        pieceElement.innerHTML = getPiece(col);
        squareElement.appendChild(pieceElement);
        pieceElement.draggable = col.color == playerRole;
        pieceElement.addEventListener("dragstart", () => {
          sourceSquare = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
        });
        pieceElement.addEventListener("click", () => {
          sourceSquare = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;

          const moves = chess.moves({ square: sourceSquare, verbose: true });
          console.log(sourceSquare);

          for (let move of moves) {
            console.log(move);
          }
        });
      }

      squareElement.addEventListener("dragover", (e) => e.preventDefault());

      squareElement.addEventListener("drop", () => {
        const targetSquare = `${String.fromCharCode(97 + colIndex)}${
          8 - rowIndex
        }`;

        handleMove(sourceSquare, targetSquare);
      });
    });
  });
};

const getPiece = (piece) => {
  const pieces = {
    k: {
      w: `<img alt="klt" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chess_klt45.svg/45px-Chess_klt45.svg.png" decoding="async" width="45" height="45" class="mw-file-element" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chess_klt45.svg/68px-Chess_klt45.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chess_klt45.svg/90px-Chess_klt45.svg.png 2x" data-file-width="45" data-file-height="45" draggable='${
        piece.color == playerRole
      }'>`,
      b: `<img alt="kdt" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/45px-Chess_kdt45.svg.png" decoding="async" width="45" height="45" class="mw-file-element" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/68px-Chess_kdt45.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/90px-Chess_kdt45.svg.png 2x" data-file-width="45" data-file-height="45" draggable='${
        piece.color == playerRole
      }'>`,
    },
    q: {
      w: `<img alt="qlt" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chess_qlt45.svg/45px-Chess_qlt45.svg.png" decoding="async" width="45" height="45" class="mw-file-element" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chess_qlt45.svg/68px-Chess_qlt45.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chess_qlt45.svg/90px-Chess_qlt45.svg.png 2x" data-file-width="45" data-file-height="45" draggable='${
        piece.color == playerRole
      }'>`,
      b: `<img alt="qdt" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chess_qdt45.svg/45px-Chess_qdt45.svg.png" decoding="async" width="45" height="45" class="mw-file-element" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chess_qdt45.svg/68px-Chess_qdt45.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chess_qdt45.svg/90px-Chess_qdt45.svg.png 2x" data-file-width="45" data-file-height="45" draggable='${
        piece.color == playerRole
      }'>`,
    },
    b: {
      w: `<img alt="blt" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/45px-Chess_blt45.svg.png" decoding="async" width="45" height="45" class="mw-file-element" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/68px-Chess_blt45.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/90px-Chess_blt45.svg.png 2x" data-file-width="45" data-file-height="45" draggable='${
        piece.color == playerRole
      }'>`,
      b: `<img alt="bdt" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chess_bdt45.svg/45px-Chess_bdt45.svg.png" decoding="async" width="45" height="45" class="mw-file-element" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chess_bdt45.svg/68px-Chess_bdt45.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chess_bdt45.svg/90px-Chess_bdt45.svg.png 2x" data-file-width="45" data-file-height="45" draggable='${
        piece.color == playerRole
      }' >`,
    },
    n: {
      w: `<img alt="nlt" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/45px-Chess_nlt45.svg.png" decoding="async" width="45" height="45" class="mw-file-element" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/68px-Chess_nlt45.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/90px-Chess_nlt45.svg.png 2x" data-file-width="45" data-file-height="45" draggable='${
        piece.color == playerRole
      }'>`,
      b: `<img alt="ndt" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Chess_ndt45.svg/45px-Chess_ndt45.svg.png" decoding="async" width="45" height="45" class="mw-file-element" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Chess_ndt45.svg/68px-Chess_ndt45.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Chess_ndt45.svg/90px-Chess_ndt45.svg.png 2x" data-file-width="45" data-file-height="45" draggable='${
        piece.color == playerRole
      }'>`,
    },
    r: {
      w: `<img alt="rlt" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/45px-Chess_rlt45.svg.png" decoding="async" width="45" height="45" class="mw-file-element" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/68px-Chess_rlt45.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/90px-Chess_rlt45.svg.png 2x" data-file-width="45" data-file-height="45" draggable='${
        piece.color == playerRole
      }'>`,
      b: `<img alt="rdt" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Chess_rdt45.svg/45px-Chess_rdt45.svg.png" decoding="async" width="45" height="45" class="mw-file-element" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Chess_rdt45.svg/68px-Chess_rdt45.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Chess_rdt45.svg/90px-Chess_rdt45.svg.png 2x" data-file-width="45" data-file-height="45" draggable='${
        piece.color == playerRole
      }'>`,
    },
    p: {
      w: `<img alt="plt" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Chess_plt45.svg/45px-Chess_plt45.svg.png" decoding="async" width="45" height="45" class="mw-file-element" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Chess_plt45.svg/68px-Chess_plt45.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Chess_plt45.svg/90px-Chess_plt45.svg.png 2x" data-file-width="45" data-file-height="45" draggable='${
        piece.color == playerRole
      }'>`,
      b: `<img alt="pdt" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chess_pdt45.svg/45px-Chess_pdt45.svg.png" decoding="async" width="45" height="45" class="mw-file-element" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chess_pdt45.svg/68px-Chess_pdt45.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chess_pdt45.svg/90px-Chess_pdt45.svg.png 2x" data-file-width="45" data-file-height="45"  draggable='${
        piece.color == playerRole
      }'>`,
    },
  };

  return pieces[piece.type][piece.color] || "";
};

const handleMove = (source, target) => {
  const move = {
    from: source,
    to: target,
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
  chess.reset();
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
