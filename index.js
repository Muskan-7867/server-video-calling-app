const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('http');
const { MONGO_DB_CONFIG} = require('../config/db.js');
const server = http.createServer(app);

mongoose.promise = global.Promise;
mongoose.connect(MONGO_DB_CONFIG, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB Connected');
}, (error) => {
    console.log('MongoDB Connection Error', error);
});


app.use(express.json());
app.use("/api", require('../routes/app-router.js'));

server.listen(process.env.PORT || 8000, function () {
    console.log('Server is running on port' , process.env.PORT);
})