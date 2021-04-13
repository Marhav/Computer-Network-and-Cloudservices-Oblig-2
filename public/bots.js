// lists for memory
let botman_list = [];

let greeting = ["Hey there!", "Hey", "Sup", "Nice to meet you!", "Hello", "Hi", "Heyyyy", "Good to finally meet you",
    "Nice to see you here"];
let bye = ["Bye", "Sad to see you go", "Goodbye", "Thank you! Come again!", "Byebye", "See you soon"];
let known_verbs = ["work", "play", "eat", "sing", "study", "cook", "joke"];
let geir_likes = ["watch youtube", "watch tiktok", "watch netflix", "watch HBO", "look at memes"];
let hello = ["hey", "hello", "hi", "hva skjer", "halla", "hallo", "sup"];

let input;
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
    if (bot === "Botman"){
        return botman(input)
    }
    if (bot === "DJ ARON"){
        return dj_aron(input)
    }
    if (bot === "BlackJack"){
        return blackjack(input)
    }
    if (bot === "RangerDanger"){
        return rangerdanger(input)
    }
    return "Invalid bot";
}


function analyze_input() {
    let input_lowercase = input.toLowerCase();
    let words_in_input = input_lowercase.split("");
    for (let words in words_in_input){
        if (words in known_verbs){
            return words;
        }
    }
}

function botman(input) {
    if (hello.includes(input.toLowerCase())){
        output = getRandomFromArray(greeting)
    }
    if (known_verbs.includes(input)) {
        if (!botman_list.includes(input)) {
            output = 'I think {} sounds great'.format(input);
        }
        else if (botman_list.includes(input)) {
            output = 'You have already said {} ...'.format(input);
        }
        botman_list.push(input); //adds to list
    }
    send_bot_MSG(output, 'Botman')
}
function blackjack(input) {
    if (hello.includes(input.toLowerCase())){
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
            "joke": "You should ask Ulf! He knows many jokes."
        };
        if (input in responses) {
            output = responses[input];
        } else if (input === "bye") {
            output = getRandomFromArray(bye)
        }
        output = "I'm not sure what that is. But i would love to " + getRandomFromArray(geir_likes);
    }
    send_bot_MSG(output,'BlackJack')
}
arne_list = [];
function dj_aron(input) {
    if (hello.includes(input.toLowerCase())){
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
            arne_list.push(input);
        }
        output = "Hmmm. I'm not sure. I suggest that we "+getRandomFromArray(known_verbs);
    }
    send_bot_MSG(output, 'DJ ARON');
}
function rangerdanger() {
    // personality: tells jokes
    let jokes = [
        "Why do Java developers wear glasses? ...Because they can not C#.",
        "How do you comfort a JavaScript bug? ...You console it.",
        "What is the object-oriented way to become wealthy? ...Inheritance",
        "A SQL query enters a bar, approaches two tables and aks: May i join you?",
        "Why was the JavaScript developer sad? ...Because he didn't Node how to Express himself.",
        "How many programmers does it take to change a light bulb? ...None, thats a hardware problem.",
        "How do functions break up? ...They stop calling each other.",
        "You can continue whenever you want. But you can only take a break once in a while."
    ];
    if (hello.includes(input.toLowerCase())){
        output = getRandomFromArray(greeting)
    }
    else if (input === "bye") {
        output = getRandomFromArray(bye);
    }
    else {
        output = getRandomFromArray(jokes);
    }
    send_bot_MSG(output, 'RangerDanger');
}

