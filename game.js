// =========================================================
// CYBER RUNNER 3D
// ONLINE GAME ENGINE
// Coded with Yash Badgujar
// =========================================================

let scene;
let camera;
let renderer;
let player;

let road;
let gameRunning = false;
let paused = false;

let score = 0;
let coins = 0;
let shield = 100;

let speed = 0.35;
let lane = 0;

let playerY = 0;
let velocityY = 0;
let jumping = false;

const obstacles = [];
const coinObjects = [];
const roadLines = [];

const lanes = [-4, 0, 4];

// =========================================================
// HTML ELEMENTS
// =========================================================

const startScreen = document.getElementById("start-screen");
const pauseScreen = document.getElementById("pause-screen");
const gameOverScreen = document.getElementById("game-over");

const startButton = document.getElementById("start-btn");
const resumeButton = document.getElementById("resume-btn");
const restartButton = document.getElementById("restart-btn");

const pauseButton = document.getElementById("pause-btn");

const scoreText = document.getElementById("score");
const coinsText = document.getElementById("coins");
const speedText = document.getElementById("speed");

const shieldBar = document.getElementById("shield-bar");

const finalScore = document.getElementById("final-score");
const highScore = document.getElementById("high-score");

// =========================================================
// THREE.JS SETUP
// =========================================================

scene = new THREE.Scene();

scene.background = new THREE.Color(0x02040a);

scene.fog = new THREE.Fog(
    0x02040a,
    30,
    180
);

// CAMERA

camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

camera.position.set(
    0,
    6,
    13
);

camera.lookAt(
    0,
    1,
    -20
);

// RENDERER

renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.getElementById("game-canvas")
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

// =========================================================
// LIGHTING
// =========================================================

const ambientLight = new THREE.AmbientLight(
    0x88ccff,
    1.2
);

scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(
    0xffffff,
    1.5
);

mainLight.position.set(
    5,
    10,
    5
);

scene.add(mainLight);

// =========================================================
// ROAD
// =========================================================

const roadGeometry = new THREE.PlaneGeometry(
    16,
    400
);

const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x07111d,
    roughness: 0.8,
    metalness: 0.4
});

road = new THREE.Mesh(
    roadGeometry,
    roadMaterial
);

road.rotation.x = -Math.PI / 2;

road.position.z = -150;

scene.add(road);

// =========================================================
// ROAD SIDES
// =========================================================

function createRoadSide(x) {

    const geometry =
        new THREE.BoxGeometry(
            0.3,
            0.25,
            400
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0x00ffff
        });

    const side =
        new THREE.Mesh(
            geometry,
            material
        );

    side.position.set(
        x,
        0.15,
        -150
    );

    scene.add(side);
}

createRoadSide(-8);
createRoadSide(8);

// =========================================================
// ROAD LINES
// =========================================================

for (let z = -10; z > -390; z -= 8) {

    for (const x of [-2, 2]) {

        const geometry =
            new THREE.BoxGeometry(
                0.12,
                0.04,
                3
            );

        const material =
            new THREE.MeshBasicMaterial({
                color: 0x00ffff
            });

        const line =
            new THREE.Mesh(
                geometry,
                material
            );

        line.position.set(
            x,
            0.04,
            z
        );

        scene.add(line);

        roadLines.push(line);
    }
}

// =========================================================
// PLAYER
// =========================================================

function createPlayer() {

    const group = new THREE.Group();

    // BODY

    const bodyGeometry =
        new THREE.BoxGeometry(
            1.5,
            2.2,
            1.1
        );

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            metalness: 0.7,
            roughness: 0.25
        });

    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    body.position.y = 1.1;

    group.add(body);

    // HEAD

    const headGeometry =
        new THREE.BoxGeometry(
            1.25,
            0.9,
            1
        );

    const headMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x111827,
            metalness: 0.8,
            roughness: 0.2
        });

    const head =
        new THREE.Mesh(
            headGeometry,
            headMaterial
        );

    head.position.y = 2.65;

    group.add(head);

    // EYES

    const eyeGeometry =
        new THREE.BoxGeometry(
            0.8,
            0.12,
            0.08
        );

    const eyeMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xff00ff
        });

    const eyes =
        new THREE.Mesh(
            eyeGeometry,
            eyeMaterial
        );

    eyes.position.set(
        0,
        2.65,
        -0.51
    );

    group.add(eyes);

    group.position.set(
        0,
        0,
        5
    );

    scene.add(group);

    return group;
}

