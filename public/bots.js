// lists for memory
let alice_list = [];
let input_list = [];

let greeting = ["Hey there!", "Hey", "Sup", "Nice to meet you!", "Hello", "Hi", "Heyyyy", "Good to finally meet you", "Nice to see you here"];
let bye = ["Bye", "Sad to see you go", "Goodbye", "Thank you! Come again!", "Byebye", "See you soon"];
let known_verbs = ["work", "play", "eat", "sing", "study", "cook"];

let input = document.getElementById('msg');

let string;

var message = "";

// find known verbs in input from user
function findKnownVerbs(input) {
    for (verb in known_verbs){
        if (verb in input){
            return verb;
        }
    }

}

// get a random value from an array
function getRandomFromArray(arr) {
    if (arr && arr.length){
        return arr[Math.floor(Math.random()*arr.length)];
    }
}

// formatting strings
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};


function bots(bot) {
    string = "";
    if (bot === "alice"){
        return alice(greeting, action, bye)
    }
    if (bot === "dora"){
        return  dora(greeting, action, bye)
    }
    if (bot === "bob"){
        return  bob(greeting, action, bye)
    }
    if (bot === "chuck"){
        return  chuck(greeting, action, bye)
    }
    return "Invalid bot";
}

function analyze_input() {
    let byeString = "";
    let greetingString = "";
    let action = "";
    if (input.includes("bye")){
        byeString = getRandomFromArray(bye)
        // exit
    }
    if (input_list.length < 1){
        greetingString = getRandomFromArray(greeting)
    }
    string = bots(greetingString, action, byeString)
}

function geir(){
    console.log("geir");
        let bot = {
            botname: "Geir"
        };
        console.log("geir");
        $.ajax({
            type: "post",
            url: "/api/bots",
            data: bot,
            success: function (xhr, textStatus) {
                console.log(xhr);
                $("#success_feedback").show().html('<strong>Geir joins the chat now!</strong>' + xhr.responseText);
                window.location.assign('index.html')
            }
        })
        /*
        let action = input + "ing";
        if (!alice_list.includes(input)) {
            return 'Alice: I think {} sounds great'.format(action);
        }
        if (alice_list.includes(input)) {
            return 'Alice: You have already said {} ...'.format(action);
        }
        alice_list.push(input);
*/
}
    function bob() {
    }

    function knut() {
    }

    function arne() {
    }




