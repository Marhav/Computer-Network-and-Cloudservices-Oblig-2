// lists for memory
let alice_list = [];
let input_list = [];

let greeting = ["Hey there!", "Hey", "Sup", "Nice to meet you!", "Hello", "Hi", "Heyyyy", "Good to finally meet you", "Nice to see you here"];
let bye = ["Bye", "Sad to see you go", "Goodbye", "Thank you! Come again!", "Byebye", "See you soon"];
let known_verbs = ["work", "play", "eat", "sing", "study", "cook"];

let input; // en tenkt input-variabel, endrer etter html
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

const geir = window.getElementById("join_geir");
geir.onclick = geir();{
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
                console.log(data);
                $("#success_feedback").show().html('<strong>Geir joins the chat now!</strong>' + xhr.responseText);
                window.location.assign('index.html')
            }
        });
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
onload = function () {
        var chat = {
            messageToSend: '',
            messageResponses: [
                'How do you comfort a JavaScript bug? You console it.',
            ],
            init: async function () {
                this.chatTree = new ChatTree();
                await this.chatTree.init();
                this.cacheDOM();
                this.bindEvents();
                await this.render();
            },
            cacheDOM: function () {
                this.$chatHistory = $('.chat-history');
                this.$button = $('button');
                this.$textarea = $('#message-to-send');
                this.$chatHistoryList = this.$chatHistory.find('ul');
            },
            bindEvents: function () {
                this.$button.on('click', this.addMessage.bind(this));
                this.$textarea.on('keyup', this.addMessageEnter.bind(this));
            },
            render: async function () {
                this.scrollToBottom();
                if (this.messageToSend.trim() !== '') {
                    var template = Handlebars.compile($("#message-template").html());
                    var context = {
                        messageOutput: this.messageToSend,
                        time: this.getCurrentTime()
                    };

                    this.input = this.messageToSend;
                    this.$chatHistoryList.append(template(context));
                    this.scrollToBottom();
                    this.$textarea.val('');

                    // responses
                    var templateResponse = Handlebars.compile($("#message-response-template").html());
                    var contextResponse = {
                        response: await this.chatTree.getMessage(this.input),
                        time: this.getCurrentTime()
                    };

                    setTimeout(function () {
                        this.$chatHistoryList.append(templateResponse(contextResponse));
                        this.scrollToBottom();
                    }.bind(this), 1000);

                }

            },

            addMessage: function () {
                this.messageToSend = this.$textarea.val();
                this.render();
            },
            addMessageEnter: function (event) {
                // enter was pressed
                if (event.keyCode === 13) {
                    this.addMessage();
                }
            },
            scrollToBottom: function () {
                this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
            },
            getCurrentTime: function () {
                return new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
            }
        };

        chat.init();
    };

    class ChatTree {

        constructor() {
        }

        async init() {
            const data = await this.reset();
            this.bots = data;
            this.firstMsg = true;
            console.log("debug:)");
            return "Chat has ended. Send a message to start chat again!";
        }

        async reset() {
            const response = await fetch('bots.json');
            const jsonResponse = await response.json();
            return jsonResponse;
        }

        async getMessage(input) {
            let resp = '';
            if (this.firstMsg === true) {
                this.firstMsg = false;
                resp += "Hey there<br>";
            } else {

                if (("message" in this.bots) && (input.trim() === "bye")) {
                    return this.init();
                }

                if (isNaN(parseInt(input)) || parseInt(input) <= 0 || parseInt(input) > this.bots['children'].length + 1)
                    return 'It seems like you gave a wrong input ! Go ahead try again !';

                if (parseInt(input) - 1 === this.bots['children'].length) {
                    this.init();
                }

                this.bots = this.bots['children'][parseInt(input) - 1];
            }

            if ("message" in this.bots) {
                let data;
                if (this.bots['type'] === "function") {
                    if (this.bots['message'] === "getJoke()") {
                        data = await eval(this.bots['message']);
                        data = data.value.joke;
                    } else {
                        data = await eval(this.bots['message']);
                        data = data.articles[0].title;
                    }
                } else {
                    data = this.bots['message'];
                }
                resp += data;
                resp += "<br><br>Write <b>bye</b> to end chat";
            } else {
                for (let i in this.bots['child_msg']) {
                    resp += String(parseInt(i) + 1) + ". " + this.bots['child_msg'][parseInt(i)] + "<br>";
                }
            }
            return resp;
        }
    }

    async function getJoke() {
        const response = await fetch('http://api.icndb.com/jokes/random');
        const jsonResp = await response.json();
        return jsonResp;
    }



