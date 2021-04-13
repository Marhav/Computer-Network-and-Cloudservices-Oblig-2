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
let current_room_id;

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

function enter_room(room_id){

    $.ajax({
        type: "get",
        url: "/api/room/"+ room_id +"/messages",
        success: function (data){
            $("#join_success_feedback").hide();
            current_room_id = room_id;
            $("#join_danger_feedback").hide();
            $("#msgs_boxes").html(data)
        },
        error: function (xhr){
            $("#join_danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
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
        url: "/api/room/"+current_room_id+"/"+current_user+"/messages",
        data: msg,
        success: function (data){
            $("#join_success_feedback").hide();
            $("#join_danger_feedback").hide();
            enter_room(current_room_id);
            document.getElementById("msgInput").value = '';
            //Sjekke hvilke bots some er i rommet(current_room_id).
                //Funksjon som henter alle users i rommet.
                //for loop som går igennom arrayet og ser etter bot-navn.
                //if statement som, når true, kaller funksjonen bots(bot, input)
        },
        error: function (xhr){
            $("#join_danger_feedback").show().html("<strong>Danger!</strong> " + xhr.responseText);
            $("#join_success_feedback").hide();
        }
    })

}

// Users

function get_room_users(){

    user_array = [];

    $.ajax({
        type: "get",
        url: "/api/room/"+ current_room_id +"/users",
        success: function (data){
            for(let user in data){
                user_array.append(user);
            }
            return user_array;
        },
        error: function (xhr){
            console.log("Error i get_room_users(): " + xhr.responseText);
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
            url: "/api/room/"+ current_room_id + "/users",
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
    } else {
        $("#join_danger_feedback").show().html('<strong>Warning!</strong> Join a room before adding a bot!');
    }
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
            console.log("Success i send_bot_MSG: " + data)
        },
        error: function (xhr){
            console.log("Error i send_bot_MSG: " + xhr.responseText)
        }
    })
}

// Push Notifications
/*
addEventListener('load', async () => {
    let sw = await navigator.serviceWorker.register('./sw.js')
    console.log("sw: " + sw)
})
 */

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
                applicationServerKey: 'BKF59gmG_aPkrcoF9LU0k_IFAwEuBeG3OyLfbvQut7NxuassHIYXIqXNiTkifeA0YrcnogYdDLCAwzS1hEz6B9o'
            }).then(function(sub) {
                // **********VIKTIG!**********
                // Her skal push sendes til server og legges til
                // i gruppen som skal ha push varsler!
                // ***************************
                console.log(JSON.stringify(sub));
                add_sub(sub.toJSON());
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
/*
async function subscribe(){
    let sw = navigator.serviceWorker.ready
    let push = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BKF59gmG_aPkrcoF9LU0k_IFAwEuBeG3OyLfbvQut7NxuassHIYXIqXNiTkifeA0YrcnogYdDLCAwzS1hEz6B9o'
    })

    console.log(JSON.stringify(push))
}

 */


// Additional functions

function logout(){
    current_user = null;
    current_room_id = null;
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
