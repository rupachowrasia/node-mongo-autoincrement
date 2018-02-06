const express = require('express');
const app = express();
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const PORT = process.env.PORT || 3004;

// connect to db
mongoose.connect('mongodb://localhost:27017/testdb');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(`Database has been connected successfully`);
});

// defining schema
autoIncrement.initialize(mongoose.connection);
let Schema = mongoose.Schema;
let userSchema = new Schema({
    'id' : String,
    'name' : String,
    'email' : String
});

userSchema.plugin(autoIncrement.plugin, {
    model: 'user',
    field: '_id',
    startAt: 100,
    incrementBy: 1
});

let User = mongoose.model('user', userSchema);

app.get('/getNextId', function(req, res){
    User.nextCount((err, count) => {                          
        let user = new User();
        user.save((err) => {
            console.log(`The Id is ${count}`);
            user.nextCount((err, count) => {
                console.log(`The next Id is ${count}`);
            });
        });
        res.status(200).send(JSON.stringify({ id : count }, null, 3));
    });
});

app.listen(PORT, () => {
    console.log(`Server is up and running on Port : ${PORT}`);
});
