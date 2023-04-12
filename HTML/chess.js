// define the chessboard
var board = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["",  "",  "",  "",  "",  "",  "",  "" ],
    ["",  "",  "",  "",  "",  "",  "",  "" ],
    ["",  "",  "",  "",  "",  "",  "",  "" ],
    ["",  "",  "",  "",  "",  "",  "",  "" ],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"]
  ];
  
  // define variables for game state
  var currentPlayer = "white";
  var selectedPiece = null;
  var moves = [];
  
  // initialize the game
  function init() {
    drawBoard();
    updateStatus();
  }
  
  // draw the board
  function drawBoard() {
    var canvas = document.getElementById("chessboard");
    var ctx = canvas.getContext("2d");
    var squareSize = canvas.width / 8;
  
    // draw the board
    for (var row = 0; row < 8; row++) {
      for (var col = 0; col < 8; col++) {
        if ((row + col) % 2 === 0) {
          ctx.fillStyle = "#fff";
        } else {
          ctx.fillStyle = "#999";
        }
        ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
  
        // draw the piece
        var piece = board[row][col];
        if (piece !== "") {
          var img = new Image();
          img.src = "pieces/" + piece + ".png";
          img.onload = function() {
            ctx.drawImage(img, col * squareSize, row * squareSize, squareSize, squareSize);
          };
        }
      }
    }
  }
  
  // handle user clicks
  function handleClick(event) {
    var canvas = document.getElementById("chessboard");
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var row = Math.floor(y / (canvas.height / 8));
    var col = Math.floor(x / (canvas.width / 8));
  
    if (selectedPiece === null) {
      // select a piece
      if (board[row][col] !== "" && board[row][col].charAt(0) === currentPlayer.charAt(0)) {
        selectedPiece = { row: row, col: col };
        moves = getLegalMoves(row, col);
        highlightSquares(moves);
      }
    } else {
      // move the piece
      if (moves.some(move => move.row === row && move.col === col)) {
        board[row][col] =
        board[selectedPiece.row][selectedPiece.col] = "";
        board[row][col] = currentPlayer.charAt(0).toUpperCase() + selectedPiece.piece;
  
        // check for pawn promotion
        if (board[row][col] === "WP" && row === 0) {
          board[row][col] = "WQ";
        } else if (board[row][col] === "BP" && row === 7) {
          board[row][col] = "BQ";
        }
  
        // switch player
        currentPlayer = currentPlayer === "white" ? "black" : "white";
        selectedPiece = null;
        moves = [];
        drawBoard();
        updateStatus();
      } else {
        selectedPiece = null;
        moves = [];
        drawBoard();
        updateStatus();
      }
    }
  }
  
  // get legal moves for a piece
  function getLegalMoves(row, col) {
    var piece = board[row][col];
    var moves = [];
  
    switch (piece.charAt(1)) {
      case "P":
        // pawn moves
        if (piece.charAt(0) === "W") {
          if (board[row - 1][col] === "") {
            moves.push({ row: row - 1, col: col });
          }
          if (row === 6 && board[row - 1][col] === "" && board[row - 2][col] === "") {
            moves.push({ row: row - 2, col: col });
          }
          if (col > 0 && board[row - 1][col - 1].charAt(0) === "B") {
            moves.push({ row: row - 1, col: col - 1 });
          }
          if (col < 7 && board[row - 1][col + 1].charAt(0) === "B") {
            moves.push({ row: row - 1, col: col + 1 });
          }
        } else {
          if (board[row + 1][col] === "") {
            moves.push({ row: row + 1, col: col });
          }
          if (row === 1 && board[row + 1][col] === "" && board[row + 2][col] === "") {
            moves.push({ row: row + 2, col: col });
          }
          if (col > 0 && board[row + 1][col - 1].charAt(0) === "W") {
            moves.push({ row: row + 1, col: col - 1 });
          }
          if (col < 7 && board[row + 1][col + 1].charAt(0) === "W") {
            moves.push({ row: row + 1, col: col + 1 });
          }
        }
        break;
  
      case "R":
        // rook moves
        for (var i = row + 1; i < 8; i++) {
          if (board[i][col] === "") {
            moves.push({ row: i, col: col });
          } else if (board[i][col].charAt(0) !== piece.charAt(0)) {
            moves.push({ row: i, col: col });
            break;
          } else {
            break;
          }
        }
        for (var i = row - 1; i >= 0; i--) {
          if (board[i][col] === "") {
            moves.push({ row: i, col: col });
          } else if (board[i][col].charAt(0)) {
            moves.push({ row: row, col: col + 1 });
          }
          if (col > 0 && row > 0 && board[row - 1][col - 1].charAt(0) !== piece.charAt(0)) {
            moves.push({ row: row - 1, col: col - 1 });
          }
          if (col < 7 && row > 0 && board[row - 1][col + 1].charAt(0) !== piece.charAt(0)) {
            moves.push({ row: row - 1, col: col + 1 });
          }
          if (col > 0 && row < 7 && board[row + 1][col - 1].charAt(0) !== piece.charAt(0)) {
            moves.push({ row: row + 1, col: col - 1 });
          }
          if (col < 7 && row < 7 && board[row + 1][col + 1].charAt(0) !== piece.charAt(0)) {
            moves.push({ row: row + 1, col: col + 1 });
          }
          break;
        }
        case "K":
          // king moves
          if (row > 0 && board[row - 1][col].charAt(0) !== piece.charAt(0)) {
            moves.push({ row: row - 1, col: col });
          }
          if (row < 7 && board[row + 1][col].charAt(0) !== piece.charAt(0)) {
            moves.push({ row: row + 1, col: col });
          }
          if (col > 0 && board[row][col - 1].charAt(0) !== piece.charAt(0)) {
            moves.push({ row: row, col: col - 1 });
          }
          if (col < 7 && board[row][col + 1].charAt(0) !== piece.charAt(0)) {
            moves.push({ row: row, col: col + 1 });
          }
          if (row > 0 && col > 0 && board[row - 1][col - 1].charAt(0) !== piece.charAt(0)) {
            moves.push({ row: row - 1, col: col - 1 });
          }
          if (row < 7 && col > 0 && board[row + 1][col - 1].charAt(0) !== piece.charAt(0)) {
            moves.push({ row: row + 1, col: col - 1 });
          }
          if (row > 0 && col < 7 && board[row - 1][col + 1].charAt(0) !== piece.charAt(0)) {
            moves.push({ row: row - 1, col: col + 1 });
          }
          if (row < 7 && col < 7 && board[row + 1][col + 1].charAt(0) !== piece.charAt(0)) {
            moves.push({ row: row + 1, col: col + 1 });
          }
          break;
    
        case "Q":
          // queen moves
          for (var i = row + 1; i < 8; i++) {
            if (board[i][col] === "") {
              moves.push({ row: i, col: col });
            } else if (board[i][col].charAt(0) !== piece.charAt(0)) {
              moves.push({ row: i, col: col });
              break;
            } else {
              break;
            }
            for (var i = row - 1; i >= 0; i--) {
              if (board[i][col] === "") {
                moves.push({ row: i, col: col });
              } else if (board[i][col].charAt(0) !== piece.charAt(0)) {
                moves.push({ row: i, col: col });
                break;
              } else {
                break;
              }
            }
            for (var i = col + 1; i < 8; i++) {
              if (board[row][i] === "") {
                moves.push({ row: row, col: i });
              } else if (board[row][i].charAt(0) !== piece.charAt(0)) {
                moves.push({ row: row, col: i });
                break;
              } else {
                break;
              }
            }
            for (var i = col - 1; i >= 0; i--) {
              if (board[row][i] === "") {
                moves.push({ row: row, col: i });
              } else if (board[row][i].charAt(0) !== piece.charAt(0)) {
                moves.push({ row: row, col: i });
                break;
              } else {
                break;
              }
            }
            for (var i = row + 1, j = col + 1; i < 8 && j < 8; i++, j++) {
              if (board[i][j] === "") {
                moves.push({ row: i, col: j });
              } else if (board[i][j].charAt(0) !== piece.charAt(0)) {
                moves.push({ row: i, col: j });
                break;
              } else {
                break;
              }
            }
            for (var i = row - 1, j = col + 1; i >= 0 && j < 8; i--, j++) {
              if (board[i][j] === "") {
                moves.push({ row: i, col: j });
              } else if (board[i][j].charAt(0) !== piece.charAt(0)) {
                moves.push({ row: i, col: j });
                break;
              } else {
                break;
              }
            }
            for (var i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
              if (board[i][j] === "") {
                moves.push({ row: i, col: j });
              } else if (board[i][j].charAt(0) !== piece.charAt(0)) {
                moves.push({ row: i, col: j });
                break;
              } else {
                break;
              }
            }
            for (var i = row + 1, j = col - 1; i < 8 && j >= 0; i++, j--) {
              if (board[i][j] === "") {
                moves.push({ row: i, col: j });
              } else if (board[i][j].charAt(0) !== piece.charAt(0)) {
                moves.push({ row: i, col: j });
                break;
              } else {
                break;
              }
            }
            break;
          default:

            break;
        }
        return moves;
      }
      
    
    