const dialog = require("electron").remote.dialog;

let localCampaign;
let hasChanges = false;

function realSave(callback){
    var name = $("#campaign-title-edit").val();
    var first = $("#begin-event").val();
    localCampaign.begin = first;
    localCampaign.title = name;
    hasChanges = false;
    bus.emit("save-campaign", localCampaign, callback);
}

function savePuzzle(){
    var puzzleModal = $("#puzzle-modal");
    var original = puzzleModal.find("#puzzle-id").attr("data-original-id");
    var id = puzzleModal.find("#puzzle-id").val();
    var name = puzzleModal.find("#puzzle-name").val();
    var description = puzzleModal.find("#puzzle-description").val();
    var hints = [];
    puzzleModal.find("#puzzle-hints").find("input").each(function(){
        hints.push($(this).val());
    });
    var solution  = puzzleModal.find("#puzzle-solution").val();
    console.log(original);

    localCampaign.puzzles[original] = {
        "name": name,
        "description": description,
        "hints": hints,
        "solution": solution
    };

    localCampaign = JSON.parse(JSON.stringify(localCampaign).replace(original, id));
    hasChanges = true;
}

function saveNPC(){
    var npcModal = $("#npc-modal");
    var original = $("#npc-id").attr("data-original-id");
    var id = $("#npc-id").val();
    var name = $("#npc-name").val();
    var clazz = $("#npc-class").val();
    var race = $("#npc-race").val();
    var alignment = $("#npc-alignment").val();
    var background = $("#npc-background").val();
    var description = $("#npc-physical-description").val();
    var traits = $("#npc-traits").val();

    var noteworthy_points = {};
    var points = $("#npc-noteworthy").find("li");
    points.each(function(){
        noteworthy_points[$(this).find("input").val()] = $(this).find("textarea").val();
    });

    var languages = [];
    $("#npc-languages").find("li").each(function(){
        languages.push($(this).find("select").val());
    });

    localCampaign.npcs[original] = {
        "name": name,
        "class": clazz,
        "race": race,
        "alignment": alignment,
        "background": background,
        "description": description,
        "traits": traits,
        "key_points": noteworthy_points,
        "languages": languages
    };
    hasChanges = true;
}

function saveMonster(){
    var monsterModal = $("monster-modal");
    var original = $("#monster-id").attr("data-original-id");
    var id = $("#monster-id").val();
    var name = $("#monster-name").val();
    var level = $("#monster-challenge").val();
    var xp = $("#monster-id").val();
    var type = $("#monster-type").val();
    var size = $("#monster-size").val();
    var alignment = $("#monster-alignment").val();
    var ac = $("#monster-ac").val();
    var hp = $("#monster-hp").val();
    var speed = $("#monster-speed").val();
    var str = $("#monster-str").val();
    var dex = $("#monster-dex").val();
    var con = $("#monster-con").val();
    var int = $("#monster-int").val();
    var wis = $("#monster-wis").val();
    var cha = $("#monster-cha").val();

    var skills = [];
    $("#monster-skills").find("li").each(function(){
        skills.push({
            "name": $($(this).find("input")[0]).val(),
            "modifier": $($(this).find("input")[1]).val()
        });
    });

    var abilities = {};
    $("#monster-abilities").find("li").each(function(){
        abilities[$(this).find("input").val()] = $(this).find("textarea").val();
    });

    var actions = {};
    $("#monster-skills-2").find("li").each(function(){
        actions[$(this).find("input").val()] = $(this).find("textarea").val();
    });

    var di = [];
    $("#monster-damage-immunities").find("input").each(function(){
        di.push($(this).val());
    });
    var dr = [];
    $("#monster-damage-resistances").find("input").each(function(){
        dr.push($(this).val());
    });
    var ci = [];
    $("#monster-condition-immunities").find("input").each(function(){
        ci.push($(this).val());
    });
    var cr = [];
    $("#monster-condition-resistances").find("input").each(function(){
        cr.push($(this).val());
    });

    var senses = [];
    $("#monster-senses").find("input").each(function(){
        senses.push($(this).val());
    });
    var languages = [];
    $("#monster-languages").find("select").each(function(){
        languages.push($(this).val());
    });

    localCampaign.monsters[original] = {
        "name": name,
        "challenge": {
            "level": level,
            "xp": xp
        },
        "type": type,
        "size": size,
        "alignment": alignment,
        "ac": ac,
        "hp": hp,
        "speed": speed,
        "stats": {
            "str": str,
            "dex": dex,
            "con": con,
            "int": int,
            "wis": wis,
            "cha": cha,
        },
        "skills": skills,
        "abilities": abilities,
        "actions": {
            "Jelly Kick": "Kicks and enemy in the face with a jelly foot"
        },
        "immunities": {
            "damage": di,
            "condition": ci
        },
        "resistances": {
            "damage": dr,
            "condition": cr
        },
        "senses": senses,
        "languages": languages
    }

    localCampaign = JSON.parse(JSON.stringify(localCampaign).replace(original, id));
    hasChanges = true;
}

