// lists for memory
let alice_list = [];
let bob_list = [];
let dora_list = [];
let chuck_list = [];

let greeting = ["Hey there!", "Hey", "Sup", "Nice to meet you!", "Hello", "Hi", "Heyyyy", "Good to finally meet you", "Nice to see you here"];
let bye = ["Bye", "Sad to see you go", "Goodbye", "Thank you! Come again!", "Byebye", "See you soon"];

// function to get a random value from an array
function getRandomFromArray(arr) {
    if (arr && arr.length){
        return arr[Math.floor(Math.random()*arr.length)];
    }
}

function bots() {
    string = "";
    if (bot === "alice"){
        string = alice(greeting, action, bye)
    }
    else if (bot === "dora"){
        string = dora(greeting, action, bye)
    }
    else if (bot === "bob"){
        string = bob(greeting, action, bye)
    }
    else if (bot === "chuck"){
        string = chuck(greeting, action, bye)
    }

}

function analyze_input() {
    let bye_string = "";
    let greeting = "";
    let action = "";
    if (input.includes("bye")){
        bye_string = getRandomFromArray(bye)
    }
    string = bots(greeting, action, bye_string)
}

function alice() {


}
function bob() {


    
}
function dora() {

    
}
function chuck() {

}

