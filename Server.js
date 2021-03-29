const Joi = require('joi'); // Validation
const express = require('express');
const app = express();
app.listen(2828, () => console.log('Listening for connections on port 2828....'));
app.use(express.static('public'));
app.use(express.json())

users = [];
chat_rooms = [];

messages = [];

app.post('/api', (request, response) => {
    console.log(request);
});

// General functions



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

                                        // -------------- Users -------------------- //

//get all. Return users array.

app.get('/api/users', (req, res) => {
    res.send(users);
});

//add user. Return users array.

app.post('/api/users', (req,res) => {
    const schema = {
        name: Joi.string().min(2).required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error){
       res.status(400).send(result.error.details[0].message); // If the name is "Null" or less than 2 characters, the user will get an error with the details.
       return;
   }
    const user = {
       user_id: users.length + 1,
       name: req.body.name
   };
   users.push(user);
   res.send(users);
});

// function to find the index of the room. (multidimensional)

function findIndexOfRoom(arr,value){
    let roomIndex;
    for (let i = 0;i<arr.length;i++){
        if (arr[i][0] === value){
            roomIndex = i;
            return roomIndex;
        }
    }
}



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

    res.send(user);
} );



// /api/user/<user-id>





                                            //  -- Chat-Rooms -- //

// Get all

app.get('/api/rooms', (req, res) => {
    res.send(chat_rooms);
});

//add one

app.post('/api/rooms',(req, res) => {

    const schema = {
        name: Joi.string().min(2).required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error){
        res.status(404).send(result.error.details[0].message); // If the name is "Null" or less than 2 characters, the user will get an error with the details.
        return;
    }
    const room = {
        room_id: chat_rooms.length + 1,
        name: req.body.name
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

    const index = chat_rooms.indexOf(room);
    res.send(chat_rooms[index]);
});

// Restrictions:Only registered users can join


app.post('/api/room/:room_id/users',(req,res) => {

    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');

    const schema = {
        name: Joi.string().min(2).required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error){
        res.status(404).send(result.error.details[0].message); // If the name is "Null" or less than 2 characters, the user will get an error with the details.
        return;
    }

    const user = users.find(c => c.user_id === parseInt(req.params.user_id));

    const index = users.indexOf(room);

    chat_rooms[index].push(user);
    console.log(chat_rooms[0])

    res.send(chat_rooms[index]);

});





                                            // -- Messages -- //

// Restrictions:Only users in the room can get messages.

// /api/room/<room-id>/messages


app.get('/api/room/:room_id/messages', (req, res) => {
});

// /api/room/<room-id>/<user-id>/messages
// Restrictions:
//      ●Only users who have joined the room can get or addmessages.
//      ●Only registered user-id's should be permitted as <user-id>


app.get('/api/room/:room_id/:user_id/messages', (req, res) => {
    const user_id = req.params.user_id;
});


app.post('/api/room/:room_id/:user_id/messages', (req, res) => {
    const user_id = req.params.user_id;
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


 */






