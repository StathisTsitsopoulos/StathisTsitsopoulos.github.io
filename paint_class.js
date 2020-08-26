import {btnPop,radiansToAngles,closeButtons,lineDistance} from './helperFunctions.js';
import Rectangle from './rect_class_test.js';
import Line from './line_class.js'
import Circle from './circle_class.js';
import Triangle from './triangle_class.js';

var angles = 0;
var radius = 0;
var curr = {x:0,y:0}


export default class Paint {
    //Xrwmata
    //save
    constructor(mycanvas) {
        this.canvas = document.getElementById(mycanvas);
        this.ctx = this.canvas.getContext("2d")
        this.ctx.strokeStyle = 'rgb(255,0,0)';
        this.permission = false;
       

    }


    set activeSelection (selection) {
        this.selection = selection;
        console.log(this.selection);
    }

    set activeThickness(value) {
        this.ctx.lineWidth = value;
    }

    set fontFamily(value) {

        let fontArgs = this.ctx.font.split(' ');
        value = value.toString();

        this.ctx.font = fontArgs[0]+" " + value; 
        $("#textarea").css("font-family",value);
    }

    set fontSize(value) {
        let fontArgs = this.ctx.font.split(' ');
        value = value.toString();
        this.ctx.font = value +"px " + fontArgs[fontArgs.length - 1]; 
        $("#textarea").css("font-size",value + "px");
    }


    
    set activeColor (value) {
        $("#slider-show").css("visibility",'visible');
        if (value<30) {
            this.ctx.strokeStyle = "black";
        }
        else if (value<=255) {
            this.ctx.strokeStyle = 'rgb(255,'+ value +',0)';
            $("#RGB-box").val("rgb(255,"+value+",0)");
        }
        else if (value<=2*255) {
            value = 255-value%255;
            this.ctx.strokeStyle  = 'rgb('+value+',255,0)';
            $("#RGB-box").val("rgb(255,"+value+",0)");
        }
        else if (value<=3*255) {
            value = value%255;
            this.ctx.strokeStyle  = 'rgb(0,255,'+value+')';
            $("#RGB-box").val("rgb(255,255," + value +"" );
        }
        else if (value<=4*255) {
            value = 255-value%255
            this.ctx.strokeStyle  = 'rgb(0,'+value+',255)';
            $("#RGB-box").val("rgb(255," + value +",255" );

        }
        else if (value<=5*255) {
            value  = value%255;
            this.ctx.strokeStyle  = 'rgb('+value+',0,255)';
            $("#RGB-box").val("rgb("+value+",0,255" );
        }
        else {
            value = 255-value%255;
            this.ctx.strokeStyle = 'rgb(255,0,'+value+')';
            $("#RGB-box").val("rgb(255,0,"+value+"" );
        }
        $("#slider-show").css("background-color",this.ctx.strokeStyle);
        $("#RGB-box").css("background-color",this.ctx.strokeStyle);
        $(".slider").css("background",this.ctx.strokeStyle);
        
    }

