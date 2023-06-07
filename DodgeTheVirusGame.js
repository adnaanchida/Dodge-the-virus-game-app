// Adnaan Chida

//The objective of this game is to dodge the virus(bugs)  so that it does not corrupt the computer or
//hard drive or computer corrupting all its files folder and your precious personal data

// Declaring global variables
// Entire program can use and change them
var CountMovement = 0;
var playerLives = 3;
var PlayerMovementSize = 44;
var KeyUpButton = true;
var levelCounter = 1;
var addBoost = 0;
var boostincreaseCount = 3;
var topScore = [1, 0, 1, 0, 1];
var speedUp = 0.1;
var bonusReward = "bonuslife";
setPosition("rightButton", -320, -400);
setPosition("leftButton", -450, -400);
setPosition("upButton", -550, -250);
setPosition("boostButton", -350, -350);
if(randomNumber(1, 0) == 1){
  setText("Tiplbl", "Tip: To play this game on a smartphone, Click or tap for on screen buttons.");
}

// Starts the game
onEvent("Startbtn", "click", function() {
  setScreen("gameScreen");
  enemyMovement("bug2", "truckandLevelEnemy", "bug1");
});

// Controls for keyboard play
onEvent("gameScreen", "keydown", function(event) {
  if (KeyUpButton){
  KeyUpButton = false;
  movePlayer(event.key);
  }
});

// Controls for mouse or touch screen play
onEvent("gameScreen", "click", function() {
setPosition("upButton", 217, 355);
setPosition("rightButton", 263, 402);
setPosition("leftButton", 202, 402);
setPosition("boostButton", 2, 412);
});
onEvent("upButton", "click", function() {
  movePlayer("Up");
  KeyUpButton = true;
});
onEvent("leftButton", "click", function() {
  movePlayer("Left");
  KeyUpButton = true;
});
onEvent("rightButton", "click", function() {
  movePlayer("Right");
  KeyUpButton = true;
});
onEvent("boostButton", "click", function() {
  movePlayer("Shift");
  KeyUpButton = true;
});



// Moves player in the appropriate direction
function movePlayer(key){
  var xPlayer = getXPosition("player");
  var yPlayer = getYPosition("player");
  if (key == "Up") {
    setPosition("player", xPlayer, (yPlayer - PlayerMovementSize) - addBoost);
    if (obstacleCollision()) {
      setPosition("player", xPlayer, yPlayer + PlayerMovementSize + addBoost);
      } else {
        setText("scoreNumLabel", CountMovement);
        CountMovement++;
      }
    if (yPlayer < 0) {
        setProperty("player", "y", 410);
        stopTimedLoop();
        levelCounter++;
        addBoost = 0;
        setText("levelLabel", levelCounter);
       enemyMovement("bug2", "truckandLevelEnemy", "bug1");
    }
  } else if (key == "Right") {
    setPosition("player", xPlayer + 25, yPlayer);
    if (xPlayer > 290) {
      setProperty("player", "x", 0);
    }
  } else if (key == "Left") {
    setPosition("player", xPlayer - 25, yPlayer);
    if (xPlayer < -10) {
      setProperty("player", "x", 280);
    }
  } else if (key == "Down") {
    setText("scoreNumLabel", CountMovement);
    setPosition("player", xPlayer, yPlayer + PlayerMovementSize - addBoost);
    if (obstacleCollision()) {
      setPosition("player", xPlayer, yPlayer - PlayerMovementSize - addBoost);
      CountMovement++;
    }
    CountMovement--;
    if (yPlayer > 430) {
      setProperty("player", "y", 410);
    }
  } else if (key == "Shift") {
    addBoost = 20;
    //boostincreaseCount = boostincreaseCount - 1
    boostincreaseCount--;
    hideElement('VirusProtectionboost' + (3 - boostincreaseCount));
    setPosition("obstacle1Image", -250, -250);
    setPosition("obstacle2Image", -200, -200);
    setPosition("obstacle3Image", -250, -250);
  }
  bonusCheck();
}


// Checks if player is touching a bonus item
function bonusCheck() {
  if (checkCollision(bonusReward, 55, 35)) {
    setPosition(bonusReward, -400, -400);
    if (bonusReward == 'bonuslife') {
      showElement('life' + (3 - playerLives));
    playerLives = playerLives + 1; //playerLives++
      bonusReward = 'virusProtectionBoost';
    } else {
      boostincreaseCount++;
      showElement('VirusProtectionboost' + boostincreaseCount);
      bonusReward = 'bonuslife';
    }
  }
}


