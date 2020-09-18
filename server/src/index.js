const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const {singleTask, multiTasker1} = require("./utils");
const socketIo = require("socket.io");

const PORT = process.env.PORT || 5120;
const HOST = '0.0.0.0';

const CLIENT_BUILD_PATH = path.join(__dirname, '../../client/build');

// Static files
app.use(express.static(CLIENT_BUILD_PATH));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Socket IO connection
const server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log('new client connected');
  socket.on('sendUrls', async data => {
    console.log(data.length);
    while(data.length) {
      
      const finalRes = await multiTasker1(data.splice(0,10));
      socket.emit('sendResult', finalRes);
      
  }
 
  socket.emit('end', 'Scrapping is Completed Results are Available to Export.');
  });
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on('sendUrl', async data => {
      const finalRes = await singleTask(data);
      socket.emit('sendSingleResult', finalRes);
      
  });
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


// API calls

app.post("/url", async (req, res) => {
  url = req.body.url;
  const result = await singleTask(url);
  res.json([result]);
});

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


// app.get('*', function(request, response) {
//   response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
// });