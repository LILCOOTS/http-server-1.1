const net = require("net");

const port = 8080;
const server = net.createServer((socket) => {
  console.log("Client Connected");
});

server.listen(port, "localhost", () => {
  console.log(`listening to port ${port}`);
});
