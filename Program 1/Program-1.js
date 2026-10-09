// Object containing all predetermined rhyming words for given inputs
const rhymingWords = {
    "cat": ["fat", "rat", "splat", "bat", "hat", "chat"],
    "dog": ["frog", "cyborg", "fog", "log", "jog"],
    "moon": ["spoon", "soon", "tune", "balloon"],
}; 

// Function to find a rhyme
function findRhymes() {
    // Get the input word from the input field, convert it to lower case, and trim any extra spaces
    const inputWord = document.getElementById("wordInput").value.toLowerCase().trim(); 
    // Get the output box element
    const outputBox = document.getElementById("outputBox");

    // Check if the input word exists in the rhymingWords object
    if (rhymingWords[inputWord]) {
        const rhymes = rhymingWords[inputWord];
        // Display the rhyming words in the output box
        outputBox.innerHTML = `<strong>Rhyming words:</strong> ${rhymes.join(", ")}`;
    } else {
        //output message if no rhyming words are found
        outputBox.innerHTML = "<strong>No rhymes found for this word.</strong>";
    }
}

// button to call findRhymes function when clicked
document.getElementById("findRhymesButton").addEventListener("click", findRhymes);
