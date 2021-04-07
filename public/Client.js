
function create_user(){

    const input_user = $("#username").val();

    let user = {
        username: input_user
    }

    $.post("/api/users", user, function (data){
        alert("Data from server: " + data);
    })
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