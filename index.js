const net = require("net");
const { routes, sendRes, sendErr } = require("./routes.js");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");

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
      const [method, rawPath] = lines[0].split(" ");
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
      console.log(method);
      console.log(rawPath);
      console.log(headers);

      // Extract query parameters
      const [pathname, queryStr] = rawPath.split("?");
      let queryParams = {};
      // if (queryStr) {
      //   queryStr.split("&").forEach((part) => {
      //     const [k, v] = part.split("=");
      //     queryParams[k] = decodeURIComponent(v);
      //   });
      // }
      queryParams = querystring.parse(queryStr);

      console.log("Path:", pathname);
      console.log("Query Params:", queryParams);

      //              RESPONSE

      //check if static files are served
      const filePath = pathname === "/" ? "/index.html" : pathname;
      const absolutePath = path.join(__dirname, "public", filePath);

      //serve static files if there
      if (
        method === "GET" &&
        fs.existsSync(absolutePath) &&
        fs.statSync(absolutePath).isFile()
      ) {
        const extension = path.extname(absolutePath);
        const content_type = getContentType(extension);
        const body = fs.readFileSync(absolutePath);
        sendRes(socket, 200, content_type, body);
      } else {
        handleRoutes(
          socket,
          method,
          pathname,
          headers,
          lines,
          bodyIndex,
          queryParams,
        );
      }

      if (
        !headers.Connection ||
        headers.Connection.toLowerCase() !== "keep-alive"
      ) {
        socket.end();
      }
    } catch (e) {
      sendErr(socket, 500, "text/plain", "Internal Server Error");
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

const handleRoutes = (
  socket,
  method,
  pathname,
  headers,
  lines,
  bodyIndex,
  queryParams,
) => {
  let reqBody = "";
  if (method === "POST" || method === "PUT") {
    reqBody = lines.slice(bodyIndex).join("\r\n");
    const content_type = headers["Content-Type"];

    if (content_type === "application/json") {
      reqBody = JSON.parse(reqBody);
    } else if (content_type === "application/x-www-form-urlencoded") {
      reqBody = querystring.parse(reqBody);
    }
  }

  //route logic
  if (routes[method] && routes[method][pathname]) {
    routes[method][pathname](socket, headers, reqBody, queryParams);
  } else {
    sendErr(socket, 404, "text/html", "<h1>404 Not Found</h1>");
  }
};

function getContentType(ext) {
  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
  };
  return mimeTypes[ext] || "text/plain";
}
