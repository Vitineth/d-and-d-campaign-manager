//This file is included from index.html and handles direct input to components within the DOM 
//and the distribution of thise events to the other aspects of the program.

// Because we are in the renderer thread we need to specify the dialog library as a remote to access it.
const dialog = require('electron').remote.dialog;
// We need to access our system bus to distribute the events around the systems.
var bus = require('../system-emitter.js');

//When we are on the loader page and actually try to load something we need to show the user the system
//file chooser. As we are using JSON data as the storage format for our campaigns we add a filter for 
//that.
//Additionally, there is a quick check that an actual path was set by the user and if so then we
//trigger a load for it which is in another file.
$(".load-button").click(function(){
    dialog.showOpenDialog({
        title: "Load Campaign File",
        filters: [
            { name: "Campaign Data", extensions: ["json"] }
        ],
        multiSelections: false,
    }, function(path){
        if(path) bus.emit("load-campaign", path);
    })
});

//When the user enters some text or modifies the contents of the search field we need to update the
//search results accordingly. This just distributes the contents to the other renderer.
$("#search-field").on('input', function(){
    bus.emit("expand-query", $(this).val(), $("#search-type").val());
});

$("#roller-close").click(function(){
    $("#roller").css("display", "none");
});