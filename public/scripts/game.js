import * as frontend from "./frontend.js"

const FIELD_WIDTH = 750
const FIELD_MARGIN = 1 
const FIELD_SIZE = 16

const TILE_EMPTY = 0
const TILE_SNAKE = 1
const TILE_BONUS = 2

const STYLES = new Map([
    [TILE_EMPTY, "tile-empty"],
    [TILE_SNAKE, "tile-snake"],
    [TILE_BONUS, "tile-bonus"]
])


const CONTROL_LEFT = 0
const CONTROL_UP = 1
const CONTROL_RIGHT = 2
const CONTROL_DOWN = 3

const CONTROLS = new Map([
    [37, CONTROL_LEFT],
    [38, CONTROL_UP],
    [39, CONTROL_RIGHT],
    [40, CONTROL_DOWN],

    [65, CONTROL_LEFT],
    [87, CONTROL_UP],
    [68, CONTROL_RIGHT],
    [83, CONTROL_DOWN]
])

const FRAMERATE = 100

const body = document.body
const field = document.getElementById("field")
const display = document.getElementById("display")
const score = document.getElementById("score")
const best = document.getElementById("best")
const savescore = document.getElementById("savescore")
const gameover = document.getElementById("gameover")
const retry = document.getElementById("retry")
const main = document.getElementById("main")


const game = {
    active: false
}
let bestscore = null

function SetupField(){
    field.style.width = `${FIELD_WIDTH}px`
    field.style.height = `${FIELD_WIDTH}px`
    display.style.width = `${FIELD_WIDTH}px`

    const tilesize = (FIELD_WIDTH - FIELD_MARGIN * (FIELD_SIZE + 1) * 2) / FIELD_SIZE

    for (let x = 0; x < FIELD_SIZE; x++){
        for (let y = 0; y < FIELD_SIZE; y++){
            const tile = document.createElement('div')
            tile.id = `x${x}y${y}`
            tile.classList.add('screen')
            tile.classList.add('tile-empty')

            tile.style.margin = `${FIELD_MARGIN}px`
            tile.style.width = `${tilesize}px`
            tile.style.height = `${tilesize}px`

            field.appendChild(tile)
        }   
    }   
}

function UpdateField(){
    if (game.active){
        for (let x = 0; x < FIELD_SIZE; x++){
            for (let y = 0; y < FIELD_SIZE; y++){
                const tile = document.getElementById(`x${x}y${y}`)
                tile.classList.remove("tile-empty")
                tile.classList.remove("tile-snake")
                tile.classList.remove("tile-bonus")
                tile.classList.add(STYLES.get(game.tiles[x][y]))
            }   
        }
    }else{
        for (let x = 0; x < FIELD_SIZE; x++){
            for (let y = 0; y < FIELD_SIZE; y++){
                const tile = document.getElementById(`x${x}y${y}`)
                tile.classList.remove("tile-snake")
                tile.classList.remove("tile-bonus")
            }   
        }
    }
}

function UpdateTiles(){
    for (let x = 0; x < FIELD_SIZE; x++){
        for (let y = 0; y < FIELD_SIZE; y++){
            game.tiles[x][y] = TILE_EMPTY
        }   
    }   

    for (let i = 0; i < game.snake.length; i++){
        game.tiles[game.snake[i].x][game.snake[i].y] = TILE_SNAKE
    }

    game.tiles[game.bonus.x][game.bonus.y] = TILE_BONUS
}

function UpdateScore(){
    if (game.active && (bestscore != null)){
        if (game.score > bestscore){
            bestscore = game.score 
            savescore.innerHTML = "New best!"
        }
        if (game.score < bestscore){
            savescore.innerHTML = ""
        }
        best.innerHTML = `best ${bestscore}`
    }
    score.innerHTML = `score ${game.score}`
}

function SaveScore(){
    const session = localStorage.getItem("session")
    if (session != null){
        frontend.SendPost("score", {
            session: session,
            score: game.score
        }).then(res => {
            if (res.error){
                alert(`Failed to save score. (${res.error})`)
            }else{
                ///
            }
        })
    }


}

