// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Because we are in the renderer thread we need to specify the dialog library as a remote to access it.
const dialog = require('electron').remote.dialog;
// We need to access our system bus to distribute the events around the systems.
var bus = require('../system-emitter.js');

//var monsterExpanderTemplate start
var monsterExpanderTemplate = $("<div class=\"expansion-body clearfix\">\n   <h2 ><span id=\"name\">Hell Hound</span> <small><span id=\"size\">Medium</span> <span id=\"type\">fiend</span>, <span id=\"alignment\">lawful evil</span></small></h2>\n   <table style=\"width: 100%;\" class=\"clear-table\">\n     <tbody>\n       <tr>\n         <th style=\"width: 15%;\">Armor Class</th>\n         <td><span id=\"ac\">15 (natural armor)</span></td>\n       </tr>\n       <tr>\n         <th>Hit Points</th>\n         <td><span id=\"hp\">45 (7d8+14)</hp></td>\n       </tr>\n       <tr>\n         <th>Speed</th>\n         <td><span id=\"speed\">60ft</span></td>\n       </tr>\n     </tbody>\n   </table>\n   <hr>\n   <table style=\"width: 100%; text-align: center\" class=\"clear-table stats-table\">\n     <tbody>\n       <tr>\n         <th>STR</th>\n         <th>DEX</th>\n         <th>CON</th>\n         <th>INT</th>\n         <th>WIS</th>\n         <th>CHA</th>\n       </tr>\n       <tr>\n         <td><span id=\"str\">17 (+3)</span></td>\n         <td><span id=\"dex\">12 (+1)</span></td>\n         <td><span id=\"con\">14 (+2)</span></td>\n         <td><span id=\"int\">6 (-2)</span></td>\n         <td><span id=\"wis\">13 (+1)</span></td>\n         <td><span id=\"cha\">6 (-2)</span></td>\n       </tr>\n     </tbody>\n   </table>\n   <hr>\n   <table style=\"width: 100%;\" class=\"clear-table\">\n     <tbody>\n       <tr>\n         <th style=\"width: 15%;\">Skills</th>\n         <td>\n           <ul id=\"skills\">\n             <li>Perception +5</li>\n           </ul>\n         </td>\n       </tr>\n       <tr>\n         <th>Damage Immunities</th>\n         <td id=\"immunities-damage\">fire</td>\n       </tr>\n       <tr>\n         <th>Condition Immunities</th>\n         <td id=\"immunities-condition\">fire</td>\n       </tr>\n       <tr>\n         <th>Damage Resistances</th>\n         <td id=\"resistances-damage\">fire</td>\n       </tr>\n       <tr id=\"resistances-condition\">\n         <th>Condition Resistances</th>\n         <td  id=\"resistances-condition\">fire</td>\n       </tr>\n       <tr>\n         <th>Senses</th>\n         <td id=\"senses\"><strong>darkvision</strong> (60ft)., <strong>passive perception</strong> 15</td>\n       </tr>\n       <tr>\n         <th>Languages</th>\n         <td>\n           <ul id=\"languages\"></ul>\n         </td>\n       </tr>\n       <tr>\n         <th>Challenge</th>\n         <td id=\"challenge\">3 (700XP)</td>\n       </tr>\n     </tbody>\n   </table>\n   <hr>\n   <div id=\"abilities\">\n     <span>\n       <strong>Keen Hearing and Smell</strong> The hound has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n     </span>\n     <br>\n     <span>\n       <strong>Pack Tactics</strong> The hound has advantage on an attack roll against a creature if a least one of the hound's allies is within 5 feet of the creature and the ally isn't incapacitated.\n     </span>\n   </div>\n   <hr>\n   <h5>Actions</h5>\n   <div id=\"actions\">\n     <span>\n       <strong>Bite</strong> <em>Melee Weapon Attack: </em> +5 to hit, reach 5 ft., one target. <em>Hit: </em> 7 (1d8 + 3) piercing damage plus 7 (2d6) fire damage.\n     </span>\n     <br>\n     <span>\n       <strong>Fire Breath (Recharge 5-6)</strong> THe hound exhales fire in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity waving throw, taking 21 (6d6) fire damage on a failed save or half as much damage on a successful one.\n     </span>\n   </div>\n </div>\n");
//close

