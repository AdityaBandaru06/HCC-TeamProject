const path = require('path');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origins: ['http://localhost:8080']
  }
});
const {PythonShell} = require("python-shell");

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('start-monitoring', (req,res) => {
    console.log('Monitoring started', req);
    const alert = req.alert
    console.log("You have selected : ", alert)
  
    var options = {
      mode: 'text',
      pythonOptions: ['-u'],
      scriptPath: './',
      args: ['-p','shape_predictor_68_face_landmarks.dat']
    };
    var shell = new PythonShell('drowsy.py', options);
    shell.on('message', function (message) {
      if(alert =='dashboard_message'){
        if(message=='1')
        {
            console.log("Take a break");
            io.emit("message", {message: "Take a break"});
        }
  ;
      }
      else if(alert =='dashboard_sound'){
        res.render("stop");
      }
      else{
        console.log("Take a break");
        io.emit("message", {message: "Take a break"});
        //res.render("stop");
      }
      });
    });
});

app.post('/k', (req, res) => {
  
});

server.listen(3000, () => console.log('open up your browser'));