player = createPlayer();

// =========================================================
// OBSTACLE
// =========================================================

function createObstacle() {

    const geometry =
        new THREE.BoxGeometry(
            2.3,
            2.2,
            2
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xff0055,
            metalness: 0.5,
            roughness: 0.3
        });

    const obstacle =
        new THREE.Mesh(
            geometry,
            material
        );

    const randomLane =
        Math.floor(
            Math.random() * 3
        );

    obstacle.position.set(
        lanes[randomLane],
        1.1,
        -100
    );

    scene.add(obstacle);

    obstacles.push(obstacle);
}

// =========================================================
// COIN
// =========================================================

function createCoin() {

    const geometry =
        new THREE.TorusGeometry(
            0.65,
            0.16,
            12,
            24
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xffdd00,
            emissive: 0xffaa00,
            emissiveIntensity: 1
        });

    const coin =
        new THREE.Mesh(
            geometry,
            material
        );

    const randomLane =
        Math.floor(
            Math.random() * 3
        );

    coin.position.set(
        lanes[randomLane],
        1.5,
        -100
    );

    scene.add(coin);

    coinObjects.push(coin);
}

// =========================================================
// SPAWN TIMER
// =========================================================

let spawnTimer = 0;

function spawnObjects() {

    spawnTimer++;

    if (spawnTimer > 65) {

        spawnTimer = 0;

        createObstacle();

        if (Math.random() > 0.35) {
            createCoin();
        }
    }
}

// =========================================================
// MOVE LEFT
// =========================================================

function moveLeft() {

    if (!gameRunning || paused) return;

    lane--;

    if (lane < 0) {
        lane = 0;
    }
}

// =========================================================
// MOVE RIGHT
// =========================================================

function moveRight() {

    if (!gameRunning || paused) return;

    lane++;

    if (lane > 2) {
        lane = 2;
    }
}

// =========================================================
// JUMP
// =========================================================

function jump() {

    if (!gameRunning || paused) return;

    if (!jumping) {

        jumping = true;

        velocityY = 0.32;
    }
}

// =========================================================
// COLLISION
// =========================================================

function checkCollision(a, b, distance) {

    const dx =
        Math.abs(
            a.position.x -
            b.position.x
        );

    const dz =
        Math.abs(
            a.position.z -
            b.position.z
        );

    return (
        dx < distance &&
        dz < distance
    );
}

// =========================================================
// GAME OVER
// =========================================================

function endGame() {

    gameRunning = false;

    finalScore.textContent =
        Math.floor(score);

    let best =
        Number(
            localStorage.getItem(
                "cyberRunnerHighScore"
            ) || 0
        );

    if (score > best) {

        best = Math.floor(score);

        localStorage.setItem(
            "cyberRunnerHighScore",
            best
        );
    }

    highScore.textContent = best;

    gameOverScreen.classList.remove(
        "hidden"
    );
}

// =========================================================
// RESET GAME
// =========================================================

function resetGame() {

    obstacles.forEach(
        object => scene.remove(object)
    );

    coinObjects.forEach(
        object => scene.remove(object)
    );

    obstacles.length = 0;
    coinObjects.length = 0;

    score = 0;
    coins = 0;

    shield = 100;

    speed = 0.35;

    lane = 1;

    player.position.x = 0;
    player.position.y = 0;

    jumping = false;
    velocityY = 0;

    spawnTimer = 0;

    updateHUD();
}

// =========================================================
// START GAME
// =========================================================

function startGame() {

    resetGame();

    gameRunning = true;
    paused = false;

    startScreen.classList.add(
        "hidden"
    );

    pauseScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );
}

// =========================================================
// PAUSE
// =========================================================

