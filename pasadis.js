const r = 500; // radium
const w = 1000;
const h = 500;
const p = Math.PI*2*r; //perimeter
const n = 64; // Number of vertices
const deltaAngulo = 2*Math.PI/n; // [rad]
const displayIntersections = false;
const displayLines = true;
const form = 1 // 0=cirlce 1=square

// Create a canvas that extends the entire screen
// and it will draw right over the other html elements, like buttons, etc
var canvas = document.createElement("canvas");
canvas.setAttribute("width", r*2 + 100);
canvas.setAttribute("height", r*2);
const centerX = r + 50;
const centerY = r*2/2;
// console.log(centerX);
canvas.setAttribute("style", "position: absolute; x:0; y:0;");
document.body.appendChild(canvas);

//Then you can draw a point at (10,10) like this:

var ctx = canvas.getContext("2d");

const vertices = getVertices(n);

// drawVertices(vertices)
if (displayIntersections) {
  const intersections = getIntersections(vertices);
  drawIntersections(intersections)
}
if (displayLines) {
  drawLines(vertices)
}


// ************************* FUNCTIONS ************************** //
// function to calculate the coordinates of all the vertices given n divisions of a circle
function getVertices(n){
  var vertices = [];
  if (form === 0) { // circle
    for (var i = 0; i < n; i++) {
      const v = [r*Math.cos(deltaAngulo*i), r*Math.sin(deltaAngulo*i)] // [x, y]
      vertices.push(v);
    }
  }
  if (form === 1) { // square
    const per = 4*w+4*h;
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < n/4 ; j++) {
        if (i === 0) {
          const X = w;
          const Y = -h+h/w*per*j/n;
          console.log('X:'+X+' Y='+Y);
          vertices.push([X,Y]);
        }
        if (i ===1) {
          const X = w - (1-h/w)*per/n*j
          const Y = h
          console.log('X:'+X+' Y='+Y);
          vertices.push([X,Y])
        }
        if (i===2) {
          const X = -w
          const Y = h-h/w*per/n*j;
          console.log('X:'+X+' Y='+Y);
          vertices.push([X,Y]);
        }
        if (i ===3) {
          const X = -w + (1-h/w)*per/n*j
          const Y = -h
          console.log('X:'+X+' Y='+Y);
          vertices.push([X,Y])
        }
      }
    }
  }
  return vertices;
}

// function to do all the possible intersections given all the vertices
function getIntersections(vertices){
  const n = vertices.length
  var intersections = [];
  for (var i = 0; i < n; i++) { // got trhough all vertices
    const v1 = vertices[i];
    for (var j = i+1; j < n+i-1; j++) { // go from the next point to the first, which means substracting i
      const v2 = vertices[j];
      for (var k = i+1; k < j; k++) {
        const v3 = vertices[k];
        for (var l = j+1; l < n; l++) {
          const v4 = vertices[l];
          if (displayIntersections) {
            const intersection = intersect(v1, v2, v3, v4);
            intersections.push(intersection);
          }
          // if (displayLines) {
          //   // console.log('draw!');
          //   drawLine(v1, v2);
          // }
        }
      }
    }
  }
  return intersections
}

// funciton to get the coordinates of the intersection between 2 lines
function intersect(v1, v2, v3, v4) {
  // equations:
  // y = a1*x + b1
  // y = a2*x + b2

  const a1 = (v2[1]-v1[1])/(v2[0]-v1[0]); // slope 1
  // console.log('a1=('+v2[1]+'-'+v1[1]+')/('+v2[0]+'-'+v1[0]+') = '+a1);
  const a2 = (v4[1]-v3[1])/(v4[0]-v3[0]); // slope 2
  // console.log('a2=('+v4[1]+'-'+v3[1]+')/('+v4[0]+'-'+v3[0]+') = '+a2);
  if ((a1 >= 99999) || (a1 <= -99999)) {
    const b2 = v3[1]-(a2*v3[0])
    const x = v1[0]
    const y = a2*x+b2
    return [x, y]
  }
  if ((a2 >= 99999) || (a2 <= -99999)) {
    const b1 = v1[1]-(a1*v1[0])
    const x = v3[0]
    const y = a1*x+b1
    return [x, y]
  } else {
    const b1 = v1[1]-(a1*v1[0])
    const b2 = v3[1]-(a2*v3[0])
    const x = (b2-b1)/(a1-a2)
    const y = x*a1 + b1
    return [x, y]
  }

}

// function to draw all the vertices
function drawVertices(vertices) {
  for (var i=0; i<vertices.length; i++){
    ctx.fillRect(centerX+vertices[i][0],centerY+vertices[i][1],8,8);
  }
}

// function to draw all the intersections
function drawIntersections(intersections){
  for (var i=0; i<intersections.length; i++){
    // console.log(intersections[i]);
    ctx.fillRect(centerX+intersections[i][0],centerY-intersections[i][1],1,1);
  }
}


// function to draw lines
function drawLine(v1, v2){
  ctx.moveTo(centerX+v1[0], centerY+v1[1]);
  ctx.lineTo(centerX+v2[0], centerY+v2[1]);
  ctx.lineWidth=1;
  ctx.strokeStyle="black";
  ctx.stroke();
}

// draw all lines
function drawLines(vertices){
  for (var i = 0; i < n; i++) {
    const startX = centerX + vertices[i][0];
    const startY = centerY - vertices[i][1];
    for (var j = 0; j < n; j++) {
      ctx.strokeStyle = 'rgb('+ Math.floor(255/n*i/2 + 255/n*i/3)+',' + Math.floor(255 - 255/n * i) + ', ' + Math.floor(255 - 255/n * j) + ')';
      // console.log('rgb('+ Math.floor(255/n*i) +',' + Math.floor(255 - 255/n * i) + ', ' + Math.floor(255 - 255/n * j) + ')');
      ctx.beginPath();
      ctx.moveTo(startX, centerY+vertices[i][1])
      // console.log('moved to: X='+startX+' Y='+startY);
      ctx.lineTo(centerX+vertices[j][0], centerY-vertices[j][1])
      ctx.stroke()
    }
  }
}
