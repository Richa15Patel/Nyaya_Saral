document.addEventListener("DOMContentLoaded", function () {
    // Grab DOM elements
    const queryInput = document.getElementById("query");
    const searchBtn = document.getElementById("searchBtn");
    const languageSelect = document.getElementById("language");
    const resultDiv = document.getElementById("result");
    const voiceSearchBtn = document.getElementById("voiceSearchBtn");

    // Function to perform search via backend API
    function searchIPC() {
        const query = queryInput.value;
        const lang = languageSelect.value;

        fetch(`http://127.0.0.1:8000/search/?query=${encodeURIComponent(query)}&lang=${encodeURIComponent(lang)}`)
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    resultDiv.innerHTML = `<p>${data.message}</p>`;
                } else {
                    resultDiv.innerHTML = `
                        <h2>Section ${data.Section}</h2>
                        <p><strong>Description:</strong> ${data.Description}</p>
                        <p><strong>Offense:</strong> ${data.Offense}</p>
                        <p><strong>Punishment:</strong> ${data.Punishment}</p>
                        <p><strong>Translation (${lang}):</strong> ${data.Translation}</p>
                    `;
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                resultDiv.innerHTML = "<p>Error fetching data.</p>";
            });
    }

    // Bind the search function to the search button
    searchBtn.addEventListener("click", searchIPC);

    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.interimResults = false;
        recognition.continuous = false;

        function startVoiceRecognition() {
            // Map selected language to speech recognition language code
            const selectedLang = languageSelect.value;
            let speechLang = "en-US"; // default to English
            const langMap = {
                "English": "en-US",
                "Hindi": "hi-IN",
                "Tamil": "ta-IN",
                "Bengali": "bn-IN"
            };
            if (langMap[selectedLang]) {
                speechLang = langMap[selectedLang];
            }
            recognition.lang = speechLang;
            recognition.start();
        }

        // When speech is recognized, update the input box with the transcript
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            queryInput.value = transcript;
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            alert("Could not process voice input. Please try again.");
        };

        // Bind voice search button to start voice recognition
        voiceSearchBtn.addEventListener("click", startVoiceRecognition);
    } else {
        alert("Your browser does not support voice search.");
    }
});
