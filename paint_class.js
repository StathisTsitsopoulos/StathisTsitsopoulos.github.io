import {btnPop,radiansToAngles,closeButtons,lineDistance} from './helperFunctions.js';
import Rectangle from './rect_class_test.js';
import Line from './line_class.js'

var angles = 0;

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
        $("#color-show").css("background-color",this.ctx.strokeStyle);
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
        this.shapeHeight = 0;
        this.shapeWidth = 0;
        this.textPermission = 0;
        this.rectObjects = [];
        this.redoRectObjects = [];
        this.lineObjects = [];
        this.redoLineObjects = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    start (e) {
        this.permission = true;
        closeButtons();


        if (this.selection == "eraser") { this.restoreColor = this.ctx.strokeStyle;}

        if (this.selection != "select") {
            this.startingImage = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
            
            if (this.undoArray.length < 10) {this.undoArray.push(this.startingImage);}
            else { this.undoArray.shift();   this.undoArray.push(this.startingImage);}
        }
        this.startingX = e.touches[0].clientX-100;
        this.startingY = e.touches[0].clientY;
        //this.ctx.rect(0, 0,e.touches[0].clientX,e.touches[0].clientY);
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
                    this.ctx.putImageData(this.startingImage,0,0);
                    this.ctx.beginPath();
                    this.ctx.arc(this.startingX,this.startingY,Math.sqrt(Math.pow(e.touches[0].clientX - this.startingX,2)+Math.pow(e.touches[0].clientY - this.startingY,2)),0,Math.PI*2,true);
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
                case "select":
                    for (let item of this.rectObjects) {
                       if (item.checkRect(e.touches[0].clientX-100,e.touches[0].clientY) == true) {
                            item.popButton();
                            this.selectedRect = item;
                       }
                    }
                    break;
                case "fill":
                    for (let item of this.rectObjects) {
                        if (item.checkRect(e.touches[0].clientX-100,e.touches[0].clientY) == true) {
                             item.fillStyle = this.ctx.strokeStyle;
                             item.restore(this.ctx);
                        }
                     }
            }
        }
    }

    end (e) {
        this.permission = false;
        if (this.selection == "rectangle") {
            // btnPop($("#x-btn"),e.touches[0].clientX,this.startingY);
            // btnPop($("#text-btn"),this.startingX,e.touches[0].clientY);
            
            this.shapeHeight = Math.abs(this.startingY-e.changedTouches[0].pageY);
            
            this.shapeWidth = Math.abs(this.startingX-e.changedTouches[0].pageX);
            
            this.selectedRect = new Rectangle(this.startingX,this.startingY,this.shapeWidth,this.shapeHeight)
            this.selectedRect.lineWidth = this.ctx.lineWidth;
            this.selectedRect.strokeStyle = this.ctx.strokeStyle;
            
            this.selectedRect.popButton();

            this.rectObjects.push(this.selectedRect);
        }
        if (this.selection == "line") {
            this.selectedLine = new Line(this.startingX,this.startingY,lineDistance({x: this.startingX+100,y: this.startingY},{x:e.touches[0].clientX,y:e.touches[0].clientY}),{x: e.touches[0].clientX-100,y: e.touches[0].clientY});
            this.selectedLine.strokeStyle = this.ctx.strokeStyle;
            this.selectedLine.lineWidth = this.ctx.lineWidth;
            this.lineObjects.push(this.selectedLine);
        }

        if (this.selection == "resize") {
            this.selectedRect.cornersAfterResize();
            this.ctx.fillText(this.selectedRect.text, this.selectedRect.startingX+this.selectedRect.width/2,  this.selectedRect.startingY+this.selectedRect.height/2);
            this.selectedRect.popButton();
            this.selection = "rectangle";

        }
        
        if (this.selection == "eraser") { this.ctx.strokeStyle = this.restoreColor;}
        if (this.selection == "rotate") {//this.selectedRect.restore(this.ctx); 
            this.selectedRect.popButton();this.selection = "rectangle";this.selectedRect.restore(this.ctx);}


        this.ctx.beginPath()
        
    }

   
    undo (layer) {  
        //Undo for layer 2
        console.log("Undoing");
        if (layer == 2) {
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
        //Undo for layer 0
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
        if (layer == 2) {
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
    
    closeShape () {
        console.log("Closing Shape");
        console.log(this.rectObjects.length+"REctobjects length")
        closeButtons();
        let temp 
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let item of this.rectObjects) {
            
            if (item != this.selectedRect) {
                if (item!= this.selectedRect ) {

                   item.restore(this.ctx);       
                }
            }
            else {
                temp = item;
            }
        }

        this.rectObjects.splice(this.rectObjects.indexOf(temp),1);
        this.redoRectObjects.splice(this.redoRectObjects.indexOf(temp),1);
        this.undoArray.splice(this.undoArray.indexOf(temp),1);
        this.redoArray.splice(this.redoArray.indexOf(temp),1);
        console.log(this.rectObjects.length+"REctobjects length")
        

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
            this.ctx.rect(-this.selectedRect.width/2, -this.selectedRect.height/2,this.selectedRect.width,this.selectedRect.height);
            this.ctx.stroke();
            this.ctx.fillText(this.selectedRect.text, 0, 0);
            this.selectedRect.cornersAfterRotate = angles;
        this.ctx.restore();
    }



    resize (e) {
        console.log("resizing")
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
        this.ctx.stroke();
        
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