function saveScene(){
    var original = $("#scene-id").attr("data-original-id");
    var id = $("#scene-id").val();
    var name = $("#scene-name").val();
    var description = $("#scene-description").val();

    var key_points = [];
    $("#scene-key-points").find("input").each(function(){
        key_points.push($(this).val());
    });

    var npcs = [];
    $("#scene-npcs").find("select").each(function(){
        npcs.push($(this).val());
    });

    var puzzles = [];
    $("#scene-puzzles").find("select").each(function(){
        puzzles.push($(this).val());
    });

    var navigation = {};
    $("#scene-navigation").find("li").each(function(){
        navigation[$(this).find("input").val()] = $(this).find("select").val();
    });

    localCampaign.scenes[original] = {
        "name": name,
        "description": description,
        "key_points": key_points,
        "npcs": npcs,
        "puzzles": puzzles,
        "navigation": navigation
    };

    localCampaign = JSON.parse(JSON.stringify(localCampaign).replace(original, id));
    hasChanges = true;

}

function saveEncounter(){
    var original = $("#encounter-id").attr("data-original-id");
    var id = $("#encounter-id").val();
    var name = $("#encounter-name").val();
    var description = $("#encounter-description").val();

    var key_points = [];
    $("#encounter-key-points").find("input").each(function(){
        key_points.push($(this).val());
    });

    var npcs = [];
    $("#encounter-monsters").find("select").each(function(){
        npcs.push($(this).val());
    });

    var puzzles = [];
    $("#encounter-puzzles").find("select").each(function(){
        puzzles.push($(this).val());
    });

    var navigation = {};
    $("#encounter-navigation").find("li").each(function(){
        navigation[$(this).find("input").val()] = $(this).find("select").val();
    });

    localCampaign.encounters[original] = {
        "name": name,
        "description": description,
        "key_points": key_points,
        "npcs": npcs,
        "puzzles": puzzles,
        "navigation": navigation
    };

    localCampaign = JSON.parse(JSON.stringify(localCampaign).replace(original, id));
    hasChanges = true;
}