//Should we be sent a request to switch to the loader page we need to distribute it to the generic
//page switching function but we also need to fix the overflow of the body as we have it set up so 
//it would have scrollbars otherwise. This is a tad inefficient so we will need to fix this up a bit
//when we get to the rewriting of the pages feature branch.
bus.on("switch-to-loader", function(){
    switchPage("loader");
    $("body").css("overflow", "hidden");
});

//Like before, if we are switching to the explorer we can use the default stuff but we need to 
//repair the changes that we made to the overflow when we switched to the loader by resetting it
//back to auto. This will also be rewritten when we get to the rewriting of pages feature branch.
bus.on("switch-to-explorer", function(){
    switchPage("explorer");
    $("body").css("overflow", "auto");
});

//This is a generic function that allows us to spawn an error box from anywhere using a quick bus
//call. This is designed to be expanded in the future and provides a standard layout for error 
//messages. Functions can create their own with specific buttons for example but this it for
//quick error messages with just a single button.
bus.on("error-window", function(data){
    dialog.showErrorBox("Error", data);
});

//This is a response to the loading of a specific encounter. To be able to access it, we need to have
//access to the requested encounter and the specific campaign. This is most commonly done by emitting
//an 'trigger-load' event with the id in the form of 's__scene_id' or 'e__encounter_id' which will
//dispatch to this function with the correct encounter and campaign to be used.
bus.on('load-encounter', function(encounter, campaign){
    // The loading of a campaign requires rewriting a large portion of the explorer window.
    //Not all code here will be documented as things should be roughly self-explanatory.
    
    $("#exp-type").text("Encounter");
    $("#exp-name").text(encounter.name);
    $("#exp-description").text(encounter.description);

    //The JSON template defines a list of key points so we much generate the list elements
    //and append them to the ul we are using for them which will then be placed into the key
    //points area.
    var ul = $("<ul></ul>");
    for(var i = 0; i < encounter.key_points.length; i++){
        ul.append($("<li></li>").text(encounter.key_points[i]));
    }
    $("#exp-key-points").empty().append(ul);
    
    //Puzzles and monsters form a reasonably complex part of the loading. The general process
    //is simple enough, empty the container and then append an expander for every monster and puzzle.
    //The functions to generating the monsters and puzzles are broken out as the same stuff is used
    //for the loading of a scene as well as a encounter. This could be centralised into one but they
    //will remain separate for now as there will be future expansion at which point the scene and
    //encounter screens will change more significantly.
    $("#exp-monsters-container").empty();
    $("#exp-puzzle-container").empty();

    for(var i = 0; i < encounter.monsters.length; i++){
        var monster = campaign.monsters[encounter.monsters[i]];
        $("#exp-monsters-container").append(generateMonster(monster));
    }

    for(var i = 0; i < encounter.puzzles.length; i++){
        var monster = campaign.puzzles[encounter.puzzles[i]];
        $("#exp-monsters-container").append(generatePuzzle(monster));
    }

    //Navigation follows a similar basic process as monsters and puzzles and is broken out into a
    //different function for the same reasons. This bit gets a bit annoying with the JSON keys. There
    //is likely a better way to do this but we will get around to doing that during the optimisation 
    //feature branch. TODO
    $("#exp-navigation").empty();
    var keys = Object.keys(encounter.navigation);
    for(var i = 0; i < keys.length; i++){
        $("#exp-navigation").append(generateNavButton(encounter.navigation[keys[i]], keys[i]));
    }

    //Once we've finished the loading we can announce it which will stop the loading icon in the 
    //bottom right after 400ms. This is just to give the user some time to see it because otherwise
    //it won't ever be shown because this function is so fast.
    bus.emit("loading-end");
});