function togglePause() {

    if (!gameRunning) return;

    paused = !paused;

    if (paused) {

        pauseScreen.classList.remove(
            "hidden"
        );

    } else {

        pauseScreen.classList.add(
            "hidden"
        );
    }
}

// =========================================================
// HUD
// =========================================================

function updateHUD() {

    scoreText.textContent =
        String(
            Math.floor(score)
        ).padStart(6, "0");

    coinsText.textContent =
        coins;

    speedText.textContent =
        (speed / 0.35).toFixed(1)
        + "x";

    shieldBar.style.width =
        Math.max(
            0,
            shield
        ) + "%";
}

// =========================================================
// UPDATE GAME
// =========================================================

function updateGame() {

    if (!gameRunning || paused) {
        return;
    }

    // SCORE

    score += speed * 0.7;

    // SPEED

    speed += 0.00008;

    // PLAYER LANE MOVEMENT

    const targetX =
        lanes[lane];

    player.position.x +=
        (targetX -
         player.position.x) *
        0.15;

    // JUMP PHYSICS

    if (jumping) {

        player.position.y +=
            velocityY;

        velocityY -= 0.018;

        if (
            player.position.y <= 0
        ) {

            player.position.y = 0;

            velocityY = 0;

            jumping = false;
        }
    }

    // ROAD MOVEMENT

    roadLines.forEach(
        line => {

            line.position.z += speed;

            if (
                line.position.z > 15
            ) {

                line.position.z -= 380;
            }
        }
    );

    // SPAWN

    spawnObjects();

    // OBSTACLES

    for (
        let i = obstacles.length - 1;
        i >= 0;
        i--
    ) {

        const obstacle =
            obstacles[i];

        obstacle.position.z +=
            speed;

        if (
            checkCollision(
                player,
                obstacle,
                1.6
            )
        ) {

            if (
                player.position.y < 1
            ) {

                shield -= 25;

                scene.remove(
                    obstacle
                );

                obstacles.splice(
                    i,
                    1
                );

                if (shield <= 0) {
                    endGame();
                    return;
                }
            }
        }

        if (
            obstacle.position.z > 20
        ) {

            scene.remove(
                obstacle
            );

            obstacles.splice(
                i,
                1
            );
        }
    }

    // COINS

    for (
        let i = coinObjects.length - 1;
        i >= 0;
        i--
    ) {

        const coin =
            coinObjects[i];

        coin.position.z += speed;

        coin.rotation.y += 0.08;

        if (
            checkCollision(
                player,
                coin,
                1.4
            )
        ) {

            coins++;

            score += 100;

            scene.remove(
                coin
            );

            coinObjects.splice(
                i,
                1
            );

            continue;
        }

        if (
            coin.position.z > 20
        ) {

            scene.remove(
                coin
            );

            coinObjects.splice(
                i,
                1
            );
        }
    }

    updateHUD();
}

// =========================================================
// ANIMATION LOOP
// =========================================================

function animate() {

    requestAnimationFrame(
        animate
    );

    updateGame();

    renderer.render(
        scene,
        camera
    );
}

// =========================================================
// KEYBOARD CONTROLS
// =========================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            moveLeft();
        }

        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            moveRight();
        }

        if (
            event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w" ||
            event.code === "Space"
        ) {

            jump();
        }

        if (
            event.key.toLowerCase() === "p"
        ) {

            togglePause();
        }
    }
);

// =========================================================
// BUTTON CONTROLS
// =========================================================

startButton.addEventListener(
    "click",
    startGame
);

restartButton.addEventListener(
    "click",
    startGame
);

resumeButton.addEventListener(
    "click",
    togglePause
);

pauseButton.addEventListener(
    "click",
    togglePause
);

document.getElementById(
    "left-btn"
).addEventListener(
    "click",
    moveLeft
);

document.getElementById(
    "right-btn"
).addEventListener(
    "click",
    moveRight
);

document.getElementById(
    "jump-btn"
).addEventListener(
    "click",
    jump
);

// =========================================================
// RESIZE
// =========================================================

window.addEventListener(
    "resize",
    function() {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);

// =========================================================
// START RENDER LOOP
// =========================================================

updateHUD();

animate();
