import Paint from './paint_class.js';
import { closeButtons,checkDistance } from './helperFunctions.js';
import Project from './project_class.js'

var paint = new Paint("canvas");
var layer2 = new Paint("canvas2");
var layer3 = new Paint("canvas3");
var layer4 = new Paint("canvas4");
var layer5 = new Paint("canvas5");


var projectOptions = document.getElementById("projects");


//testctx =  JSON.parse(JSON.stringify(layer2.getRects()))


var layers = [paint,layer2,layer3,layer4,layer5];
var layersIndex = 0;

var projectsCounter = 1;
var projectIndex = -1;
var projects = []
var undoCanvasId = [];
var redoCanvasId = [];
var selection;

var textSwitch = 0;
var switcher = 1;
var rotate_perimssion = 0;
var resize_perimssion = 0;
var drag_perimssion = 0;
var previousItem = document.getElementById("brush");


var popText = document.getElementById("test")
var timeOut ;

for (let item of layers) {
    item.init();
}

// paint.canvas.addEventListener('mousedown',start);
// paint.canvas.addEventListener('mousemove',draw);
// paint.canvas.addEventListener('mouseup',end);   
//MOBILE TESTING
canvas.addEventListener('touchstart',start);
canvas.addEventListener('touchmove',draw);
canvas.addEventListener('touchend', end);
//document.addEventListener('touchmove',draw)

document.querySelectorAll("[data-tool").forEach(                           //Tool event listener
    item => {
        item.addEventListener("click",function () {
            selection =  item.getAttribute("data-tool");
            
            previousItem.classList.remove("active")
            item.classList.add("active");
            previousItem = item;
            closeButtons();
            clearTimeout(timeOut);
            popText.innerHTML = selection;
            timeOut = setTimeout(textHide,3000);
            if (selection == "circle") {
                layersIndex = 4;
            }
            else if (selection == "triangle") {
                layersIndex = 3;
            }
            else if (selection == "line") {
                layersIndex = 2;
            }
            else if (selection == "rectangle") {
                layersIndex = 1;
            }
            else {
                layersIndex = 0;
            }
            if (selection == "fill") {$("#RGB-box").trigger("click");}
            layers[layersIndex].activeSelection = selection;
        });
    }
)

document.querySelectorAll("[data-btn").forEach(                           //Btn event listener
    item => {
        item.addEventListener("click",function (e) {
            console.log("in here with "+ item.getAttribute("data-btn"))
            closeButtons();
            if (item.getAttribute("data-btn") == "undo" || item.getAttribute("data-btn") == "redo") {
                clearTimeout(timeOut);
                popText.innerHTML = item.getAttribute("data-btn");
                timeOut = setTimeout(textHide,3000);
            }
            switch(item.getAttribute("data-btn")) {
                case "undo":
                    if (undoCanvasId.length == 0) {console.log("nothing to undo")}
                    else {
                        let i = undoCanvasId[undoCanvasId.length-1]; // Index of layer to procced for the undo op
                        if (layers[i].undo(i) != 0 ) {
                            redoCanvasId.push(i)
                            undoCanvasId.pop();
                        }
                    }
                    break;
                case "redo":
                    if (redoCanvasId.length == 0 ) {console.log("nothing to redo")}
                    else {
                        let j = redoCanvasId[redoCanvasId.length-1]
                        if (layers[j].redo(j) != 0 ) {
                            undoCanvasId.push(j)
                            redoCanvasId.pop();
                        }
                    }
                    break;
                case "x-btn":
                    layers[layersIndex].closeShape(layersIndex);
                    break;
                case "text-btn":
                    layers[layersIndex].putText(e);
                    $('#textarea').focus();
                    textSwitch = 1;
                    break;
                case "add":
                    if(projectsCounter<4) {
                        projects.push(new Project(paint.getImage(),layer2.getRects(),layer3.getLines(),layer4.getTriangles(),layer5.getCircles()));
                        redoCanvasId.length = 0;
                        undoCanvasId.length = 0;
                        projectsCounter += 1;
                        projectOptions.options[projectOptions.options.length] = new Option("Project "+projectsCounter,projectsCounter);
                        console.log(" I am in here")
                        projectOptions.value = projectsCounter;
                        projectIndex = projectsCounter-1;
                        layersIndex = 0;
                        for (let item of layers) {
                            item.init();
                        }
                        document.querySelector('#add').style.background = "none";
                        previousItem.classList.remove("active");
                        previousItem = document.getElementById("brush");
                        previousItem.classList.add("active");
                        selection = "brush";

                        console.log(projects)
                    }
                    else {alert("Maximum of 4 Projects allowed")}
                    break;
            }
        });
    }
)

document.querySelectorAll("[data-text").forEach(                           //Text event listener
    item => {
        item.addEventListener("change",function (e) {
            switch(item.getAttribute("data-text")) {
                case "fontSize":
                    console.log("Changing Font size");

                    layers[layersIndex].fontSize = $(this).val() ;
                    break;
                case "fontFamily":
                    console.log("Changing Font family");
                    layers[layersIndex].fontFamily = $(this).val();
                    break;
            }
        });
    }
)
//===================CHANGE PROJECT==========================
$("#projects").on("change",function () {    //Change project
    console.log(projectIndex);
    console.log(projects);
    projects[projectIndex] = new Project(paint.getImage(),layer2.getRects(),layer3.getLines(),layer4.getTriangles(),layer5.getCircles());

    projectIndex = $("#projects").val() - 1;

    previousItem.classList.remove("active");
    previousItem = document.getElementById("brush");
    previousItem.classList.add("active");
    selection = "brush";
    
    for (let item of layers) {
        item.init();
    }
    redoCanvasId.length = 0;
    undoCanvasId.length = 0;
    layersIndex = 0;

    for (let item of projects[projectIndex].rects) {
        item.restore(layer2.ctx)
    }
    for (let item of projects[projectIndex].lines) {
        item.restore(layer3.ctx)
    }
    for (let item of projects[projectIndex].triangles) {
        item.restore(layer4.ctx)
    }
    for (let item of projects[projectIndex].circles) {
        item.restore(layer5.ctx)
    }
    paint.restoreImage(projects[projectIndex].image);
    layer2.restoreRects(projects[projectIndex].rects);
    layer3.restoreLines(projects[projectIndex].lines);
    layer4.restoreTriangles(projects[projectIndex].triangles);
    layer5.restoreCircles(projects[projectIndex].circles);
    // console.log(layer2.getRects().length)
    

    // let image = addPaint(paint,$("#projects").val());
    // paint.ctx.putImageData(image,0,0);
})
//======================CHANGING PROJECT====================

