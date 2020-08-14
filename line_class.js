import {btnPop} from './helperFunctions.js';

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

    checkLine(point) { //https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment taken from here
        
        let x = point.x;
        let y = point.y

        let A = x - this.startingX;
        let B = y - this.startingY;
        let C = this.endPoint.x - this.startingX;
        let D = this.endPoint.y - this.startingY;
      
        let dot = A * C + B * D;
        let len_sq = C * C + D * D;
        let param = -1;
        if (len_sq != 0) //in case of 0 length line
            param = dot / len_sq;
      
        let xx, yy;
      
        if (param < 0) {
          xx = this.startingX;
          yy = this.startingY;
        }
        else if (param > 1) {
          xx = this.endPoint.x;
          yy = this.endPoint.y;
        }
        else {
          xx = this.startingX + param * C;
          yy = this.startingY + param * D;
        }
      
        let dx = x - xx;
        let dy = y - yy;
        return(Math.sqrt(dx * dx + dy * dy));
      }

      popButton() {
        btnPop($("#resize-btn"),this.endPoint.x+100,this.endPoint.y);
        
      }






}