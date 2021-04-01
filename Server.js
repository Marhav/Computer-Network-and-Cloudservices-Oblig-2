const Joi = require('joi'); // Validation
const express = require('express');
const StringBuilder = require("string-builder");
const app = express();
const PORT = 2828;

app.listen(PORT, () => console.log(`Listening for connections on port ${PORT}`));

app.use(express.static('public'));
app.use(express.json())
const bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true}));

let users = [];

let chat_rooms = [];

let id_couter = 1;

app.post('/api', (request, response) => {
    console.log(request);
});

                                        // -------------- Users -------------------- //

//get all. Return users array.

app.get('/api/users', (req, res) => {


    const out = new StringBuilder();
    users.forEach(user => {
        out.append(user.name);
    });

    res.send(out.toString())
});

//add user.
app.post('/api/users', (req,res) => {

    const schema = {
        name: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(2).max(50).required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error){
       res.status(400).send(result.error.details[0].message); // If the name is "Null" or less than 2 characters, the user will get an error with the details.
       return;
    }
    const user = {
       user_id: id_couter,
       password:req.body.password,
       name: req.body.name
    };
    id_couter ++;
    users.push(user);
    res.send(`Hello, ${user.name}!\nYour user ID is ${user.user_id}`);
});


// get one user by given id

app.get('/api/user/:user_id', (req,res) => {

    const user = users.find(c => c.user_id === parseInt(req.params.user_id));
    if (!user) res.status(404).send('The user with the given id was not found.');
    res.send(user);

});

// Delete user by given id

app.delete('/api/user/:user_id', (req, res) =>{
    const user = users.find(c => c.user_id === parseInt(req.params.user_id));
    if (!user) res.status(404).send('The user with the given id was not found.');

    const index = users.indexOf(user);
    users.splice(index,1);

    res.send(`User ${user.name} with ${user.user_id} is deleted!`);
} );


                                            //  -- Chat-Rooms -- //

// Get all

app.get('/api/rooms', (req, res) => {
    res.send(chat_rooms);
});

//add one

app.post('/api/rooms',(req, res) => {

    const schema = {
        name: Joi.string().min(2).max(50).required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error){
        res.status(404).send(result.error.details[0].message); // If the name is "Null" or less than 2 characters, the user will get an error with the details.
        return;
    }
    const room = {
        room_id: chat_rooms.length + 1,
        name: req.body.name,
        roomUsers: [],
        messages: []
    };

    chat_rooms.push(room);
    res.send(chat_rooms);
});

app.get('/api/room/:room_id', (req,res) => {

    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');
    res.send(room);

});

//Get all users in the room
app.get('/api/room/:room_id/users', (req, res) =>{

    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');

    res.send(room.roomUsers);
});

// ● Restrictions:Only registered users can join

app.post('/api/room/:room_id/users',(req,res) => {

    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');

    const joinUser = {
        user_id: req.body.user_id,
        name: req.body.name
    };

    const user = users.indexOf(joinUser);

    if (!user) res.status(404).send("No user with user ID " + joinUser.user_id + " is found");

    room.roomUsers.push(joinUser);

    res.send(room.roomUsers);

});

                                            // -- Messages -- //

// Restrictions:Only users in the room can get messages.

app.get('/api/room/:room_id/messages', (req, res) => {

    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));

    if (!room) res.status(404).send('The room with the given id was not found.');

    const joinUser = {
        user_id: req.body.user_id,
        name: req.body.name
    };

    const user = room.roomUsers.indexOf(joinUser);

    if (!user) res.status(404).send("No user with user ID " + joinUser.user_id + " is found.");

    res.send(room.messages);

});

// Restrictions:
//      ●Only users who have joined the room can get or add messages.
//      ●Only registered user-id's should be permitted as <user-id>

app.get('/api/room/:room_id/:user_id/messages', (req, res) => {
    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');

    const user = chat_rooms.find(c => c.user_id === parseInt(req.params.user_id));
    if (!user) res.status(404).send('The user with the given id was not found.');

    res.send(room.messages);
});


app.post('/api/room/:room_id/:user_id/messages', (req, res) => {

    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');

    const user = chat_rooms.find(c => c.user_id === parseInt(req.params.user_id));
    if (!user) res.status(404).send('The user with the given id was not found.');

    const message = req.body.name;

    room.messages.push(message);
    req.send(room.messages);
});


/*

// Restrictions:<user-id> is already registered.

/*
function getOneUser(user_id){
    abort_if_not_exists(user_id);
    return users[user_id];
}

function deleteOneUser(user_id){
    abort_if_not_exists()
    users = users.filter(function(user){
        return user != user_id;
    });
}
function getAllUsers(){
    return users
}

function addOneUser(){

}

function getAllRooms(){

}

function addOneRoom(){

}

// /api/room/<room-id>

function getOneRoom(){

}

function addOneMessage(){
}

function getAllMessages(){
}
function getAllRoomUsers(){

}

function addOneRoomUser(){

}

function abort_if_not_exists(user_id){

    if (!users.includes(user_id)){
        express.request.aborted = true; // Litt usikker på denne syntaksen. :')
    }
}
function abort_if_exists(user_id){
    if(users.includes(user_id)){
        express.request.aborted = true; // Litt usikker på denne syntaksen. :')
    }
}
 */






