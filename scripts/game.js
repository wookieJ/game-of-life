const canvasElem = document.getElementById('canvas');
const ctx = canvasElem.getContext('2d');

const planeWidth = 900;
const planeHeight = 900;

/**
 * Grid - plansza gry w życie
 */
function Grid(w, h)
{
    this.step = w < h ? w/(w<250 ? 10 : 50) : h/(h<250 ? 10 : 50);
    this.columns = Math.floor(w / this.step);
    this.rows = Math.floor(h / this.step);
    this.grid = [];
    
    for(i=0 ; i<this.columns ; i++)
    {
        this.grid[i] = [];
        for(j=0 ; j<this.rows ; j++)
            this.grid[i][j] = 0;
    }
    
    console.log(">> grid (" + this.columns + ";" + this.rows + ") created");
}

/**
 * Funkcja sprawdzająca stan pól planszy
 */
Grid.prototype.checkCellValue = function()
{
    for(i=0 ; i<this.columns ; i++)
    {
        for(j=0 ; j<this.rows ; j++)
        {
            if(this.grid[i][j] == 1)
            {
                ctx.beginPath();
                ctx.fillStyle = "black";
                ctx.rect(i*this.step, j*this.step, this.step, this.step);
                ctx.fill();
                ctx.stroke();
            }
            else
            {
                ctx.beginPath();
                ctx.fillStyle = "white";
                ctx.rect(i*this.step, j*this.step, this.step, this.step);
                ctx.fill();
                ctx.stroke();
            }
        }
    }
}

/*
 *  Setup function
 */
function setup()
{
    // rozmiar planszy
    canvasElem.width = planeWidth;
    canvasElem.height = planeHeight;
    canvasElem.style.backgroundColor = "white"
    
    // stworzenie siatki
    grid = new Grid(planeWidth, planeHeight);
    
    grid.grid[15][15] = 1;
    grid.grid[16][15] = 1;
    grid.grid[17][15] = 1;
}

/*
 *  Game loop
 */
function run()
{
    grid.grid[16][15] == 1 ? grid.grid[16][15]=0 : grid.grid[16][15]=1;
    grid.checkCellValue();
}

setup();
setInterval(run,750);