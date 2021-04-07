
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
            alert(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(errorThrown + " " + textStatus + " " + xhr);
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
        success: function(data, textStatus, xhr) {
            alert(data);
            console.log(xhr.getResponseHeader("Content-Length"));
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(errorThrown + " " + textStatus + " " + xhr);
        }});
}


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