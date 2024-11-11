const net = require("net");
const { routes, sendRes, sendErr } = require("./routes.js");

const port = 8080;
const server = net.createServer((socket) => {
  console.log("Client Connected");
  //everytime a client connects, its meta data for connection is fetched
  socket.on("data", (data) => {
    try {
      //              REQUEST
      const req = data.toString();
      //splitting the req by newline escape character
      const lines = req.split("\r\n");
      //the first line of lines sends us the method and path of the req.
      const [method, path, httpVersion] = lines[0].split(" ");
      //fetch the headers
      const headers = {};
      let bodyIndex = 0;
      lines.slice(1).forEach((line, index) => {
        if (line === "") {
          bodyIndex = index + 2; // Line after the blank line is the start of the body
        }
        const [key, value] = line.split(": ");
        if (key && value) {
          headers[key] = value;
        }
      });
      console.log(lines);
      console.log(method);
      console.log(path);
      console.log(httpVersion);
      console.log(headers);

      //              RESPONSE
      let reqBody = "";
      if (method === "POST") {
        reqBody = lines.slice(bodyIndex).join("\r\n");
        const jsonBody = JSON.parse(reqBody);
        console.log(reqBody);
        console.log(jsonBody);

        if (routes[method] && routes[method][path]) {
          routes[method][path](socket);
        }

        if (
          !headers.Connection ||
          headers.Connection.toLowerCase() !== "keep-alive"
        ) {
          socket.end();
        }
      }
    } catch (e) {
      console.log(e);
      socket.end();
    }
  });

  socket.on("error", (err) => {
    console.log("Error: ", err);
  });

  socket.on("end", () => {
    console.log("Client Disconnnected");
  });
});

server.listen(port, "localhost", () => {
  console.log(`listening to port ${port}`);
});