function loadMonsterModal(id){
    if(localCampaign.hasOwnProperty("monsters") && localCampaign.monsters.hasOwnProperty(id)){
        var monster = localCampaign.monsters[id];

        $("#monster-id").val(id).attr("data-original-id", id);
        $("#monster-q-id").val("m__" + id);
        $("#monster-name").val(monster.name);
        $("#monster-challenge").val(monster.challenge.level);
        $("#monster-xp").val(monster.challenge.xp);
        $("#monster-type").val(monster.type);
        $("#monster-size").val(monster.size);
        $("#monster-alignment").val(monster.alignment);
        $("#monster-ac").val(monster.ac);
        $("#monster-hp").val(monster.hp);
        $("#monster-speed").val(monster.speed);
        $("#monster-str").val(monster.stats.str);
        $("#monster-dex").val(monster.stats.dex);
        $("#monster-con").val(monster.stats.con);
        $("#monster-int").val(monster.stats.int);
        $("#monster-wis").val(monster.stats.wis);
        $("#monster-cha").val(monster.stats.cha);

        var str_m = Math.floor((monster.stats.str - 10) / 2);
        var dex_m = Math.floor((monster.stats.dex - 10) / 2);
        var con_m = Math.floor((monster.stats.con - 10) / 2);
        var int_m = Math.floor((monster.stats.int - 10) / 2);
        var wis_m = Math.floor((monster.stats.wis - 10) / 2);
        var cha_m = Math.floor((monster.stats.cha - 10) / 2);

        $("#monster-str-mod").text(str_m > 0 ? "+" + str_m : str_m);
        $("#monster-dex-mod").text(str_m > 0 ? "+" + dex_m : dex_m);
        $("#monster-con-mod").text(con_m > 0 ? "+" + con_m : con_m);
        $("#monster-int-mod").text(str_m > 0 ? "+" + int_m : int_m);
        $("#monster-wis-mod").text(str_m > 0 ? "+" + wis_m : wis_m);
        $("#monster-cha-mod").text(str_m > 0 ? "+" + cha_m : cha_m);

        var skill = $(".material-icons#monster-add-skill").prev();
        skill.empty();
        for(var i in monster.skills){
            var s = $("<li><input type=\"text\"><input type=\"text\"><i class=\"material-icons\">close</i></li>");
            $(s.find("input")[0]).val(monster.skills[i].name);
            $(s.find("input")[1]).val(monster.skills[i].modifier);
            skill.append(s);
        }

        var abilities = $(".material-icons#monster-add-abilities").prev();
        abilities.empty();
        for(var i in monster.abilities){
            var s = $('<li><input type="text"><i class="material-icons">close</i><textarea></textarea></li>');
            s.find("input").val(i);
            s.find("textarea").text(monster.abilities[i]);
            abilities.append(s);
        }

        var skill2 = $(".material-icons#monster-add-skill-2").prev();
        skill2.empty();
        for(var i in monster.actions){
            var s = $('<li><input type="text"><i class="material-icons">close</i><textarea></textarea></li>');
            s.find("input").val(i);
            s.find("textarea").val(monster.actions[i]);
            skill2.append(s);
        }

        var di = $(".material-icons#monster-add-damage-immunity").prev();
        di.empty();
        for(var i in monster.immunities.damage){
            var s = $("<li><input type=\"text\"><i class=\"material-icons\">close</i></li>");
            s.find("input").val(monster.immunities.damage[i]);
            di.append(s);
        }

        var dr = $(".material-icons#monster-add-damage-resistance").prev();
        dr.empty();
        for(var i in monster.resistances.damage){
            var s = $("<li><input type=\"text\"><i class=\"material-icons\">close</i></li>");
            s.find("input").val(monster.resistances.damage[i])
            dr.append(s);
        }

        var ci = $(".material-icons#monster-add-condition-immunity").prev();
        ci.empty();
        for(var i in monster.immunities.condition){
            var s = $("<li><input type=\"text\"><i class=\"material-icons\">close</i></li>");
            s.find("input").val(monster.immunities.condition[i]);
            ci.append(s);
        }

        var cr = $(".material-icons#monster-add-condition-resistance").prev();
        cr.empty();
        for(var i in monster.resistances.condition){
            var s = $("<li><input type=\"text\"><i class=\"material-icons\">close</i></li>");
            s.find("input").val(monster.resistances.condition[i]);
            cr.append(s);
        }

        var senses = $(".material-icons#monster-add-senses").prev();
        senses.empty();
        for(var i in monster.senses){
            var s = $("<li><input type=\"text\"><i class=\"material-icons\">close</i></li>");
            s.find("input").val(monster.senses[i]);
            senses.append(s);
        }

        var languages = $(".material-icons#monster-add-languages").prev();
        languages.empty();
        for(var i in monster.languages){
            var s = $('<li><select><option>Abyssal</option><option>Aquan</option><option>Auran</option><option>Celestial</option><option>Common</option><option>Deep Speech</option><option>Draconic</option><option>Druidic</option><option>Dwarvish</option><option>Elvish</option><option>Giant</option><option>Gnomish</option><option>Goblin</option><option>Gnoll</option><option>Halfling</option><option>Ignan</option><option>Infernal</option><option>Orc</option><option>Primordial</option><option>Sylvan</option><option>Terran</option><option>Undercommon</option></select><i class="material-icons">close</i></li>');
            s.find("select").val(monster.languages[i]);
            languages.append(s);
        }
    }

    toggleModal($('#monster-modal'));
}

function loadPuzzleModal(id){
    if(localCampaign.hasOwnProperty("puzzles") && localCampaign.puzzles.hasOwnProperty(id)){
        var puzzle = localCampaign.puzzles[id];

        $("#puzzle-id").val(id).attr("data-original-id", id);
        $("#puzzle-id-q").val("p__" + id);
        $("#puzzle-name").val(puzzle.name);
        $("#puzzle-description").val(puzzle.description);
        $("#puzzle-solution").val(puzzle.solution);

        var hints = $(".material-icons#puzzle-add-hints").prev();
        hints.empty();
        for(var i in puzzle.hints){
            var s = $('<li><input type="text"><i class="material-icons">close</i></li>');
            s.find("input").val(puzzle.hints[i]);
            hints.append(s);
        }
        toggleModal($('#puzzle-modal'));
    }
}

