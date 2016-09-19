var Oregon = Oregon || {};

Oregon.WEIGHT_PER_OX = 20;
Oregon.WEIGHT_PER_PERSON = 2;
Oregon.FOOD_WEIGHT = 0.6;
Oregon.FIREPOWER_WEIGHT = 5;
Oregon.GAME_SPEED = 800;
Oregon.DAY_PER_STEP = 0.2;
Oregon.FOOD_PER_PERSON = 0.02;
Oregon.FULL_SPEED = 5;
Oregon.SLOW_SPEED = 3;
Oregon.FINAL_DISTANCE = 1000;
Oregon.EVENT_PROBABILITY = 0.15;
Oregon.ENEMY_FIREPOWER_AVG = 5;
Oregon.ENEMY_GOLD_AVG = 50;

Oregon.Game = {};

// initiate game
Oregon.Game.init = function(){

  // ui reference
  this.ui = Oregon.UI;

  // reference event manager
  this.eventManager = Oregon.Event;

  // setup caravan
  this.caravan = Oregon.Caravan;
  this.caravan.init({
    day: 0,
    distance: 0,
    crew: 30,
    food: 80,
    oxen: 2,
    money: 300,
    firepower: 2
  });

  // pass references
  this.caravan.ui = this.ui;
  this.caravan.eventManager = this.eventManager;

  this.ui.game = this;
  this.ui.caravan = this.caravan;
  this.ui.eventManager = this.eventManager;

  this.eventManager.game = this;
  this.eventManager.caravan = this.caravan;
  this.eventManager.ui = this.ui;

  // start!
  this.startJourney();
};

// start journey and time starts
Oregon.Game.startJourney = function(){
  this.gameActive = true;
  this.previousTime = null;
  this.ui.notify('The adventure begins', 'positive');

  this.step();
};

// game loop
Oregon.Game.step = function(timestamp) {

  // starting, setup the previous time for the first time
  if(!this.previousTime){
    this.previousTime = timestamp;
    this.updateGame();
  }

  // time difference
  var progress = timeStamp - this.previousTime;

  // game update
  if(progress >= Oregon.GAME_SPEED) {
    this.previousTime = timestamp;
    this.updateGame();
  }

  if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
};

// update game stats
Oregon.game.updateGame = function() {
  
  // day update
  this.caravan.day += Oregon.DAY_PER_STEP;

  // food update
  this.caravan.consumeFood();

  if(this.caravan.food === 0) {
    this.ui.notify('Your caravan starved to death', 'negative');
    this.gameActive = false;
    return;
  }

  // update weight
  this.caravan.updateWeight();

  // update progress/distance
  this.caravan.updateDistance();

  // show stats
  this.ui.refreshStats();

  // check for deaths
  if(this.caravan.crew <= 0) {
    this.caravan.crew = 0;
    this.ui.notify('Everyone died', 'negative');
    this.gameActive = false;
    return;
  }

  // check if win?
  if(this.caravan.distance >= Oregon.FINAL_DISTANCE) {
    this.ui.notify('Everyone died', 'negative');
    this.gameActive = false;
    return;
  }

  // random events
  if(Math.random() <= Oregon.EVENT_PROBABILITY) {
    this.eventManager.generateEvent();
  }
};

// pause journey
Oregon.Game.pauseJourney = function() {
  this.gameActive = false;
};

// resume journey
Oregon.Game.resumeJourney = function() {
  this.gameActive = true;
  this.step();
};

// init game
Oregon.Game.init();