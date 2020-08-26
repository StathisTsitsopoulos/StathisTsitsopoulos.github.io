import {btnPop,distanceBetweenPoints} from './helperFunctions.js';

export default class Rectangle {


    constructor(startingX,startingY,width, height) {
        this.startingX = startingX;
        this.startingY = startingY ;
        this.width = width;
        this.height = height; 
        this.centerX = startingX + width/2;
        this.centerY = startingY + height / 2;
        this.leftCornerX = startingX;
        this.leftCornerY = startingY;
        this.rightCornerX = startingX + width;
        this.rightCornerY = startingY;
        this.botLeftCornerX = startingX;
        this.botLeftCornerY = startingY + height;
        this.botRightCornerX = startingX + width;
        this.botRightCornerY = startingY + height;
        this.angle = 0;
        this.strokeStyle = 0;
        this.lineWidth = 0;
        this.text = "";
        this.font = 0;
        this.fillPermission = 0;
    }

    set fillStyle(fillStyle) {
        this.fillStyles = fillStyle;
        this.fillPermission = 1;
    }

    set cornersAfterRotate(angles) {
        this.leftCornerX = this.centerX - this.width/2 * Math.cos(angles) + this.height/2 * Math.sin(angles);
        this.leftCornerY = this.centerY - this.width/2 * Math.sin(angles) - this.height/2 * Math.cos(angles);

        this.rightCornerX = this.centerX + this.width/2 * Math.cos(angles) + this.height/2 * Math.sin(angles);
        this.rightCornerY = this.centerY + this.width/2 * Math.sin(angles) - this.height/2 * Math.cos(angles);

        this.botLeftCornerX = this.centerX - this.width/2 * Math.cos(angles) - this.height/2 * Math.sin(angles);
        this.botLeftCornerY = this.centerY - this.width/2 * Math.sin(angles) + this.height/2 * Math.cos(angles);

        this.botRightCornerX = this.centerX + this.width/2 * Math.cos(angles) - this.height/2 * Math.sin(angles);
        this.botRightCornerY = this.centerY + this.width/2 * Math.sin(angles) + this.height/2 * Math.cos(angles);
        this.angle = angles;
    }

    cornersAfterResize() {
        this.leftCornerX = this.startingX;
        this.leftCornerY = this.startingY;


        this.rightCornerX = this.startingX + this.width;
        this.rightCornerY = this.startingY;

        this.botLeftCornerY = this.startingY + this.height;
        this.botLeftCornerX = this.startingX;

        this.botRightCornerX = this.startingX + this.width;
        this.botRightCornerY = this.startingY + this.height;

        this.centerX = this.startingX + this.width/2;
        this.centerY = this.startingY + this.height/2;
    }



    checkRect (x,y) {
        if (x>this.startingX && x<this.startingX + this.width && y > this.startingY && y< this.startingY + this.height) {
            console.log("we gucci")
            return true;
        }
    }

    checkDistance (point) {  //Calculates the disances from the rectangle's corners and returns the smallest one
        let min = 10000;
        if (distanceBetweenPoints({x: this.leftCornerX,y: this.leftCornerY},{x: point.x, y: point.y}) < min) {
            min = distanceBetweenPoints({x: this.leftCornerX,y: this.leftCornerY},{x: point.x, y: point.y});
        }
        if (distanceBetweenPoints({x: this.rightCornerX,y: this.rightCornerY},{x: point.x, y: point.y}) < min) {
            min = distanceBetweenPoints({x: this.rightCornerX,y: this.rightCornerY},{x: point.x, y: point.y});
        }
        if (distanceBetweenPoints({x: this.botRightCornerX,y: this.botRightCornerY},{x: point.x, y: point.y}) < min) {
            min = distanceBetweenPoints({x: this.botRightCornerX,y: this.botRightCornerY},{x: point.x, y: point.y});
        }
        if (distanceBetweenPoints({x: this.botLeftCornerX,y: this.botLeftCornerY},{x: point.x, y: point.y}) < min) {
            min = distanceBetweenPoints({x: this.botLeftCornerX,y: this.botLeftCornerY},{x: point.x, y: point.y});
        }
        return (min);
    }

    
    //Test
    popButton () {
        btnPop($("#rotate-btn"),this.leftCornerX+100,this.leftCornerY);
        btnPop($("#x-btn"),this.rightCornerX+100,this.rightCornerY);
        btnPop($("#text-btn"),this.botLeftCornerX+100,this.botLeftCornerY);
        btnPop($("#resize-btn"),this.botRightCornerX+100,this.botRightCornerY);
        btnPop($("#drag-btn"),this.centerX+100,this.centerY);
    }

    restore (ctx) {
        
        ctx.save();
        
            
        ctx.translate(this.startingX,this.startingY);

        ctx.translate(this.width/2,this.height/2);
        
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.font = this.font
        ctx.rect(-this.width/2, -this.height/2,this.width,this.height);
        if(this.fillPermission) {ctx.fillStyle = this.fillStyles; ctx.fill(); ctx.strokeStyle = this.fillStyles;}
        
       
        ctx.stroke();
        ctx.restore();


        ctx.save();
        ctx.translate(this.startingX,this.startingY);
        ctx.translate(this.width/2,this.height/2);
        ctx.rotate(this.angle);
        ctx.font = this.font
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
        console.log("redaw and angles ",this.angle*180/Math.PI);
    }

    move(dx,dy) {
        this.leftCornerX +=  dx;
        this.leftCornerY += dy;
        this.rightCornerX += dx;
        this.rightCornerY += dy;
        this.botLeftCornerX += dx;
        this.botLeftCornerY += dy;
        this.botRightCornerX += dx;
        this.botRightCornerY += dy;
        this.startingX += dx;
        this.startingY += dy;
        this.centerX = this.startingX + this.width/2;
        this.centerY = this.startingY + this.height / 2;


    }





}

//backup


    // set leftCorner(angles) {
    //     this.leftCornerX = this.centerX - this.width/2 * Math.cos(angles) + this.height/2 * Math.sin(angles);
    //     this.leftCornerY = this.centerY - this.width/2 * Math.sin(angles) - this.height/2 * Math.cos(angles);
    //     console.log("Center is "+this.centerX,this.centerY+"angles is "+angles*180/Math.PI+"cos of angles is"+Math.cos(angles))
    //     console.log("Left corner is now ",this.leftCornerX,this.leftCornerY);
    // }

    // set rightCorner(angles) {
    //     this.rightCornerX = this.centerX + this.width/2 * Math.cos(angles) + this.height/2 * Math.sin(angles);
    //     this.rightCornerY = this.centerY + this.width/2 * Math.sin(angles) - this.height/2 * Math.cos(angles);
    // }

    // set botLeftCorner(angles) {
    //     this.botLeftCornerX = this.centerX - this.width/2 * Math.cos(angles) - this.height/2 * Math.sin(angles);
    //     this.botLeftCornerY = this.centerY - this.width/2 * Math.sin(angles) + this.height/2 * Math.cos(angles);
    // }

    // set botRightCorner(angles) {
    //     this.botRightCornerX = this.centerX + this.width/2 * Math.cos(angles) - this.height/2 * Math.sin(angles);
    //     this.botRightCornerY = this.centerY + this.width/2 * Math.sin(angles) + this.height/2 * Math.cos(angles);
    // }
