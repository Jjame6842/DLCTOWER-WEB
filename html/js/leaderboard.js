window.onload = pageLoad;

function pageLoad(){
    readLeaderboard();
    document.getElementById('likebutton').onclick = getData;

}

function readLeaderboard() {
    fetch("/readLeaderboard")
        .then(response => response.json())
        .then(data => {
            console.log('Data from server:', data);
            showLeaderboard(data);
        })
        .catch(error => console.error('Error reading posts:', error));
}

function showLeaderboard(data) {
    var keys = Object.keys(data);
    var divTag = document.getElementById("leaderboard-container");
    divTag.innerHTML = "";
    
    for (var i = keys.length - 1; i >= 0; i--) {
        var temp = document.createElement("div");
        temp.className = "";
        divTag.appendChild(temp);

        var temp1 = document.createElement("div");
        temp1.className = "";
        temp1.innerHTML = data[keys[i]]["username"];
        temp.appendChild(temp1);

        var temp2 = document.createElement("div");
        temp2.className = "";
        temp2.innerHTML = data[keys[i]]["score"];
        temp.appendChild(temp2);

        var temp3 = document.createElement("div");
        temp3.className = "";
        temp3.innerHTML = data[keys[i]]["likes"];
        temp.appendChild(temp3);

        // Create a button with an IIFE
        var button = (function(username1, likes) {
            var btn = document.createElement("button");
            btn.innerHTML = "Click me";
            btn.addEventListener("click", function() {
                writelike(username1, likes);
            });
            return btn;
        })(temp1.innerHTML, temp3.innerHTML);

        // Append the button to the div
        temp.appendChild(button);
    }
}

async function writelike(username1) {
    const response = await fetch("/writelike", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username1: username1
        })
    });

    ////console.log('Response from server:', response);
    readPost();
}

