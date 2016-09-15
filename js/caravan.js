var Oregon = Oregon || {};

Oregon.Caravan = {};

Oregon.Caravan.init = function(stats){
  this.day = stats.day;
  this.distance = stats.distance;
  this.crew = stats.crew;
  this.food = stats.food;
  this.oxen = stats.oxen;
  this.money = stats.money;
  this.firepower = stats.firepower;
};

// weight & capacity
Oregon.Caravan.updateWeight = function(){
  var droppedFood = 0;
  var droppedGuns = 0;

  // carvan carry capacity
  this.capacity = this.oxen * Orgeon.WEIGHT_PER_OX + this.crew * Oregon.WEIGHT_PER_PERSON;

  // current weight
  this.weight = this.food * Oregon.FOOD_WEIGHT + this.firepower * Oregon.FIREFPOWER_WEIGHT;

  // drops if too much weight
  // gun drop before food
  while(this.firepower && this.capacity <= this.weight) {
    this.firepower--;
    this.weight -= Oregon.FIREFPOWER_WEIGHT;
    droppedGuns++;
  }

  if(droppedGuns) {
    this.ui.notify('Left '+droppedGuns+' guns behind', 'negative');
  }

  while(this.food && this.capacity <= this.weight) {
    this.food--;
    this.weight -= Oregon.FOOD_WEIGHT;
    droppedFood++;
  }

  if(droppedFood) {
    this.us.notify('Left '+droppedFood+' food provisions behind', 'negative');
  }
};

// update covered distance
Oregon.Caravan.updateDistance = function() {
  var diff = this.capacity - this.weight;
  var speed = Oregon.SLOW_SPEED + diff/this.capacity * Oregon.FULL_SPEED;
  this.distance += speed;
};

// food consumption
Oregon.Caravan.consumeFood = function() {
  this.food -= this.crew * Oregon.FOOD_PER_PERSON;

  if(this.food < 0) {
    this.food = 0;
  }
};