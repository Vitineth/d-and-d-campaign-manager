let index = {};

bus.on("enable-campaign", function () {
    bus.emit("fetch-campaign", function (campaign) {
        index = {};
        let exEncounter, exMonster, exPuzzle, exScene, exNPCs;

        function verify() {
            if (exEncounter && exMonster && exPuzzle && exScene && exNPCs) {
                $("#exp-search-monsters").empty();
                $("#exp-search-encounters").empty();
                $("#exp-search-puzzles").empty();
                $("#exp-search-scenes").empty();
                $("#exp-search-characters").empty();
                $("#exp-search-all").empty();
                for (var monsterID in campaign.monsters) {
                    $("#exp-search-monsters").append(generateMonster(campaign.monsters[monsterID], $(exMonster), monsterID, false).attr("id", "ex-srch-" + monsterID + "_m"));
                    $("#exp-search-all").append(generateMonster(campaign.monsters[monsterID], $(exMonster), monsterID, true).attr("id", "ex-srcha-" + monsterID + "_m"));
                }
                for (var encounterID in campaign.encounters) {
                    $("#exp-search-encounters").append(generateEncounter(campaign.encounters[encounterID], $(exEncounter), encounterID, false).attr("id", "ex-srch-" + encounterID + "_e"));
                    $("#exp-search-all").append(generateEncounter(campaign.encounters[encounterID], $(exEncounter), encounterID, true).attr("id", "ex-srcha-" + encounterID + "_e"));
                }
                for (var puzzleID in campaign.puzzles) {
                    $("#exp-search-puzzles").append(generatePuzzle(campaign.puzzles[puzzleID], $(exPuzzle), puzzleID, false).attr("id", "ex-srch-" + puzzleID + "_p"));
                    $("#exp-search-all").append(generatePuzzle(campaign.puzzles[puzzleID], $(exPuzzle), puzzleID, true).attr("id", "ex-srcha-" + puzzleID + "_p"));
                }
                for (var sceneID in campaign.scenes) {
                    $("#exp-search-scenes").append(generateScene(campaign.scenes[sceneID], $(exScene), sceneID, false).attr("id", "ex-srch-" + sceneID + "_s"));
                    $("#exp-search-all").append(generateScene(campaign.scenes[sceneID], $(exScene), sceneID, true).attr("id", "ex-srcha-" + sceneID + "_s"));
                }
                for (var npcID in campaign.npcs) {
                    $("#exp-search-characters").append(generateNPC(campaign.npcs[npcID], $(exNPCs), npcID, false).attr("id", "ex-srch-" + npcID + "_n"));
                    $("#exp-search-all").append(generateNPC(campaign.npcs[npcID], $(exNPCs), npcID, true).attr("id", "ex-srcha-" + npcID + "_n"));
                }
            }
        }

        $.get("resources/html/monster.html", function (data) {
            exMonster = data;
            verify();
        });
        $.get("resources/html/npc.html", function (data) {
            exNPCs = data;
            verify();
        });
        $.get("resources/html/puzzle.html", function (data) {
            exPuzzle = data;
            verify();
        });
        $.get("resources/html/encounter.html", function (data) {
            exEncounter = data;
            verify();
        });
        $.get("resources/html/scene.html", function (data) {
            exScene = data;
            verify();
        });
    });
});

function generatePuzzle(puzzle, copy, id, idx) {
    let nSpan = $("<span></span>").text(puzzle.name);
    let nCode = $("<code></code>").text("[ " + id + " ]");
    copy.find("#name").empty().append(nSpan).append(nCode).removeAttr("id");
    copy.find("#description").text(puzzle.description).removeAttr("id");
    copy.find("#solution").text(puzzle.solution).removeAttr("id");
    $("#hints").empty();
    for (var i = 0; i < puzzle.hints.length; i++) {
        copy.find("#hints").append($("<li></li>").text(puzzle.hints[i]));
        if(idx) indexText(puzzle.hints[i], id + "_p");
    }
    copy.find("#hints").removeAttr("id");

    var header = copy.find(".expander-header");
    var image = copy.find(".expander-image");
    var body = copy.find(".expander-content");
    header.click(function () {
        image.addClass("spinner");
        body.slideToggle(400, function () {
            image.removeClass("spinner");
        });
    });

    if(idx){
        indexText(puzzle.name, id + "_p");
        indexText(id, id + "_p");
        indexText(puzzle.description, id + "_p");
        indexText(puzzle.solution, id + "_p");
    }

    return copy;
}

