window.onload = pageLoad;

function pageLoad(){
	document.getElementById('postbutton').onclick = getData;
    document.getElementById('displayPic').onclick = fileUpload;
	document.getElementById('fileField').onchange = fileSubmit;
    

    readLeaderboard();
    readPic();
    readPost();
	
}

function getData(){
    var msg = document.getElementById("textmsg").value;
    document.getElementById("textmsg").value = "";
    writePost(msg);
}

///imgzone
function fileUpload(){
    alert("getpic");
	document.getElementById('fileField').click();
}

function fileSubmit(){
	document.getElementById('formId').submit();
}

function showImg(filename){
	if (filename !==""){
		var showpic = document.getElementById('displayPic');
		showpic.innerHTML = "";
		var temp = document.createElement("img");
		temp.src = filename;
		showpic.appendChild(temp);
	}
}


////
async function writePost(msg){
    console.log('Writing post:', msg);

    const response = await fetch("/writePost", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: msg
        })
    });

    console.log('Response from server:', response);
    readPost();
}

function readPost() {
    fetch("/readPost")
        .then(response => response.json())
        .then(data => {
            console.log('Data from server:', data);
            showPost(data);
        })
        .catch(error => console.error('Error reading posts:', error));
}

function readPic() {
    fetch("/readPic")
        .then(response => response.json())
        .then(pic => {
            showImg('img/'+pic);
        })
        .catch(error => console.error('Error reading posts:', error));
}



function showPost(data) {
    var keys = Object.keys(data);
    var divTag = document.getElementById("comment-container");
    divTag.innerHTML = "";

    for (var i = keys.length - 1; i >= 0; i--) {
        var temp = document.createElement("div");
        temp.className = "newsfeed";
        divTag.appendChild(temp);

        var temp1 = document.createElement("div");
        temp1.className = "postmsg";
        temp1.innerHTML = "@" + data[keys[i]]["username"] + ": " + data[keys[i]]["text"];
        temp.appendChild(temp1);
    }
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

    // Sort keys based on score in descending order
    keys.sort(function (a, b) {
        return data[b]["score"] - data[a]["score"];
    });

    var divTag = document.getElementById("leaderboard-container");
    divTag.innerHTML = "";

    for (var i = 0; i < keys.length; i++) {
        var temp = document.createElement("div");
        temp.className = "leaderboard-entry"; // Add a class for styling
        divTag.appendChild(temp);

        var temp1 = document.createElement("div");
        temp1.className = "leaderboard-username";
        temp1.innerHTML = data[keys[i]]["username"];
        temp.appendChild(temp1);

        var temp2 = document.createElement("div");
        temp2.className = "leaderboard-score";
        temp2.innerHTML = "Score: " + data[keys[i]]["score"];
        temp.appendChild(temp2);

        var temp3 = document.createElement("div");
        temp3.className = "leaderboard-likes";
        temp3.innerHTML = "Likes: " + data[keys[i]]["likes"];
        temp.appendChild(temp3);

        // Create a container div for the text and button
        var containerDiv = document.createElement("div");
        containerDiv.className = "text-button-container";
        temp.appendChild(containerDiv);

        // Create a button with an IIFE
        var button = (function (username, likes) {
            var btn = document.createElement("button");
            btn.innerHTML = "Like";
            btn.addEventListener("click", function () {
                writelike(username, likes);
            });
            return btn;
        })(temp1.innerHTML, data[keys[i]]["likes"]);

        // Append the button to the container div
        containerDiv.appendChild(button);
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

