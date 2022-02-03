const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let score = 0;

class Wall {

    static width = 40;
    static height = 40;

    constructor({position}) {
        this.position = position;
        this.height = 40;
        this.width = 40;
        this.color = 'blue';
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
    }
}

class Player {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = "yellow"
    }

    draw() {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Enemy {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = "red"
    }

    draw() {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Fruit {
    constructor({position}) {
        this.position = position;
        this.radius = 3;
        this.color = "white"
    }

    draw() {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

}

let map = [
    ['|','-','-','-','-','-','-','-','-','-','-','-','-',"|"],
    ['|',' ','.','.','.','.',' ','.','.','.','.','.','.',"|"],
    ['|','.','-','.','.','-','.','.','-','.','.','-','.',"|"],
    ['|','.','.','.','.','.','.','.','.','.','.','.','.',"|"],
    ['|','.','-','.','.','-','.','.','-','.','.','-','.',"|"],
    ['|','.','.','.','.','.','.','.','.','.','.','.','.',"|"],
    ['|','.','-','.','.','-','.','.','-','.','.','-','.',"|"],
    ['|','.','.','.','.','.','.','.','.','.','.','.','.',"|"],
    ['|','-','-','-','-','-','-','-','-','-','-','-','-',"|"],
];

const keys = {
    up: {
        pressed : false,
    },
    down: {
        pressed : false,
    },
    left: {
        pressed : false,
    },
    right: {
        pressed : false,
    }
}

const player = new Player({
    position: {
        x: 60,
        y: 60
    },
    velocity: {
        x: 0,
        y: 0
    }
});

const enemy = new Enemy({
    position: {
        x: 260,
        y: 60
    },
    velocity: {
        x: 0,
        y: 0
    }
});

const game = {
    gameOver: false
}

const fruits = [];

const walls = [];
let lastKey = "";

function showGameOver() {
    context.fillStyle = "white";
    context.font = "40px Arial";
    context.fillText("GAME OVER", 170, 315); 
}

function animation() {

    const id = requestAnimationFrame(animation);
    context.clearRect(0, 0, canvas.width, canvas.height);

    if(game.gameOver) {
        cancelAnimationFrame(id);
        showGameOver();        
    }

    walls.forEach(wall => {
        wall.update();

        if (player.position.y - player.radius + player.velocity.y <= wall.position.y + wall.height
            && player.position.x + player.radius + player.velocity.x >= wall.position.x
            && player.position.y + player.radius + player.velocity.y >= wall.position.y
            && player.position.x - player.radius + player.velocity.x <= wall.position.x + wall.width
        ) {
                player.velocity.y = 0;
                player.velocity.x = 0;
            }
    })

    // Detecting collision with the enemy
    if(
        Math.hypot(enemy.position.x - player.position.x, enemy.position.y - player.position.y) < 
        enemy.radius + player.radius
        )
    {
        game.gameOver = true;
    }

    player.update();
    player.velocity.y = 0;
    player.velocity.x = 0;

    enemy.update();

    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Score: " + score.toString() , 40, 30); 

    if(keys.up.pressed && lastKey === "up") {
        player.velocity.y = -5;
    } else if (keys.left.pressed && lastKey === "left") {
        player.velocity.x = -5; 
    } else if (keys.right.pressed && lastKey === "right") {
        player.velocity.x = 5;
    } else if (keys.down.pressed && lastKey === "down") {
        player.velocity.y = 5;
    }

    if(walls.length === 0) {
        map.forEach((row, i) => {
            row.forEach((symbol, j) => {
                switch (symbol) {
                    case '-' :
                        walls.push(
                            new Wall({
                                position: {
                                    x: Wall.width * j,
                                    y: Wall.height * i
                                }
                            })
                        )
                        break

                    case '|' :
                        walls.push(
                            new Wall({
                                position: {
                                    x: Wall.width * j,
                                    y: Wall.height * i
                                }
                            })
                        )
                        break

                    case '.' :
                        fruits.push(
                            new Fruit({
                                position: {
                                    x: j * Wall.width + Wall.width / 2,
                                    y: i * Wall.height + Wall.width / 2
                                }
                            })
                        )
                        break


                }
            })
        })
    }

    fruits.forEach((fruit, index) => {
        fruit.draw();

        if(Math.hypot(fruit.position.x - player.position.x, fruit.position.y - player.position.y) < fruit.radius + player.radius
        ){
            fruits.splice(index, 1);
            score++;
        }

    })


    if (fruits.length === 0) {
        game.gameOver = true;
    }

}

addEventListener("keydown", ({key}) => {
    switch (key) {
        case 'ArrowUp':
            keys.up.pressed = true;
            lastKey = "up";
            break;

        case 'ArrowDown':
            keys.down.pressed = true;
            lastKey = "down";
            break;

        case 'ArrowLeft':
            keys.left.pressed = true;
            lastKey = "left";
            break;

        case 'ArrowRight':
            keys.right.pressed = true;
            lastKey = "right";
            break;
    }
})

addEventListener("keyup", ({key}) => {
    switch (key) {
        case 'ArrowUp':
            keys.up.pressed = false;
            break;

        case 'ArrowDown':
            keys.down.pressed = false;
            break;

        case 'ArrowLeft':
            keys.left.pressed = false;
            break;

        case 'ArrowRight':
            keys.right.pressed = false;
            break;
    }
})

animation()