const net = require("net");

const port = 8080;
const server = net.createServer((socket) => {
  console.log("Client Connected");

  socket.on("data", (data) => {
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
      headers[key] = value;
    });
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

    const resHTML = [
      "HTTP/1.1 200 OK", //status line
      "Content-Type: text/html", //header
      "Content-Length: 21", //header
      "", //end of headers
      "<h1>Hello World!</h1>", //body
    ].join("\r\n");
    socket.write(resHTML);
    socket.end();
  });

  socket.on("end", () => {
    console.log("Client Disconnnected");
  });
});

server.listen(port, "localhost", () => {
  console.log(`listening to port ${port}`);
});