function loadSceneModal(id){
    if(localCampaign.hasOwnProperty("scenes") && localCampaign.scenes.hasOwnProperty(id)){
        var scene = localCampaign.scenes[id];

        $("#scene-id").val(id).attr("data-original-id", id);
        $("#scene-id-q").val("s__" + id);
        $("#scene-name").val(scene.name);
        $("#scene-description").val(scene.description);

        var keyPoints = $(".material-icons#scene-add-key-points").prev();
        keyPoints.empty();
        for(var i in scene.key_points){
            var s = $('<li><input type="text"><i class="material-icons">close</i></li>');
            s.find("input").val(scene.key_points[i]);
            keyPoints.append(s);
        }

        var npcs = $(".material-icons#scene-add-npc").prev();
        npcs.empty();
        for(var i in scene.npcs){
            var element = $('<li><select></select><i class="material-icons">close</i></li>');
            var select = element.find("select");
            for(var i in localCampaign.npcs){
                select.append($("<option></option>").text(localCampaign.npcs[i].name).val("n__" + i));
            }
            select.val("n__" + i);
            npcs.append(element);
        }

        var puzzles = $(".material-icons#scene-add-puzzle").prev();
        puzzles.empty();
        for(var i in scene.puzzles){
            var element = $('<li><select></select><i class="material-icons">close</i></li>');
            var select = element.find("select");
            for(var i in localCampaign.puzzles){
                select.append($("<option></option>").text(localCampaign.puzzles[i].name).val("p__" + i));
            }
            select.val("p__" + i);
            puzzles.append(element);
        }

        var navigation = $(".material-icons#scene-add-navigation").prev();
        navigation.empty();
        for(var i in scene.navigation){
            var element = $('<li><input type="text"><select></select><i class="material-icons">close</i></li>');
            var select = element.find("select");
            for(var j in localCampaign.encounters){
                select.append($("<option></option>").text(localCampaign.encounters[j].name + " (Encounter)").val("e__" + j));
            }
            for(var j in localCampaign.scenes){
                select.append($("<option></option>").text(localCampaign.scenes[j].name + " (Scene)").val("s__" + j));
            }
            element.find("input").val(i);
            if(i.indexOf("s__") == 0){
                select.val(localCampaign.scenes[i].name + " (Scene)");
            }
            if(i.indexOf("e__") == 0){
                select.val(localCampaign.encounters[i].name + " (Encounter)");
            }
            navigation.append(element);
        }

        toggleModal($('#scene-modal'));
    }
}

function loadEncounterModal(id){
    if(localCampaign.hasOwnProperty("encounters") && localCampaign.encounters.hasOwnProperty(id)){
        var encounter = localCampaign.encounters[id];

        $("#encounter-id").val(id).attr("data-original-id", id);
        $("#encounter-id-q").val("e__" + id);
        $("#encounter-name").val(encounter.name);
        $("#encounter-description").val(encounter.description);

        var keyPoints = $(".material-icons#encounter-add-key-points").prev();
        keyPoints.empty();
        for(var i in encounter.key_points){
            var s = $('<li><input type="text"><i class="material-icons">close</i></li>');
            s.find("input").val(encounter.key_points[i]);
            keyPoints.append(s);
        }

        var npcs = $(".material-icons#encounter-add-monsters").prev();
        npcs.empty();
        for(var i in encounter.monsters){
            var element = $('<li><select></select><i class="material-icons">close</i></li>');
            var select = element.find("select");
            for(var i in localCampaign.monsters){
                select.append($("<option></option>").text(localCampaign.monsters[i].name).val("m__" + i));
            }
            select.val("m__" + i);
            npcs.append(element);
        }

        var puzzles = $(".material-icons#encounter-add-puzzles").prev();
        puzzles.empty();
        for(var i in encounter.puzzles){
            var element = $('<li><select></select><i class="material-icons">close</i></li>');
            var select = element.find("select");
            for(var j in localCampaign.puzzles){
                select.append($("<option></option>").text(localCampaign.puzzles[j].name).val("p__" + j));
            }
            console.log(encounter.puzzles[i]);
            select.val("p__" + encounter.puzzles[i]);
            puzzles.append(element);
        }

        var navigation = $(".material-icons#encounter-add-navigation").prev();
        navigation.empty();
        for(var i in encounter.navigation){
            var element = $('<li><input type="text"><select></select><i class="material-icons">close</i></li>');
            var select = element.find("select");
            for(var j in localCampaign.encounters){
                select.append($("<option></option>").text(localCampaign.encounters[j].name + " (Encounter)").val("e__" + j));
            }
            for(var j in localCampaign.scenes){
                select.append($("<option></option>").text(localCampaign.scenes[j].name + " (Scene)").val("s__" + j));
            }
            element.find("input").val(i);
            if(i.indexOf("s__") == 0){
                select.val(localCampaign.scenes[i].name + " (Scene)");
            }
            if(i.indexOf("e__") == 0){
                select.val(localCampaign.encounters[i].name + " (Encounter)");
            }
            navigation.append(element);
        }
        toggleModal($('#encounter-modal'));
    }
}

