
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const cors = require('cors')
const {devDb} = require('./config/dbConfig')
const routes = require("./routes/index.route")
const socketIO = require('socket.io')
const http = require('http')

devDb();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors())
app.use(routes);

const server = http.createServer(app)
// const io = socketIO(server, {
//     cors: {
//      origin: "http://localhost:3000",
//      method: ["GET", "POST", "PATCH", "PUT", "DELETE"],
//      credentials: true,
//      allowedHeaders: ["Authorization"]
//     }
// }
// );
// app.set("io", io);

app.get("/",(req,res)=>res.json({message:"done"}))

server.listen(PORT,()=>{
    console.log("server is running on,PORT",PORT)
})