function generateScene(puzzle, copy, id, idx) {
    let nSpan = $("<span></span>").text(puzzle.name);
    let nCode = $("<code></code>").text("[ " + id + " ]");
    copy.find("#name").empty().append(nSpan).append(nCode).removeAttr("id");
    copy.find("#description").text(puzzle.description).removeAttr("id");
    $("#kps").empty();
    for (var i = 0; i < puzzle.key_points.length; i++) {
        copy.find("#kps").append($("<li></li>").text(puzzle.key_points[i]));
        if(idx) indexText(puzzle.key_points[i], id + "_s");
    }
    copy.find("#kps").removeAttr("id");

    for (var i = 0; i < puzzle.npcs.length; i++) {
        let code = $("<code></code>").text(puzzle.npcs[i]);
        copy.find("#npcs").append($("<li></li>").append(code));
    }
    copy.find("#npcs").removeAttr("id");

    for (var i = 0; i < puzzle.puzzles.length; i++) {
        let code = $("<code></code>").text(puzzle.puzzles[i]);
        copy.find("#puzzles").append($("<li></li>").append(code));
    }
    copy.find("#puzzles").removeAttr("id");

    let keys = Object.keys(puzzle.navigation);
    for (var i = 0; i < keys.length; i++) {
        let strong = $("<strong></strong").text(keys[i]);
        let code = $("<code></code>").text(puzzle.navigation[keys[i]]);
        let span = $("<span></span>").text(" -> ");
        copy.find("#navigation").append($("<li></li>").append(strong).append(span).append(code));
    }
    copy.find("#navigation").removeAttr("id");

    var header = copy.find(".expander-header");
    var image = copy.find(".expander-image");
    var body = copy.find(".expander-content");
    header.click(function () {
        image.addClass("spinner");
        body.slideToggle(400, function () {
            image.removeClass("spinner");
        });
    });
    
    copy.find(".search-open").css("display", "block").click(function(){
        bus.emit("trigger-load", "s__" + id);
        toggleModal($("#search-modal"));
    })

    if(idx){
        indexText(id, id + "_s");
        indexText(puzzle.name, id + "_s");
        indexText(puzzle.description, id + "_s");
    }

    return copy;
}

function generateEncounter(puzzle, copy, id, idx) {
    let nSpan = $("<span></span>").text(puzzle.name);
    let nCode = $("<code></code>").text("[ " + id + " ]");
    copy.find("#name").empty().append(nSpan).append(nCode).removeAttr("id");
    copy.find("#description").text(puzzle.description).removeAttr("id");
    $("#kps").empty();
    for (var i = 0; i < puzzle.key_points.length; i++) {
        copy.find("#kps").append($("<li></li>").text(puzzle.key_points[i]));
        if(idx) indexText(puzzle.key_points[i], id + "_e");
    }
    copy.find("#kps").removeAttr("id");

    for (var i = 0; i < puzzle.monsters.length; i++) {
        let code = $("<code></code>").text(puzzle.monsters[i]);
        copy.find("#monsters").append($("<li></li>").append(code));
    }
    copy.find("#monsters").removeAttr("id");

    for (var i = 0; i < puzzle.puzzles.length; i++) {
        let code = $("<code></code>").text(puzzle.puzzles[i]);
        copy.find("#puzzles").append($("<li></li>").append(code));
    }
    copy.find("#puzzles").removeAttr("id");

    let keys = Object.keys(puzzle.navigation);
    for (var i = 0; i < keys.length; i++) {
        let strong = $("<strong></strong").text(keys[i]);
        let code = $("<code></code>").text(puzzle.navigation[keys[i]]);
        let span = $("<span></span>").text(" -> ");
        copy.find("#navigation").append($("<li></li>").append(strong).append(span).append(code));
    }
    copy.find("#navigation").removeAttr("id");

    var header = copy.find(".expander-header");
    var image = copy.find(".expander-image");
    var body = copy.find(".expander-content");
    header.click(function () {
        image.addClass("spinner");
        body.slideToggle(400, function () {
            image.removeClass("spinner");
        });
    });
    
    copy.find(".search-open").css("display", "block").click(function(){
        bus.emit("trigger-load", "e__" + id);
        toggleModal($("#search-modal"));
    })

    if(idx){
        indexText(id, id + "_e");
        indexText(puzzle.name, id + "_e");
        indexText(puzzle.description, id + "_e");
    }

    return copy;
}