    init () {
        this.canvas.width =  window.innerWidth;
        this.canvas.height =  window.innerHeight -300;
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = 'rgb(255,0,0)';
        this.ctx.lineCap = "round";
        this.selection = "brush";
        this.restoreColor = 'rgb(255,0,0)';
        this.undoArray = [];
        this.redoArray = [];
        this.textPermission = 0;
        this.rectObjects = [];
        this.lineObjects = [];
        this.triangleObjects = [];
        this.circleObjects = [];
        
        this.ctx.font = "30px Calibri"
        this.redoRectObjects = [];
        this.redoLineObjects = [];
        this.redoTriangleObjects = [];
        this.redoCircleObjects = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    start (e) {
        console.log("STARTING WITH ",this.selection)
        this.permission = true;
        if (this.selection != "select") {closeButtons();}



        if (this.selection == "eraser") { this.restoreColor = this.ctx.strokeStyle;}

        if (this.selection != "select") {
            this.startingImage = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
            
            if (this.undoArray.length < 10) {this.undoArray.push(this.startingImage);}
            else { this.undoArray.shift();   this.undoArray.push(this.startingImage);}
        }
        this.startingX = e.touches[0].clientX-100;
        this.startingY = e.touches[0].clientY;
        if (this.selection == "drag" || this.selection == "resize") {
            curr.x = this.startingX
            curr.y = this.startingY
        }
    }

    drawShape (e) {
        if (this.permission == true) {
            switch(this.selection) {
                
                case "eraser":

                    this.ctx.strokeStyle = "white";
                    this.ctx.lineTo(e.touches[0].clientX-100,e.touches[0].clientY);
                    this.ctx.stroke();
                    this.ctx.beginPath();
                    this.ctx.moveTo(e.touches[0].clientX-100,e.touches[0].clientY);
                    break;
                case "brush":
                    this.ctx.lineTo(e.touches[0].clientX-100,e.touches[0].clientY);
                    this.ctx.stroke();
                    this.ctx.beginPath();
                    this.ctx.moveTo(e.touches[0].clientX-100,e.touches[0].clientY);
                    break;
                case "rectangle":           
                       
                    this.ctx.putImageData(this.startingImage,0,0);
                    this.ctx.beginPath();
                    this.ctx.rect(this.startingX, this.startingY,e.touches[0].clientX - this.startingX,e.touches[0].clientY - this.startingY);
                    this.ctx.stroke();
                    $('#textarea').val('') //Test code
                    break;
                case "line":
                    this.ctx.putImageData(this.startingImage,0,0);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.startingX,this.startingY);
                    this.ctx.lineTo(e.touches[0].clientX-100, e.touches[0].clientY);
                    this.ctx.stroke();
                    break;
                case "circle":
                    let tempRadius = radius;
                    radius = Math.sqrt(Math.pow(e.touches[0].clientX - this.startingX,2)+Math.pow(e.touches[0].clientY - this.startingY,2));
                    if (this.startingX - radius < 0  || this.startingY-radius<0 || this.startingY + radius > this.canvas.height || this.startingX+radius>this.canvas.width-100) {radius = tempRadius;break;}
                    this.ctx.putImageData(this.startingImage,0,0);
                    this.ctx.beginPath();
                    this.ctx.arc(this.startingX,this.startingY,radius,0,Math.PI*2,true);
                    this.ctx.stroke();
                    break;
                case "triangle":
                    this.ctx.putImageData(this.startingImage,0,0);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.startingX,this.startingY);
                    this.ctx.lineTo(e.touches[0].clientX-100,this.startingY);
                    this.ctx.lineTo(e.touches[0].clientX-100,e.touches[0].clientY);
                    this.ctx.closePath();
                    this.ctx.stroke();
                    break;
            }
        }
    }

    end (e) {
        this.permission = false;
        
        if (this.selection == "rectangle") {
			if (e.changedTouches[0].clientX < this.startingX && e.changedTouches[0].clientY < this.startingY) {
                this.selectedRect = new Rectangle(e.changedTouches[0].clientX,e.changedTouches[0].clientY, Math.abs(this.startingX-e.changedTouches[0].clientX),Math.abs(this.startingY-e.changedTouches[0].clientY));
            }
            else if (e.changedTouches[0].clientX > this.startingX && e.changedTouches[0].clientY < this.startingY) {
                this.selectedRect = new Rectangle(this.startingX,e.changedTouches[0].clientY, Math.abs(this.startingX-e.changedTouches[0].clientX),Math.abs(this.startingY-e.changedTouches[0].clientY));
            }
            else if (e.changedTouches[0].clientX<this.startingX) {
                this.selectedRect = new Rectangle(e.changedTouches[0].clientX,this.startingY, Math.abs(this.startingX-e.changedTouches[0].clientX),Math.abs(this.startingY-e.changedTouches[0].clientY));
            }
            else {this.selectedRect = new Rectangle(this.startingX,this.startingY, Math.abs(this.startingX-e.changedTouches[0].clientX),Math.abs(this.startingY-e.changedTouches[0].clientY))}
            this.selectedRect.font = this.ctx.font;
            this.selectedRect.lineWidth = this.ctx.lineWidth;
            this.selectedRect.strokeStyle = this.ctx.strokeStyle;
            
            this.selectedRect.popButton();
            
            
            this.rectObjects.push(this.selectedRect);
        }
        else if (this.selection == "line") {
            this.selectedLine = new Line(this.startingX,this.startingY,lineDistance({x: this.startingX+100,y: this.startingY},{x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}),{x: e.changedTouches[0].clientX-100,y: e.changedTouches[0].clientY});
            this.selectedLine.strokeStyle = this.ctx.strokeStyle;
            this.selectedLine.lineWidth = this.ctx.lineWidth;
            this.selectedLine.popButton();
            this.lineObjects.push(this.selectedLine);
            
        }
        else if (this.selection == "triangle") {
            this.selectedTriangle = new Triangle({x: this.startingX,y: this.startingY},{x: e.changedTouches[0].clientX-100, y: this.startingY},{x: e.changedTouches[0].clientX-100,y:e.changedTouches[0].clientY});
            this.selectedTriangle.lineWidth = this.ctx.lineWidth;
            this.selectedTriangle.strokeStyle = this.ctx.strokeStyle;
            this.selectedTriangle.setCenter();
            this.selectedTriangle.popButton();
            this.triangleObjects.push(this.selectedTriangle);
            console.log("Ending triangle");
        }

        else if (this.selection == "circle") {
            this.selectedCircle = new Circle({x: this.startingX,y: this.startingY},radius);
            this.selectedCircle.strokeStyle = this.ctx.strokeStyle;
            this.selectedCircle.lineWidth = this.ctx.lineWidth;
            this.selectedCircle.popButton();
            this.circleObjects.push(this.selectedCircle)
            console.log("Ending circle")
        }
        
        else if (this.selection == "resize") {
            if (this.rectObjects.length>0) {
                this.selectedRect.cornersAfterResize();
                this.selectedRect.angle = 0;
                this.ctx.fillText(this.selectedRect.text, this.selectedRect.startingX+this.selectedRect.width/2,  this.selectedRect.startingY+this.selectedRect.height/2);
                this.selectedRect.popButton();
                this.selection = "rectangle";
            }
            else if (this.lineObjects.length>0) {
                this.selectedLine.popButton();
                this.selection = "line";
            }
            else if (this.triangleObjects.length>0) {
                this.selectedTriangle.setCenter();
                this.selectedTriangle.popButton();
                this.selection = "triangle";
            }
            else if (this.circleObjects.length>0) {
                this.selectedCircle.popButton();
                this.selection = "circle";
            }
        }
        
        else if (this.selection == "eraser") { this.ctx.strokeStyle = this.restoreColor;}
        else if (this.selection == "rotate") {//this.selectedRect.restore(this.ctx); 
            this.selectedRect.cornersAfterRotate = angles;
            this.selectedRect.popButton();
            this.selection = "rectangle";
            this.selectedRect.restore(this.ctx);
        }
        else if (this.selection == "drag") {
            if (this.rectObjects.length>0) {
                this.selectedRect.popButton();
                this.selectedRect.restore(this.ctx);
                this.selection = "rectangle";
            }
            else if (this.triangleObjects.length>0) {
                this.selectedTriangle.setCenter();
                this.selectedTriangle.popButton();
                this.selectedTriangle.restore(this.ctx);
                this.selection = "triangle";
            }
            else if (this.circleObjects.length>0) {
                this.selectedCircle.popButton();
                this.selectedCircle.restore(this.ctx);
                this.selection = "circle";
            }
        }
      
        

        this.ctx.beginPath()
        
    }

    

    checkSelect(e,layer) {
        let minDistance = 100000;
        let minItem;
        if (layer == 1) {
            for (let item of this.rectObjects) {
                if (item.checkRect(e.touches[0].clientX-100,e.touches[0].clientY) == true) {
                    if (item.checkDistance({x: e.touches[0].clientX-100,y: e.touches[0].clientY})< minDistance) {
                        minItem = item;
                        minDistance = item.checkDistance({x: e.touches[0].clientX-100,y: e.touches[0].clientY})
                    } 
                }
            }
            if (minDistance != 100000) {
                this.selectedRect = minItem;
                return {number:minDistance,shape:this.selectedRect};
            }
        }
        else if (layer == 2) {
            
            for (let item of this.lineObjects) {
                if (item.checkLine({x: e.touches[0].clientX-100,y: e.touches[0].clientY}) < 5) {
                    this.selectedLine = item;
                    
                    return {number:minDistance,shape:item};
                }
            }
        }
        else if (layer ==3 ) {
        
            for (let item of this.triangleObjects) {
                if (item.checkTriangle({x: e.touches[0].clientX-100,y: e.touches[0].clientY})) {
                    if (item.checkDistance({x: e.touches[0].clientX-100,y: e.touches[0].clientY})< minDistance) {
                        minItem = item;
                        minDistance = item.checkDistance({x: e.touches[0].clientX-100,y: e.touches[0].clientY})
                    } 
                }
                
            }
            if (minDistance != 100000) {
                this.selectedTriangle = minItem;
                
                return {number: minDistance, shape: this.selectedTriangle};
            }
            
        }
        else if (layer == 4) {
            for (let item of this.circleObjects) {
                if (item.checkCircle({x: e.touches[0].clientX-100,y: e.touches[0].clientY})) {
                    if (item.checkDistance({x: e.touches[0].clientX-100,y: e.touches[0].clientY})< minDistance) {
                        minItem = item;
                        minDistance = item.checkDistance({x: e.touches[0].clientX-100,y: e.touches[0].clientY})
                    } 
                }
            }
            if (minDistance != 100000) {
                this.selectedCircle = minItem;
                        
                return {number: minDistance,shape:this.selectedCircle};
            }


        }
        
        return 0;
         
    }

    fillObject(layer) {
        if (layer == 1)  {
            this.selectedRect.fillStyle = this.ctx.strokeStyle;
            this.selectedRect.restore(this.ctx);
                
        }

        else if (layer ==3) {
            this.selectedTriangle.fillStyle = this.ctx.strokeStyle;
            this.selectedTriangle.restore(this.ctx)
            
        }
        else if (layer ==4) {
            this.selectedCircle.fillStyle = this.ctx.strokeStyle;
            this.selectedCircle.restore(this.ctx)
        }

    }


    
    undo (layer) {  
        console.log("Undoing layer ",layer);
        //Undo for layer 4
        if (layer == 4 ) {
            if (this.circleObjects.length>0) {
                console.log(this.circleObjects.length);
                this.redoCircleObjects.push(this.circleObjects[this.circleObjects.length-1]);
                this.circleObjects.pop();

                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                for (let item of this.circleObjects) {
                    item.restore(this.ctx);
                }
            }
            else {
                return 0;
            }
        }
        //Undo for layer 3
        else if (layer == 3) {
            if (this.triangleObjects.length>0) {
                this.redoTriangleObjects.push(this.triangleObjects[this.triangleObjects.length-1]);
                this.triangleObjects.pop();

                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                for (let item of this.triangleObjects) {
                    item.restore(this.ctx);
                }
            }
            else {
                return 0;
            }
        }
        //Undo for layer 2
       
        else if (layer == 2) {
            if (this.lineObjects.length>0) {
                this.redoLineObjects.push(this.lineObjects[this.lineObjects.length-1]);
                this.lineObjects.pop();
                console.log("length is ",this.lineObjects.length)

                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                for (let item of this.lineObjects) {
                    item.restore(this.ctx);
                }
            }
            else {
                return 0;
            }
        }
        //Undo for layer 1
        else if (layer == 1) { 
            if (this.rectObjects.length>0) {
                this.redoRectObjects.push(this.rectObjects[this.rectObjects.length-1]);
                this.rectObjects.pop();
                console.log("length is ",this.rectObjects.length)

                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                for (let item of this.rectObjects) {
                    item.restore(this.ctx);
                }
            }
            else {
                return 0;
            }
        }
        else {
        //Undo for layer 0
            if (this.undoArray.length > 0) {
                let length = this.undoArray.length;
                if (length!=0) {
                    if (this.redoArray.length < 10) {this.redoArray.push(this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height));}
                    else { this.redoArray.shift();   this.redoArray.push(this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height));}
                    this.ctx.putImageData(this.undoArray[length-1],0,0);
                    this.undoArray.pop();
                }
            }
            else {
                return 0;
            }
        }
    }

    redo (layer) {
        if (layer == 4) {
            if(this.redoCircleObjects.length>0) {
                this.circleObjects.push(this.redoCircleObjects[this.redoCircleObjects.length-1]);
                this.redoCircleObjects.pop();
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                for (let item of this.circleObjects) {
                    item.restore(this.ctx);
                }
            }
            else {
                return 0;
            }
        }
        else if (layer == 3) {
            if(this.redoTriangleObjects.length>0) {
                this.triangleObjects.push(this.redoTriangleObjects[this.redoTriangleObjects.length-1]);
                this.redoTriangleObjects.pop();
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                for (let item of this.triangleObjects) {
                    item.restore(this.ctx);
                }
            }
            else {
                return 0;
            }
        }
        else if (layer == 2) {
            if(this.redoLineObjects.length>0) {
                this.lineObjects.push(this.redoLineObjects[this.redoLineObjects.length-1]);
                this.redoLineObjects.pop();
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                for (let item of this.lineObjects) {
                    item.restore(this.ctx);
                }
            }
            else {
                return 0;
            }

        }

        else if (layer == 1) {
            if (this.redoRectObjects.length>0) {
                this.rectObjects.push(this.redoRectObjects[this.redoRectObjects.length-1]);
                this.redoRectObjects.pop();
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                for (let item of this.rectObjects) {
                    item.restore(this.ctx);
                }
            }
            else {
                return 0;
            }
        }
        else {
            if (this.redoArray.length > 0) {
                console.log("Redoing");
                let length = this.redoArray.length;
                if (length!=0) {
                    if (this.undoArray.length < 10) {this.undoArray.push(this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height));}
                    else { this.undoArray.shift();   this.undoArray.push(this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height));}
                    this.ctx.putImageData(this.redoArray[length-1],0,0);
                    this.redoArray.pop();
                }
            }
            else {
                return 0;
            }
        }
    }
    
    closeShape (layer) {
        console.log("Closing Shape");
        closeButtons();
        let temp 
        if (layer == 1) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let item of this.rectObjects) {
                
                if (item != this.selectedRect) {

                    item.restore(this.ctx);       
                }
                else {
                    temp = item;
                }
            }
            this.rectObjects.splice(this.rectObjects.indexOf(temp),1);
            this.redoRectObjects.splice(this.redoRectObjects.indexOf(temp),1);
            this.undoArray.splice(this.undoArray.indexOf(temp),1);
            this.redoArray.splice(this.redoArray.indexOf(temp),1);
        }
        else if (layer == 3) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let item of this.triangleObjects) {
                if (item != this.selectedTriangle) {
                    item.restore(this.ctx);
                }
                else {
                    temp = item;
                }
            }
            this.triangleObjects.splice(this.triangleObjects.indexOf(temp),1);
            this.redoTriangleObjects.splice(this.redoTriangleObjects.indexOf(temp),1);
            this.undoArray.splice(this.undoArray.indexOf(temp),1);
            this.redoArray.splice(this.redoArray.indexOf(temp),1);
        }
        else if (layer == 4) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let item of this.circleObjects) {
                if (item != this.selectedCircle) {
                    item.restore(this.ctx);
                }
                else {
                    temp = item;
                }
            }
            this.circleObjects.splice(this.circleObjects.indexOf(temp),1);
            this.redoCircleObjects.splice(this.redoCircleObjects.indexOf(temp),1);
            this.undoArray.splice(this.undoArray.indexOf(temp),1);
            this.redoArray.splice(this.redoArray.indexOf(temp),1);
        }
        

    }

    rotate (e) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let item of this.rectObjects) {
            if (item != this.selectedRect) {
                item.restore(this.ctx);
            }
        }

        console.log("rotating");

        this.ctx.save();
            this.ctx.translate(this.selectedRect.startingX,this.selectedRect.startingY);
            this.ctx.translate(this.selectedRect.width/2,this.selectedRect.height/2);
            angles = radiansToAngles(e.touches[0].clientY-this.selectedRect.centerY,e.touches[0].clientX-this.selectedRect.centerX);
            this.ctx.rotate(angles);
            this.ctx.beginPath();
			this.ctx.strokeStyle = this.selectedRect.strokeStyle;
            this.ctx.rect(-this.selectedRect.width/2, -this.selectedRect.height/2,this.selectedRect.width,this.selectedRect.height);
            this.ctx.stroke();
            this.ctx.fillText(this.selectedRect.text, 0, 0);
            
        this.ctx.restore();
    }

    drag(e,layer) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        var dx = curr.x - (e.touches[0].clientX-100)
        var dy = curr.y - e.touches[0].clientY
        console.log("dx is ",dx,"dy is ",dy)
        curr.x = e.touches[0].clientX-100
        curr.y = e.touches[0].clientY
        if (layer == 1) {
            for (let item of this.rectObjects) {
                if (item != this.selectedRect) {
                    item.restore(this.ctx);
                }
            }
            console.log(this.selectedRect.leftCornerX, this.selectedRect.leftCornerY)
            this.selectedRect.move(-dx,-dy)
            this.selectedRect.restore(this.ctx);
        }
        else if (layer == 3) {
            for (let item of this.triangleObjects) {
                if (item != this.selectedTriangle) {
                    item.restore(this.ctx);
                }
            }
            this.selectedTriangle.move(-dx,-dy)
            this.selectedTriangle.restore(this.ctx)
        }
        else if (layer == 4) {
            for (let item of this.circleObjects) {
                if (item != this.selectedCircle) {
                    item.restore(this.ctx);
                }
            }
            this.selectedCircle.move(-dx,-dy)
            this.selectedCircle.restore(this.ctx)
        }


    }

    resize (e,layer) {
        console.log("resizing")
        if (layer == 1) {
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.selectedRect.height =  Math.abs(this.selectedRect.startingY-e.touches[0].clientY);
            this.selectedRect.width = Math.abs(this.selectedRect.startingX-e.touches[0].clientX);
            for (let item of this.rectObjects) {
                if (item != this.selectedRect) {
                    item.restore(this.ctx);
                }
            }
            this.ctx.beginPath();
            this.ctx.rect(this.selectedRect.startingX, this.selectedRect.startingY,e.touches[0].clientX - this.selectedRect.startingX,e.touches[0].clientY - this.selectedRect.startingY);
            if (this.selectedRect.fillPermission) {this.ctx.save(); this.ctx.fillStyle = this.selectedRect.fillStyles; this.ctx.fill();this.ctx.restore();}
            this.ctx.stroke();
            
        }
        else if (layer == 2) {
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let item of this.lineObjects) {
                if (item != this.selectedLine) {
                    item.restore(this.ctx);
                }
            }

            this.ctx.beginPath();
            this.ctx.moveTo(this.selectedLine.startingX,this.selectedLine.startingY);
            this.ctx.lineTo(e.touches[0].clientX-100, e.touches[0].clientY);
            this.ctx.stroke();
            
            this.selectedLine.endPoint.x = e.touches[0].clientX-100;
            this.selectedLine.endPoint.y = e.touches[0].clientY;
        }
        else if (layer == 3) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let item of this.triangleObjects) {
                if (item != this.selectedTriangle) {
                    item.restore(this.ctx);
                }
                
            }
            this.ctx.beginPath();
            this.ctx.moveTo(this.selectedTriangle.point1.x,this.selectedTriangle.point1.y);
            this.ctx.lineTo(e.touches[0].clientX-100,this.selectedTriangle.point1.y);
            this.ctx.lineTo(e.touches[0].clientX-100,e.touches[0].clientY);
            this.ctx.closePath();
            if (this.selectedTriangle.fillPermission) {this.ctx.save(); this.ctx.fillStyle = this.selectedTriangle.fillStyles; this.ctx.fill();this.ctx.restore();}
            this.ctx.stroke();
            this.selectedTriangle.point2.x = e.touches[0].clientX-100;
            this.selectedTriangle.point3 = {x:e.touches[0].clientX-100,y: e.touches[0].clientY};

        }
        else if (layer == 4) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let item of this.circleObjects) {
                if (item != this.selectedCircle) {
                    item.restore(this.ctx);
                }
            }

            this.ctx.beginPath();
            this.selectedCircle.radius = Math.sqrt(Math.pow(e.touches[0].clientX - this.selectedCircle.startingPoint.x,2)+Math.pow(e.touches[0].clientY - this.selectedCircle.startingPoint.y,2));
            this.ctx.arc(this.selectedCircle.startingPoint.x,this.selectedCircle.startingPoint.y,this.selectedCircle.radius,0,Math.PI*2,true);
            if (this.selectedCircle.fillPermission) {this.ctx.save(); this.ctx.fillStyle = this.selectedCircle.fillStyles; this.ctx.fill();this.ctx.restore();}
            this.ctx.stroke();


        }
        
    }

    putText(e) {
        btnPop($("#textarea"),this.selectedRect.centerX,this.selectedRect.centerY);
    }

    popText(){
        let text= $("#textarea").val();
        this.selectedRect.text = text;
        this.selectedRect.font = this.ctx.font;
        this.ctx.fillText(this.selectedRect.text, this.selectedRect.centerX-100, this.selectedRect.centerY);
        $("#textarea").css("display","none");
        $("#textarea").val("");
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let item of this.rectObjects) {
            item.restore(this.ctx);
        }


    }


    getRects() {
        return this.rectObjects;
    }

    getImage() {
        return this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
    }

    getLines() {
        return this.lineObjects;
    }

    getTriangles () {
        return this.triangleObjects;
    }

    getCircles() {
        return this.circleObjects;
    }

    restoreTriangles (triangleObjects) {
        this.triangleObjects = triangleObjects;
    }

    restoreCircles (circleObjects) {
        this.circleObjects = circleObjects;
    }

    restoreRects (rectObjects) {
        this.rectObjects = rectObjects;
    }
    
    restoreLines(lineObjects) {
        this.lineObjects = lineObjects;
    }

    restoreImage (image) {
        this.ctx.putImageData(image,0,0);
    }


}
//Rotate backup

   // let shapeWidth = 200;
        // let shapeHeight = 200;
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // for (let item of this.rectObjects) {
        //     if (item!= this.selectedRect) {
        //         console.log("Height:",item.height,"width: ",item.width,"angle",item.angle,"starting x,y: ",item.startingX,item.startingY)
        //         this.ctx.save();
                
                 
        //         this.ctx.translate(item.startingX,item.startingY);

        //         this.ctx.translate(item.width/2,item.height/2);
                
        //         this.ctx.lineWidth = item.lineWidth;
        //         this.ctx.strokeStyle = item.strokeStyle;
        //         this.ctx.rotate(item.angle);
        //         this.ctx.beginPath();
        //         this.ctx.rect(-item.width/2, -item.height/2,item.width,item.height);
        //         this.ctx.stroke();
        //         this.ctx.restore();
        //         console.log("redraw");

        //     }

        // }