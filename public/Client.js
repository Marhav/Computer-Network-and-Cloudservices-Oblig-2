// initial function
$(function () {
    //Skjuler alle feedbacks.
    $("#danger_feedback").hide()
    $("#success_feedback").hide()
    $("#warning_feedback").hide()
})

// index.html
function login(){

    const input_login_username = $("#login_username").val();

    let user = {
        username: input_login_username
    }

    $.ajax({
        type: "post",
        url: "/api/login",
        data: user,
        success: function(data) {
            console.log(data);
            $("#danger_feedback").hide();
            window.location.assign('home.html');
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown + " " + textStatus + " " + xhr);
            $("#danger_feedback").show();
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
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#success_feedback").hide();
            if(xhr.status == 400) {
                $("#warning_feedback").show().html('<strong>Warning!</strong> ' + xhr.responseText);
            } else if (xhr.status == 409) {
                $("#warning_feedback").show().html('<strong>Warning!</strong> ' + xhr.responseText);
            } else {
                $("#warning_feedback").show().html('<strong>Warning!</strong> Something went wrong! Error code: ' + xhr.status);
            }
        }});
}



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
