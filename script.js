const resultElement = document.getElementById("result");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
let recognition;

function sanitize(text) {
    // Basic sanitization: escape HTML special chars
    return text.replace(/[&<>"']/g, function (c) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]);
    });
}

function startConverting() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        setuprecognition(recognition);
        recognition.start();
        startBtn.disabled = true;
        stopBtn.disabled = false;
    } else {
        alert("Speech recognition not supported in this browser.");
    }
}

function setuprecognition(recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = function (event) {
        const { finalTranscript, interTranscript } = processResult(event.results);
        const output = finalTranscript + interTranscript;
        if (output.trim() === "") {
            resultElement.classList.add("placeholder");
            resultElement.textContent = "Click the microphone and start speaking...";
        } else {
            resultElement.classList.remove("placeholder");
            // Only allow <br> for line breaks, sanitize everything else
            resultElement.innerHTML = sanitize(output).replace(/\n|<br\s*\/?\s*>/gi, '<br>');
        }
    };

    recognition.onerror = function (event) {
        alert("Speech recognition error: " + event.error);
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };

    recognition.onend = function () {
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };
}

function processResult(results) {
    let finalTranscript = '';
    let interTranscript = '';
    for (let i = 0; i < results.length; i++) {
        let transcript = results[i][0].transcript;
        transcript = transcript.replace(/\n/g, "<br>");
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
    }
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

// Accessibility: allow keyboard shortcuts (Enter/Space on focused button)
[startBtn, stopBtn].forEach(btn => {
    btn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });
});

// Initialize button states
startBtn.disabled = false;
stopBtn.disabled = true;