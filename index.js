const net = require("net");

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
      lines.slice(1).forEach((line) => {
        if (line === "") {
          return;
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

      const res = [
        "HTTP/1.1 200 OK",
        "Content-Type: text/plain",
        "Content-Length: 12",
        "", //end of headers
        "Hello World!", //body
      ].join("\r\n");

      if (path === "/") {
        var body = "<h1>Welcome Home!</h1>";
      } else if (path === "/about") {
        var body = "<h1>About Us Page</h1>";
      } else {
        var body = "<h1>Page Not Found</h1>";
      }
      const bodyLength = body.length;
      let resHTML = [
        "HTTP/1.1 200 OK",
        "Content-Type: text/html",
        `Content-Length: ${bodyLength}`,
      ];
      //connection status header
      if (
        headers.Connection &&
        headers.Connection.toLowerCase() === "keep-alive"
      ) {
        resHTML.push("Connection: keep-alive");
      } else {
        resHTML.push("Connection: close");
      }
      resHTML.push("");
      resHTML.push(body);
      resHTML = resHTML.join("\r\n");
      socket.write(resHTML);
      if (
        !headers.Connection ||
        headers.Connection.toLowerCase() !== "keep-alive"
      ) {
        socket.end();
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
