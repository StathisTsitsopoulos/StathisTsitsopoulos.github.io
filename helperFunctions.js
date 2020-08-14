import Paint from './paint_class.js';
import Rectangle from './rect_class_test.js'

var paintArray = new Array();
var select = document.getElementById("projects");
var paintCounter = 1;
var active = 1;


export function btnPop(el,startingX,startingY) {
    el.css("position","absolute");
    el.css("left",startingX-15 + 'px');
    el.css("top",startingY-15+'px');
    el.css("display","block");
}

export function radiansToAngles (y,x){
    return Math.atan2(y, x);
}

export function closeButtons () {
    $("#x-btn").css("display","none");
    $("#rotate-btn").css("display","none");
    $("#text-btn").css("display","none");
    $("#textarea").css("display","none");
    $("#resize-btn").css("display", "none");
}

//PREVIOUS CHANGE PROJECT METHOD
export function paintArrayInit (paint) {
    paintArray.push(paint.ctx.getImageData(0,0,paint.canvas.width,paint.canvas.height));
}

export function addPaint(paint,value) {

    if (value == -1 ) {         //Adding a Paint
        console.log("Adding Paint");

        paintCounter++;
        select.options[select.options.length] = new Option("Project "+paintCounter, paintCounter);
        paintArray[active-1] = paint.ctx.getImageData(0,0,paint.canvas.width,paint.canvas.height);
        paint.ctx.clearRect(0, 0, paint.canvas.width, paint.canvas.height);
        paintArray.push(paint.ctx.getImageData(0,0,paint.canvas.width,paint.canvas.height))
        active = paintCounter;
        console.log(paintArray.length);
        $("#projects").val(paintCounter);
        return(paintArray[paintCounter-1]);
        
    }
    else {                      //Changing Paint
        paintArray[active-1] = paint.ctx.getImageData(0,0,paint.canvas.width,paint.canvas.height);
        active = value;
        return(paintArray[active-1]);

    }

    
}


export function lineDistance(p1, p2) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y)
}

export function checkDistance(e,layers) {
    var rep = 0;
    var contain = [0,0,0,0,0]
    for (let layer of layers ) {
        contain[rep]= layer.checkSelect(e,rep)
        rep += 1;
    }
    for (let struct of contain) {
        if (struct.number >0) {
            struct.shape.popButton();
            return struct.number;
        }
    }
    return 0 ;


}
