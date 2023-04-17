const temperature = 0.7;
const maxTokens = 2048;

const apiKeyInput = document.getElementById("apikey-input");

let apiKey = "";

apiKeyInput.addEventListener("input", (event) => {
    apiKey = event
        .target
        .value
        .trim();
    if (apiKey !== "") {
        document
            .getElementById("toggle-button")
            .disabled = false;
    } else {
        document
            .getElementById("toggle-button")
            .disabled = true;
    }
});

function clearConversation() {
    finalTranscript = '';
    document.getElementById("result").innerHTML = "";
    document.getElementById("chatResponseText").innerHTML = "";
}

async function sendToChatbot() {
    var result = document.getElementById("result").innerText.trim();
    if (result !== "") {
        fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                "temperature": temperature,
                "max_tokens": maxTokens,
                "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "user",
                        "content": result
                    }
                ]
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.choices[0].message.content)
                const chatbotResponse = data.choices[0].message.content;
                document.getElementById("chatResponseText").innerText = chatbotResponse;
            })
            .catch(error => console.error(error));
    }
}



// Voice recognition functions
var recognition = new webkitSpeechRecognition();
recognition.lang = "pl-PL";
recognition.continuous = true;
recognition.interimResults = true;
var finalTranscript = '';
recognition.onresult = function (event) {
    var interimTranscript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            finalTranscript += event
                .results[i][0]
                .transcript;
        } else {
            interimTranscript += event
                .results[i][0]
                .transcript;
        }
    }
    document.getElementById('result').innerHTML = finalTranscript;
    document.getElementById('send-button').disabled = false;
};

var isRecording = false;
function toggleRecording() {
    if (isRecording) {
        recognition.stop();
        document.getElementById('toggle-button').disabled = true;
        isRecording = false;
    } else {
        recognition.start();
        document.getElementById('toggle-button').disabled = true;
        document.getElementById('stop-button').disabled = false;
        isRecording = true;
    }
}

function stopRecording() {
    recognition.stop();
    document.getElementById('toggle-button').disabled = false;
    document.getElementById('stop-button').disabled = true;
    isRecording = false;
}