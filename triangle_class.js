import {btnPop,distanceBetweenPoints} from './helperFunctions.js';

export default class Triangle {


    constructor(point1,point2,point3) {
        this.point1 = point1;
        this.point2 = point2;
        this.point3 = point3;   
        this.strokeStyle = 0;
        this.lineWidth = 0;
        this.fillPermission = 0;
        this.center = {x:0,y:0};
        this.base = distanceBetweenPoints(point2,point3);
        this.height = distanceBetweenPoints(point1,point2);
        console.log("Base is ",this.base," and height is ",this.height)
        this.angle = 0;
    }


    set fillStyle(fillStyle) {
        this.fillStyles = fillStyle;
        this.fillPermission = 1;
    }



    restore (ctx) {
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(this.point1.x,this.point1.y);
        ctx.lineTo(this.point2.x,this.point2.y);
        ctx.lineTo(this.point3.x,this.point3.y);
        if(this.fillPermission) {ctx.fillStyle = this.fillStyles; ctx.fill();}
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        console.log("redraw");
    }

    popButton() {
        btnPop($("#resize-btn"),this.point2.x+100,this.point2.y);
        btnPop($("#x-btn"),this.point1.x+100,this.point1.y);
        // btnPop($("#rotate-btn"),this.point3.x+100,this.point3.y);
        btnPop($("#drag-btn"),this.center.x+100,this.center.y)
        
    }

    checkTriangle(point) {
        let point1 = this.point1;
        let point2 = this.point2;
        let point3 = this.point3;


        var as_x = point.x-point1.x;
        var as_y = point.y-point1.y;

        let s_ab = (point2.x-point1.x)*as_y-(point2.y-point1.y)*as_x > 0;

        if((point3.x-point1.x)*as_y-(point3.y-point1.y)*as_x > 0 == s_ab) return false;

        if((point3.x-point2.x)*(point.y-point2.y)-(point3.y-point2.y)*(point.x-point2.x) > 0 != s_ab) return false;

        return true;
    }

    checkDistance (point) {  //Calculates the disances from the rectangle's corners and returns the smallest one
    let min = 10000;
    if (distanceBetweenPoints({x: this.point1.x,y: this.point1.y},{x: point.x, y: point.y}) < min) {
        min = distanceBetweenPoints({x: this.point1.x,y: this.point1.y},{x: point.x, y: point.y});
    }
    if (distanceBetweenPoints({x: this.point2.x,y: this.point2.y},{x: point.x, y: point.y}) < min) {
        min = distanceBetweenPoints({x: this.point2.x,y: this.point2.y},{x: point.x, y: point.y});
    }
    if (distanceBetweenPoints({x: this.point3.x,y: this.point3.y},{x: point.x, y: point.y}) < min) {
        min = distanceBetweenPoints({x: this.point3.x,y: this.point3.y},{x: point.x, y: point.y});
    }
    console.log("min distance is ",min)
    return (min);


    }

    setCenter() {
        this.center.x = (this.point1.x+this.point2.x+this.point3.x)/3;
        this.center.y =  (this.point1.y+this.point2.y+this.point3.y)/3;
    }

    move(dx,dy) {
        this.point1.x +=  dx;
        this.point1.y += dy;
        this.point2.x += dx;
        this.point2.y += dy;
        this.point3.x += dx;
        this.point3.y += dy;
       
        this.center.x = (this.point1.x+this.point2.x+this.point3.x)/3;
        this.center.y =  (this.point1.y+this.point2.y+this.point3.y)/3;
    }

}


