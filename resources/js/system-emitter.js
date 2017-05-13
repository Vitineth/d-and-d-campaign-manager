const EventEmitter = require('events');
const emitter = new EventEmitter();
const electron = require('electron');

emitter.on('uncaughtException', function (err) {
    console.error(err);
});

emitter.on("enable-campaign", function(){
    var menu = electron.remote.Menu.getApplicationMenu().items[1].submenu.items;
    for(var i = 0; i < menu.length; i++){
        menu[i].enabled = true;
    }
});

emitter.on("disable-campaign", function(){
    var menu = electron.remote.Menu.getApplicationMenu().items[1].submenu.items;
    for(var i = 0; i < menu.length; i++){
        menu[i].enabled = false;
    }
});

module.exports = emitter;