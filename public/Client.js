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
    $("#bot_div").hide()
    $(".mesgs").hide()

})

let current_user
let current_room_id;
let subs = [];


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
        success: function(data) {
            console.log(data);
            current_user = input_login_user;
            $("#login_div").hide();
            $(".hidden_before_login").show()
            $("#current_user").html('Hello, ' + current_user + "!")
            get_all_rooms()
            get_user_rooms()
            get_all_users()
            if (subs.indexOf(current_user) === -1) $("#myModal").modal('show');
            $("#danger_feedback").hide();
        },
        error: function (xhr, textStatus) {
            console.log(textStatus + " " + xhr.responseText);
            $("#danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            setTimeout(function() { $("#danger_feedback").fadeOut(1500); }, 2000);


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
            setTimeout(function() { $("#success_feedback").fadeOut(1500); }, 2000);

            $("#warning_feedback").hide();
            window.location.assign('index.html');
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#success_feedback").hide();
            if(xhr.status === 400) {
                $("#warning_feedback").show().html('<strong>Warning!</strong> ' + xhr.responseText);
                setTimeout(function() { $("#warning_feedback").fadeOut(1500); }, 2000);

            } else if (xhr.status === 409) {
                $("#warning_feedback").show().html('<strong>Warning!</strong> ' + xhr.responseText);
                setTimeout(function() { $("#warning_feedback").fadeOut(1500); }, 2000);

            } else {
                $("#warning_feedback").show().html('<strong>Warning!</strong> Something went wrong! Error code: '
                    + xhr.status + " " + xhr.responseText);
                setTimeout(function() { $("#warning_feedback").fadeOut(1500); }, 2000);

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

function get_all_users() {
    $.ajax({
        type: "get",
        url: "/api/users/",
        success: function(data) {
            console.log(data);
            $("#users").html(data);
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
            setTimeout(function() { $("#new_room_success_feedback").fadeOut(1500); }, 2000);

            $("#new_room_danger_feedback").hide();
            get_all_rooms()
            document.getElementById("input_New_Room").value = '';
        },
        error: function (xhr){
            $("#new_room_danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            setTimeout(function() { $("#new_room_danger_feedback").fadeOut(1500); }, 2000);
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
        success: function (){
            $("#join_success_feedback").show().html("<strong>Success!</strong> Room joined!");
            setTimeout(function() { $("#join_success_feedback").fadeOut(1500); }, 2000);
            $("#join_danger_feedback").hide();
            get_user_rooms()
        },
        error: function (xhr){
            $("#join_danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            setTimeout(function() { $("#join_danger_feedback").fadeOut(1500); }, 2000);
            $("#join_success_feedback").hide();
        }
    })
}

function enter_room(room_id){

    $.ajax({
        type: "get",
        url: "/api/room/"+ room_id +"/messages",
        success: function (data){
            $("#join_success_feedback").hide();
            current_room_id = room_id;
            get_room_users()
            $("#bot_div").show()
            $(".mesgs").show()
            $("#join_danger_feedback").hide();
            $("#msgs_boxes").html(data)
        },
        error: function (xhr){
            $("#join_danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            setTimeout(function() { $("#join_danger_feedback").fadeOut(1500); }, 2000);
            $("#join_success_feedback").hide();
        }
    })
}


//messages


function sendMSG() {
    const msg_input = $("#msgInput").val();

    const msg = {
        user: current_user,
        msg: msg_input
    }

    $.ajax({
        type: "post",
        url: "/api/room/" + current_room_id + "/" + current_user + "/messages",
        data: msg,
        success: function () {
            $("#join_danger_feedback").hide();
            enter_room(current_room_id);
            document.getElementById("msgInput").value = '';
            get_room_bots(msg_input)
        },
        error: function (xhr) {
            $("#join_danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            setTimeout(function() { $("#join_danger_feedback").fadeOut(1500); }, 2000);

        }
    })


}

// Users

function get_room_users(){

    $.ajax({
        type: "get",
        url: "/api/room/"+ current_room_id +"/users",
        success: function (data){
            $("#join_danger_feedback").hide();
            console.log("From get_room_users: " + data)
            $("#user_rooms").show().html(data)
        },
        error: function (xhr){
            $("#join_danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            setTimeout(function() { $("#join_danger_feedback").fadeOut(1500); }, 2000);

        }
    })
}

function delete_user(){

    const user_dlt = $("#input_delete_user").val();

    $.ajax({
        type: "delete",
        url: "/api/user/" + user_dlt,
        success: function (data){
            if (user_dlt == current_user)
                window.location.assign('index.html');
            get_all_users();
            $("#join_success_feedback").show().html("<strong>Success!</strong> " + data);
            setTimeout(function() { $("#join_success_feedback").fadeOut(1500); }, 2000);
            $("#join_danger_feedback").hide();
            document.getElementById("input_delete_user").value = '';
            get_room_users()
        },
        error: function (xhr){
            $("#join_danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            setTimeout(function() { $("#join_danger_feedback").fadeOut(1500); }, 2000);
            $("#join_success_feedback").hide();
        }
    })
}



// bots

const botArray = ['BlackJack','Botman','DJ ARON','RangerDanger'];
function addBot(bot){

    if(current_room_id){
        const findBot = botArray.find(c => c === bot);
        const user = {
            username: findBot
        }

        $.ajax({
            type: "post",
            url: "/api/users",
            data: user,
            success: function(data) {
                console.log(data);
                $("#warning_feedback").hide();
            }});

        $.ajax({
            type: "post",
            url: "/api/room/"+ current_room_id + "/users",
            data: user,
            success: function (){
                $("#join_success_feedback").show().html("<strong>Success!</strong> " + bot + " has entered the room!");
                setTimeout(function() { $("#join_success_feedback").fadeOut(1500); }, 2000);

                $("#join_danger_feedback").hide();
                get_room_users()
            },
            error: function (xhr){
                $("#join_danger_feedback").show().html("<strong>Danger!</strong> " + bot + " has already entered the room");
                setTimeout(function() { $("#join_danger_feedback").fadeOut(1500); }, 2000);

                $("#join_success_feedback").hide();
            }
        })
    }
}


function get_room_bots(msg_input){

    $.ajax({
        type: "get",
        url: "/api/room/"+ current_room_id +"/bots",
        success: function (data){
            console.log(data[0].username)
            for (let i = 0; i < data.length; i++) {
                if (botArray.includes(data[i].username)) {
                    console.log("Dette er data[].username: " + data[i].username)
                    bots(data[i].username, msg_input)
                }
            }
        },
        error: function (xhr){
            console.log("Error i get_room_users(): " + xhr.responseText);
        }
    })
}

function send_bot_MSG(input, bot) {
    const msg = {
        user: bot,
        msg: input
    }

    $.ajax({
        type: "post",
        url: "/api/room/"+current_room_id+"/"+current_user+"/messages",
        data: msg,
        success: function (data){
            sleep(300);
            enter_room(current_room_id)
            console.log("Success i send_bot_MSG: " + data)
        },
        error: function (xhr){
            console.log("Error i send_bot_MSG: " + xhr.responseText)
        }
    })
}


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(reg) {
        console.log('Service Worker Registered!', reg);

        reg.pushManager.getSubscription().then(function(sub) {
            if (sub === null) {
                // Update UI to ask user to register for Push
                console.log('Not subscribed to push service!');
            } else {
                // We have a subscription, update the database
                console.log('Subscription object: ', sub);
            }
        });
    })
        .catch(function(err) {
            console.log('Service Worker registration failed: ', err);
        });
}
function subscribe() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function(reg) {

            reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'BMfFUGhN3UEzor02WglMbeyjpI_g_VsId4wWIdrIZ2UWKDbI3beC25pkcr3qkbGQzLAX_W3NjJpOX5FJbes-8fA'
            }).then(function(sub) {
                console.log(JSON.stringify(sub));
                add_sub(sub.toJSON());
                subs.push(current_user)
            }).catch(function(e) {
                if (Notification.permission === 'denied') {
                    console.warn('Permission for notifications was denied');
                } else {
                    console.error('Unable to subscribe to push', e);
                }
            });
        })
    }
}

function add_sub(input){

    console.log(input)
    $.ajax({
        type: "post",
        url: "/api/sub",
        data: input,
        success: function (data){
            console.log("Success i send_bot_MSG: " + data)
        },
        error: function (xhr){
            console.log("Error i send_bot_MSG: " + xhr.responseText)
        }
    })
}

// Additional functions

function logout(){
    current_user = null;
    current_room_id = null;
    $("#login_div").show();
    $(".hidden_before_login").hide()
}

function refresh_everything(){

    get_room_users()
    get_user_rooms()
    get_all_rooms()
    get_all_users()
    enter_room(current_room_id)
}


// Keylistener for chat. (Press Enter to send message!)
addEventListener("keypress", function (e){
    if(e.keyCode === 13){
        document.getElementById("msg_btn").click();
    }
});