// Confirms player released key, player can't hold key to move
onEvent("gameScreen", "keyup", function(event) {
  if (event.key == "Right" || "Up" || "Left" || "Down") {
    KeyUpButton = true;
  }
});


// Uses timed loop to move enemys forward every 10 miliseconds
function enemyMovement(id1, id2, id3) {
  var id1X = 1;
  var id2X = 230;
  var id3X = 1;
  var id1Y = randomNumber(300, 220);
  var id2Y = randomNumber(100, 102);
  var id3Y = randomNumber(10, 110);
  var paint = getPaint();
  setProperty(id1, "icon-color", paint[0]);
  setProperty(id2, "icon-color", paint[1]);
  setProperty(id3, "icon-color", paint[2]);
  getObstacles(paint[3], paint[4], paint[5]);
  getBonus();
  setProperty("gameScreen", "background-color", paint[6]);
  speedUp = speedUp + levelCounter * (randomNumber(0, 3) * 0.11);
  timedLoop(10, function() {
    id1X = id1X + 1 + speedUp;
    id2X = id2X - (0.2 + speedUp);
    id3X = (id3X + 1) + speedUp;
    setPosition(id1, id1X, id1Y);
    setPosition(id2, id2X, id2Y);
    setPosition("levelLabel", id2X + 32, id2Y + 13);
    setPosition(id3, id3X, id3Y);
    if (id1X > 331) {
      id1X = -92;
    }
    if (id2X < -180) {
      id2X = 300;
    }
    if (id3X > 330) {
      id3X = -90;
    }
    if (checkCollision(id1, 40, 35) || checkCollision(id2, 40, 40) || checkCollision(id3, 53, 35)) {
      CollisionEnemy();
    }
  });
}

// Randomizes the appearance of obstacles
function getObstacles(shade1, shade2, shade3) {
  var obstacleNum = randomNumber(1, 3);
  setPosition("obstacle2Image", -200, -350);
  setPosition("obstacle1Image", -300, -300);
  setPosition("obstacle3Image", -150, -110);
  if (obstacleNum == 1) {
    setPosition("obstacle1Image", randomNumber(-20, 120), randomNumber(67, 300));
    setProperty("obstacle1Image", "icon-color", shade1);
  } else if (obstacleNum == 2) {
    setProperty("obstacle1Image", "icon-color", shade1);
    setProperty("obstacle2Image", "icon-color", shade2);
    setPosition("obstacle1Image", randomNumber(-20, 120), randomNumber(67, 300));
    setPosition("obstacle2Image", randomNumber(-20, 120), randomNumber(67, 300));
  } else if (obstacleNum == 3) {
    setProperty("obstacle1Image", "icon-color", shade1);
    setProperty("obstacle2Image", "icon-color", shade2);
    setProperty("obstacle3Image", "icon-color", shade3);
    setPosition("obstacle1Image", randomNumber(-20, 120), randomNumber(67, 300));
    setPosition("obstacle2Image", randomNumber(-20, 120), randomNumber(67, 300));
    setPosition("obstacle3Image", randomNumber(-20, 120), randomNumber(67, 300));
  }
}

// Randomizes the appearance of bonus items
function getBonus() {
  setPosition('bonuslife', -400, -400);
  setPosition('virusProtectionBoost', -400, -400);
  var bonusNum = randomNumber(1, 6);
  if (playerLives < 3 && bonusNum == 1) {
    setPosition('bonuslife', randomNumber(20, 210), randomNumber(60, 360));
    bonusReward = "bonuslife";
  } else if (boostincreaseCount < 3 && bonusNum == 4) {
    setPosition('virusProtectionBoost', randomNumber(20, 210), randomNumber(60, 360));
    bonusReward = "virusProtectionBoost";
  }
}