function loadNPCModal(id){
    if(localCampaign.hasOwnProperty("npcs") && localCampaign.npcs.hasOwnProperty(id)){
        var npc = localCampaign.npcs[id];

        $("#npc-id").val(id).attr("data-original-id", id);
        $("#npc-id-q").val("n__" + id);
        $("#npc-name").val(npc.name);
        $("#npc-class").val(npc.class);
        $("#npc-race").val(npc.race);
        $("#npc-alignment").val(npc.alignment);
        $("#npc-background").val(npc.background);
        $("#npc-physical-description").val(npc.description);
        $("#npc-traits").val(npc.traits);

        $("#npc-noteworthy").empty();
        for(var i in npc.key_points){
            var entry = $('<li><input type="text"><i class="material-icons">close</i><textarea></textarea></li>');
            entry.find("input").val(i);
            entry.find("textarea").val(npc.key_points[i]);
            $("#npc-noteworthy").append(entry);
        }

        var languages = $("#npc-languages");
        languages.empty();
        for(var i in npc.languages){
            var s = $('<li><select><option>Abyssal</option><option>Aquan</option><option>Auran</option><option>Celestial</option><option>Common</option><option>Deep Speech</option><option>Draconic</option><option>Druidic</option><option>Dwarvish</option><option>Elvish</option><option>Giant</option><option>Gnomish</option><option>Goblin</option><option>Gnoll</option><option>Halfling</option><option>Ignan</option><option>Infernal</option><option>Orc</option><option>Primordial</option><option>Sylvan</option><option>Terran</option><option>Undercommon</option></select><i class="material-icons">close</i></li>');
            s.find("select").val(npc.languages[i]);
            languages.append(s);
        }

        toggleModal($('#npc-modal'));
    }
}

function toggleModal(reference){
    console.log("CooL");
    reference.children().each(function(){$(this).fadeToggle()});
}

function reloadClose(){
    $(".material-icons:contains(close)").off("click").click(function(){
        $(this).parent().remove();
    });
}

