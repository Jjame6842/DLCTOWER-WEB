window.onload = pageLoad;

function pageLoad(){
	document.getElementById('postbutton').onclick = getData;
    document.getElementById('displayPic').onclick = fileUpload;
	document.getElementById('fileField').onchange = fileSubmit;

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
            alert('img'+pic);
            showImg('img/'+pic);
        })
        .catch(error => console.error('Error reading posts:', error));
}



function showPost(data){
	var keys = Object.keys(data);
	var divTag = document.getElementById("comment-container");
	divTag.innerHTML = "";
	for (var i = keys.length-1; i >=0 ; i--) {
		var temp = document.createElement("div");
		temp.className = "";
		divTag.appendChild(temp);

		var temp1 = document.createElement("div");
		temp1.className = "";
		temp1.innerHTML = data[keys[i]]["text"];
		temp.appendChild(temp1);

		var temp1 = document.createElement("div");
		temp1.className = "";
		temp1.innerHTML = data[keys[i]]["username"];
        temp.appendChild(temp1);
	}
}