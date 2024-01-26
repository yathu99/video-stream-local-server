
var elem = document.getElementsByName('content');


function getFiles(){
    var xhr = new XMLHttpRequest();
    const url = "/listing";
    xhr.open('GET',url);
    xhr.onload = () =>{
        return xhr;
    }
    xhr.send();
}