function load(){
    hasChanges = false;
    $("#localCampaign-title").text(localCampaign.name);
    $("#localCampaign-title-edit").val(localCampaign.name);

    for(var i in localCampaign.encounters){
        $("#begin-event").append($("<option></option>").attr("value", "e__" + i).text(localCampaign.encounters[i].name + " (Encounter)"));
    }
    for(var i in localCampaign.scenes){
        $("#begin-event").append($("<option></option>").attr("value", "s__" + i).text(localCampaign.scenes[i].name + " (Scene)"));
    }
    $("#begin-event").val(localCampaign.begin);

    for(var i in localCampaign.monsters){
        var monster = $('<div class="expander" id="expander"><table class="expander-header"><tbody><tr><td class="expander-td"><i class="material-icons" id="icon">bug_report</i></td><td style="width: 30%;font-weight: 900;" id="name">Hell Hound</td><td style="width: 16%">Monster</td><td style="width: 16%" id="challenge">Challenge 3 (700XP)</td><td style="width: 16%" id="stat">72HP/23AC</td><td style="width: 16%"><code id="id">m__hell_hound</code></td><td style="width: 3%"><i class="material-icons">edit</i></td></tr></tbody></table></div>');

        monster.attr("data-id", i).removeAttr("id");
        monster.find("#icon").removeAttr("id");
        monster.find("#name").text(localCampaign.monsters[i].name).removeAttr("id");
        monster.find("#challenge").text("Challenge " + localCampaign.monsters[i].challenge.level + " (" + localCampaign.monsters[i].challenge.xp + ")").removeAttr("id");
        monster.find("#stat").text(localCampaign.monsters[i].hp + "HP/" + localCampaign.monsters[i].ac + "AC").removeAttr("id");
        monster.find("#id").text("m__" + i).removeAttr("id");

        $("#monster-container").append(monster);
    }

    for (var i in localCampaign.scenes){
        var scene = $('<div class="expander"><table class="expander-header"><tbody><tr><td class="expander-td"><i class="material-icons">account_balance</i></td><td style="width: 30%;font-weight: 900;" id="name">Coin Puzzle</td><td style="width: 16%">Scene</td><td style="width: 16%" id="npcs">4 NPCs</td><td style="width: 16%" id="puzzles">4 Puzzles</td><td style="width: 16%"><code id="code">p_coin_puzzle</code></td><td style="width: 3%"><i class="material-icons">edit</i></td></tr></tbody></table></div>');

        scene.find("#name").text(localCampaign.scenes[i].name).removeAttr(i);
        scene.find("#npcs").text(localCampaign.scenes[i].npcs.length + " NPCs").removeAttr("id");
        scene.find("#puzzles").text(localCampaign.scenes[i].puzzles.length + " Puzzles").removeAttr("id");
        scene.find("#code").text("s__" + i).removeAttr("id");
        scene.attr("data-id", i);

        $("#scene-container").append(scene);
    }

    for (var i in localCampaign.puzzles){
        var puzzle = $('<div class="expander"><table class="expander-header"><tbody><tr><td class="expander-td"><i class="material-icons">toys</i></td><td style="width: 30%;font-weight: 900;" id="name">Coin Puzzle</td><td style="width: 21%">Puzzle</td><td style="width: 21%" id="hints">4 Hints</td><td style="width: 21%"><code id="code">p_coin_puzzle</code></td><td style="width: 3%"><i class="material-icons">edit</i></td></tr></tbody></table></div>');

        puzzle.find("#name").text(localCampaign.puzzles[i].name).removeAttr("id");
        puzzle.find("#hints").text(localCampaign.puzzles[i].hints.length + " hints").removeAttr("id");
        puzzle.find("#code").text("p__" + i).removeAttr("id");
        puzzle.attr("data-id", i);

        $("#puzzle-container").append(puzzle);
    }

    for (var i in localCampaign.encounters){
        var encounter = $('<div class="expander"><table class="expander-header"><tbody><tr data-id=""><td class="expander-td"><i class="material-icons">highlight_off</i></td><td style="width: 30%;font-weight: 900;" id="name">Coin Puzzle</td><td style="width: 12%">Encounter</td><td style="width: 12%" id="npcs">4 NPCs</td><td style="width: 12%" id="monsters">4 Monsters</td><td style="width: 12%" id="puzzles">4 Puzzles</td><td style="width: 12%"><code id="code">p_coin_puzzle</code></td><td style="width: 3%"><i class="material-icons">edit</i></td></tr></tbody></table></div>');

        encounter.find("#name").text(localCampaign.encounters[i].name).removeAttr("id");
        encounter.find("#npcs").text(localCampaign.encounters[i].npcs.length + " NPCs").removeAttr("id");
        encounter.find("#monsters").text(localCampaign.encounters[i].monsters.length + " Monsters").removeAttr("id");
        encounter.find("#puzzles").text(localCampaign.encounters[i].puzzles.length + " Puzzles").removeAttr("id");
        encounter.find("#code").text("e__" + i).removeAttr("id");
        encounter.attr("data-id", i);

        $("#encounter-container").append(encounter);
    }

    for (var i in localCampaign.npcs){
        var npc = $('<div class="expander"><table class="expander-header"><tbody><tr data-id=""><td class="expander-td"><i class="material-icons">person</i></td><td style="width: 30%;font-weight: 900;" id="name">Coin Puzzle</td><td style="width: 12%">Encounter</td><td style="width: 12%" id="npcs">4 NPCs</td><td style="width: 12%" id="monsters">4 Monsters</td><td style="width: 12%" id="puzzles">4 Puzzles</td><td style="width: 12%"><code id="code">p_coin_puzzle</code></td><td style="width: 3%"><i class="material-icons">edit</i></td></tr></tbody></table></div>');

        npc.find("#name").text(localCampaign.npcs[i].name).removeAttr("id");
        npc.find("#npcs").text(localCampaign.npcs[i].class).removeAttr("id");
        npc.find("#monsters").text(localCampaign.npcs[i].race).removeAttr("id");
        npc.find("#puzzles").text(Object.keys(localCampaign.npcs[i].key_points).length + " Points").removeAttr("id");
        npc.find("#code").text("n__" + i).removeAttr("id");
        npc.attr("data-id", i);

        $("#npc-container").append(npc);
    }

    $(".material-icons:contains(close)").click(function(){
        $(this).parent().remove();
    });

    $("#monster-id").on('input', function(){
        $("#monster-q-id").val("m__" + $(this).val());
    });

    $("#encounter-id").on('input', function(){
        $("#encounter-id-q").val("e__" + $(this).val());
    });

    $("#scene-id").on('input', function(){
        $("#scene-q-id").val("s__" + $(this).val());
    });

    $("#npc-id").on('input', function(){
        $("#npc-q-id").val("n__" + $(this).val());
    });

    $("#puzzle-id").on('input', function(){
        $("#puzzle-id-q").val("p__" + $(this).val());
    });

    $(".material-icons#monster-add-skill").click(function(){
        var ins = $(this).prev();
        ins.append($("<li><input type=\"text\"><i class=\"material-icons\">close</i></li>"));
        reloadClose();
    })
    $(".material-icons#monster-add-abilities").click(function(){
        var ins = $(this).prev();
        ins.append($('<li><input type="text"><i class="material-icons">close</i><textarea></textarea></li>'));
        reloadClose();
    })
    $(".material-icons#monster-add-skill-2").click(function(){
        var ins = $(this).prev();
        ins.append($('<li><input type="text"><i class="material-icons">close</i><textarea></textarea></li>'));
        reloadClose();
    })
    $(".material-icons#monster-add-damage-immunity").click(function(){
        var ins = $(this).prev();
        ins.append($("<li><input type=\"text\"><i class=\"material-icons\">close</i></li>"));
        reloadClose();
    })
    $(".material-icons#monster-add-damage-resistance").click(function(){
        var ins = $(this).prev();
        ins.append($("<li><input type=\"text\"><i class=\"material-icons\">close</i></li>"));
        reloadClose();
    })
    $(".material-icons#monster-add-condition-immunity").click(function(){
        var ins = $(this).prev();
        ins.append($("<li><input type=\"text\"><i class=\"material-icons\">close</i></li>"));
        reloadClose();
    })
    $(".material-icons#monster-add-condition-resistance").click(function(){
        var ins = $(this).prev();
        ins.append($("<li><input type=\"text\"><i class=\"material-icons\">close</i></li>"));
        reloadClose();
    })
    $(".material-icons#monster-add-senses").click(function(){
        var ins = $(this).prev();
        ins.append($("<li><input type=\"text\"><i class=\"material-icons\">close</i></li>"));
        reloadClose();
    })
    $(".material-icons#monster-add-languages").click(function(){
        var ins = $(this).prev();
        ins.append('<li><select><option>Abyssal</option><option>Aquan</option><option>Auran</option><option>Celestial</option><option>Common</option><option>Deep Speech</option><option>Draconic</option><option>Druidic</option><option>Dwarvish</option><option>Elvish</option><option>Giant</option><option>Gnomish</option><option>Goblin</option><option>Gnoll</option><option>Halfling</option><option>Ignan</option><option>Infernal</option><option>Orc</option><option>Primordial</option><option>Sylvan</option><option>Terran</option><option>Undercommon</option></select><i class="material-icons">close</i></li>');
        reloadClose();
    })
    $(".material-icons#npc-add-noteworthy").click(function(){
        var ins = $(this).prev();
        ins.append($('<li><input type="text"><i class="material-icons">close</i><textarea></textarea></li>'));
        reloadClose();
    })
    $(".material-icons#npc-add-languages").click(function(){
        var ins = $(this).prev();
        ins.append('<li><select><option>Abyssal</option><option>Aquan</option><option>Auran</option><option>Celestial</option><option>Common</option><option>Deep Speech</option><option>Draconic</option><option>Druidic</option><option>Dwarvish</option><option>Elvish</option><option>Giant</option><option>Gnomish</option><option>Goblin</option><option>Gnoll</option><option>Halfling</option><option>Ignan</option><option>Infernal</option><option>Orc</option><option>Primordial</option><option>Sylvan</option><option>Terran</option><option>Undercommon</option></select><i class="material-icons">close</i></li>');
        reloadClose();
    })
    $(".material-icons#puzzle-add-hints").click(function(){
        var ins = $(this).prev();
        ins.append($('<li><input type="text"><i class="material-icons">close</i></li>'));
        reloadClose();
    })
    $(".material-icons#scene-add-key-points").click(function(){
        var ins = $(this).prev();
        ins.append($('<li><input type="text"><i class="material-icons">close</i></li>'));
        reloadClose();
    })
    $(".material-icons#scene-add-npc").click(function(){
        var ins = $(this).prev();
        var element = $('<li><select></select><i class="material-icons">close</i></li>');
        var select = element.find("select");
        for(var i in localCampaign.npcs){
            select.append($("<option></option>").text(localCampaign.npcs[i].name));
        }
        ins.append(element);
        reloadClose();
    })
    $(".material-icons#scene-add-puzzle").click(function(){
        var ins = $(this).prev();
        var element = $('<li><select></select><i class="material-icons">close</i></li>');
        var select = element.find("select");
        for(var i in localCampaign.puzzles){
            select.append($("<option></option>").text(localCampaign.puzzles[i].name));
        }
        ins.append(element);
        reloadClose();
    })
    $(".material-icons#scene-add-navigation").click(function(){
        var ins = $(this).prev();
        var element = $('<li><select></select><i class="material-icons">close</i></li>');
        var select = element.find("select");
        for(var i in localCampaign.encounters){
            select.append($("<option></option>").text(localCampaign.npcs[i].name + " (Encounter)"));
        }
        for(var i in localCampaign.scenes){
            select.append($("<option></option>").text(localCampaign.scenes[i].name + " (Scene)"));
        }
        ins.append(element);
        reloadClose();
    })
    $(".material-icons#encounter-add-key-points").click(function(){
        var ins = $(this).prev();
        ins.append($('<li><input type="text"><i class="material-icons">close</i></li>'));
        reloadClose();
    })
    $(".material-icons#encounter-add-monsters").click(function(){
        var ins = $(this).prev();
        var element = $('<li><select></select><i class="material-icons">close</i></li>');
        var select = element.find("select");
        for(var i in localCampaign.monsters){
            select.append($("<option></option>").text(localCampaign.monsters[i].name));
        }
        ins.append(element);
        reloadClose();
    })
    $(".material-icons#encounter-add-navigation").click(function(){
        var ins = $(this).prev();
        var element = $('<li><select></select><i class="material-icons">close</i></li>');
        var select = element.find("select");
        for(var i in localCampaign.encounters){
            select.append($("<option></option>").text(localCampaign.encounters[i].name + " (Encounter)"));
        }
        for(var i in localCampaign.scenes){
            select.append($("<option></option>").text(localCampaign.scenes[i].name + " (Scene)"));
        }
        ins.append(element);
        reloadClose();
    })
    $(".material-icons#encounter-add-puzzles").click(function(){
        var ins = $(this).prev();
        var element = $('<li><select></select><i class="material-icons">close</i></li>');
        var select = element.find("select");
        for(var i in localCampaign.puzzles){
            select.append($("<option></option>").text(localCampaign.puzzles[i].name));
        }
        ins.append(element);
        reloadClose();
    });

    $(".expander-surrounder[data-type='monsters'] div[data-id]").click(function(){
        loadMonsterModal($(this).attr("data-id"));  
    })
    $(".expander-surrounder[data-type='puzzles'] div[data-id]").click(function(){
        loadPuzzleModal($(this).attr("data-id"));  
    })
    $(".expander-surrounder[data-type='scenes'] div[data-id]").click(function(){
        loadSceneModal($(this).attr("data-id"));  
    })
    $(".expander-surrounder[data-type='encounters'] div[data-id]").click(function(){
        loadEncounterModal($(this).attr("data-id"));  
    })
    $(".expander-surrounder[data-type='npcs'] div[data-id]").click(function(){
        loadNPCModal($(this).attr("data-id"));  
    })
}

