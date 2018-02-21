const canvasElem = document.getElementById('canvas');
const ctx = canvasElem.getContext('2d');

const startButton = document.getElementById('startButton');
const editButton = document.getElementById('editButton');
const clearButton = document.getElementById('clearButton');
const randomButton = document.getElementById('randomButton');
const generationNumberLabel = document.getElementById("generationNumber");

const paneWidth = 800;
const paneHeight = 600;

var playGeneration = false;
var editable = false;
var generationNumber = 0;

// stworzenie siatki
grid = new Grid(paneWidth, paneHeight);

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
            this.grid[i][j] = Math.random() < 0.5 ? 0 : 1;
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
        
    if(playGeneration == true)
    {
        playGeneration = false;
        startButton.textContent = "START";
    }
    else
    {
        playGeneration = true;
        editable = false;
        editButton.textContent = "EDIT";
        startButton.textContent = "STOP";
    }
}

/*
 * Funkcja obsługująca działanie przycisku edit
 */
function editButtonListener()
{
    console.log(">> editButton status: " + editable);
        
    if(editable == false && playGeneration == false)
    {
        editable = true;
        editButton.textContent = "STOP EDIT";
    }
    else
    {
        editable = false;
        editButton.textContent = "EDIT";
    }
}

/*
 * Funkcja czyści pole
 */
function clearButtonListener()
{
    playGeneration = false;
    startButton.textContent = "START";
    generationNumber = 0;
    
    for(i=0 ; i<grid.columns ; i++)
    {
        grid.grid[i] = [];
        for(j=0 ; j<grid.rows ; j++)
            grid.grid[i][j] = 0;
    }
    
}

/*
 * Funkcja uzupełnia losowo siatkę
 */
function randomButtonListener()
{
    for(i=0 ; i<grid.columns ; i++)
    {
        grid.grid[i] = [];
        for(j=0 ; j<grid.rows ; j++)
            grid.grid[i][j] = Math.random() < 0.5 ? 0 : 1;
    }
    generationNumber = 0;
}

/*
 * Funkcja służąca do edycji komórek na planszy poprzez kliknięcie myszką
 */
function invertCell(event)
{
    if(editable)
    {
        idx = Math.floor((event.clientX - canvasElem.offsetLeft - 20) / grid.step);
        idy = Math.floor((event.clientY - canvasElem.offsetTop - 20) / grid.step);

        if(idx>=0 && idx<grid.columns && idy>=0 && idy<grid.rows)
        {
            grid.grid[idx][idy] = grid.grid[idx][idy] == 1 ? 0 : 1;
        }
    }
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
    
    initialStart = playGeneration == true ? "STOP" : "START";
    startButton.textContent = initialStart;
    
    initialStart = editable == true ? "EDIT STOP" : "EDIT";
    editButton.textContent = initialStart;
    
    startButton.addEventListener("click", startButtonListener);
    editButton.addEventListener("click", editButtonListener);
    clearButton.addEventListener("click", clearButtonListener);
    randomButton.addEventListener("click", randomButtonListener);
    canvasElem.addEventListener("click", invertCell);
}

/*
 *  Game loop
 */
function run()
{
    generationNumberLabel.textContent = generationNumber;
    if(playGeneration == true)
    {
        grid.playGeneration();
        generationNumber++;
    }
    grid.checkCellValue();
}

setup();
setInterval(run,100);