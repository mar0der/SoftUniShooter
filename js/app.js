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

    var yearLength = 2000;
    var gameTime = 1960;
    var winLevel = 2020;
    var gameFPS = 60;
    var minGameSpeed = 1;
    var maxGameSpeed = 10;
    var timerText;
    var levelGoalText;
    var player;
    var levelGoal;
    var hitPoints = 500;
    var backgroundImageNumber = 1960;
    var backgroundImage;
    var backgroundImages = [1960, 1972, 1976, 1983, 1984, 1985, 1993, 1994, 1995, 1996, 1997, 2000, 2005, 2009, 2014]
    var levelsGoals = [0, 1000, 2000, 3000, 4000, 5000, 6000];
    var levels = [1960, 1970, 1980, 1990, 2000, 2010, 2020];
    var availableAvatars = ['bChervenkov','mStoyanov', 'sNakov', 'sVelkov' ,'pBorukova'];
    var enemyListObject = {
        '1970' : ['dRitchie', 'sJobsA', 'bGatesM'],
        '1980' : ['bStroustrup', 'sJobsO', 'bGatesW' ],
        '1990' : ['lTorvaldsL', 'tBernersLeepng', 'jGosling','bEich','rLerdorf', 'hLie' ],
        '2000' : ['bGatesC', 'rDahl', 'lTorvaldsG'],
        '2010' : ['tCook', 'sNakov']        
    }
    //$.each(source, function() {dest.push(this)})   
    var enemyList = ['bGatesM'];
    

    //initial game setup
    window.onload = function() {

        //Setup canvas with height and size of the screen

        var canvas = document.getElementById('stage');
        context = canvas.getContext('2d');
        context.canvas.width = WIDTH;
        context.canvas.height = HEIGHT;
        //$('#playground').css('background-image', 'url(\'images/background/'+backgoundImage+'.png\')');
        stage = new createjs.Stage("stage");


        //Setup the Asset Queue and load sounds

        queue = new createjs.LoadQueue(false);
        queue.installPlugin(createjs.Sound);
        queue.on("complete", queueLoaded, this);
        createjs.Sound.alternateExtensions = ["ogg"];

        //Create a load manifest for all assets

        queue.loadManifest([
            {id: '1960', src: 'images/background/1960.png'},
            {id: '1972', src: 'images/background/1972.png'},
            {id: '1976', src: 'images/background/1972.png'},
            {id: '1983', src: 'images/background/1972.png'},
            {id: '1984', src: 'images/background/1972.png'},
            {id: '1985', src: 'images/background/1972.png'},
            {id: '1993', src: 'images/background/1972.png'},
            {id: '1994', src: 'images/background/1972.png'},
            {id: '1995', src: 'images/background/1972.png'},
            {id: '1996', src: 'images/background/1972.png'},
            {id: '1997', src: 'images/background/1972.png'},
            {id: '2000', src: 'images/background/1972.png'},
            {id: '2005', src: 'images/background/1972.png'},
            {id: '2009', src: 'images/background/1972.png'},
            {id: '2013', src: 'images/background/1972.png'},
            {id: '2014', src: 'images/background/1972.png'},
            {id: 'crossHair', src: 'images/crosshair.png'},
            {id: 'bCox', src: 'images/enemy/bCox.png'},
            {id: 'bEich', src: 'images/enemy/tCook.png'},
            {id: 'bGates', src: 'images/enemy/bGates.png'},
            {id: 'bGatesC', src: 'images/enemy/bGatesC.png'},
            {id: 'bGatesM', src: 'images/enemy/bGatesM.png'},
            {id: 'bGatesW', src: 'images/enemy/bGatesW.png'},
            {id: 'bStroustrup', src: 'images/enemy/bStroustrup.png'},
            {id: 'dRitchie', src: 'images/enemy/dRitchie.png'},
            {id: 'hLie', src: 'images/enemy/hLie.png'},
            {id: 'jGosling', src: 'images/enemy/jGosling.png'},
            {id: 'lTorvaldsG', src: 'images/enemy/lTorvaldsG.png'},
            {id: 'lTorvaldsL', src: 'images/enemy/lTorvaldsL.png'},
            {id: 'rDahl', src: 'images/enemy/rDahl.png'},
            {id: 'rLerdorf', src: 'images/enemy/rLerdorf.png'},
            {id: 'sJobsA', src: 'images/enemy/sJobsA.png'},
            {id: 'sJobsO', src: 'images/enemy/sJobsO.png'},
            {id: 'sNakov', src: 'images/enemy/sNakov.png'},
            {id: 'tBernersLeepng', src: 'images/enemy/tBernersLeepng.png'},
            {id: 'tCook', src: 'images/enemy/tCook.png'},
            
            {id: 'enemyExplosion', src: 'images/explosion_anim.png'},
            {id: 'bChervenkov', src: 'images/players/bChervenkov.png'},
            {id: 'mStoyanov', src: 'images/players/mStoyanov.png'},
            {id: 'pBorukova', src: 'images/players/pBorukova.png'},
            {id: 'sNakov', src: 'images/players/sNakov.png'},
            {id: 'sVelkov', src: 'images/players/sVelkov.png'},
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

        backgroundImage = new createjs.Bitmap(queue.getResult("1960"));
        backgroundImage.snapToPixel = false;
        $('#bgc').attr('width', WIDTH + 'px');
        $('#bgc').attr('height', HEIGHT + 'px');
        $('#bgc').css('display', 'block');

        // Add player to the stage
        var avatarObject = parseURLParams(document.URL);
        if(avatarObject && avatarObject.avatar &&  avatarObject.avatar.length > 0 ){
            avatar = avatarObject.avatar[0];
        }else{
            avatar = 'sNakov';
        }

        var hero = new createjs.Bitmap(queue.getResult(avatar));
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
            "images": [queue.getResult('dRitchie')],
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
        var randomEnemy = enemyList[ (Math.floor(Math.random() * enemyList.length))];
        animation = new createjs.Bitmap(queue.getResult(randomEnemy));
        animation.regX = 75;
        animation.regY = 75;
        animation.x = enemyXPos;
        animation.y = enemyYPos;
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
        enemyXSpeed *= 1.0009;
        enemyYSpeed *= 1.0009;
        updateLabels();

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
            stage.removeChild(animation);
            enemyDeath();
            enemyXPos = -200;
            enemyYPos = -200;
            score += hitPoints;

            createjs.Sound.play("deathSound");

            //Make it harder next time
            enemyYSpeed *= 1.05;
            enemyXSpeed *= 1.03;
            updateLabels();
            //Create new enemy
            var timeToCreate = Math.floor((Math.random() * 3500) + 1);
            setTimeout(createEnemy, timeToCreate);

        } else {
            score -= 10;
        }
    }

//the Tick function
    function updateTime() {
        isGameover();
        updateLabels();
        updateBackgroundImage();
        addEnemies();
        gameTime += 1;
        levelGoal = levelsGoals[levels.indexOf(Number(getCurrentLevel()))];
        createjs.Sound.play("tick");
        timerText.text = "Year: " + gameTime;
        createjs.Sound.play("sound/tick.mp3");
    }

//background image change
    function updateBackgroundImage() {
        if (backgroundImages.indexOf(gameTime) > 0) {
            backgroundImageNumber = gameTime;
            $('#bgc').attr('src', 'images/background/' + backgroundImageNumber + '.png');
        }
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
    function addEnemies(){
        if(gameTime == getCurrentLevel() && gameTime > 1960){
            $.each(enemyListObject[gameTime], function() {enemyList.push(this)});
        }
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

    function parseURLParams(url) {
        var queryStart = url.indexOf("?") + 1,
                queryEnd = url.indexOf("#") + 1 || url.length + 1,
                query = url.slice(queryStart, queryEnd - 1),
                pairs = query.replace(/\+/g, " ").split("&"),
                parms = {}, i, n, v, nv;

        if (query === url || query === "") {
            return;
        }

        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=");
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);

            if (!parms.hasOwnProperty(n)) {
                parms[n] = [];
            }

            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }
});
