// Function to load CSV file and extract words
function loadWordsFromCSV(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '1000_most_used_words.csv', true);

    // When the request is loaded
    xhr.onload = function() {
        if (xhr.status === 200) {
            const wordsCSV = xhr.responseText;
            // Split by lines and extract words
            const wordsArray = wordsCSV.split(/\r?\n/);
            callback(wordsArray); // Call the callback function with the words array
        } else {
            console.error('Failed to load CSV file.');
        }
    };

    xhr.send(); // Send the request
}

// Function to find a replacement word based on last two letters
function findReplacementWord(targetWord, wordsArray) {
    let replacementWord = null;
    // Iterate over each word in wordsArray
    wordsArray.some(word => {
        // Check if the last two letters of the words match
        if (word.length >= 2 && targetWord.length >= 2 &&
            word.slice(-2).toLowerCase() === targetWord.slice(-2).toLowerCase()) {
            replacementWord = word;
            return true; // Exit loop once a matching word is found
        }
        return false; // Continue loop if no match
    });
    return replacementWord; // Return the found replacement word, or null if not found
}

// Function to process the poem and find a replacement for [?]
function processPoem(poem, wordsArray) {
    // Split the poem into lines
    const lines = poem.split(/\r?\n/);
    let replacedPoem = '';

    // Iterate over each line of the poem
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Check if the line contains '[?]' and there are at least two lines ahead
        if (line.includes('[?]') && i + 2 < lines.length) {
            const nextLine = lines[i + 2];
            const words = nextLine.trim().split(" ");
            const lastWord = words[words.length - 1].replace(/[^\w\s]|_/g, ""); // Remove punctuation

            // Find a replacement word from wordsArray where last two letters match
            const replacementWord = findReplacementWord(lastWord, wordsArray);

            // If a replacement word is found, replace '[?]' with it
            if (replacementWord) {
                replacedPoem += line.replace('[?]', replacementWord) + '\n';
            } else {
                replacedPoem += line + '\n'; // If no replacement found, keep the original line
            }
        } else {
            replacedPoem += line + '\n'; // If line doesn't contain '[?]', keep it as is
        }
    }

    return replacedPoem.trim(); // Return the processed poem
}

// Function to handle button click event
document.getElementById("findRhymesButton").addEventListener("click", function() {
    const poem = document.getElementById("poemInput").value;
    const outputBox = document.getElementById("outputBox");

    // Check if the poem input is empty
    if (poem.trim() === "") {
        outputBox.innerHTML = "<strong>Please enter a poem.</strong>";
        return;
    }

    // Load words from CSV and process the poem
    loadWordsFromCSV(function(wordsArray) {
        const processedPoem = processPoem(poem, wordsArray);
        // Display the processed poem in the output box
        outputBox.innerHTML = `<br><strong>Processed Poem:</strong><br><pre>${processedPoem}</pre>`;
    });
});
