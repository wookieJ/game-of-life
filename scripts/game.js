const canvasElem = document.getElementById('canvas');
const ctx = canvasElem.getContext('2d');

const startButton = document.getElementById('startButton');
const editButton = document.getElementById('editButton');

const paneWidth = 600;
const paneHeight = 600;

var playGeneration = false;
var editable = false;

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
 * Funkcja rysująca siatkę oraz wypełnienie martwych i żywych komórek
 */
Grid.prototype.checkCellValue = function()
{
    for(i=0 ; i<this.columns ; i++)
    {
        for(j=0 ; j<this.rows ; j++)
        {
            ctx.beginPath();
            
            if(this.grid[i][j] == 1)
                ctx.fillStyle = "black";
            else
                ctx.fillStyle = "white";
            
            ctx.rect(i*this.step, j*this.step, this.step, this.step);
            ctx.fill();
            ctx.stroke();
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
    
    // iteracja po każdej komórce
    for(i=0 ; i<this.columns ; i++)
    {
        for(j=0 ; j<this.rows ; j++)
        {        
            var cellCounter = 0;
            
            // iteracja po sąsiadach komórki
            for(k=-1 ; k<2 ; k++)
            {
                for(l=-1 ; l<2 ; l++)
                {
                    // komórka nie jest swoim sąsiadem
                    if(k != 0 || l != 0)
                    {
                        idx = i+k;
                        idy = j+l;
                        
                        // zapętlenie planszy
                        if(idx < 0)
                            idx = this.columns - 1;
                        else if(idx >= this.columns)
                            idx = 0;
                        
                        if(idy < 0)
                            idy = this.rows - 1;
                        else if(idy >= this.rows)
                            idy = 0;
                        
                        if(this.grid[idx][idy] == 1)
                            cellCounter++;
                    }
                }
            }
            
            // warunki umierania i ożwiania komórki
            if(this.grid[i][j] == 0 && cellCounter == 3)
                copyGrid[i][j] = 1;
            
            else if(this.grid[i][j] == 1 && (cellCounter < 2 || cellCounter > 3))
                copyGrid[i][j] = 0;
        }
    }
    
    this.grid = copyGrid;
}

/*
 * Funkcja obsługująca działanie przycisku start/stop
 */
function startButtonListener()
{
    console.log(">> startButton status: " + playGeneration);
    playGeneration = playGeneration == true ? false : true;
        
    if(playGeneration == true)
        startButton.textContent = "STOP";
    else
        startButton.textContent = "START";
}

/*
 * Funkcja obsługująca działanie przycisku edit
 */
function editButtonListener()
{
    console.log(">> editButton status: " + editable);
    editable = editable == true ? false : true;
        
    if(editable == true)
        editable.textContent = "EDIT";
    else
        editable.textContent = "STOP EDIT";
}

/*
 *  Setup function
 */
function setup()
{
    // rozmiar planszy
    canvasElem.width = paneWidth;
    canvasElem.height = paneHeight;
    canvasElem.style.backgroundColor = "white"
    
    // stworzenie siatki
    grid = new Grid(paneWidth, paneHeight);
    
    startButton.addEventListener("click", startButtonListener);
    editButton.addEventListener("click", editButtonListener);
    
    // szybowiec
    grid.grid[35][25] = 1;
    grid.grid[36][25] = 1;
    grid.grid[37][25] = 1;
    grid.grid[35][26] = 1;
    grid.grid[36][27] = 1;
    
    // szybowiec
    grid.grid[5][5] = 1;
    grid.grid[6][5] = 1;
    grid.grid[7][5] = 1;
    grid.grid[5][6] = 1;
    grid.grid[6][7] = 1;
}

/*
 *  Game loop
 */
function run()
{
    if(playGeneration == true)
        grid.playGeneration();
    grid.checkCellValue();
    
    // edycja
}

setup();
setInterval(run,100);