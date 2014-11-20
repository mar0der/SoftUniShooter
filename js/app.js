$(document).ready(function() {
    //Game configuration
    var context;
    var queue;
    var WIDTH = Math.floor(($(window).width()) * 0.996);
    var HEIGHT = Math.floor(($(window).height()) * 0.996);
    var mouseXPosition;
    var mouseYPosition;
    var stage;
    var animation;
    var deathAnimation;
    var spriteSheet;
    var enemyXPos;
    var enemyYPos;
    var enemyXSpeed = 5;
    var enemyYSpeed = 5;
    var score = 0;
    var scoreText;
    var gameTimer;

    var yearLength = 1000;
    var gameTime = 1960;
    var winLevel = 1980;
    var gameFPS = 60;
    var minGameSpeed = 1;
    var maxGameSpeed = 10;
    var timerText;
    var player;
    var levelGoal;
    var hitPoints = 500;
    var backgoundImage = 1960;
    var backgroundImages = [1960,1972,1976,1983,1984,1985,1993,1994,1995,1996,1997,2000,2005,2009,2014]
    var levelsGoals = [0, 1000, 2000, 3000, 4000, 5000, 6000];
    var levels = [1960, 1970, 1980, 1990, 2000, 2010, 2020];
 
    //initial game setup
    window.onload = function() {

        //Setup canvas with height and size of the screen

        var canvas = document.getElementById('stage');
        context = canvas.getContext('2d');
        context.canvas.width = WIDTH;
        context.canvas.height = HEIGHT;
        $('#playground').css('background-image', 'url(\'images/background/'+backgoundImage+'.png\')');
        stage = new createjs.Stage("stage");

        //Setup the Asset Queue and load sounds

        queue = new createjs.LoadQueue(false);
        queue.installPlugin(createjs.Sound);
        queue.on("complete", queueLoaded, this);
        createjs.Sound.alternateExtensions = ["ogg"];

        //Create a load manifest for all assets

        queue.loadManifest([
            {id: '1900', src: 'images/background.jpg'},
            {id: '1960', src: 'images/background/1960.png'},
            {id: '1975', src: 'images/background/1975.png'},
            {id: 'crossHair', src: 'images/crosshair.png'},
            {id: 'batSpritesheet', src: 'images/enemy/tCook.png'},
            {id: 'enemyExplosion', src: 'images/explosion_anim.png'},
            {id: 'player', src: 'images/players/bChervenkov.png'},
            //{id: 'tick', src: 'sound/tick.mp3'},
            {id: 'gameOverSound', src: 'sound/gameOver.mp3'}//,
            // {id: 'shot', src: '../sound/shot.mp3'},
            // {id: 'background', src: '../sound/countryside.mp3'},

            // {id: 'deathSound', src: '../sound/die.mp3'}
        ]);
        queue.load();

        //Create a timer that updates once every 5 seconds

        gameTimer = setInterval(updateTime, yearLength);

    };

    //load all resources

    function queueLoaded(event) {

        // Add player to the stage

        var hero = new createjs.Bitmap(queue.getResult("player"));
        hero.x = WIDTH / 2 - 75;
        hero.y = HEIGHT - 150;
        stage.addChild(hero);

        //Add Score Label to the stage

        scoreText = new createjs.Text("Score: " + score.toString(), "36px Arial", "#FFF");
        scoreText.x = 10;
        scoreText.y = 10;
        stage.addChild(scoreText);

        //Add Score Label to the stage

        levelGoalText = new createjs.Text("Level goal: " + 1000, "36px Arial", "#FFF");
        levelGoalText.x = 10;
        levelGoalText.y = 50;
        stage.addChild(levelGoalText);

        //Ad Timer to the scene

        timerText = new createjs.Text("Year: " + gameTime.toString(), "36px Arial", "#FFF");
        timerText.x = WIDTH - 250;
        timerText.y = 10;
        stage.addChild(timerText);

        // Play background sound to the scene

        createjs.Sound.play("background", {loop: -1});

        // Create enemy spritesheet

        spriteSheet = new createjs.SpriteSheet({
            "images": [queue.getResult('batSpritesheet')],
            "frames": {"width": 150, "height": 150},
            "animations": {"flap": [0, 0]}
        });

        // Create enemy explosion spritesheet

        deadEnemySheet = new createjs.SpriteSheet({
            "images": [queue.getResult('enemyExplosion')],
            "frames": {"width": 201, "height": 201},
            "animations": {"die": [0, 12, false, 1]}
        });

        // Create first enemy

        createEnemy();

        // Hide mouse pointer and add custom crosshair

        $('#stage').css('cursor', 'none');
        crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
        stage.addChild(crossHair);

        // Add ticker

        createjs.Ticker.setFPS(gameFPS);
        createjs.Ticker.addEventListener('tick', stage);
        createjs.Ticker.addEventListener('tick', tickEvent);

        // Set up events AFTER the game is loaded

        window.onmousemove = handleMouseMove;
        window.onmousedown = handleMouseDown;

    }

    function createEnemy() {
        enemyXPos = getNewX();
        enemyYPos = getNewY();
        enemyXSpeed *= randomSign();
        enemyYSpeed *= randomSign();
        animation = new createjs.Sprite(spriteSheet, "flap");
        animation.regX = 75;
        animation.regY = 75;
        animation.x = enemyXPos;
        animation.y = enemyYPos;
        animation.gotoAndPlay("flap");
        stage.addChildAt(animation, 1);
    }

    //Random generators
    function getNewX() {
        var newX = Math.abs(Math.floor((Math.random() * ((WIDTH - 74) - 75) + 75)));
        return newX;
    }

    function getNewY() {
        var newY = Math.abs(Math.floor((Math.random() * ((HEIGHT - 74) - 75) + 75)));
        return newY;
    }

    function randomSign() {
        var num = Math.floor(Math.random() * 2);
        if (num == 0) {
            return -1;
        } else {
            return 1;
        }
    }

    function enemyDeath() {
        deathAnimation = new createjs.Sprite(deadEnemySheet, "die");
        deathAnimation.regX = 100;
        deathAnimation.regY = 100;
        deathAnimation.x = enemyXPos;
        deathAnimation.y = enemyYPos;
        deathAnimation.gotoAndPlay("die");
        stage.addChild(deathAnimation);
    }

    function tickEvent()
    {
        //Make sure enemy bat is within game boundaries and move enemy Bat
        if (enemyXPos <= WIDTH - 75 && enemyXPos >= 74) {
            enemyXPos += enemyXSpeed;
        } else {
            enemyXSpeed = enemyXSpeed * (-1);
            enemyXPos += enemyXSpeed;
        }
        if (enemyYPos <= HEIGHT - 75 && enemyYPos >= 74) {
            enemyYPos += enemyYSpeed;
        } else {
            enemyYSpeed = enemyYSpeed * (-1);
            enemyYPos += enemyYSpeed;
        }
        animation.x = enemyXPos;
        animation.y = enemyYPos;
    }


    function handleMouseMove(event) {
        //Offset the position by 45 pixels so mouse is in center of crosshair
        crossHair.x = event.clientX - 45;
        crossHair.y = event.clientY - 45;
    }

    function handleMouseDown(event) {

        //Play Gunshot sound
        createjs.Sound.play("sound/Gunshot.mp3");

        //Increase speed of enemy slightly
        enemyXSpeed *= 1.005;
        enemyYSpeed *= 1.006;

        //Obtain Shot position
        var shotX = Math.round(event.clientX);
        var shotY = Math.round(event.clientY);
        var spriteX = Math.round(animation.x);
        var spriteY = Math.round(animation.y);

        // Compute the X and Y distance using absolte value
        var distX = Math.abs(shotX - spriteX);
        var distY = Math.abs(shotY - spriteY);

        // Anywhere in the body or head is a hit - but not the wings
        if (distX < 60 && distY < 75) {
            //Hit
            console.log(distX + " " + distY);
            stage.removeChild(animation);
            enemyDeath();
            enemyXPos = -200;
            enemyYPos = -200;
            score += hitPoints;

            createjs.Sound.play("deathSound");

            //Make it harder next time
            enemyYSpeed *= 1.25;
            enemyXSpeed *= 1.3;

            //Create new enemy
            var timeToCreate = Math.floor((Math.random() * 3500) + 1);
            setTimeout(createEnemy, timeToCreate);

        } else {
            score -= 10;
        }
    }

//the Tick function
    function updateTime() {
        isGameover()
        updateLabels();
        gameTime += 1;
        createjs.Sound.play("tick");
        timerText.text = "Year: " + gameTime;
        createjs.Sound.play("sound/tick.mp3");
        levelGoal = levelsGoals[levels.indexOf(Number(getCurrentLevel()))]
    }

//update all labels on screen
    function updateLabels() {
        levelGoalText.text = "Level goal: " + levelsGoals[levels.indexOf(Number(getCurrentLevel())) + 1];
        timerText.text = "Year: " + gameTime.toString();
        scoreText.text = "Score: " + score.toString();
    }

//End Game and Clean up the stage 

    function isGameover() {
        if (getCurrentLevel() === winLevel && score >= levelGoal) {
            gameOverText = new createjs.Text("You won! You are programmer now!", "56px Arial", "#FFF");
            gameOverText.x = WIDTH / 2 - 450;
            gameOverText.y = HEIGHT / 2 - 15;
            stage.addChild(gameOverText);
            cleanStage();
        } else if (isLevelFailed()) {
            gameOverText = new createjs.Text("Game Over", "56px Arial", "#FFF");
            gameOverText.x = WIDTH / 2 - 150;
            gameOverText.y = HEIGHT / 2 - 15;
            stage.addChild(gameOverText);
            createjs.Sound.play("sound/gameOver.mp3");
            cleanStage();
        }
    }

//clean stage aftet the game
    function cleanStage() {
        stage.removeChild(animation);
        stage.removeChild(crossHair);
        stage.removeChild(levelGoalText);
        clearInterval(gameTimer);
    }
    function isLevelFailed() {
        if (gameTime == getCurrentLevel() && score < levelGoal) {
            return true;
        }
        return false;
    }
    function getCurrentLevel() {
        var gameLevel;
        if (gameTime >= 1960 && gameTime < 1970) {
            gameLevel = 1960;
        } else if (gameTime >= 1970 && gameTime < 1980) {
            gameLevel = 1970;
        } else if (gameTime >= 1980 && gameTime < 1990) {
            gameLevel = 1980;
        } else if (gameTime >= 1990 && gameTime < 2000) {
            gameLevel = 1990;
        } else if (gameTime >= 2000 && gameTime < 2010) {
            gameLevel = 2000;
        } else if (gameTime >= 2010 && gameTime < 2020) {
            gameLevel = 2010;
        } else if (gameTime >= 2010) {
            gameLevel = 2020;
        }
        return Number(gameLevel);
    }

});
