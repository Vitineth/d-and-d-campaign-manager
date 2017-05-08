// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ipc = require('electron').ipcRenderer;
const dialog = require('electron').remote.dialog;
var bus = require('./resources/js/system-emitter.js');

bus.on("switch-to-loader", function(){
    switchPage("loader");
    $("body").css("overflow", "hidden");
});

bus.on("switch-to-explorer", function(){
    switchPage("explorer");
    $("body").css("overflow", "auto");
});

bus.on("error-window", function(data){
    dialog.showErrorBox("Error", data);
});

bus.on('load-encounter', function(encounter, campaign){
    $("#exp-type").text("Encounter");
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

bus.on('expand-query-results', function(results){
    $("#sresults").empty();
    for(var i = 0; i < results.length; i++){
        var li = $("<li></li>").attr("data-location", results[i].id);
        var title = $("<span></span>").text(results[i].name);
        var type = $("<span></span>").text(results[i].type == "e" ? "Encounter" : "Scene").attr("class", "type");

        li.click(function(){
            bus.emit("trigger-load", $(this).attr("data-location"));
        });

        $("#sresults").append(li.append(title).append(type));
    }
});

bus.on('loading-begin', function(){
    $(".loading-div").css("display", "flex");
});

bus.on('loading-end', function(){
    setTimeout(function(){
        $(".loading-div").css("display", "none");
    }, 400);
});

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

function generatePuzzle(puzzle){

}

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

    var copy = monsterExpanderTemplate.clone();
    copy.find("#name").text(monster.name).removeAttr("id");
    copy.find("#size").text(monster.size).removeAttr("id");
    copy.find("#type").text(monster.type).removeAttr("id");
    copy.find("#alignment").text(monster.alignment).removeAttr("id");
    copy.find("#ac").text(monster.ac).removeAttr("id");
    copy.find("#hp").text(monster.hp).removeAttr("id");
    copy.find("#speed").text(monster.speed).removeAttr("id");

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

    copy.find("#str").text(str + " (" + new String(strm > 0 ? "+" + new String(strm) : strm) + ")").removeAttr("id");
    copy.find("#dex").text(dex + " (" + new String(dexm > 0 ? "+" + new String(dexm) : dexm) + ")").removeAttr("id");
    copy.find("#con").text(con + " (" + new String(conm > 0 ? "+" + new String(conm) : conm) + ")").removeAttr("id");
    copy.find("#int").text(int + " (" + new String(intm > 0 ? "+" + new String(intm) : intm) + ")").removeAttr("id");
    copy.find("#wis").text(wis + " (" + new String(wism > 0 ? "+" + new String(wism) : wism) + ")").removeAttr("id");
    copy.find("#cha").text(cha + " (" + new String(cham > 0 ? "+" + new String(cham) : cham) + ")").removeAttr("id");

    copy.find("#skills").empty();//ul
    for(var i = 0; i < monster.skills.length; i++){
        var li = $("<li></li>");
        var strong = $("<strong></strong>").text(monster.skills[i].name);
        var span = $("<span></span>").text(monster.skills[i].modifier);
        li.append(strong).append(span);
        copy.find("#skills").append(li);
    }
    copy.find("#skills").removeAttr("id");

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

    var senses = "";
    for(var i = 0; i < monster.senses.length; i++){
        senses += ", " + monster.senses[i];
    }                                       
    copy.find("#senses").text(senses.substring(2)).removeAttr("id");

    copy.find("#languages").empty();//ul
    for(var i = 0; i < monster.languages.length; i++){
        var li = $("<li></li>").text(monster.languages[i].modifier);
        copy.find("#languages").append(li);
    }
    copy.find("#languages").removeAttr("id");

    copy.find("#challenge").text(monster.challenge.level + " (" + monster.challenge.xp + ")").removeAttr("id");

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

    console.log($("#exp-monsters-container"));
    $("#exp-monsters-container").append(copy);

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

    return expansion;
}

var monsterExpanderTemplate = $("<div class=\"expansion-body clearfix\">\n   <h2 ><span id=\"name\">Hell Hound</span> <small><span id=\"size\">Medium</span> <span id=\"type\">fiend</span>, <span id=\"alignment\">lawful evil</span></small></h2>\n   <table style=\"width: 100%;\" class=\"clear-table\">\n     <tbody>\n       <tr>\n         <th style=\"width: 15%;\">Armor Class</th>\n         <td><span id=\"ac\">15 (natural armor)</span></td>\n       </tr>\n       <tr>\n         <th>Hit Points</th>\n         <td><span id=\"hp\">45 (7d8+14)</hp></td>\n       </tr>\n       <tr>\n         <th>Speed</th>\n         <td><span id=\"speed\">60ft</span></td>\n       </tr>\n     </tbody>\n   </table>\n   <hr>\n   <table style=\"width: 100%; text-align: center\" class=\"clear-table stats-table\">\n     <tbody>\n       <tr>\n         <th>STR</th>\n         <th>DEX</th>\n         <th>CON</th>\n         <th>INT</th>\n         <th>WIS</th>\n         <th>CHA</th>\n       </tr>\n       <tr>\n         <td><span id=\"str\">17 (+3)</span></td>\n         <td><span id=\"dex\">12 (+1)</span></td>\n         <td><span id=\"con\">14 (+2)</span></td>\n         <td><span id=\"int\">6 (-2)</span></td>\n         <td><span id=\"wis\">13 (+1)</span></td>\n         <td><span id=\"cha\">6 (-2)</span></td>\n       </tr>\n     </tbody>\n   </table>\n   <hr>\n   <table style=\"width: 100%;\" class=\"clear-table\">\n     <tbody>\n       <tr>\n         <th style=\"width: 15%;\">Skills</th>\n         <td>\n           <ul id=\"skills\">\n             <li>Perception +5</li>\n           </ul>\n         </td>\n       </tr>\n       <tr>\n         <th>Damage Immunities</th>\n         <td id=\"immunities-damage\">fire</td>\n       </tr>\n       <tr>\n         <th>Condition Immunities</th>\n         <td id=\"immunities-condition\">fire</td>\n       </tr>\n       <tr>\n         <th>Damage Resistances</th>\n         <td id=\"resistances-damage\">fire</td>\n       </tr>\n       <tr id=\"resistances-condition\">\n         <th>Condition Resistances</th>\n         <td  id=\"resistances-condition\">fire</td>\n       </tr>\n       <tr>\n         <th>Senses</th>\n         <td id=\"senses\"><strong>darkvision</strong> (60ft)., <strong>passive perception</strong> 15</td>\n       </tr>\n       <tr>\n         <th>Languages</th>\n         <td>\n           <ul id=\"languages\"></ul>\n         </td>\n       </tr>\n       <tr>\n         <th>Challenge</th>\n         <td id=\"challenge\">3 (700XP)</td>\n       </tr>\n     </tbody>\n   </table>\n   <hr>\n   <div id=\"abilities\">\n     <span>\n       <strong>Keen Hearing and Smell</strong> The hound has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n     </span>\n     <br>\n     <span>\n       <strong>Pack Tactics</strong> The hound has advantage on an attack roll against a creature if a least one of the hound's allies is within 5 feet of the creature and the ally isn't incapacitated.\n     </span>\n   </div>\n   <hr>\n   <h5>Actions</h5>\n   <div id=\"actions\">\n     <span>\n       <strong>Bite</strong> <em>Melee Weapon Attack: </em> +5 to hit, reach 5 ft., one target. <em>Hit: </em> 7 (1d8 + 3) piercing damage plus 7 (2d6) fire damage.\n     </span>\n     <br>\n     <span>\n       <strong>Fire Breath (Recharge 5-6)</strong> THe hound exhales fire in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity waving throw, taking 21 (6d6) fire damage on a failed save or half as much damage on a successful one.\n     </span>\n   </div>\n </div>\n");

function switchPage(page){
    $("[data-page]").each(function(e){
        if($(this).attr("data-page") == page){
            if(page == "loader")$(this).css("display", "flex");
            else $(this).css("display", "block");
        }else{
            $(this).css("display", "none");
        }
    });
};

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

$("#search-field").on('input', function(){
    bus.emit("expand-query", $(this).val(), $("#search-type").val());
});