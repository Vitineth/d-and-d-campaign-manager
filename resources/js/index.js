let shiftEnabled = false;
let advantage = false;
let disadvantage = false;
let expression = [];
let types = [];

$(document).keydown(function (e) {
    shiftEnabled = e.shiftKey;
}).keyup(function (e) {
    shiftEnabled = e.shiftKey;
});

$("[data-function='b']").mousemove(function (e) {
    if (shiftEnabled) $(this).html("<i class=\"fa fa-times-circle-o\"></i>");
    else $(this).html("<i class=\"fa fa-arrow-left\"></i>");
}).click(function () {
    if (shiftEnabled) {
        expression = [];
        types = [];
    } else {
        expression.pop();
        types.pop();
    }
    updateField();
});

function updateField() {
    $(".roll-general").val(expression.join("").replace("*", ""));
}

function onNumber(number) {
    if (expression.length == 0) {
        expression = [number];
        types = ["n"];
    } else {
        if (types[expression.length - 1] == "n") {
            expression[expression.length - 1] = expression[expression.length - 1] + number;
        }
        if (types[expression.length - 1] == "f") {
            expression.push(number);
            types.push("n");
        }
        if (types[expression.length - 1] == "d") {
            expression.push("+");
            expression.push(number);
            types.push("f");
            types.push("n");
        }
    }
}

function onDice(dice) {
    if (expression.length == 0) {
        expression = [dice];
        types = ["d"];
    } else {
        if (types[expression.length - 1] == "n") {
            expression.push("*");
            expression.push(dice);
            types.push("f");
            types.push("d");
        }
        if (types[expression.length - 1] == "f") {
            expression.push(dice);
            types.push("d");
        }
        if (types[expression.length - 1] == "d") {
            expression[expression.length - 1] = dice;
        }
    }
}

function onFunction(func) {

    if (expression.length != 0) {
        if (types[expression.length - 1] == "n" || types[expression.length - 1] == "d") {
            if (func == "p") {
                expression.push("+");
                types.push("f");
            }
            if (func == "m") {
                expression.push("-");
                types.push("f");
            }
        } else
        if (types[expression.length - 1] == "f") {
            expression[expression.length - 1] = func;
        }
    }
}

$("[data-function]").click(function (e) {
    if (!isNaN($(this).attr("data-function"))) {
        onNumber($(this).attr("data-function"));
        updateField();
    } else {
        var a = $(this).attr("data-function");
        if (a == "r") {
            if (advantage) {
                var a = roll([].concat(expression));
                var b = roll([].concat(expression));
                if (a > b) {
                    $(".roll-general").val(a);
                } else {
                    $(".roll-general").val(b);
                }
            } else if (disadvantage) {
                var a = roll([].concat(expression));
                var b = roll([].concat(expression));
                if (a < b) {
                    $(".roll-general").val(a);
                } else {
                    $(".roll-general").val(b);
                }
            } else {
                $(".roll-general").val(roll([].concat(expression)));
            }
        } else {
            if (a == "p" || a == "m") {
                onFunction(a);
            }
            if (a == "a") {
                disadvantage = false;
                advantage = true;
            }
            if (a == "d") {
                disadvantage = true;
                advantage = false;
            }
            updateField();
        }
    }


});

$("[class^='d']").click(function () {
    onDice($(this).attr("class"));
    updateField();
});


function roll(expression) {
    for (var i = 0; i < expression.length - 2; i++) {
        if (/^[0-9]+?$/.test(expression[i]) && /^\*$/.test(expression[i + 1]) && /^d[0-9]{1,2}$/.test(expression[i + 2])) {
            var d = parseInt(expression[i + 2].replace("d", ""));
            var t = 0;
            for (var j = 0; j < parseInt(expression[i]); j++)t += Math.floor((Math.random() * (d - 1)) + 1);
            expression.splice(i, 3, t);
        }
    }

    console.log(expression);
    for (var i = 0; i < expression.length; i++) {
        if (/^d[0-9]{1,2}$/.test(expression[i])) {
            expression[i] = "(" + Math.floor((Math.random() * (expression[i].replace("d", "") - 1)) + 1) + ")";
        }
    }
    console.log(expression);
    for (var i = 0; i < expression.length - 2; i++) {
        if (/^[0-9]+?$/.test(expression[i]) && /^\+$/.test(expression[i + 1]) && /^[0-9]+?$/.test(expression[i + 2])) {
            expression.splice(i, 3, parseInt(expression[i]) + parseInt(expression[i + 2]));
        }
    }
    console.log(expression);
    for (var i = 0; i < expression.length - 2; i++) {
        if (/^[0-9]+?$/.test(expression[i]) && /^-$/.test(expression[i + 1]) && /^[0-9]+?$/.test(expression[i + 2])) {
            expression.splice(i, 3, parseInt(expression[i]) - parseInt(expression[i + 2]));
        }
    }
    return expression[0];
}
