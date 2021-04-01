// input check for CLI

if(process.argv.length === 4){
    var name = process.argv[2];
    var room = process.argv[3];
    console.log('Name: '+ name);
    console.log('Room: ' + room);
    // f.eks: node client.js bob lobby
}
const chatbots = ["bob", "alice", "dora", "chuck"];
let chatbot = false;
if (chatbots.includes(name)){
    chatbot = true;
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