require('dotenv').config({ path: 'variables.env' });
const push = require('web-push');
const Joi = require('joi'); // Validation of user input
const express = require('express');
const StringBuilder = require("string-builder");
const date = require('date-and-time');
const bodyParser = require('body-parser')

const app = express();



app.set('port', process.env.PORT || 2828);


app.use( express.static(__dirname + '/public') );
app.use(express.json() )


app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));

let users = [];
let chat_rooms = [];

                        // ------------------ Functions --------------------- //



function formater_my_rooms(arr){

    let out = new StringBuilder()
    arr.forEach(room => {

        let div = `<div class="chat_list">
                    <div class="chat_people">
                        <div class="chat_img"><span class="material-icons md-dark">forum</span></div>
                           <div class="chat_ib">${room.name}<span class="chat_date">
                                    <button class="btn btn-lg btn-primary btn-block" onclick="enter_room(${room.room_id})">Enter</button></span>
                                                           
                            </div>
                        </div>
                    </div>
                </div>`

        out.append(div);
    });

    return out;
}
function formater_rooms(arr) {

    let link;
    let out = new StringBuilder()

    arr.forEach(room => {

        let div = `
                <div class="chat_list">
                    <div class="chat_people">
                        <div class="chat_img"><span class="material-icons md-dark">forum</span></div>
                           <div class="chat_ib">
                               <h5>${room.name}<span class="chat_date"><button class="btn btn-lg btn-primary btn-block" 
                               onclick="join_room(${room.room_id})">Join</button></span></h5>
                               
                            </div>
                        </div>
                    </div>
                </div>`


        out.append(div);
    });

    return out;
}

function foramterMsgs(arr){

    let out = new StringBuilder();

    arr.forEach(msg =>{
        let div = `<div class="incoming_msg">
                     <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                        <div class="received_msg">
                            <span>From ${msg.sender}</span>
                           <div class="received_withd_msg">
                              <p>${msg.message}</p>
                                   <span class="time_date">${msg.time}</span></div>
                           </div>
                   </div>`

        out.append(div);
    });
    return out.toString();
}

function getTimeAndDate(){

    const now = new Date();
    date.format(now, 'YYYY/MM/DD HH:mm:ss');
    date.format(now, 'ddd, MMM DD YYYY');
    date.format(now, 'hh:mm A [GMT]Z');
    date.format(now, 'hh:mm A [GMT]Z', true);
    const pattern = date.compile('ddd, MMM DD YYYY, HH:mm:ss');

    return date.format(now, pattern);
}

// ------------ Push Notifications ------------- //


const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;


push.setVapidDetails('mailto:test@code.no', publicVapidKey, privateVapidKey)

let subscribers = [];

app.post('/api/sub', (req, res) => {

    if(req.body){
        subscribers.push(req.body)
        return res.status(200).send("Sub registered!");
    } else {
        res.status(404).send("Couldn't add sub!");
        console.error("Couldn't add sub!")
    }
})

                    // ------------------ Users --------------------- //

app.post('/api/login', (req,res) => {

    const user_login = {
        username: req.body.username
    };

    const user = users.find(c => c.username === user_login.username);

    if (!user) return res.status(404).send(req.body.username + " does not exist.");
    res.status(200).send("Welcome back, " + req.body.username);
});


app.get('/api/get_rooms/:username', function (req,res){

    const user = users.find(c => c.username === req.params.username);

    let user_in_rooms = [];

    chat_rooms.forEach(room => {
        room.roomUsers.forEach(room_users => {
            if (room_users.username === user.username){
                user_in_rooms.push(room);
            }
        })
    });

    let out = formater_my_rooms(user_in_rooms);

    if (!out.toString()){
        return res.status(200).send(`Welcome back, ${user.username}!\nNo messages yet`)
    }
    else res.status(200).send(out.toString());
});


app.route('/api/users')

    //get all
    .get((req, res) => {

        const out = new StringBuilder();
        users.forEach(user => {
            out.append(user.username);
        });

        res.status(200).send(out.toString())
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
        else {
            users.push(user);
        }

        res.status(200).send(`Welcome , ${user.username}!`);
    });

