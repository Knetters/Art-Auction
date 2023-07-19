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
app.use(cookieParser()); // Add cookie-parser middleware

// Lobby storage
const lobbies = {};

// Generate a random 6-digit code for the lobby
function generateCode() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

app.get('/setRole/:role', (req, res) => {
  const role = req.params.role;
  res.cookie('playerRole', role); // Set a cookie with the player role
  res.send(); // Send a response to indicate success
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

app.get('/lobby/:lobbyCode', (req, res) => {
  const iconValue = "ingameIcons";
  const lobbyCode = req.params.lobbyCode;

  if (lobbies[lobbyCode]) {
    const players = lobbies[lobbyCode].players;
    const playerRole = req.cookies.playerRole; // Retrieve the player's role from the session cookie

    res.render('lobby', { iconValue, gameCode: lobbyCode, players, playerRole }); // Pass the playerRole to the lobby.ejs template
  } else {
    res.send('Lobby not found');
  }
});

io.on('connection', (socket) => {
  socket.on('joinLobby', (data) => {
    const { playerId, playerRole, playerName, lobbyCode } = data;
  
    // Check if the lobby exists
    if (lobbies[lobbyCode]) {
      // Add the player to the lobby
      const player = { id: playerId, role: playerRole, name: playerName };
      lobbies[lobbyCode].players.push(player);

      console.log(player)

      // Join the socket to the lobby room
      socket.join(lobbyCode);

      // Set the player role in the socket's session
      socket.emit('setRole', playerRole);

      // Notify all clients in the lobby about the updated player list
      io.to(lobbyCode).emit('playerListUpdate', lobbies[lobbyCode].players);

      // Redirect the player to the lobby
      socket.emit('lobbyRedirect', { lobbyCode });

    } else {
      // Lobby does not exist, handle error
      socket.emit('lobbyNotFoundError');
    }
  });

  socket.on('disconnecting', () => {
    // Remove the player from the lobby when they disconnect
    const rooms = Object.keys(socket.rooms);
    rooms.forEach(room => {
      if (lobbies[room]) {
        lobbies[room].players = lobbies[room].players.filter(player => player.socketId !== socket.id);
        io.to(room).emit('playerListUpdate', lobbies[room].players);
      }
    });
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Application available on: http://localhost:${port}`);
});