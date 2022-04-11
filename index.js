const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

document.addEventListener("DOMContentLoaded", () => {

    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = () => {

        const data = JSON.parse(request.responseText);
        console.log(data);

    }
})