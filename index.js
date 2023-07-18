import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.set("views", "./views");

app.use(express.static('public'));

// Generate a random 6-digit code
function generateCode() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

app.get('/', (req, res) => {
  const iconValue = "menuIcons";
  res.render('index', { iconValue });
});

app.get('/createGame', (req, res) => {
  const iconValue = "ingameIcons";

  // Generate a code for the game lobby
  const gameCode = generateCode();

  res.render('createGame', { iconValue, gameCode, players: [] });
});

app.get('/findGame', (req, res) => {
  const iconValue = "ingameIcons";
  res.render('findGame', { iconValue });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Application available on: http://localhost:${port}`);
});