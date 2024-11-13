
# Simple HTTP Server 1.1 from Scratch
This project implements a basic HTTP server using Node.js to understand how HTTP works behind the scenes. The server is capable of handling GET and POST requests, parsing headers and query parameters, and serving static files. It is not intended for production use but for educational purposes.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Step-by-Step Guide](#step-by-step-guide)
  - [Step 1: Setting up the Server](#step-1-setting-up-the-server)
  - [Step 2: Handling Requests](#step-2-handling-requests)
  - [Step 3: Dynamic Routing](#step-3-dynamic-routing)
  - [Step 4: Serving Static Files](#step-4-serving-static-files)
  - [Step 5: Handling Query Parameters & POST Data](#step-5-handling-query-parameters--post-data)
- [Example Usage](#example-usage)
- [Conclusion](#conclusion)

---

## Features
- Basic HTTP request handling (GET, POST).
- Query parameters parsing.
- Serving static files (HTML, CSS, JS).
- Handling different content types like `application/json` and `application/x-www-form-urlencoded`.
- Error handling for unknown routes.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your system.

### Installation
Clone this repository:
```bash
git clone https://github.com/yourusername/http-server-1.1.git
cd http-server-1.1
```

### Running the Server
```bash
node index.js
```

The server will start on `localhost:8080`.

---

## Project Structure
```
project-folder/
├── index.js
├── routes.js
└── public/
    ├── index.html
    ├── about.html
    ├── style.css
    └── script.js
```

---

## Step-by-Step Guide

### Step 1: Setting up the Server
Create a TCP server using Node.js' `net` module:
```javascript
const net = require("net");
const port = 8080;

const server = net.createServer((socket) => {
  console.log("Client Connected");
  
  socket.on("data", (data) => {
    // Handle request here
  });

  socket.on("end", () => console.log("Client Disconnected"));
});

server.listen(port, "localhost", () => {
  console.log(`Server is listening on port ${port}`);
});
```

### Step 2: Handling Requests
Parse incoming HTTP requests to extract the method, path, headers, and body.
```javascript
const req = data.toString();
const lines = req.split("\r\n");
const [method, rawPath] = lines[0].split(" ");
const headers = {};
let bodyIndex = 0;

lines.slice(1).forEach((line, index) => {
  if (line === "") bodyIndex = index + 2;
  const [key, value] = line.split(": ");
  if (key && value) headers[key] = value;
});

console.log("Method:", method);
console.log("Path:", rawPath);
console.log("Headers:", headers);
```

### Step 3: Dynamic Routing
Define routes for different paths and methods:
```javascript
const routes = {
  GET: {
    "/": (socket) => sendRes(socket, 200, "text/html", "<h1>Welcome Home!</h1>"),
    "/about": (socket) => sendRes(socket, 200, "text/html", "<h1>About Us Page</h1>"),
  },
  POST: {
    "/form": (socket, headers, body) => {
      sendRes(socket, 200, "text/html", `<h1>Form Received</h1><p>${JSON.stringify(body)}</p>`);
    }
  }
};
```

### Step 4: Serving Static Files
Serve static files from the `public` folder:
```javascript
const serveStatic = (socket, filePath) => {
  const fullPath = path.join(__dirname, "public", filePath);
  if (fs.existsSync(fullPath)) {
    const ext = path.extname(fullPath);
    const mimeTypes = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript" };
    const contentType = mimeTypes[ext] || "text/plain";
    const content = fs.readFileSync(fullPath);
    sendRes(socket, 200, contentType, content);
  } else {
    sendErr(socket, 404, "text/html", "<h1>404 Not Found</h1>");
  }
};
```

### Step 5: Handling Query Parameters & POST Data
Parse query parameters and form data:
```javascript
const querystring = require("querystring");

const [pathname, queryStr] = rawPath.split("?");
const queryParams = queryStr ? querystring.parse(queryStr) : {};

let reqBody = "";
if (method === "POST") {
  reqBody = lines.slice(bodyIndex).join("\r\n");
  if (headers["Content-Type"] === "application/x-www-form-urlencoded") {
    reqBody = querystring.parse(reqBody);
  }
}
```

### Utility Functions
```javascript
const sendRes = (socket, statusCode, contentType, body) => {
  const response = [
    `HTTP/1.1 ${statusCode} OK`,
    `Content-Type: ${contentType}`,
    `Content-Length: ${body.length}`,
    "",
    body
  ].join("\r\n");
  socket.write(response);
};

const sendErr = (socket, statusCode, contentType, body) => {
  const response = [
    `HTTP/1.1 ${statusCode}`,
    `Content-Type: ${contentType}`,
    `Content-Length: ${body.length}`,
    "",
    body
  ].join("\r\n");
  socket.write(response);
};
```

---

## Example Usage

### Accessing Static Files
- Go to `http://localhost:8080/` to see the homepage.
- Go to `http://localhost:8080/about` to see the About Us page.
- Go to `http://localhost:8080/style.css` to access the CSS file.

### Making POST Requests
Using `curl`:
```bash
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "name=John&age=30" http://localhost:8080/form
```

---

## Conclusion
This project is a foundational exploration of how HTTP works under the hood, including request parsing, response handling, and serving static files. It serves as a great exercise in understanding the basics of web servers without relying on frameworks like Express.js.

---
