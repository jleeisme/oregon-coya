var Oregon = Oregon || {};
 
Oregon.UI = {};
 
//show a notification in the message area
Oregon.UI.notify = function(message, type){
  console.log(message + ' - ' + type);
};
 
//refresh visual caravan stats
Oregon.UI.refreshStats = function() {
  console.log(this.caravan);
}