//The generation of the monster expanders is a more complex process as there is an awful lot of 
//information to be shown to the user. The actual structure of an expander is also reasonably
//complex so there is a lot of structural code at the start to build up something that can
//actually be injected into the code. This is more complex than the code required to generate one
//straight from the HTML as the material-design.js file automatically converts and enables ones it
//finds on page load but as these are being added after the load, it is easier to generate their
//complete structure.
function generateMonster(monster, copy, id, idx) {
    let nSpan = $("<span></span>").text(monster.name);
    let nCode = $("<code></code>").text("[ " + id + " ]");
    copy.find("#name").empty().append(nSpan).append(nCode).removeAttr("id");
    //The basic details of the monster can be filled in easily. We have a template for the body
    //of the expander above which we can take a clone of. Each thing that needs to be changed
    //within it is associated with an id which must be removed before it is injected into the DOM
    //or it may mess with things (not many things like duplicate IDs).
    //    var copy = monsterExpanderTemplate.clone();
    //    var copy = $($.get("resources/html/monster.html"));
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
    copy.find("#skills").empty(); //ul
    for (var i = 0; i < monster.skills.length; i++) {
        var li = $("<li></li>");
        var strong = $("<strong></strong>").text(monster.skills[i].name);
        var span = $("<span></span>").text(monster.skills[i].modifier);
        li.append(strong).append(span);
        copy.find("#skills").append(li);

        if(idx) {
            indexText(monster.skills[i].name, id + "_m");
            indexText(monster.skills[i].modifier, id + "_m");
        }
    }
    copy.find("#skills").removeAttr("id");

    //Monsters can have a mix of either immunities or resistances for either damages or conditions.
    //This leads to a total of four possible combinations. Each is generated here as a quick comma
    //separated list (with commas at the front so we can just substring it with one argument). There is
    //no functions for hiding lists that are empty but that will be added at another time.
    var imda = "";
    for (var i = 0; i < monster.immunities.damage.length; i++) {
        imda += ", " + monster.immunities.damage[i];
        if(idx) indexText(monster.immunities.damage[i], id + "_m");
    }
    var imco = "";
    for (var i = 0; i < monster.immunities.condition.length; i++) {
        imco += ", " + monster.immunities.condition[i];
        if(idx) indexText(monster.immunities.condition[i], id + "_m");
    }
    var reda = "";
    for (var i = 0; i < monster.resistances.damage.length; i++) {
        reda += ", " + monster.resistances.damage[i];
        if(idx) indexText(monster.resistances.damage[i], id + "_m");
    }
    var reco = "";
    for (var i = 0; i < monster.resistances.condition.length; i++) {
        reco += ", " + monster.resistances.condition[i];
        if(idx) indexText(monster.resistances.condition[i], id + "_m");
    }

    copy.find("#immunities-damage").text(imda.substring(2)).removeAttr("id");
    copy.find("#immunities-condition").text(imco.substring(2)).removeAttr("id");
    copy.find("#resistances-damage").text(reda.substring(2)).removeAttr("id");
    copy.find("#resistances-condition").text(reco.substring(2)).removeAttr("id");

    //Senses are generated in the same way as above. THis may be converted to an ul later on.
    var senses = "";
    for (var i = 0; i < monster.senses.length; i++) {
        senses += ", " + monster.senses[i];

        if(idx) indexText(monster.senses[i], id + "_m");
    }
    copy.find("#senses").text(senses.substring(2)).removeAttr("id");

    //Languages are expressed as an ul so we need to convert each entry in the JSON to a li.
    copy.find("#languages").empty(); //ul
    for (var i = 0; i < monster.languages.length; i++) {
        var li = $("<li></li>").text(monster.languages[i]);
        copy.find("#languages").append(li);

        if(idx) indexText(monster.languages[i], id + "_m");
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
    for (var i = 0; i < monster.abilities.length; i++) {
        var div = $("<div></div>");
        var span = $("<span></span>").text(monster.abilities[i].description);
        var strong = $("<strong></strong>").text(monster.abilities[i].name);
        var br = $("<br></br>");

        div.append(strong).append(span).append(br);
        copy.find("#abilities").append(div);

        if(idx){
            indexText(monster.abilities[i].description, id + "_m");
            indexText(monster.abilities[i].name, id + "_m");
        }
    }
    copy.find("#abilities").removeAttr("id");

    copy.find("#actions").empty();
    for (var i = 0; i < monster.actions.length; i++) {
        var div = $("<div></div>");
        var span = $("<span></span>").text(monster.actions[i].description);
        var strong = $("<strong></strong>").text(monster.actions[i].name);
        var br = $("<br></br>");

        div.append(strong).append(span).append(br);
        copy.find("#actions").append(div);

        if(idx){
            indexText(monster.actions[i].description, id + "_m");
            indexText(monster.actions[i].name, id + "_m");
        }
    }
    copy.find("#actions").removeAttr("id");

    //And enable the actual dropdown functionality using code quickly modified from material-design.js.
    var header = copy.find(".expander-header");
    var image = copy.find(".expander-image");
    var body = copy.find(".expander-content");

    header.click(function () {
        image.addClass("spinner");
        body.slideToggle(400, function () {
            image.removeClass("spinner");
        });
    });

    if(idx){
        indexText(id, id + "_m");
        indexText(monster.name, id + "_m");
        indexText(monster.size, id + "_m");
        indexText(monster.type, id + "_m");
        indexText(monster.alignment, id + "_m");
        indexText(monster.ac, id + "_m");
        indexText(monster.hp, id + "_m");
        indexText(monster.speed, id + "_m");
        indexText(str, id + "_m");
        indexText(dex, id + "_m");
        indexText(con, id + "_m");
        indexText(int, id + "_m");
        indexText(wis, id + "_m");
        indexText(cha, id + "_m");
        indexText(strm, id + "_m");
        indexText(dexm, id + "_m");
        indexText(conm, id + "_m");
        indexText(intm, id + "_m");
        indexText(wism, id + "_m");
        indexText(cham, id + "_m");
        indexText(monster.challenge.xp, id + "_m");
        indexText(monster.challenge.level, id + "_m");
    }

    //Then we return the newly created instance which can be injected into the DOM as is.
    return copy;
}

function generateNPC(npc, copy, id, idx) {
    let nSpan = $("<span></span>").text(npc.name);
    let nCode = $("<code></code>").text("[ " + id + " ]");
    copy.find("#name").empty().append(nSpan).append(nCode).removeAttr("id");
    copy.find("#name2").text(npc.name).removeAttr("id");;
    copy.find("#race").text(npc.race).removeAttr("id");;
    copy.find("#class").text(npc.class).removeAttr("id");;
    copy.find("#alignment").text(npc.alignment).removeAttr("id");;
    copy.find("#background").text(npc.background).removeAttr("id");;
    copy.find("#languages").text(npc.languages.join(", ")).removeAttr("id");;
    copy.find("#description").text(npc.description).removeAttr("id");;
    copy.find("#traits").text(npc.traits).removeAttr("id");;
    for (var i in npc.key_points) {
        copy.find("#kp").append($("<li></li>").text(npc.key_points[i]));
        if(idx) indexText(npc.key_points[i], id + "_n");
    }
    copy.find("#kp").removeAttr("id");
    var header = copy.find(".expander-header");
    var image = copy.find(".expander-image");
    var body = copy.find(".expander-content");
    header.click(function () {
        image.addClass("spinner");
        body.slideToggle(400, function () {
            image.removeClass("spinner");
        });
    });

    if(idx){
        indexText(id, id + "_n");
        indexText(npc.name, id + "_n");
        indexText(npc.race, id + "_n");
        indexText(npc.class, id + "_n");
        indexText(npc.alignment, id + "_n");
        indexText(npc.background, id + "_n");
        indexText(npc.description, id + "_n");
        indexText(npc.traits, id + "_n");

        for(let i = 0; i < npc.languages.length; i++){
            indexText(npc.languages[i], id + "_n");
        }
    }

    return copy;
}

function search(args) {
    let matches = {};
    for (let i = 0; i < args.length; i++) {
        if (index.hasOwnProperty(args[i])) {
            for (let j = 0; j < index[args[i]].length; j++) {
                if (!matches.hasOwnProperty(index[args[i]][j])) {
                    matches[index[args[i]][j]] = 1;
                } else {
                    matches[index[args[i]][j]] += 1;
                }
            }
        }
    }
    let array = [];
    let result = [];
    for (a in matches) {
        array.push([a, matches[a]])
    }
    array.sort(function (a, b) {
        return b[1] - a[1]
    });

    for (var a = 0, b, txt = ''; b = array[a]; ++a) {
        result.push(b[0]);
    }
    return result;
}

function indexText(data, id) {
    if(typeof(data) != "string") data = data + "";
    let words = data.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (index.hasOwnProperty(words[i])) {
            if (index[words[i]].indexOf(id) == -1) {
                index[words[i]].push(id);
            }
        } else {
            index[words[i]] = [id];
        }
    }
}