//The process for loading a scene is almost exactly the same as the process for loading an encounter
//so look above for the descriptions of what each bit does. This should be updated in the future for
//any changes made to how scenes load.
bus.on('load-scene', function(encounter, campaign){
    $("#exp-type").text("Scene");
    $("#exp-name").text(encounter.name);
    $("#exp-description").text(encounter.description);

    var ul = $("<ul></ul>");
    for(var i = 0; i < encounter.key_points.length; i++){
        ul.append($("<li></li>").text(encounter.key_points[i]));
    }
    $("#exp-key-points").empty().append(ul);
    $("#exp-monsters-container").empty();
    $("#exp-puzzle-container").empty();

    for(var i = 0; i < encounter.monsters.length; i++){
        var monster = campaign.monsters[encounter.monsters[i]];
        $("#exp-monsters-container").append(generateMonster(monster));
    }

    for(var i = 0; i < encounter.puzzles.length; i++){
        var monster = campaign.puzzles[encounter.puzzles[i]];
        $("#exp-monsters-container").append(generatePuzzle(monster));
    }

    $("#exp-navigation").empty();
    var keys = Object.keys(encounter.navigation);
    for(var i = 0; i < keys.length; i++){
        $("#exp-navigation").append(generateNavButton(encounter.navigation[keys[i]], keys[i]));
    }

    bus.emit("loading-end");
});

//Searching for encounters and scenes forms one of the main functions of the sidebar. This event is
//designed to actually show the given results in the sidebar. This should be called from the
//'expand-query' event with an array of result objects.
bus.on('expand-query-results', function(results){
    //Empty out the existing results
    $("#sresults").empty();
    //And for every returned result, add an entry. This also means that if none are returned the list
    //will be cleared and nothing added which is beneficial.
    for(var i = 0; i < results.length; i++){
        // Generate te list entry. We need to expand out the e for encounter and s for scene so we just
        // trust that if it's not e it is s. This is a bit of an overlook but it works for now. If we 
        // add searching for monsters and puzzles we will have to change this but that is for another 
        // feature branch.
        var li = $("<li></li>").attr("data-location", results[i].id);
        var title = $("<span></span>").text(results[i].name);
        var type = $("<span></span>").text(results[i].type == "e" ? "Encounter" : "Scene").attr("class", "type");

        //We need to actually link up the button so we register it to trigger a load using the assigned
        //id of the result.
        li.click(function(){
            bus.emit("trigger-load", $(this).attr("data-location"));
        });

        $("#sresults").append(li.append(title).append(type));
    }
});

//The start of loading is instantanous so the box will be shown instantly. This is placed here as the
//renderer should deal with interactions with the page.
bus.on('loading-begin', function(){
    $(".loading-div").css("display", "flex");
});

//The end of loading has a delay added to it to make sure that the user actually sees the loading icon
//if there was no delay they would not actually see the loading icon at all. This is designed to make
//sure that small changes to the screen are obvious if they require some loading. These are just
//soem handy functions but don't actually need to be used for any reason.
bus.on('loading-end', function(){
    setTimeout(function(){
        $(".loading-div").css("display", "none");
    }, 400);
});

//Generating nav buttons is a simple enough ordeal but because it is required by both scenes
//and encounters it is moved here. The structure of a navigation button is:
//<div class="six columns">
//  <button class="nav-button" data-location="[id]">[name]</button>
//</div>
//With a click event to trigger a load for the id stored in data-location. This function also has
//a tiny but of handling if a location is not supplied as it will simply disable the button but still
//show it (which should highlight the errors). 
function generateNavButton(navigation, key){
    var div = $("<div></div>").attr("class", "six columns");
    var button = $("<button></button").attr("class", "nav-button").text(key);
    if(navigation.hasOwnProperty("location")){
        button.attr("data-location", navigation.location)
        button.click(function(){
            bus.emit("trigger-load",  $(this).attr("data-location"));
        });
    }else{
        button.prop("disabled", true);
    }

    var icon = $("<i></i>").attr("class", navigation.hasOwnProperty("icon") ? navigation.icon : "");
    return div.append(button.append(icon));
}

//Puzzles have not been implemented yet but will be generated here when they are added in full, this
//will be part of another feature branch.
function generatePuzzle(puzzle){

}

