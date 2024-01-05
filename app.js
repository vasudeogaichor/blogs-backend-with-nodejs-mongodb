const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('express-async-errors');

const { postRouter, authRouter } = require('./routes');
const {verifyToken} = require('./middleware/authMiddleware')

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());

app.use('/auth', authRouter);
app.use(verifyToken)
app.use('/posts', postRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    const stackTrace = err.stack.split('\n');
    res.status(500).json({Error: stackTrace});
});

mongoose.connect('mongodb://localhost:27017/db_auth');

mongoose.connection.once('open',function(){
    console.log('Database connected Successfully');
}).on('error',function(err){
    console.log('Error', err);
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})

