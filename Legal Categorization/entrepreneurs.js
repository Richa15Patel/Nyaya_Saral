document.addEventListener("DOMContentLoaded", function () {
    const languageSwitcher = document.getElementById("languageSwitcher");

    function updateLanguage(lang) {
        fetch("entrepreneurs.json")
            .then(response => response.json())
            .then(translations => {
                if (translations[lang]) {
                    document.querySelectorAll("[data-key]").forEach(element => {
                        const key = element.getAttribute("data-key");
                        if (translations[lang][key]) {
                            element.innerHTML = translations[lang][key]; // Updates text dynamically
                        }
                    });
                } else {
                    console.error("Language data not found for:", lang);
                }
            })
            .catch(error => console.error("Error loading translations:", error));
    }

    // Load saved language from localStorage (default to English)
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    languageSwitcher.value = savedLanguage; // Set dropdown value
    updateLanguage(savedLanguage);

    // Change language and save it
    languageSwitcher.addEventListener("change", function () {
        const selectedLang = this.value;
        localStorage.setItem("selectedLanguage", selectedLang);
        updateLanguage(selectedLang);
    });
});
