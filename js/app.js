$(document).ready(function () {
    var context;
    var queue;
    var WIDTH = Math.floor(($(window).width())*0.996);
    var HEIGHT = Math.floor(($(window).height())*0.996);
    var mouseXPosition;
    var mouseYPosition;
    var batImage;
    var stage;
    var animation;
    var deathAnimation;
    var spriteSheet;
    var enemyXPos;
    var enemyYPos;
    var enemyXSpeed = 3;
    var enemyYSpeed = 2.25;
    var score = 0;
    var scoreText;
    var gameTimer;
    var gameTime = 1960;
    var timerText;
    var player;
    window.onload = function()
    {

        /*
         *      Set up the Canvas with Size and height
         *
         */
        var canvas = document.getElementById('stage');
        context = canvas.getContext('2d');
        context.canvas.width = WIDTH;
        context.canvas.height = HEIGHT;
        stage = new createjs.Stage("stage");

        /*
         *      Set up the Asset Queue and load sounds
         *
         */
        queue = new createjs.LoadQueue(false);
        queue.installPlugin(createjs.Sound);
        queue.on("complete", queueLoaded, this);
        createjs.Sound.alternateExtensions = ["ogg"];

        /*
         *      Create a load manifest for all assets
         *
         */
        queue.loadManifest([
            {id: 'backgroundImage', src: 'images/background.jpg'},
            {id: 'crossHair', src: 'images/crosshair.png'},
           // {id: 'shot', src: '../sound/shot.mp3'},
           // {id: 'background', src: '../sound/countryside.mp3'},
           // {id: 'gameOverSound', src: '../sound/gameOver.mp3'},
           // id: 'tick', src: '../sound/tick.mp3'},
           // {id: 'deathSound', src: '../sound/die.mp3'},
            {id: 'batSpritesheet', src: 'images/enemy/tCook.png'},
            {id: 'batDeath', src: 'images/explosion_anim.png'},
            {id: 'player', src: 'images/players/bChervenkov.png'}
        ]);
        queue.load();


        /*
         *      Create a timer that updates once per second
         *
         */
        gameTimer = setInterval(updateTime, 5000);

    }

    function queueLoaded(event)
    {
        // Add background image
        var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"));
        stage.addChild(backgroundImage);

        // Add hero
        var hero = new createjs.Bitmap(queue.getResult("player"));
        hero.x = WIDTH / 2 - 75;
        hero.y = HEIGHT - 150;
        stage.addChild(hero);

        //Add Score
        scoreText = new createjs.Text("Score: " + score.toString(), "36px Arial", "#FFF");
        scoreText.x = 10;
        scoreText.y = 10;
        stage.addChild(scoreText);

        //Ad Timer
        timerText = new createjs.Text("Year: " + gameTime.toString(), "36px Arial", "#FFF");
        timerText.x = WIDTH - 250;
        timerText.y = 10;
        stage.addChild(timerText);

        // Play background sound
        createjs.Sound.play("background", {loop: -1});

        // Create bat spritesheet
        spriteSheet = new createjs.SpriteSheet({
            "images": [queue.getResult('batSpritesheet')],
            "frames": {"width": 150, "height": 150},
            "animations": { "flap": [0,0] }
        });

        // Create bat death spritesheet
        batDeathSpriteSheet = new createjs.SpriteSheet({
            "images": [queue.getResult('batDeath')],
            "frames": {"width": 201, "height" : 201},
            "animations": {"die": [0,12, false,1 ] }
        });

        // Create bat sprite
        createEnemy();

        // Create crosshair
        crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
        stage.addChild(crossHair);

        // Add ticker
        createjs.Ticker.setFPS(15);
        createjs.Ticker.addEventListener('tick', stage);
        createjs.Ticker.addEventListener('tick', tickEvent);

        // Set up events AFTER the game is loaded
        window.onmousemove = handleMouseMove;
        window.onmousedown = handleMouseDown;
    }

    function createEnemy()
    {
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
        stage.addChildAt(animation,1);
    }
    function getNewX(){
        var newX = Math.abs(Math.floor((Math.random()*((WIDTH-74)-75)+75)));
        return newX;
    }
    function getNewY(){
        var newY = Math.abs(Math.floor((Math.random()*((HEIGHT-74)-75)+75)));
        return newY;
    }
    function randomSign(){
        var num = Math.floor(Math.random()*2);
        if (num == 0) {
            return -1;
        }else{
            return 1;
        }
    }
    function batDeath()
    {
        deathAnimation = new createjs.Sprite(batDeathSpriteSheet, "die");
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
        if(enemyXPos <= WIDTH - 75 && enemyXPos >= 74)
        {
            enemyXPos += enemyXSpeed;
        } else
        {
            enemyXSpeed = enemyXSpeed * (-1);
            enemyXPos += enemyXSpeed;
        }
        if(enemyYPos <= HEIGHT - 75 && enemyYPos >= 74)
        {
            enemyYPos += enemyYSpeed;
        } else
        {
            enemyYSpeed = enemyYSpeed * (-1);
            enemyYPos += enemyYSpeed;
        }
        //if (enemyYPos > HEIGHT - 210 && enemyXPos > WIDTH / 2 - 75 && enemyXPos < WIDTH / 2 + 75) {
        //
        //        enemyYSpeed = enemyYSpeed * (-1);
        //        enemyYPos += enemyYSpeed;
        //    if (enemyYSpeed > 0 && enemyYPos < HEIGHT - 150) {
        //        console.log("inside");
        //        enemyXSpeed = enemyXSpeed * (-1);
        //        enemyXPos += enemyXSpeed;
        //
        //    }else if(enemyYSpeed < 0 && enemyYPos > HEIGHT - 150){
        //        console.log('inside2')
        //        enemyXSpeed = enemyXSpeed * (-1);
        //        enemyYPos += enemyYSpeed;
        //    }
        //
        //}

        animation.x = enemyXPos;
        animation.y = enemyYPos;


    }


    function handleMouseMove(event)
    {
        //Offset the position by 45 pixels so mouse is in center of crosshair
        crossHair.x = event.clientX-45;
        crossHair.y = event.clientY-45;
    }

    function handleMouseDown(event)
    {

        //Play Gunshot sound
        createjs.Sound.play("shot");

        //Increase speed of enemy slightly
        enemyXSpeed *= 1.05;
        enemyYSpeed *= 1.06;

        //Obtain Shot position
        var shotX = Math.round(event.clientX);
        var shotY = Math.round(event.clientY);
        var spriteX = Math.round(animation.x);
        var spriteY = Math.round(animation.y);

        // Compute the X and Y distance using absolte value
        var distX = Math.abs(shotX - spriteX);
        var distY = Math.abs(shotY - spriteY);

        // Anywhere in the body or head is a hit - but not the wings
        if(distX < 60 && distY < 75 )
        {
            //Hit
            console.log(distX + " " + distY);
            stage.removeChild(animation);
            batDeath();
            enemyXPos = -200 ;
            enemyYPos = -200;
            score += 100;
            scoreText.text = "Score: " + score.toString();
            createjs.Sound.play("deathSound");

            //Make it harder next time
            enemyYSpeed *= 1.25;
            enemyXSpeed *= 1.3;

            //Create new enemy
            var timeToCreate = Math.floor((Math.random()*3500)+1);
            setTimeout(createEnemy,timeToCreate);

        } else
        {
            //Miss
            score -= 10;
            scoreText.text = "Score: " + score.toString();

        }
    }

    function updateTime()
    {
        gameTime += 1;
        if(gameTime > 2020)
        {
            //End Game and Clean up
            timerText.text = "GAME OVER";
            stage.removeChild(animation);
            stage.removeChild(crossHair);
            var si =createjs.Sound.play("gameOverSound");
            clearInterval(gameTimer);
        }
        else
        {
            timerText.text = "Year: " + gameTime;
            createjs.Sound.play("tick");
        }
    }
});
