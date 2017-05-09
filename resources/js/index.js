// These variables should be pretty self-explanatory based on name so they will not have any
// documentation. You can look at their uses below to see their purpose a little more clearly.
let shiftEnabled = false;
let advantage = false;
let disadvantage = false;
let expression = [];
let types = [];

// We need to keep track of whether the shift key is pressed at any time on the entire page
// this is used to check whether we should clear the entire dice field or just remove one.
// This one controls the shiftEnabled variable.
$(document).keydown(function (e) {
    shiftEnabled = e.shiftKey;
}).keyup(function (e) {
    shiftEnabled = e.shiftKey;
});

// The back button on the form is marked with the b function for backspace. We need to check
// whether we are going to backspace or clear and update the icon accordingly on mousemove.
// On click we need to check again if we are clearing or backspacing and do the respective 
// action before we update the output field that the user sees.
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

// We can simply join the entire expression together, however, due to the way that we are 
// storing the expression we need to remove the stars as 3d12 would be represented as 
// [3, '*', 'd12'] which expands out to 3*d12. The removing of the stars here is just a quick 
// fix that should be changed later as it messes with the backspace as the user expects only 
// one term from the field
function updateField() {
    $(".roll-general").val(expression.join("").replace("*", ""));
}

// All the on functions follow a basic structure of 4 conditions which are as follows:
//  - the expression is empty
//  - the previous entry in the expression was a number
//  - the previous entry in the expression was a function
//  - the previous entry in the expression was a dice
// Each function will have a quick summary about what each one does.

// expression is empty = Set the expression to have the number as the first elements and an 
//   "n" as the first type
// previous number     = We are still entering a number so just append to the previous one
// previous function   = Push the number with the new "n" type
// previous dice       = We are defauling to adding so add a plus then the number and a function 
//   ("f") then an "n" for number.
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

// expression is empty = Set the expression to have the dice as the first elements and an 
//   "d" as the first type
// previous number     = We are assuming the user wanted to roll multiple dice so multiply
//   the result by pushing a "*" function then the dice.
// previous function   = Push the dice with the new "d" type
// previous dice       = Update the dice that has been selected before by resetting the last
//   entry in the expression
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

// expression is empty = We can't do anything as a function cannot be first.
// if previous was a number or a dice:
//   if we are adding = push a "+" to expression and a "f" to type for the plus function
//   if we are subtracting = push a "-" to expression and a "f" to type for the minus function
// if previous was a function = update the selected function.
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

// All function buttons on the dice calculator are marked with the attribute data-function="[a-z0-9]"
// So we must listen for them. When one is pressed we can determine if it is a number button by just
// testing if the function is not, not a number. If so then we distribute the onNumber and update the field.
// Otherwise we must test for the individual functions. 
// If its a roll we have three different options: if we have an advantage we must roll the expression twice
//   and pick the highest. If we have a disadvantage we must roll twice and pick the lowest. We must create
//   the new by concatinating [] and the array which produces a copy of the array. This is because the roll
//   function may modify the actual array. If we dont have a disadvanatage or advantage then just roll 
//   normally.
// If its a plus or a minus then we just call the onFunction and that will handle it.
// If it is an advantage or disadvantage then we just need to set the value of the global variables.
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

// All dice buttons have the class matching one of d2, d3, d4, d6, d8, d10, d12 or d20 as each
// one has a different color. This function is rather dangerous as it matches any class that
// starts with a d. This will be fixed at a different stage. If one is pressed then we just
// call on dice with that objects class and update the field.
$("[class^='d']").click(function () {
    onDice($(this).attr("class"));
    updateField();
});

// Rolling is an iterative process where specific sections are switched out.
// 1. Pattern [[0-9], *, d[0-9]] are replaced by the accumulation of the first number of dice rolls.
//    The entire three elements will be switched out with just the result ready for the rest.
// 2. Pattern [d[0-9]] are replaced with that corrosponding dice roll
// 3. Pattern [[0-9], + [0-9]] is replaced with the sum of two numbers
// 4. Pattern [[0-9], - [0-9]] is replaced with the first number minused the second number
// Then the first term of the expression is returned as that should be the final result. This is not perfect and could
// do with some error checking and such but we will work on that later on.
function roll(expression) {
    for (var i = 0; i < expression.length - 2; i++) {
        if (/^[0-9]+?$/.test(expression[i]) && /^\*$/.test(expression[i + 1]) && /^d[0-9]{1,2}$/.test(expression[i + 2])) {
            var d = parseInt(expression[i + 2].replace("d", ""));
            var t = 0;
            for (var j = 0; j < parseInt(expression[i]); j++)t += Math.floor((Math.random() * (d - 1)) + 1);
            expression.splice(i, 3, t);
        }
    }
    
    for (var i = 0; i < expression.length; i++) {
        if (/^d[0-9]{1,2}$/.test(expression[i])) {
            expression[i] = "(" + Math.floor((Math.random() * (expression[i].replace("d", "") - 1)) + 1) + ")";
        }
    }
    
    for (var i = 0; i < expression.length - 2; i++) {
        if (/^[0-9]+?$/.test(expression[i]) && /^\+$/.test(expression[i + 1]) && /^[0-9]+?$/.test(expression[i + 2])) {
            expression.splice(i, 3, parseInt(expression[i]) + parseInt(expression[i + 2]));
        }
    }
    
    for (var i = 0; i < expression.length - 2; i++) {
        if (/^[0-9]+?$/.test(expression[i]) && /^-$/.test(expression[i + 1]) && /^[0-9]+?$/.test(expression[i + 2])) {
            expression.splice(i, 3, parseInt(expression[i]) - parseInt(expression[i + 2]));
        }
    }
    return expression[0];
}
