import {btnPop} from './helperFunctions.js';

export default class Circle {

    constructor(startingPoint,radius) {
        this.startingPoint = startingPoint;
        this.radius = radius;
        this.strokeStyle = 0;
        this.lineWidth = 0;
        this.fillPermission = 0;
    }


    set fillStyle(fillStyle) {
        this.fillStyles = fillStyle;
        this.fillPermission = 1;
    }


    restore(ctx) {
        console.log("redraw")
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.arc(this.startingPoint.x,this.startingPoint.y,this.radius,0,Math.PI*2,true);
        if(this.fillPermission) {ctx.fillStyle = this.fillStyles; ctx.fill();}
        ctx.stroke();
        ctx.restore();

        console.log("redraw")

    }

    popButton() {
        btnPop($("#resize-btn"),this.startingPoint.x+100-this.radius,this.startingPoint.y);
        btnPop($("#x-btn"),this.startingPoint.x+100+this.radius,this.startingPoint.y);
        btnPop($("#drag-btn"),this.startingPoint.x+100,this.startingPoint.y)
    }

    checkCircle (point) {

        let square_dist = (this.startingPoint.x- point.x) ** 2 + (this.startingPoint.y - point.y) ** 2
        return square_dist <= this.radius **2
    }

    checkDistance(point) {

        let distance = Math.abs(Math.sqrt( Math.pow(point.x-this.startingPoint.x,2) + Math.pow(point.y - this.startingPoint.y,2)) - this.radius);
        return distance;
    }

    move(dx,dy) {
        this.startingPoint.x +=  dx;
        this.startingPoint.y += dy;
    }


}

