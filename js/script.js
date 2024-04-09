// js/script.js

let counter = 0;

document.getElementById('like').addEventListener('click', function() {
    counter++;
    document.getElementById('visitorCount').innerText = "Visitor Count: " + counter;
});