
// index.html
function login(){

    const input_login_username = $("#login_username").val();

    const error_feedback = document.getElementById("danger_feedback");

    let user = {
        username: input_login_username
    }

    $.ajax({
        type: "post",
        url: "/api/login",
        data: user,
        success: function(data) {
            console.log(data);
            error_feedback.classList.add("invisible");
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown + " " + textStatus + " " + xhr);
            error_feedback.classList.remove("invisible");
        }});
}

// Signup.html
function create_user(){

    const input_Register_user = $("#register_username").val();

    const success_feedback = document.getElementById("success_feedback");
    const error_feedback = document.getElementById("warning_feedback");

    let user = {
        username: input_Register_user
    }

    $.ajax({
        type: "post",
        url: "/api/users",
        data: user,
        success: function(data, textStatus, xhr) {
            console.log(data);
            console.log(xhr.getResponseHeader("Content-Length"));
            success_feedback.classList.remove("invisible");
            $("#success_feedback").html('<strong>Success!</strong> ' + input_Register_user + ' registered!')
            error_feedback.classList.add("invisible");
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown + " " + textStatus + " " + xhr.status);
            success_feedback.classList.add("invisible");
            error_feedback.classList.remove("invisible")
            if(xhr.status == 400) {
                $("#warning_feedback").html('<strong>Warning!</strong> The username must be at least 2 characters long!');
            } else if (xhr.status == 409) {
                $("#warning_feedback").html('<strong>Warning!</strong> ' + input_Register_user + ' already exists, pick another name!');
            } else {
                $("#warning_feedback").html('<strong>Warning!</strong> Something went wrong! Error code: ' + xhr.status);
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
