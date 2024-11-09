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
        const homepage = [
          "HTTP/1.1 200 OK",
          "Content-Type: text/html",
          "Content-Length: 26",
          "",
          "<h1>Welcome Home!</h1>",
        ].join("\r\n");
        socket.write(homepage);
      } else if (path === "/about") {
        const aboutPage = [
          "HTTP/1.1 200 OK",
          "Content-Type: text/html",
          "Content-Length: 29",
          "",
          "<h1>About Us Page</h1>",
        ].join("\r\n");
        socket.write(aboutPage);
      } else {
        const notFound = [
          "HTTP/1.1 404 Not Found",
          "Content-Type: text/html",
          "Content-Length: 23",
          "",
          "<h1>Page Not Found</h1>",
        ].join("\r\n");
        socket.write(notFound);
      }
      socket.end();
    } catch (e) {
      console.log(e);
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