function GetScore(){
    const session = localStorage.getItem("session")
    if (session){
        frontend.SendPost('user', {
            session: session
        })
        .then(res => {
            if (res.error){
                alert("Your session key is deprecated.")
                localStorage.removeItem("session")
                window.location.href = "./"
            }else{
                bestscore = res.user.score
                savescore.innerHTML = ""
                savescore.classList.add("newbest")
                best.innerHTML = `best ${bestscore}`
            }
        })
    }
}

function UpdateGameOver(){
    if (game.active){
        gameover.style.zIndex = -1
    }else{
        gameover.style.zIndex = 1
    }
}

function SpawnBonus(){
    let candidates = []
    for (let x = 0; x < FIELD_SIZE; x++){
        for (let y = 0; y < FIELD_SIZE; y++){
            if (game.tiles[x][y] == TILE_EMPTY){
                candidates.push({x: x, y: y})
            }
        }   
    }

    const i = Math.floor(Math.random() * candidates.length)
    game.bonus = candidates[i]
}

function SetupGame(){
    game.tiles = []
    for (let x = 0; x < FIELD_SIZE; x++){
        game.tiles.push([])
        for (let y = 0; y < FIELD_SIZE; y++){
            game.tiles[x].push(0)
        }   
    } 

    game.snake = []
    for (let i = 0; i < 4; i++){
        game.snake.push({x: i, y: Math.floor(FIELD_SIZE/2)})
    }

    game.bonus = {x: Math.floor(FIELD_SIZE/2), y : Math.floor(FIELD_SIZE/2)}

    game.direction = CONTROL_RIGHT
    game.control = CONTROL_RIGHT

    game.score = 0
    game.time = performance.now()
}

function StartGame(){
    SetupGame()
    game.active = true
    UpdateScore()
    UpdateGameOver()
}

function EndGame(){
    game.active = false
    SaveScore()
    UpdateGameOver()
}

function UpdateGame(){
    const head = {x: game.snake[game.snake.length - 1].x, y: game.snake[game.snake.length - 1].y}
    switch (game.control){
    case CONTROL_LEFT:
        head.x--
        break
    case CONTROL_UP:
        head.y++
        break
    case CONTROL_RIGHT:
        head.x++
        break
    case CONTROL_DOWN:
        head.y--
        break
    }
    game.direction = game.control

    if ((head.x == -1) || (head.x == FIELD_SIZE) || (head.y == -1) || (head.y == FIELD_SIZE)){
        EndGame()
        return
    }

    for (let i = 1; i < game.snake.length; i++){
        if (head.x == game.snake[i].x && head.y == game.snake[i].y){
            EndGame()
            return
        }
    }

    if ((head.x == game.bonus.x) && (head.y == game.bonus.y)){
        game.score++
        game.snake.push(head)

        SpawnBonus()
        UpdateScore()
    }else{
        for (let i = 0; i < game.snake.length-1; i++){
            game.snake[i].x = game.snake[i+1].x
            game.snake[i].y = game.snake[i+1].y
        }
        game.snake[game.snake.length-1].x = head.x
        game.snake[game.snake.length-1].y = head.y
    }
}

function UpdateControls(key){
    if (game.active && CONTROLS.has(key)){
        const control = CONTROLS.get(key)
        if ((control + 2) % 4 != game.direction){
            game.control = control  
        }
    }
    if (game.active && (key == 27)){
        StartGame()
    }
}

function Animate(time) {
    if (game.active){
        if (time >= game.time + FRAMERATE){
            game.time = time
            UpdateGame()
            UpdateTiles()
            UpdateField()
        }
    }
    requestAnimationFrame(Animate)
}

body.onload = () => {
    GetScore()
    SetupField()
    StartGame()
    Animate()
}

window.onkeydown = (event) => {
    UpdateControls(event.keyCode)
}

retry.onclick = () => {
    StartGame()
}