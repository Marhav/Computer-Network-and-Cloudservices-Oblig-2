// lists for memory
let alice_list = [];
let input_list = [];

let greeting = ["Hey there!", "Hey", "Sup", "Nice to meet you!", "Hello", "Hi", "Heyyyy", "Good to finally meet you",
    "Nice to see you here"];
let bye = ["Bye", "Sad to see you go", "Goodbye", "Thank you! Come again!", "Byebye", "See you soon"];
let known_verbs = ["work", "play", "eat", "sing", "study", "cook"];
let geir_likes = ["watch youtube", "watch tiktok", "watch netflix", "watch HBO", "look at memes"];

let input; // en tenkt input-variabel, endrer etter html
let string;
let output;

// find known verbs in input from user
function findKnownVerbs(input) {
    for (let verb in known_verbs){
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


function bots(bot, input) {
    if (bot === "alice"){
        return alice(input)
    }
    if (bot === "arne"){
        return  arne(input)
    }
    if (bot === "geir"){
        return  geir(input)
    }
    if (bot === "ulf"){
        return  ulf(input)
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

function alice(input) {
    if (input === ""){
        output = getRandomFromArray(greeting)
    }
    else if (!alice_list.includes(input)){
        return 'I think {} sounds great'.format(input)+"ing";
    }
    else if (alice_list.includes(input)){
        return 'You have already said {} ...'.format(input)+"ing";
    }
    alice_list.push(input);

}
function geir(input) {
    if (input === ""){
        output = getRandomFromArray(greeting)
    }
    else {
        let responses;
        responses = {
            "work": "Nah. Working is boring",
            "play": "Oh yes. Playing is fun!",
            "eat": "I love to eat. But i'm not a very good cook...",
            "sing": "Singing is fun! I love opera",
            "study": "We can study if you do my homework:)",
            "cook": "You can do the cooking and I eat the food;)",
        };
        if (input in responses){
            output = responses[input];
        }
        else if (input === "bye"){
            output = getRandomFromArray(bye)
            //avslutte chatten?
        }
        output = "I'm not sure what that is. But i would love to "+getRandomFromArray(geir_likes);
    }
}
arne_list = [];
function arne(input) {
    if (input === "") {
        output = getRandomFromArray(greeting)
    }
    else {
        if (known_verbs.includes(input)){
            if (arne_list.length % 2 === 0){
                output = "{} sounds fun!".format(input)+"ing";
            }
            else{
                output = "Yes! {} is awesome.".format(input)+"ing"
            }
        }
        output = "Hmmm. I'm not sure. I suggest that we"+getRandomFromArray(known_verbs);
    }
}
function ulf() {
}

