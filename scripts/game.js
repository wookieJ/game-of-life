const canvasElem = document.getElementById('canvas');
const ctx = canvasElem.getContext('2d');

const planeWidth = 800;
const planeHeight = 500;

// dodać zabezpieczenie przed rozjeżdżaniem się dla niepodzielnych bez reszty wymiarów

function Grid(w, h) {
    this.width = w;
    this.height = h;
    this.step = w < h ? w/(w<250 ? 10 : 50) : h/(h<250 ? 10 : 50);
}

Grid.prototype.draw = function()
{
    for(i=0 ; i<=this.width ; i+=this.step)
    {
        ctx.beginPath();
        ctx.moveTo(i,0);
        ctx.lineTo(i,this.height);
        ctx.stroke();
    }
    for(i=0 ; i<=this.height ; i+=this.step)
    {
        ctx.beginPath();
        ctx.moveTo(0,i);
        ctx.lineTo(this.width,i);
        ctx.stroke();
    }
}

function setup()
{
    // canvas sizes
    canvasElem.width = planeWidth;
    canvasElem.height = planeHeight;
    canvasElem.style.backgroundColor = "white"
    
    grid = new Grid(planeWidth, planeHeight);
    grid.draw();
}

//function run()
//{
//}

setup();
//setInterval(run,100);