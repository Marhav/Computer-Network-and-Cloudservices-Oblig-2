const Joi = require('joi'); // Validation of user input
const express = require('express');
const StringBuilder = require("string-builder");

const app = express();
const PORT = 2828;


app.use(express.static('public'));
app.use(express.json())
const bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true}));


let users = [];
let chat_rooms = [];
let id_counter = 1;


app.get('/api/login', (req, res) => {

    const user_login = {
        user_id: parseInt(req.body.user_id),
        username: req.body.username
    };

    let found = false;

    users.forEach(user => {
        if (user == user_login)
            found = true;
    });

    if (!found) res.status(404).send(`The user with the given id was not found. ${users[0].username} ${users[0].user_id} `);

    res.send(user_login.user_id);

});



app.route('/api/user/:user_id')
    // get one user by given id
    .get((req,res) => {
        const user = users.find(c => c.user_id === parseInt(req.params.user_id));
        if (!user) res.status(404).send('The user with the given id was not found.');
        res.send(user);
    })
    // Delete user by given id
    .delete((req, res) =>{
        const user = users.find(c => c.user_id === parseInt(req.params.user_id));
        if (!user) res.status(404).send('The user with the given id was not found.');

        const index = users.indexOf(user);
        users.splice(index,1);

        res.send(`User ${user.name} with ${user.user_id} is deleted!`);
    });


                    // ------------------ Users --------------------- //

app.route('/api/users')

    //get all
    .get((req, res) => {

        const out = new StringBuilder();
        users.forEach(user => {
            out.append(user.username);
        });

        res.send(out.toString())
    })
    //add user
    .post((req,res) => {

        const schema = {
            username: Joi.string().min(2).max(50).required()
        };

        const result = Joi.validate(req.body, schema);

        if (result.error){
            res.status(400).send(result.error.details[0].message); // If the name is "Null" or less than 2 characters, the user will get an error with the details.
            return;
        }
        const user = {
            user_id: id_counter,
            username: req.body.username
        };
        id_counter ++;
        users.push(user);
        res.send(`Welcome , ${user.username}! ${user.user_id}`);
    });

                   // -------------- Chat-Rooms -------------------- //

app.route('/api/rooms')
    // Get all
    .get((req, res) => {
    res.send(chat_rooms);
    })
    //add room
    .post((req,res) => {

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

//Get room with room id
app.get('/api/room/:room_id', (req,res) => {

    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');
    res.send(room);

});

app.route('/api/room/:room_id/users')
    //Get all users in the room
    .get((req, res) =>{
    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');
    res.send(room.roomUsers);
    })
    //Add/join user
    //Restrictions:Only registered users can join
    .post((req,res) => {
    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');

    const joinUser = {
        user_id: req.body.user_id,
        username: req.body.username
    };

    const user = users.indexOf(joinUser);

    if (!user) res.status(404).send("No user with user ID " + joinUser.user_id + " is found");

    room.roomUsers.push(joinUser);

    res.send(room.roomUsers);

});

                                            // ------- Messages ------- //

// Restrictions:Only users in the room can get messages.
app.get('/api/room/:room_id/messages', (req, res) => {

    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));

    if (!room) res.status(404).send('The room with the given id was not found.');

    const joinUser = {
        user_id: req.body.user_id,
        username: req.body.username
    };

    const user = room.roomUsers.indexOf(joinUser);

    if (!user) res.status(404).send("No user with user ID " + joinUser.user_id + " is found.");

    res.send(room.messages);

});

// Restrictions:
//      ●Only users who have joined the room can get or add messages.
//      ●Only registered user-id's should be permitted as <user-id>

app.route('/api/room/:room_id/:user_id/messages')
    //Get all messages
    .get((req, res) => {
    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');

    const user = chat_rooms.find(c => c.user_id === parseInt(req.params.user_id));
    if (!user) res.status(404).send('The user with the given id was not found.');

    res.send(room.messages);
    })
    //Add message
    .post((req, res) => {

    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');

    const user = chat_rooms.find(c => c.user_id === parseInt(req.params.user_id));
    if (!user) res.status(404).send('The user with the given id was not found.');

    const message = req.body.name;

    room.messages.push(message);
    req.send(room.messages);
});


app.listen(PORT, () => console.log(`Listening for connections on port ${PORT}`));
