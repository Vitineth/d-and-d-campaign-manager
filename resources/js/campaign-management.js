
// Required to read from the campaign data files
const fs = require('fs');
// Required to show the error messages
const dialog = require('electron').remote.dialog;

// Required to distribute the events through the system
var bus = require('./system-emitter.js');
let fileLocation;
// A constant store of the active campaign.
let campaign;

// This function begins the loading of a campaign stored within a file. This will try and read 
// from the file system with a UTF8 character set and shows a dialog if it fails prompting for 
// retry or cancel. If there is a successful read we parse the JSON and verify the campaign
// which will trigger the rest of the load.
function loadCampaign(filePath){
    fs.readFile(filePath, "utf8", function(err, data){
        if(err){
            bus.emit("read-error", err);
            dialog.showMessageBox({
                type: "error",
                title: "Failed to Read Campaign File",
                message: "There was an error reading the campaign files. Would you like to try again?",
                buttons: ["Retry", "Close"]
            }, function(index){
                if(index == 0) loadCampaign(filePath);
            });
        }else{
            campaign = JSON.parse(data);
            verifyCampaign(filePath);
        }
    });
}

// This is dispatched when the user requests a load of a specific campaign. This sends the file
// path for the file to be loaded.
bus.on("load-campaign", function(path){
    loadCampaign(path[0]);
});

bus.on("fetch-campaign", function(callback){
    if(typeof(callback)==="function") callback(campaign);
});

bus.on("save-campaign", function(nCampaign, callback){
    campaign = nCampaign;
    console.log(campaign);
    verifyCampaign(fileLocation);

    if(fileLocation!==undefined){
        console.log("Saving");
        fs.writeFile(fileLocation, JSON.stringify(campaign), (err) => {
            if(err){
//                bus.emit("notification", "There was an error saving the campaign to file! The error is: " + err);
                callback(err);
            }else{
                bus.emit("notification", "The campaign was saved successfully");
                callback();
            }
        });
    }
});

bus.on("change-save-location", function(location){
    fileLocation = location;
})

//bus.emit("load-campaign", ["C:\\Users\\Ryan\\Documents\\Git\\Electron\\d-and-d-campaign-manager\\resources\\data.json"]);

// Verification is a basic process here and only verifies that we have enough stuff to actually start
// and render the first interface. Right now we only verify the existance of:
//  /title
//  /scenes
//  /encounter
//  /monsters
//  /begin
// Future verification will be added for the correct syntax for puzzles, monsters, encounter, scenes
// and more but this gives us the basic overview. The improvements are for another feature branch.
// Once the file has been verified, it will switch to the explorer view, trigger a load for the key
// specified in /begin and then changes the title.
function verifyCampaign(location){
    if(!campaign.hasOwnProperty("title")){
        bus.emit("error-window", "Campaign data is missing a title. Please verify that the data you have selected is valid");
        return;
    }
    if(!campaign.hasOwnProperty("scenes")){
        bus.emit("error-window", "Campaign data is missing a scenes section. Please verify that the data you have selected is valid");
        return;
    }
    if(!campaign.hasOwnProperty("encounters")){
        bus.emit("error-window", "Campaign data is missing a scenes section. Please verify that the data you have selected is valid");
        return;
    }
    if(!campaign.hasOwnProperty("monsters")){
        bus.emit("error-window", "Campaign data is missing a scenes section. Please verify that the data you have selected is valid");
        return;
    }
    if(!campaign.hasOwnProperty("begin")){
        bus.emit("error-window", "Campaign data is missing a scenes section. Please verify that the data you have selected is valid");
        return;
    }
    if(campaign.begin.indexOf("s__") == 0){
        if(!campaign.scenes.hasOwnProperty(campaign.begin.replace("s__", ""))){
            bus.emit("error-window", "A beginning has been specified but the corresponding scene or encounter cannot be found. Ensure the ID is correct and is prefixed by either e__ or s__ for encounter and scene respectively.");
            return;
        }
    }else if(campaign.begin.indexOf("e__") == 0){
        if(!campaign.encounters.hasOwnProperty(campaign.begin.replace("e__", ""))){
            bus.emit("error-window", "A beginning has been specified but the corresponding scene or encounter cannot be found. Ensure the ID is correct and is prefixed by either e__ or s__ for encounter and scene respectively.");
            return;
        }
    }else{
        bus.emit("error-window", "A beginning has been specified but the corresponding scene or encounter cannot be found. Ensure the ID is correct and is prefixed by either e__ or s__ for encounter and scene respectively.");
        return;
    }

    fileLocation = location;
    window.document.title = "D and D Campaign Manager - " + campaign.title;
    bus.emit("switch-to-explorer");
    bus.emit("enable-campaign");
    bus.emit("trigger-load", campaign.begin);
}

// This is registered as a bus event as anyone can trigger a load, not just the function above. 
// This will attempt to resolve the key from encounters or scenes. This expects the key to be in
// the form of 
//  s__[id] = Scene
//  e__[id] = Encounters
// If it cannot find it, an error message will be provided but should the key be in an invalid format
// there will not be an error.
bus.on("trigger-load", function(id){
    bus.emit("loading-begin");

    if(id.indexOf("e__") == 0){
        //Load an encounter;
        if(!campaign.encounters.hasOwnProperty(id.replace("e__", ""))){
            bus.emit("error-window", "An encounter ID has been specified but the corrosponding encounter could not be found. Ensure that your data is valid.");
            return;
        }

        var encounter = campaign.encounters[id.replace("e__", "")];
        bus.emit("load-encounter", encounter, campaign);
    }else if(id.indexOf("s__") == 0){
        //Load a scene;
        if(!campaign.scenes.hasOwnProperty(id.replace("s__", ""))){
            bus.emit("error-window", "A scene ID has been specified but the corrosponding scene could not be found. Ensure that your data is valid.");
            return;
        }

        var encounter = campaign.scenes[id.replace("s__", "")];
        bus.emit("load-scene", encounter, campaign);
    }else{
        bus.emit("loading-end");
    }
});

// When testing a query, we need to search the possibilities and return the results. This is one of two 
// events associated with searching, the other being 'expand-query-results'. This expects the option
// to be one of
//  Any
//  Encounters
//  Scenes
// and the query to be any regular string. It will search for each and then callback to 
// expand-query-results with an array of results in the form of
//  {
//      "id": [id],
//      "name": [name],
//      "type": [e/s]
//  }
bus.on('expand-query', function(query, option){
    if(query == "") {
        bus.emit("expand-query-results", []);
        return;
    }

    var results = [];
    if(option == "Encounters" || option == "Any"){
        var encounterKeys = Object.keys(campaign.encounters);
        for(var i = 0; i < encounterKeys.length; i++){
            if(campaign.encounters[encounterKeys[i]].name.indexOf(query) != -1){
                results.push({
                    "id": "e__" + encounterKeys[i],
                    "name": campaign.encounters[encounterKeys[i]].name,
                    "type": "e"
                });
            }
        }
    }

    if(option == "Scenes" || option == "Any"){
        var sceneKeys = Object.keys(campaign.scenes);
        for(var i = 0; i < sceneKeys.lengths; i++){
            if(campaign.scenes[sceneKeys[i]].name.indexOf(query) != -1){
                results.push({
                    "id": "s__" + sceneKeys[i],
                    "name": campaign.scenes[sceneKeys[i]].name,
                    "type": "s"
                });
            }
        }
    }

    bus.emit('expand-query-results', results);
});
