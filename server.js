const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = false;
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("message", (msg) => {
      console.log("Pesan dari client > " + msg);
    });
    socket.on("typing", (sender, target) => {
      // console.log("typing message dari " + sender + " ke " + target);
      socket.broadcast.emit("typingFromServer", sender, target);
    });
    socket.on("blurType", (sender, target) => {
      // console.log(`${sender} sudah ga typing ke ${target}`);
      socket.broadcast.emit("blurTypeFromServer", sender, target);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
