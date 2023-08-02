import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.set("views", "./views");

app.use(express.static('public'));
app.use(cookieParser());

// Lobby storage
const lobbies = {};

// Generate a random 6-digit code for the lobby
function generateCode() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

app.get('/setRole/:role', (req, res) => {
  const role = req.params.role;
  res.cookie('playerRole', role);
  res.send();
});

app.get('/getPlayerList/:gameCode', (req, res) => {
  const gameCode = req.params.gameCode;
  if (lobbies[gameCode]) {
    const players = lobbies[gameCode].players;
    res.json({ players });
  } else {
    res.status(404).json({ error: 'Game lobby not found' });
  }
});

app.get('/', (req, res) => {
  const iconValue = "menuIcons";
  res.render('index', { iconValue });
});

app.get('/createGame', (req, res) => {
  const iconValue = "ingameIcons";

  // Generate a unique code for the game lobby
  let gameCode;
  do {
    gameCode = generateCode();
  } while (lobbies[gameCode]);

  // Store the lobby using the generated code
  lobbies[gameCode] = { players: [] };

  res.render('createGame', { iconValue, gameCode, players: [] });
});

app.get('/findGame', (req, res) => {
  const iconValue = "ingameIcons";
  res.render('findGame', { iconValue });
});

app.get('/game/:gameCode', (req, res) => {
  const iconValue = "ingameIcons";
  const gameCode = req.params.gameCode;

  if (lobbies[gameCode]) {
    const players = lobbies[gameCode].players;
    const playerRole = req.cookies.playerRole;

    res.render('game', { iconValue, gameCode, players, playerRole });
  } else {
    res.send('Game lobby not found');
  }
});

app.get('/lobby/:lobbyCode', (req, res) => {
  const iconValue = "ingameIcons";
  const lobbyCode = req.params.lobbyCode;

  if (lobbies[lobbyCode]) {
    const players = lobbies[lobbyCode].players;
    const playerRole = req.cookies.playerRole;

    res.render('lobby', { iconValue, gameCode: lobbyCode, players, playerRole });
  } else {
    res.send('Lobby not found');
  }
});

io.on('connection', (socket) => {
  socket.on('joinLobby', (data) => {
    const { playerId, playerRole, playerName, lobbyCode } = data;

    if (lobbies[lobbyCode]) {
      if (lobbies[lobbyCode].players.length < 8) {
        const player = { id: playerId, role: playerRole, name: playerName };
        lobbies[lobbyCode].players.push(player);

        socket.join(lobbyCode);

        socket.emit('setRole', playerRole);

        socket.emit('lobbyRedirect', { lobbyCode });

        console.log(`playerId: ${playerId} joined lobby: ${lobbyCode}`);
      } else {
        socket.emit('lobbyFullError');
      }
    } else {
      socket.emit('lobbyNotFoundError');
    }
  });

  socket.on('startGame', (lobbyCode) => {
    if (lobbies[lobbyCode]) {
      const gameCode = lobbyCode;
      io.to(lobbyCode).emit('navigateToGame', gameCode);
    }
  });

  socket.on('draw', ({ lobbyCode, lastX, lastY, x, y }) => {
    socket.to(lobbyCode).emit('draw', { lastX, lastY, x, y });
  });

  socket.on('disconnecting', () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach(room => {
      if (lobbies[room]) {
        lobbies[room].players = lobbies[room].players.filter(player => player.id !== socket.id);
      }
    });
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Application available on: http://localhost:${port}`);
});