app.route('/api/user/:username')
// get one user by given id
    .get((req,res) => {
        const user = users.find(c => c.username === req.params.username);
        if (!user) return res.status(404).send('The user with the given id was not found.');
        res.status(200).send(user);
    })
    // Delete user by given id
    .delete((req, res) =>{
        const user = users.find(c => c.username === req.params.username);
        if (!user) return res.status(404).send('The user with the given id was not found.');

        const index = users.indexOf(user);
        users.splice(index,1);

        res.status(200).send(`User ${user.username} is deleted!`);
    });


                   // -------------- Chat-Rooms -------------------- //

app.route('/api/rooms')
    // Get all
    .get((req, res) => {
        let out = formater_rooms(chat_rooms);

        if (!out.toString()){
            return res.status(200).send(`No rooms created!`);
        }
        else res.status(200).send(out.toString());
    })
    //add room
    .post((req,res) => {

    const schema = {
        name: Joi.string().min(2).max(50).required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error){
        // If the name is "Null" or less than 2 characters,
        // the user will get an error with the details.
        return res.status(404).send(result.error.details[0].message);

    }

    const check_room = chat_rooms.find(c => c.name === req.body.name);

    if (check_room) return res.status(404).send(req.body.name + " already exist.");


    const room = {
        room_id: chat_rooms.length + 1,
        name: req.body.name,
        roomUsers: [],
        messages: []

        // [[user1,melding1,melding2,melding3],[user2,melding1,melding2,melding3]]
    };

    chat_rooms.push(room);
    res.status(200).send(req.body.name +" was created!");
});

//Get room with room id
app.get('/api/room/:room_id', (req,res) => {

    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) res.status(404).send('The room with the given id was not found.');
    res.status(200).send(room);

});

app.route('/api/room/:room_id/users')
    //Get all users in the room
    .get((req, res) =>{
    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) return res.status(404).send('The room with the given id was not found.');
    res.status(200).send(room.roomUsers);
    })
    //Add/join user
    //Restrictions:Only registered users can join
    .post((req,res) => {
    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) return res.status(404).send('The room with the given id was not found.');




    const joinUser = {
        username: req.body.username
    };

    const check_users_in_room = room.roomUsers.find(c => c.username === joinUser.username);

    if(check_users_in_room) return res.status(400).send("You have already joined " + room.name);

    const user = users.indexOf(joinUser);

    if (!user) res.status(404).send("No user with user ID " + joinUser.username + " is found");

    room.roomUsers.push(joinUser);

    res.status(200).send(room.roomUsers);

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

    res.status(200).send(foramterMsgs(room.messages));
});

app.route('/api/room/:room_id/:username/messages')
    //Get all messages
    .get((req, res) => {
    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) return  res.status(404).send('The room with the given id was not found.');

    const user = users.find(c => c.username === req.params.username);
    if (!user) return  res.status(404).send('The user with the given username was not found.');

    const user_messages = [];

    for (let i = 0; i < room.messages.length; i++){
        if(room.messages[i].sender === user.username){
            user_messages.push(room.messages[i].message)
        }
    }

    res.status(200).send(user_messages); // NB! MÅ IKKE RETURNERE ALLE MELDINGER I ROMMET!
    })
    //Add message
    .post((req, res) => {

    const room = chat_rooms.find(c => c.room_id === parseInt(req.params.room_id));
    if (!room) return  res.status(404).send('The room with the given id was not found.');

    const user = users.find(c => c.username === req.body.user);
    if (!user) return res.status(404).send('The user with the given username was not found.');



    const message = {
        sender: req.body.user,
        message: req.body.msg,
        time: getTimeAndDate()
    }


    for (let i = 0; i < subscribers.length; i++){
        if(subscribers[i] !== req.body) {
            push.sendNotification(subscribers[i], 'Message from ')
        }
    }

    room.messages.push(message);

    res.status(200).send(foramterMsgs(room.messages));
});


const server = app.listen(app.get('port'), () => {
    console.log(`Listening for connections on port ${server.address().port}`);
});
