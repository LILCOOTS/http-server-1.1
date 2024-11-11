const routes = {
  GET: {
    "/": (socket) => {
      sendRes(socket, 200, "text/html", "<h1>Welcome Home!</h1>");
    },
    "/about": (socket) => {
      sendRes(socket, 200, "text/html", "<h1>About Us Page</h1>");
    },
  },
  POST: {
    "/submit": (socket, headers, body) => {
      const res =
        headers["Content-Type"] === "application/json"
          ? `Received JSON: ${body}`
          : `${body}`;
      sendRes(socket, 200, "text/plain", res);
    },
  },
};

const sendRes = (socket, statusCode, contType, body) => {
  let response = [
    `HTTP/1.1 ${statusCode} OK`,
    `Content-Type: ${contType}`,
    `Content-Length: ${body.length}`,
    "",
    body,
  ].join("\r\n");
  socket.write(response);
};

//not found error
const sendErr = (socket, statusCode, contType, body) => {
  let response = [
    `HTTP/1.1 ${statusCode} Not Found`,
    `Content-Type: ${contType}`,
    `Content-Length: ${body.length}`,
    "",
    body,
  ].join("\r\n");
  socket.write(response);
};

module.exports = {
  routes,
  sendRes,
  sendErr,
};
