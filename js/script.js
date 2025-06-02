// js/script.js

let counter = localStorage.getItem('visitorCount') ? parseInt(localStorage.getItem('visitorCount')) : 0;
document.getElementById('visitorCount').innerText = "Visitor Count: " + counter;

document.getElementById('like').addEventListener('click', function() {
    counter++;
    document.getElementById('visitorCount').innerText = "Visitor Count: " + counter;
    localStorage.setItem('visitorCount', counter);
});