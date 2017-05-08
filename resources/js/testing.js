const path = require('path');
const url = require('url');
const fs = require('fs');
var bus = require('./system-emitter.js');
const dialog = require('electron').remote.dialog;

let campaign;

function loadCampaign(filePath){
    fs.readFile(filePath, "utf8", function(err, data){
        if(err){
            console.log(err);
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
            verifyCampaign();
        }
    });
}

bus.on("load-campaign", function(path){
    loadCampaign(path[0]);
})

function verifyCampaign(){
    //Verify that we have scenes, encounters, monsters and a beginning.
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


    bus.emit("switch-to-explorer");
    window.document.title = "D and D Campaign Manager - " + campaign.title;
    bus.emit("trigger-load", campaign.begin);
}

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
        if(!campaign.encounters.hasOwnProperty(id.replace("s__", ""))){
            bus.emit("error-window", "A scene ID has been specified but the corrosponding scene could not be found. Ensure that your data is valid.");
            return;
        }

        var encounter = campaign.encounters[id.replace("s__", "")];
        bus.emit("load-scene", encounter);
    }else{
        bus.emit("loading-end");
    }
});

bus.on('expand-query', function(query, option){
    if(query == "") {
        bus.emit("expand-query-results", []);
        return;
    }

    var results = [];
    console.log(option + ", " + query);

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