//==========================ROTATE AND RESIZE AND DRAG=========================
$("#rotate-btn").on("touchstart",(e)=>{      //Rotate+
    e.preventDefault();
    rotate_perimssion = 1;
    layers[layersIndex].activeSelection = "rotate";
    selection = "rotate"
    
    closeButtons();
    start(e);
});

$("#rotate-btn").on("touchmove",(e)=>{
    draw(e);
});


$("#rotate-btn").on("touchend",(e)=>{
    rotate_perimssion = 0;
    
    end(e);
});

$("#drag-btn").on("touchstart",(e)=>{      //DRAG
    e.preventDefault();
    drag_perimssion = 1;
    layers[layersIndex].activeSelection = "drag";
    selection = "drag"
    
    closeButtons();
    start(e);
});

$("#drag-btn").on("touchmove",(e)=>{
    draw(e);
});


$("#drag-btn").on("touchend",(e)=>{
    drag_perimssion = 0;
    
    end(e);
});

$("#resize-btn").on("touchstart",(e)=>{      //Resize test
    selection = "resize"

    resize_perimssion = 1;
    layers[layersIndex].activeSelection = "resize";
    closeButtons();
    start(e);
});

$("#resize-btn").on("touchmove",(e)=>{
    draw(e);
});

$("#resize-btn").on("touchend",(e)=>{
    resize_perimssion = 0;
    end(e);
});

//=============================ROTATE AND RESIZE AND DRAG END==================

$("#projectName").on("click",()=> {
    let txt =  prompt("Please enter your project name: ");
    console.log(txt);
    if (txt != null && txt != "") {
        if (projectIndex==-1) {projectOptions.options[0].text = txt;}
        else {projectOptions.options[projectIndex].text = txt;}
    }
});


$("#colorPick").on("input",()=>{                                           //Color event listener
    clearTimeout(timeOut);
    if (switcher) {
        popText.innerHTML = "colorPick";
        for (let item of layers) {
            item.activeColor = $("#colorPick").val();
        }
    }
    else {
        popText.innerHTML = "Thickness";
        for (let item of layers) {
            item.activeThickness = Math.floor($("#colorPick").val()/153);
        }
    }
    timeOut = setTimeout(textHide,3000);
});
$("#colorPick").on("touchend",()=>{
    document.getElementById('slider-show').style.visibility = 'hidden';
});

// ====================== COLOR and THICKNESS ======================//

$("#RGB-box").on("click",()=>{
    switcher = 1;
    
    $("#RGB-box").css("background-color",layers[layersIndex].ctx.strokeStyle);
    clearTimeout(timeOut);
    popText.innerHTML = "colorPick";
    timeOut = setTimeout(textHide,3000);
    document.getElementById("colorPick").classList.remove("slider2");
    document.getElementById("colorPick").classList.add("slider");
    $(".slider").css("background",layers[layersIndex].ctx.strokeStyle);

});

$("#thickness").on("click",()=>{
    switcher = 0;
    clearTimeout(timeOut);
    popText.innerHTML = "Thickness";
    timeOut = setTimeout(textHide,3000);
    $(".slider").css("background","grey");
    $("#RGB-box").css("background-color","grey");
    document.getElementById("colorPick").classList.remove("slider");
    document.getElementById("colorPick").classList.add("slider2");
    
});
//===============================================================//
function textHide () {
    popText.innerHTML = "";
}

function start (e) {
    e.preventDefault();
    if (textSwitch != 1) {

  
        if (selection == "select" || selection == "fill") {
            
            
            closeButtons();
            layersIndex = checkDistance(e,layers)
            layers[layersIndex].activeSelection = "select"
            if (selection == "fill") {
                layers[layersIndex].fillObject(layersIndex);
                layers[layersIndex].activeSelection = "fill";
            }
        }
        else {
            undoCanvasId.push(layersIndex);
            console.log(undoCanvasId) 
            layers[layersIndex].start(e);
            draw(e);
        }
    }
}

function draw (e) {
    e.preventDefault();
    if (rotate_perimssion == 1) {layers[layersIndex].rotate(e);}
    else if (resize_perimssion == 1) {layers[layersIndex].resize(e,layersIndex);}
    else if (drag_perimssion == 1) {layers[layersIndex].drag(e,layersIndex);}
    else {layers[layersIndex].drawShape(e);}

}

function end (e) {
    e.preventDefault();
    

    if(textSwitch != 1) {
        rotate_perimssion = 0;
        resize_perimssion = 0;
        drag_perimssion == 0;
        layers[layersIndex].end(e);
    }
    else {
        layers[layersIndex].popText();
        textSwitch = 0;
    }
   
}
//CHANGE PROJECT 1
