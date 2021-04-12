// initial function
$(function () {
    //Skjuler alle feedbacks.
    $("#danger_feedback").hide()
    $("#success_feedback").hide()
    $("#warning_feedback").hide()
    $(".hidden_before_login").hide()
})

let current_user

// index.html
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
            $("#success_feedback").show().html("<strong>Success!</strong> " + xhr);
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

    let user = {
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

// home.html
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
    
}

//messages

function get_all_messages() {
    
}
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
