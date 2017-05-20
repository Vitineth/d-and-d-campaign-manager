var shownNotifications = 20;
var notifications = [];

function generateID(){
    var options = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXY";
    var output = "";
    for(var i = 0; i < 10; i++){
        output += options[parseInt((Math.random() * options.length))];
    }
    return output;
}

function generateNotification(id, text, buttons, callback, ignore){
    var wrapper = $("<div></div>").addClass("notification-div").attr("id", id).css("top", "20px");

    //. css("top", parseInt(shownNotifications) + "px");
    var container = $("<table></table>").addClass("notification-container");
    var body = $("<tbody></tbody>");
    var row = $("<tr></tr>");
    var close = $("<i></i>").addClass("notification-dismiss").addClass("material-icons").text("close");
    var cell1 = $("<td></td>").addClass("notification-icon-td");
    var icon = $("<i></i>").addClass("material-icons").text("announcement").addClass("notification-icon");
    var cell2 = $("<td></td>").addClass("notification-content").text(text);
    var buttonWrapper = $("<div></div>").addClass("not-buttons");
    for(var i in buttons){
        var button = $("<button></button>").text(buttons[i]).click(function(){
            if(callback($(this))){
                $("#" + wrapper.attr("id")).animate({
                    right: "-=31pc",
                }, 500, function(){
                    offsetNotifications(id, false);
                    notifications.splice(notifications.indexOf(wrapper.attr("id")), 1);
                    wrapper.remove();
                });
            }
        });
        buttonWrapper.append(button);
    }
    close.click(function(){
        $("#" + wrapper.attr("id")).animate({
            right: "-=31pc",
        }, 500, function(){
            offsetNotifications(id, false);
            notifications.splice(notifications.indexOf(wrapper.attr("id")), 1);
            wrapper.remove();
        });
    });

    wrapper.append(container);
    container.append(body);
    body.append(row);
    row.append(cell1);
    cell1.append(icon);
    row.append(cell2);
    if(!ignore) wrapper.append(close);
    wrapper.append(buttonWrapper);

    return wrapper;
}

function launchNotification(text, options){
    options = options || {};
    var buttons = options.hasOwnProperty("buttons") ? options.buttons : null;
    var dismiss = options.hasOwnProperty("dismiss") ? options.dismiss : (buttons == null ? 2000 : -1);
    var callback = options.hasOwnProperty("callback") ? options.callback : function(){return true;};
    var ignoreClose = options.hasOwnProperty("ignore") ? options.ignore : false;

    var id = generateID();
    var notification = generateNotification(id, text, buttons, callback, ignoreClose);
    $("body").append(notification);

    notifications.unshift(id);
    offsetNotifications(id, true);

    $("#" + id).animate({
        right: "+=31pc"
    }, 500, function(){
        if(dismiss != -1){
            setTimeout(function(){
                $("#" + id).animate({
                    right: "-=31pc"
                }, 500, function(){
                    offsetNotifications(id, false);
                    notifications.splice(notifications.indexOf(id), 1);
                    $("#" + id).remove();
                });
            }, dismiss);
        }
    });

    return id;
}

function offsetNotifications(id, added){
    var height = $("#" + id).height();
    for(var i = notifications.indexOf(id)+1; i < notifications.length; i++){
        var not = $("#" + notifications[i])
        var top = parseInt(not.css("top").replace("px", ""));
        if(added){
            not.css("top", (top + height + 30) + "px");
        }else{
            not.css("top", (top - height - 30) + "px");
        }
    }
}

function killNotification(id){
    var sel = $("#" + id);
    if(sel.length){
        $("#" + id).animate({
            right: "-=31pc"
        }, 500, function(){
            offsetNotifications(id, false);
            notifications.splice(notifications.indexOf(id), 1);
            $("#" + id).remove();
        });
    }
}

bus.on("notification", function(text, options, idCallback){
    options = options || {};
    if(idCallback){
        idCallback(launchNotification(text, options));
    }else{
        launchNotification(text, options);
    }
});