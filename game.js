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
 * Funkcja rysująca wypełnienie martwych i żywych komórek
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

/**
 * Funkcja sprawdzająca stan pól planszy
 */
Grid.prototype.playGeneration = function()
{
    copyGrid = [];
    for(i=0 ; i<this.columns ; i++)
    {
        copyGrid[i] = [];
        for(j=0 ; j<this.rows ; j++)
            copyGrid[i][j] = this.grid[i][j];
    }
    
    for(i=0 ; i<this.columns ; i++)
    {
        for(j=0 ; j<this.rows ; j++)
        {        
            var cellCounter = 0;
            
            for(k=-1 ; k<2 ; k++)
            {
//                console.log(k);
                for(l=-1 ; l<2 ; l++)
                {
                    if(k != 0 || l != 0)
                    {
                        idx = i+k;
                        idy = j+l;
                        
                        if(idx >= 0 && idy >=0 && idx < this.columns && idy < this.rows)
                        {
                            // zabezepiczyć na brzegach albo zapętlić
                            if(this.grid[idx][idy] == 1)
                                cellCounter++;
                        }
                    }
                }
            }            
//            console.log(cellCounter);
            if(this.grid[i][j] == 0 && cellCounter == 3)
            {
                copyGrid[i][j] = 1;
//                console.log("ALIVE");
            }
            
            else if(this.grid[i][j] == 1 && (cellCounter < 2 || cellCounter > 3))
            {
                copyGrid[i][j] = 0;
//                console.log("DEAD");
            }
        }
    }
    
    this.grid = copyGrid;
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
    
    // szybowiec
    grid.grid[35][25] = 1;
    grid.grid[36][25] = 1;
    grid.grid[37][25] = 1;
    grid.grid[35][26] = 1;
    grid.grid[36][27] = 1;
}

/*
 *  Game loop
 */
function run()
{
    grid.playGeneration();
    grid.checkCellValue();
    
    // dodać brzegi / zapętlić
    // przycisk start/stop
    // edycja
}

setup();
setInterval(run,50);