export default class Line {


    constructor(startingX,startingY,length,endPoint) {
        this.startingX = startingX;
        this.startingY =startingY;
        this.length = length;
        this.endPoint = endPoint;
        this.strokeStyle = 0;
        this.lineWidth = 0;
    }




    restore (ctx) {
        
        ctx.save();
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(this.startingX,this.startingY);
        ctx.lineTo(this.endPoint.x,this.endPoint.y);
        ctx.stroke();
        ctx.restore();

        console.log("redraw");
    }






}