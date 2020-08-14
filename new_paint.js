import Paint from './paint_class.js';
import { closeButtons, addPaint,paintArrayInit } from './helperFunctions.js';
import Project from './project_class.js'

var paint = new Paint("canvas");
var layer2 = new Paint("canvas2");
var layer3 = new Paint("canvas3");
var projectOptions = document.getElementById("projects");


//testctx =  JSON.parse(JSON.stringify(layer2.getRects()))


var layers = [paint,layer2,layer3];
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
var firstTime = 1;


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







document.querySelectorAll("[data-tool").forEach(                           //Tool event listener
    item => {
        item.addEventListener("click",function (e) {
            closeButtons();
            selection =  item.getAttribute("data-tool");

            if (selection == "line") {
                layersIndex = 2;
            }
            else if (selection == "rectangle" || selection == "select" || selection == "fill") {
                layersIndex = 1;
            }
            else {
                layersIndex = 0;
            }
            layers[layersIndex].activeSelection = selection;
        });
    }
)

document.querySelectorAll("[data-btn").forEach(                           //Btn event listener
    item => {
        item.addEventListener("click",function (e) {
            console.log("in here with "+ item.getAttribute("data-btn"))
            closeButtons();
            switch(item.getAttribute("data-btn")) {
                case "switch":
                    switcher = (switcher+1)%2;
                    break;
                case "undo":
                    let i = undoCanvasId[undoCanvasId.length-1]; // Index of layer to procced for the undo op
                    if (layers[i].undo(i) != 0 ) {
                        redoCanvasId.push(i)
                        undoCanvasId.pop();
                    }
                    break;
                case "redo":
                    let j = redoCanvasId[redoCanvasId.length-1]
                    if (layers[j].redo(j) != 0 ) {
                        undoCanvasId.push(j)
                        redoCanvasId.pop();
                    }
                    break;
                case "x-btn":
                    layers[layersIndex].closeShape();
                    break;
                case "text-btn":
                    layers[layersIndex].putText(e);
                    textSwitch = 1;
                    break;
                case "add":
                    projects.push(new Project(paint.getImage(),layer2.getRects(),layer3.getLines()));
                    redoCanvasId.length = 0;
                    undoCanvasId.length = 0;
                    projectsCounter += 1;
                    projectOptions.options[projectOptions.options.length] = new Option("Project "+projectsCounter,projectsCounter);
                    console.log(" I am in here")
                    projectOptions.value = projectsCounter;
                    projectIndex = projectsCounter-1;
                    //$("#projects").val(projectsIndex);
                    layersIndex = 0;
                    for (let item of layers) {
                        item.init();
                    }

                    console.log(projects)
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
    projects[projectIndex] = new Project(paint.getImage(),layer2.getRects(),layer3.getLines());

    projectIndex = $("#projects").val() - 1;
    
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
    paint.restoreImage(projects[projectIndex].image);
    layer2.restoreRects(projects[projectIndex].rects);
    layer3.restoreLines(projects[projectIndex].lines);
})
//======================CHANGING PROJECT====================

//==========================ROTATE AND RESIZE=========================
$("#rotate-btn").on('touchstart',(e)=>{      //Rotate
    rotate_perimssion = 1;
    layers[layersIndex].activeSelection = "rotate";
    closeButtons();
  
});
$("#rotate-btn").on('touchmove',(e)=>{      //Rotate
    rotate_perimssion = 1;
    layers[layersIndex].activeSelection = "rotate";
    closeButtons();
    draw();
  
});

$("#rotate-btn").on("mouseup",(e)=>{
    rotate_perimssion = 0;
});

$("#resize-btn").on("mousedown",(e)=>{      //Resize test
    resize_perimssion = 1;
    layers[layersIndex].activeSelection = "resize";
    closeButtons();
  
});

$("#resize-btn").on("mouseup",(e)=>{
    resize_perimssion = 0;
});
//=============================ROTATE AND RESIZE END==================



$("#color-pick").on("input",()=>{                                           //Color event listener
    if (switcher) {
        for (let item of layers) {
            item.activeColor = $("#color-pick").val();
        }
    }
    else {
        for (let item of layers) {
            item.activeThickness = Math.floor($("#color-pick").val()/153);
        }
    }
});
$("#color-pick").on("touchend",()=>{
    document.getElementById('slider-show').style.visibility = 'hidden';
});




function start (e) {
    
    e.preventDefault()
    if (textSwitch != 1) {

        if (selection != "select") {
            undoCanvasId.push(layersIndex);
        }
        
        
        layers[layersIndex].start(e);
        draw(e);
    }
}

function draw (e) {
    
    e.preventDefault()
    if (rotate_perimssion == 1) {layers[layersIndex].rotate(e);}
    else if (resize_perimssion == 1) {layers[layersIndex].resize(e);}
    else {layers[layersIndex].drawShape(e);}

}

function end (e) {
    
    e.preventDefault()
    if(textSwitch != 1) {
        
        rotate_perimssion = 0;
        resize_perimssion = 0;
        layers[layersIndex].end(e);
    }
    else {
        layers[layersIndex].popText();
        textSwitch = 0;
    }
   
}