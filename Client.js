function selectUser(){

}

function joinUser(){
    const name = $("#name").val();  //vil velge fra index.html id, feil?

    const user = $("#user").val();

    const data ={name, user};

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch('/api', options);
}

function joinRoom(){

}