bus.on("enable-campaign", function(){
    bus.emit("fetch-campaign", function(campaign){
        localCampaign = campaign;
        load();

        $("#editor-return").off("click").click(function(){
            if(hasChanges){
                dialog.showMessageBox({
                    type:"question",
                    buttons: ["Save", "Discard"],
                    title: "You have unsaved changes",
                    message: "You have made changes that have not yet been saved to the campaign. Would you like to save them now or discard them."
                }, function(response){
                    if(response == 0) { //Save
                        realSave(function(err){
                            if(!err)bus.emit("switch-to-explorer");
                        });
                    }else if(response == 1){ // Discard
                        bus.emit("switch-to-explorer");
                    }
                });
            }else{
                bus.emit("switch-to-explorer");    
            }
        });
        function save(){
            bus.emit("notification", "Saving...", {icon: "save"});
            realSave(function(err){
                if(err){
                    bus.emit("notification", "There was an error saving the campaign. Would you like to retry the save, specify a new save location or cancel", {color: "rgba(198, 32, 32, 0.8);", callback: function(button){
                        if(button.text() == "Retry"){
                            save();
                        }
                        if(button.text() == "New Location"){
                            dialog.showSaveDialog({
                                title: "Load Campaign File",
                                filters: [
                                    { name: "Campaign Data", extensions: ["json"] }
                                ],
                            }, function(path){
                                if(path){
                                    bus.emit("change-save-location", path);
                                    save();
                                }
                            })
                        }
                        return true;
                    }, buttons: ["Retry", "New Location", "Cancel"]})
                }
            });
        }
        $("#editor-save").off("click").click(function(){
            save();
        });
        $("#editor-discard").off("click").click(function(){
            bus.emit("switch-to-explorer");
        });
    });
});
