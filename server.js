const { Console } = require('console');
const path = require('path');
const { exit } = require('process');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origins: ['http://localhost:8080']
  }
});
const {PythonShell} = require("python-shell");
var shell = null

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('start-monitoring', (req,res) => {
    const alert = req.alert
    console.log("You have selected : ", alert)
  
    var options = {
      mode: 'text',
      pythonOptions: ['-u'],
      scriptPath: './',
      args: ['-p','public/models/shape_predictor_68_face_landmarks.dat']
    };
    try{
       shell = new PythonShell('drowsy.py', options);
    }
    catch(err){
      Console.log(err)
    }
    shell.on('message', function (message) {
      console.log(message)
      if(message=='1')
      {
          if(alert =='Alert Message'){
              console.log("Take a break");
              io.emit("message", {message: "Play Message"});
          }
          else if(alert =='Alert Sound'){
                io.emit("message", {message: "Play Sound"});
          }
          else{
              console.log("Both");
              io.emit("message", {message: "Play Both"});
          }
      }
      });
    });
    socket.on('stop-monitoring', (req,res) => {
      console.log("Stopping the monitoring")
    
      var options = {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: './',
        args: ['-s','stop']
      };
      try{
        shell = new PythonShell('drowsy.py', options);
      }
      catch(err){
        console.log(err)
      }
      shell.on('message', function (message) {
        console.log(message)
        if(message=='stopped')
        {
            io.emit("message", {message: "stopped"});  
        }
        });
    });
});

app.post('/k', (req, res) => {

});

server.listen(3000, () => console.log('open up your browser'));