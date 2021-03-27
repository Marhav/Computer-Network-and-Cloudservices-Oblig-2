const express = require('express');
const app = express();
app.listen(2828, () => console.log('Listening for connections....'));
app.use(express.static('public'))

// Arrays
users = []

chat_rooms = []

messages = []

// General functions

function abort_if_not_exists(){

}

function abort_if_exists(){

}


// Users

// /api/user

function getAllUsers(){

}

function addOneUser(){

}

// /api/user/<user-id>
// Restrictions:<user-id> is already registered.

function getOneUser(){

}

function deleteOneUser(){

}

// Chat-Rooms

// /api/rooms

function getAllRooms(){

}

function addOneRoom(){

}

// /api/room/<room-id>

function getOneRoom(){

}

// Room users

// /api/room/<room-id>/user
// Restrictions:Only registered users can join

function getAllRoomUsers(){

}

function addOneRoomUser(){

}

// Messages

// /api/room/<room-id>/messages
// Restrictions:Only users in the room can get messages.

function getAllMessages(){

}

// /api/room/<room-id>/<user-id>/messages
// Restrictions:
//      ●Only users who have joined the room can get or addmessages.
//      ●Only registered user-id's should be permitted as <user-id>

function getAllUserMessages(){

}

function addOneMessage(){

}



