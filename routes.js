const routes = {
  GET: {
    "/": (socket) => {
      sendRes(socket, 200, "text/html", "<h1>Welcome Home!</h1>");
    },
    "/about": (socket) => {
      sendRes(socket, 200, "text/html", "<h1>About Us Page</h1>");
    },
    "/search": (socket, headers, reqBody, queryParams) => {
      try {
        const query = queryParams.query || "none";
        const limit = queryParams.limit || 5;
        const body = `<h1>Search Query: ${query}, Limit: ${limit}</h1>`;
        sendRes(socket, 200, "text/html", body);
      } catch (e) {
        sendErr(socket, 400, "text/html", "Invalid Search Query");
      }
    },
  },
  POST: {
    "/submit": (socket, headers, body) => {
      try {
        const jsonBody = JSON.parse(body);
        sendRes(
          socket,
          200,
          "application/json",
          JSON.stringify({ msg: "Received", data: jsonBody }),
        );
      } catch (e) {
        sendErr(socket, 400, "text/plain", "Invalid JSON");
      }
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