//The generation of the monster expanders is a more complex process as there is an awful lot of 
//information to be shown to the user. The actual structure of an expander is also reasonably
//complex so there is a lot of structural code at the start to build up something that can
//actually be injected into the code. This is more complex than the code required to generate one
//straight from the HTML as the material-design.js file automatically converts and enables ones it
//finds on page load but as these are being added after the load, it is easier to generate their
//complete structure.
function generateMonster(monster){
    var expansion = $("<div></div>").attr("class", "expansion");
    var panel = $("<div></div>").attr("class", "expansion-panel");
    var header = $("<div></div>").attr("class", "expansion-header");
    var table = $("<table></table>").attr("class", "clear-table expansion-table");
    var tbody = $("<tbody></tbody>");
    var tr = $("<tr></tr>");
    var name = $("<td></td>").attr("class", "primary").text(monster.name);
    var type = $("<td></td>").text("Monster");
    var chevronTd = $("<td></td>");
    var chevronSpan = $("<span></span>").attr("class", "expansion-chevron");
    var chevron = $("<i></i>").attr("class", "fa fa-chevron-down");

    //The basic details of the monster can be filled in easily. We have a template for the body
    //of the expander above which we can take a clone of. Each thing that needs to be changed
    //within it is associated with an id which must be removed before it is injected into the DOM
    //or it may mess with things (not many things like duplicate IDs).
    var copy = monsterExpanderTemplate.clone();
    copy.find("#name").text(monster.name).removeAttr("id");
    copy.find("#size").text(monster.size).removeAttr("id");
    copy.find("#type").text(monster.type).removeAttr("id");
    copy.find("#alignment").text(monster.alignment).removeAttr("id");
    copy.find("#ac").text(monster.ac).removeAttr("id");
    copy.find("#hp").text(monster.hp).removeAttr("id");
    copy.find("#speed").text(monster.speed).removeAttr("id");

    //We need to calculate the stats here. This is done so the user does not need to work them
    //out on their own. The formula is from the Player's Handbook (v-10)/2 then round down.
    var str = monster.stats.str;
    var strm = Math.floor((str - 10) / 2);

    var dex = monster.stats.dex;
    var dexm = Math.floor((dex - 10) / 2);

    var con = monster.stats.con;
    var conm = Math.floor((con - 10) / 2);

    var int = monster.stats.int;
    var intm = Math.floor((int - 10) / 2);

    var wis = monster.stats.wis;
    var wism = Math.floor((wis - 10) / 2);

    var cha = monster.stats.cha;
    var cham = Math.floor((cha - 10) / 2);

    //Here the actual content of the stats are set in the form:
    // <stat> (+/-<mod>)
    //This requires some messing around with parsing as strings because otherwise half of it is a number
    //and half is not so we end up with messy NaN's randomly. This is just a bit simpler albeit messy.
    copy.find("#str").text(str + " (" + new String(strm > 0 ? "+" + new String(strm) : strm) + ")").removeAttr("id");
    copy.find("#dex").text(dex + " (" + new String(dexm > 0 ? "+" + new String(dexm) : dexm) + ")").removeAttr("id");
    copy.find("#con").text(con + " (" + new String(conm > 0 ? "+" + new String(conm) : conm) + ")").removeAttr("id");
    copy.find("#int").text(int + " (" + new String(intm > 0 ? "+" + new String(intm) : intm) + ")").removeAttr("id");
    copy.find("#wis").text(wis + " (" + new String(wism > 0 ? "+" + new String(wism) : wism) + ")").removeAttr("id");
    copy.find("#cha").text(cha + " (" + new String(cham > 0 ? "+" + new String(cham) : cham) + ")").removeAttr("id");

    //The skills is an unordered list so we need to generate them from the text specified by the user
    //The sections are in the form:
    //<li>
    //  <strong>[name]</strong> <span>[description]</span>
    //</li>
    copy.find("#skills").empty();//ul
    for(var i = 0; i < monster.skills.length; i++){
        var li = $("<li></li>");
        var strong = $("<strong></strong>").text(monster.skills[i].name);
        var span = $("<span></span>").text(monster.skills[i].modifier);
        li.append(strong).append(span);
        copy.find("#skills").append(li);
    }
    copy.find("#skills").removeAttr("id");

    //Monsters can have a mix of either immunities or resistances for either damages or conditions.
    //This leads to a total of four possible combinations. Each is generated here as a quick comma
    //separated list (with commas at the front so we can just substring it with one argument). There is
    //no functions for hiding lists that are empty but that will be added at another time.
    var imda = "";
    for(var i = 0; i < monster.immunities.damage.length; i++){
        imda += ", " + monster.immunities.damage[i];
    }
    var imco = "";
    for(var i = 0; i < monster.immunities.condition.length; i++){
        imco += ", " + monster.immunities.condition[i];
    }
    var reda = "";
    for(var i = 0; i < monster.resistances.damage.length; i++){
        reda += ", " + monster.resistances.damage[i];
    }
    var reco = "";
    for(var i = 0; i < monster.resistances.condition.length; i++){
        reco += ", " + monster.resistances.condition[i];
    }

    copy.find("#immunities-damage").text(imda.substring(2)).removeAttr("id");
    copy.find("#immunities-condition").text(imco.substring(2)).removeAttr("id");
    copy.find("#resistances-damage").text(reda.substring(2)).removeAttr("id");
    copy.find("#resistances-condition").text(reco.substring(2)).removeAttr("id");

    //Senses are generated in the same way as above. THis may be converted to an ul later on.
    var senses = "";
    for(var i = 0; i < monster.senses.length; i++){
        senses += ", " + monster.senses[i];
    }                                       
    copy.find("#senses").text(senses.substring(2)).removeAttr("id");

    //Languages are expressed as an ul so we need to convert each entry in the JSON to a li.
    copy.find("#languages").empty();//ul
    for(var i = 0; i < monster.languages.length; i++){
        var li = $("<li></li>").text(monster.languages[i].modifier);
        copy.find("#languages").append(li);
    }
    copy.find("#languages").removeAttr("id");

    copy.find("#challenge").text(monster.challenge.level + " (" + monster.challenge.xp + ")").removeAttr("id");

    //Abilities and actions are generated in almost the same way as skills only using the format:
    //<div>
    //  <strong>[name]</strong>
    //  <span>[description]</span>
    //  <br>
    //</div>
    copy.find("#abilities").empty();
    for(var i = 0; i < monster.abilities.length; i++){
        var div = $("<div></div>");
        var span = $("<span></span>").text(monster.abilities[i].description);
        var strong = $("<strong></strong>").text(monster.abilities[i].name);
        var br = $("<br></br>");

        div.append(strong).append(span).append(br);
        copy.find("#abilities").append(div);
    }
    copy.find("#abilities").removeAttr("id");

    copy.find("#actions").empty();
    for(var i = 0; i < monster.actions.length; i++){
        var div = $("<div></div>");
        var span = $("<span></span>").text(monster.actions[i].description);
        var strong = $("<strong></strong>").text(monster.actions[i].name);
        var br = $("<br></br>");

        div.append(strong).append(span).append(br);
        copy.find("#actions").append(div);
    }
    copy.find("#actions").removeAttr("id");

    //Finally we append the copy of the body to the container we are using
    $("#exp-monsters-container").append(copy);

    //Assemble the entire expander from all its base components
    expansion.append(panel);
    panel.append(header);
    header.append(table);
    table.append(tbody);
    tbody.append(tr);
    tr.append(name);
    tr.append(type);
    tr.append(chevronTd);
    chevronTd.append(chevronSpan);
    chevronSpan.append(chevron);
    panel.append(copy);

    //And enable the actual dropdown functionality using code quickly modified from material-design.js.
    header.click(function(){
        var state = copy.attr("data-state") || "closed";
        if(state === "open"){
            copy.attr("data-state", "closed");
            copy.slideUp();
            chevron.attr("class", "fa fa-chevron-down");
        }else if(state === "closed"){
            copy.attr("data-state", "open");
            copy.slideDown();
            chevron.attr("class", "fa fa-chevron-up");
        }
    });

    //Then we return the newly created instance which can be injected into the DOM as is.
    return expansion;
}

//This function just hides every page that is not the one requested and shows the one that is specified.
//It is worth noting that if an invalid page is specified here then the page will be blank as it will
//hide every page. 
//There is an exception added for the loader which requires a flexbox layout rather than the standard
//block to facilitate the centered content.
function switchPage(page){
    $("section").each(function(e){
        if($(this).attr("id") == page){
            if(page == "loader")$(this).css("display", "flex");
            else $(this).css("display", "block");
        }else{
            $(this).css("display", "none");
        }
    });
};