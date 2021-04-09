const Joi = require('joi'); // Validation of user input
const express = require('express');
const StringBuilder = require("string-builder");

const app = express();
const PORT = 2828;

app.use( express.static('public') );
app.use(express.json() )
const bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true}));

let users = [];
let chat_rooms = [];


app.post('/api/login', (req,res) => {

    const user_login = {
        username: req.body.username
    };

    const user = users.find(c => c.username === user_login.username);

    if (!user) return res.status(404).send('Innvalid username');

    return res.status(200);
});

app.get('/api/get_conv/:username', (req,res) => {

    const user = users.find(c => c.username === req.params.username);

    let user_in_rooms = [];

    chat_rooms.forEach(room => {
        room.roomUsers.forEach(room_users => {
            if (room_users.username == user_login.username){
                user_in_rooms.push(room);
            }
        })
    });

    let out = formater(user_in_rooms);

    if (!out.toString()){
        return res.send(`Welcome back, ${user_login.username}!\nNo messages yet`)
    }
    else res.send("Recent " + out.toString());
});

function formater(arr){

    let link;
    let out = new StringBuilder()

    arr.forEach(room => {

        link = `http://localhost:2828/api/room/${room.room_id}`
        let div = `<div class="card" style="width: 18rem;">
                                <img class="card-img-top" src="..." alt="Card image cap">
                                    <div class="card-body">
                                    <h5 class="card-title">${room.name}</h5>
                                    <a href="${link}" class="btn btn-primary">Go to the room</a>
                                </div>
                           </div>`
        out.append(div);
    });

    return out;
}


app.route('/api/user/:username')
    // get one user by given id
    .get((req,res) => {
        const user = users.find(c => c.username === req.params.username);
        if (!user) return res.status(404).send('The user with the given id was not found.');
        res.send(user);
    })
    // Delete user by given id
    .delete((req, res) =>{
        const user = users.find(c => c.username === req.params.username);
        if (!user) return res.status(404).send('The user with the given id was not found.');

        const index = users.indexOf(user);
        users.splice(index,1);

        res.send(`User ${user.username} is deleted!`);
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
            return res.status(400).send(result.error.details[0].message); // If the name is "Null" or less than 2
            // characters, the user will get an error with the details.
        }

        const user = {
            username: req.body.username
        };

        const user_check = users.find(c => c.username === user.username);

        if (user_check)
            return res.status(409).send("The username is taken.");
        else users.push(user);

        res.send(`Welcome , ${user.username}!`);
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
        res.status(404).send(result.error.details[0].message); // If the name is "Null" or less than 2 characters,
        // the user will get an error with the details.
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
        username: req.body.username
    };

    const user = users.indexOf(joinUser);

    if (!user) res.status(404).send("No user with user ID " + joinUser.username + " is found");

    room.roomUsers.push(joinUser);

    res.send(room.roomUsers);

});

                                            // ------- Messages ------- //

// Restrictions:Only users in the room can get messages.
app.get('/api/room/:room_id/messages', (req, res) => {

    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));

    if (!room) res.status(404).send('The room with the given id was not found.');

    const joinUser = {
        username: req.body.username
    };

    const user = room.roomUsers.indexOf(joinUser);

    if (!user) res.status(404).send("No user with user ID " + joinUser.username + " is found.");

    res.send(room.messages);

});

// Restrictions:
//      ●Only users who have joined the room can get or add messages.
//      ●Only registered user-id's should be permitted as <user-id>

app.route('/api/room/:room_id/:username/messages')
    //Get all messages
    .get((req, res) => {
    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');

    const user = chat_rooms.find(c => c.username === req.params.username);
    if (!user) res.status(404).send('The user with the given id was not found.');

    res.send(room.messages);
    })
    //Add message
    .post((req, res) => {

    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');

    const user = chat_rooms.find(c => c.username === req.params.username);
    if (!user) res.status(404).send('The user with the given id was not found.');

    const message = req.body.name;

    room.messages.push(message);
    req.send(room.messages);
});

app.listen(PORT, () => console.log(`Listening for connections on port ${PORT}`));