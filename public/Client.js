// initial function
$(function () {
    //Skjuler alle feedbacks.
    $("#danger_feedback").hide()
    $("#success_feedback").hide()
    $("#new_room_danger_feedback").hide()
    $("#new_room_success_feedback").hide()
    $("#join_danger_feedback").hide()
    $("#join_success_feedback").hide()
    $("#warning_feedback").hide()
    $(".hidden_before_login").hide()
})

let current_user

// index.html/login
function login(){

    const input_login_user = $("#login_username").val();

    let user = {
        username: input_login_user
    }

    $.ajax({
        type: "post",
        url: "/api/login",
        data: user,
        success: function(xhr, textStatus) {
            console.log(xhr);
            current_user = input_login_user;
            $("#login_div").hide();
            $(".hidden_before_login").show()
            get_all_rooms()
            get_user_rooms()
            $("#danger_feedback").hide();
        },
        error: function (xhr, textStatus) {
            console.log(textStatus + " " + xhr.responseText);
            $("#danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            $("#success_feedback").hide();
        }});
}

// Signup.html
function create_user(){

    const input_Register_user = $("#register_username").val();

    const user = {
        username: input_Register_user
    }

    $.ajax({
        type: "post",
        url: "/api/users",
        data: user,
        success: function(data, status_text, xhr) {
            console.log(data);
            $("#success_feedback").show().html('<strong>Success!</strong> ' + xhr.responseText)
            $("#warning_feedback").hide();
            window.location.assign('index.html');
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#success_feedback").hide();
            if(xhr.status === 400) {
                $("#warning_feedback").show().html('<strong>Warning!</strong> ' + xhr.responseText);
            } else if (xhr.status === 409) {
                $("#warning_feedback").show().html('<strong>Warning!</strong> ' + xhr.responseText);
            } else {
                $("#warning_feedback").show().html('<strong>Warning!</strong> Something went wrong! Error code: ' + xhr.status + " " + xhr.responseText);
            }
        }});
}

// index.html/home
// rooms

function get_user_rooms() {

    $.ajax({
        type: "get",
        url: "/api/get_rooms/" + current_user,
        success: function(data) {
            console.log(data);
            $("#user_rooms").html(data);
        },
        error: function (xhr, textStatus) {
            console.log(textStatus + " " + xhr.responseText);
        }
    });
}

function get_all_rooms() {
    $.ajax({
        type: "get",
        url: "/api/rooms",
        success: function(data) {
            console.log(data);
            $("#room").html(data);
        },
        error: function (xhr, textStatus) {
            console.log(textStatus + " " + xhr.responseText);
        }
    });
}

function create_room() {

    const new_room_name = $("#input_New_Room").val();

    const room_name = {
        name: new_room_name
    }

    $.ajax({
        type: "post",
        url: "/api/rooms",
        data: room_name,
        success: function (data){
            $("#new_room_success_feedback").show().html("<strong>Success!</strong> " + data);
            $("#new_room_danger_feedback").hide();
            get_all_rooms()
            document.getElementById("input_New_Room").value = '';
        },
        error: function (xhr){
            $("#new_room_danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            $("#new_room_success_feedback").hide();
        }
    })
}

function join_room(room_id){
    const user = {
        username: current_user
    }

    $.ajax({
        type: "post",
        url: "/api/room/"+ room_id + "/users",
        data: user,
        success: function (data){
            $("#join_success_feedback").show().html("<strong>Success!</strong> Room joined!");
            $("#join_danger_feedback").hide();
            get_user_rooms()
        },
        error: function (xhr){
            $("#join_danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            $("#join_success_feedback").hide();
        }
    })
}



//messages

let roomid;
function enter_room(room_id){
    $.ajax({
        type: "get",
        url: "/api/room/"+ room_id +"/messages",
        success: function (data){
            $("#join_success_feedback").hide();
            roomid = room_id;
            $("#join_danger_feedback").hide();
            $("#msgs_boxes").html(data)
        },
        error: function (xhr){
            $("#join_danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            $("#join_success_feedback").hide();
        }
    })
}

const botArray = ['geir','alice','arne','ulf'];
function addBot(bot){

    const findBot = botArray.find(c => c === bot);
    const user = {
        username: findBot
    }

    $.ajax({
        type: "post",
        url: "/api/users",
        data: user,
        success: function(data, status_text, xhr) {
            console.log(data);
            $("#warning_feedback").hide();
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            if(xhr.status === 400) {
                $("#warning_feedback").show().html('<strong>Warning!</strong> ' + xhr.responseText);
            } else if (xhr.status === 409) {
                $("#warning_feedback").show().html('<strong>Warning!</strong> ' + xhr.responseText);
            } else {
                $("#warning_feedback").show().html('<strong>Warning!</strong> Something went wrong! Error code: ' + xhr.status + " " + xhr.responseText);
            }
        }});

    $.ajax({
        type: "post",
        url: "/api/room/"+ roomid + "/users",
        data: user,
        success: function (data){
            $("#join_success_feedback").show().html("<strong>Success!</strong> Room joined!");
            $("#join_danger_feedback").hide();
            get_user_rooms()
        },
        error: function (xhr){
            $("#join_danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            $("#join_success_feedback").hide();
        }
    })
}



function sendMSG() {

    const msgInput = $("#msgInput").val();

    const msg = {
        user: current_user,
        msg: msgInput
    }

    $.ajax({
        type: "post",
        url: "/api/room/"+roomid+"/"+current_user+"/messages",
        data: msg,
        success: function (data){
            $("#join_success_feedback").hide();
            $("#join_danger_feedback").hide();
            enter_room(roomid);
            document.getElementById("msgInput").value = '';

        },
        error: function (xhr){
            $("#join_danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            $("#join_success_feedback").hide();
        }
    })

}


function logout(){
    current_user = null;
    roomid = null;
    $("#login_div").show();
    $(".hidden_before_login").hide()
}


// Keylistener for chat. (Press Enter to send message!)
addEventListener("keypress", function (e){
    if(e.keyCode === 13){
        document.getElementById("msg_btn").click();
    }
});

/*
$(function () {
    $("#send").click(function () {
        sendMessage({
            name: $("#login_username").val(),
            message: $("#message").val()
        });
        getMessages();
    })
    $.ajax({
        type:"post",
        url:"/api/room/:room_id/messages",
        success: function (data) {
            console.log(data);
        }
    })
    function addMessages(message) {
        $("#message").append('<h4> ${message.login_username} </hh4> <p> ${message.message} </p>')
    }
    function getMessages() {
        $.get('/api/room/:room_id/messages',(data)=> {
            console.log(data)
            data.forEach(addMessages);
        })
    }
    function sendMessage(message) {
        $.post('/api/room/:room_id/messages', message)
    }
});



 */

/*
function selectUser(){

}

function joinUser(){
    const name = $("#name").val();  //vil velge fra index.html id, feil?

    const data ={name};

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch('/api/users', options);
}

function joinRoom(){

}
function messages() {
}
 */