$("#exp-search-field-all").on("input", function(){
    let all = [];
    $("#exp-search-all").children().each(function(){all.push($(this).attr("id").replace("ex-srcha-", ""));});
    if($(this).val() != ""){
        let matches = search($(this).val().split(" "));
        console.log(all);

        for(let i = 0; i < all.length; i++){
            if(matches.indexOf(all[i]) != -1){
                $("#ex-srcha-" + all[i]).css("display", "block");
            }else{
                $("#ex-srcha-" + all[i]).css("display", "none");
            }
        }
    }else{
        for(let i = 0; i < all.length; i++){
            $("#ex-srcha-" + all[i]).css("display", "block");
        }
    }
});

function registerSearch(type){
    $("#exp-search-field-" + type).on("input", function(){
        let all = [];
        $("#exp-search-" + type).children().each(function(){all.push($(this).attr("id").replace("ex-srch-", ""));});
        if($(this).val() != ""){
            let matches = search($(this).val().split(" "));

            for(let i = 0; i < all.length; i++){
                if(matches.indexOf(all[i]) != -1){
                    $("#exp-search-" + type).find("#ex-srch-" + all[i]).css("display", "block");
                }else{
                    $("#exp-search-" + type).find("#ex-srch-" + all[i]).css("display", "none");
                }
            }
        }else{
            for(let i = 0; i < all.length; i++){
                $("#exp-search-" + type).find("#ex-srch-" + all[i]).css("display", "block");
            }
        }
    });
}

registerSearch("characters");
registerSearch("encounters");
registerSearch("monsters");
registerSearch("puzzles");
registerSearch("scenes");