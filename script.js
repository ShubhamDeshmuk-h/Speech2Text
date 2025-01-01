const resultElement = document.getElementById("result");
let recognition;

function startConverting() {
    /* Check whether the browser supports the function */
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        setuprecognition(recognition);
        recognition.start();
    } else {
        console.error("Speech recognition not supported in this browser.");
    }
}

function setuprecognition(recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = function (event) {
        const { finalTranscript, interTranscript } = processResult(event.results);
        resultElement.innerHTML = finalTranscript + interTranscript;
    };

    recognition.onerror = function (event) {
        console.error("Speech recognition error: ", event.error);
    };

    recognition.onend = function () {
        console.log("Speech recognition ended.");
    };
}

function processResult(results) {
    let finalTranscript = '';
    let interTranscript = '';

    for (let i = 0; i < results.length; i++) {
        let transcript = results[i][0].transcript;
        transcript = transcript.replace("\n", "<br>");

        if (results[i].isFinal) {
            finalTranscript += transcript;
        } else {
            interTranscript = transcript;
        }
    }
    return { finalTranscript, interTranscript };
}

function stopConverting() {
    if (recognition) {
        recognition.stop();
    } else {
        console.warn("No active recognition instance to stop.");
    }
}

/*
const resultElement = document.getElementById("result")
let recognition;

function startConverting(){

    check whether use browers supports the function
    if('webkitSpeechRecognition' in window){
        recognition = new webkitSpeechRecognition();
        setuprecognition(recognition);
        recognition.start();
    }

}

function setuprecognition(recognition){
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = function(event){
        const {finalTranscript,interTranscript} = processResult(event.results); 
        //process result function inside this box
        resultElement.innerHTML = finalTranscript + interTranscript;
        
    }


}

function processResult(results){
    let finalTranscript = '';
    let interTranscript = '';
    for(let i = 0; i < results.length;i++){
        let transcript = results[i][0].transcript;
        transcript = transcript.replace("\n","<br>");

        if(results[i].isFinal){
            finalTranscript += transcript;

        }else{
            interTranscript = transcript;

        }
    

    }
    return(finalTranscript,interTranscript)
}

function stopConverting(){
    if(recognition){
        recognition.stop();
        
    }else{

    }

}


*/