// Randomizes the item colors for items, each unique
function getPaint() {
  var paint1 = randomNumber(0, 255);
  var paint2 = randomNumber(0, 255);
  var paint3 = randomNumber(0, 255);
  var light = paint1 < 60 && paint2 < 60 && paint3 < 60;
  var similar = Math.abs(paint1 - paint2) + Math.abs(paint1 - paint3) < 60;
  var pastel = paint1 > 120 && paint2 > 120 && paint3 > 120;
  if (light || pastel || similar) {
    paint1 = randomNumber(150, 255);
    paint2 = randomNumber(50, 100);
    paint3 = randomNumber(50, 100);
  }
  var paint = [];
  var id1paint = 'rgb(' + paint1 + ' , ' + paint2 + ',' + paint3 + ')';
  var id2paint = 'rgb(' + paint2 + ' , ' + paint3 + ',' + paint1 + ')';
  var id3paint = 'rgb(' + paint3 + ' , ' + paint1 + ',' + paint2 + ')';
  var obstacle1paint = 'rgb(' + paint2 + ' , ' + paint1 + ',' + paint3 + ')';
  var obstacle2paint = 'rgb(' + paint1 + ' , ' + paint3 + ',' + paint2 + ')';
  var obstacle3paint = 'rgb(' + paint1 + ' , ' + paint3 + ',' + 3 + ')';
  var levelpaint = 'rgba(' + paint3 + ' , ' + paint2 + ',' + paint1 + ', 0.33)';
  appendItem(paint, id1paint);
  appendItem(paint, id2paint);
  appendItem(paint, id3paint);
  appendItem(paint, obstacle1paint);
  appendItem(paint, obstacle2paint);
  appendItem(paint, obstacle3paint);
  appendItem(paint, levelpaint);
  return paint;
}

// Checks if items are touching the player
function checkCollision(enemy, xArea, yArea) {
  if (yArea > Math.abs(getImageYCenter("player") - getImageYCenter(enemy))) {
    if (xArea > Math.abs(getImageXCenter("player") - getImageXCenter(enemy))) {
      return true;
    }
  }
  return false;
}

// Used by checkCollision to get x value
function getImageXCenter(image) {
  var x = getXPosition(image);
  var width = getProperty(image, "width");
  var xCenter = x + width / 2;
  return xCenter;
}

// Used by checkCollision to get y value
function getImageYCenter(image) {
  var y = getYPosition(image);
  var height = getProperty(image, "height");
  var yCenter = y + height / 2;
  return yCenter;
}


// Decrease lives, go to game if 0
function CollisionEnemy() {
  playerLives--;
  stopTimedLoop();
  if (playerLives < 1) {
    hideElement("winImage");
    showElement("gameOverImage");
    setScreen("gameOverScreen");
    if (topScore[0] == 0) {
      topScore = [CountMovement, CountMovement, CountMovement, CountMovement, CountMovement];
      setText("rScore1", CountMovement);
      setText("recentLevel1", levelCounter);
      setText("rScore2", CountMovement);
      setText("recentLevel2", levelCounter);
      setText("rScore3", CountMovement);
      setText("recentLevel3", levelCounter);
      setText("rScore4", CountMovement);
      setText("recentLevel4", levelCounter);
      setText("rScore5", CountMovement);
      setText("recentLevel5", levelCounter);
      
    }
    for (var i = 0; i < topScore.length; i++) {
      if (CountMovement > topScore[i]) {
        topScore[i] = CountMovement;
        setText("rScore" + (i + 1), CountMovement);
        setText("recentLevel" + (i + 1), levelCounter);
        setText("overLabel", "High Score!");
        setProperty("gameOverScreen", "background-color", "#4c4646");
        i = 20;
        showElement("winImage");
        hideElement("gameOverImage");
        }
    }
    setText("scoreNumber", CountMovement);
    setText("levelNumber", levelCounter);
  } else {
    setPosition("player", 150, 444);
    hideElement("life" + (3 - playerLives));
   enemyMovement("bug2", "truckandLevelEnemy", "bug1");
  }
}


// Check for obstacle collision, move player
function obstacleCollision(){
  for(var i=1; i < 3; i++){
    if (checkCollision("obstacle"+ i +"Image", 60, 15)){
      return true;
    }
  }
  return false;
}

// Retry button on game over screen
onEvent("retryButton", "click", function() {
  setScreen("gameScreen");
  enemyMovement("bug2", "truckandLevelEnemy", "bug1");
  setPosition('bonuslife', -400, -400);
  setPosition('virusProtectionBoost', -400, -400);
  CountMovement = 0;
  levelCounter = 1;
  playerLives = 3;
  boostincreaseCount = 3;
  speedUp = 0;
  setText("scoreNumber", CountMovement);
  setText("levelNumber", levelCounter);
  setPosition("player", 140, 410);
  showElement("life1");
  showElement("life2");
  showElement("VirusProtectionboost1");
  showElement("VirusProtectionboost2");
  showElement("VirusProtectionboost3");
});

//will set the homescreen button to go back to the main screen of the game/app
onEvent("HomeScreen", "click", function(){
  setScreen("startScreen");
});
