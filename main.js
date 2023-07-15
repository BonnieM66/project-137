objects = [];
status = "";

function preload() {

}

function setup() {
    canvas = createCanvas(480, 380);
    canvas.center();

    video = createCapture(VIDEO);
    video.size(480, 380);
    video.hide();
}

function start() {
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("model_status").innerHTML = "status: detecting objects";
    input = document.getElementById("input").value;
    console.log(input);
}

function modelLoaded() {
    console.log("model loaded");
    status = true;
}

function gotResult(error, results) {
    if(error) {
        console.log(error);
    }
    console.log(results);
    objects = results;
}

function draw() {
    image(video, 0, 0, 480, 380);

    if(status != "") {
        objectDetector.detect(video, gotResult);
        document.getElementById("model_status").innerHTML = "status: object detected";
        for(i = 0; i < objects.length; i++) {
            fill("#FF0000")
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke("#FF0000");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if(objects[i].label == input) {
                video.stop();
                objectDetector.detect(gotResult);

                var synth = window.speechSynthesis;
                speak = "object mentioned found";
                var utterThis = new SpeechSynthesisUtterance(speak);
                synth.speak(utterThis);
                document.getElementById("object_status").innerHTML = "object mentioned found";
                
            } else {
                document.getElementById("object_status").innerHTML = "object mentioned not found";
            }
        }
    }
}