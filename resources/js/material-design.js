$(document).ready(function(){
    loadFonts();
    convertCheckboxes();
    initializeDropdowns();
    initializeDialogs();
    initializeExpansions();

    $(".date-picker").each(function(){
        var now = moment();
        regeneratePicker($(this), now.month() + 1, now.year());
        var that = $(this)
        $($(this).find(".fa.fa-chevron-left")[0]).click(function(){
            var activeIndex = that.attr("data-month");
            var activeYear = parseInt(that.attr("data-year") || now.year());

            activeIndex--;
            if(activeIndex < 1) {
                activeIndex = 12;
                activeYear--;
            }

            regeneratePicker(that, activeIndex, activeYear);
        });
        $($(this).find(".fa.fa-chevron-right")[0]).click(function(){
            var activeIndex = that.attr("data-month");
            var activeYear = parseInt(that.attr("data-year") || now.year());

            activeIndex++;
            if(activeIndex > 12) {
                activeIndex = 1;
                activeYear++;
            }

            regeneratePicker(that, activeIndex, activeYear);
        });
    });
});

function regeneratePicker(picker, monthIndex, year){
    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var calendar = $(picker.find(".p-calendar")[0]);
    var month = $(picker.find(".p-tbtd-2")[0]);
    var header = $(picker.find(".p-main")[0]);

    calendar.empty();
    picker.attr("data-month", monthIndex);
    picker.attr("data-year", year);

    month.text(moment.months()[monthIndex - 1] + " " + year);
    var table = $("<table></table>");
    var header = $("<tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr>");
    header.appendTo(table);

    var days = months[monthIndex-1];
    var offset = moment(year + "-" + pad(monthIndex, 2) + "-01").day();
    var index = 0;

    var row = $("<tr></tr>");
    for(var i = 0; i < offset; i++){
        var entry = $("<td></td>").attr("class", "empty");
        entry.appendTo(row);
        index++;
    }
    console.log(days);
    for(var i = 0; i < days; i++){
        var entry = $("<td></td>").text(i + 1).attr("data-date", pad((i + 1), 2));
        entry.appendTo(row);
        index++;
        if(index % 7 == 0){
            row.appendTo(table);
            row = $("<tr></tr>");
        }
    }

    if(index % 7 != 0){
        row.appendTo(table);
    }

    table.appendTo(calendar);
    console.log("Added");

    picker.find("td:not(.p-empty):not(.p-tbtd-1):not(.p-tbtd-3):not(.p-tbtd-2)").each(function(){
        $(this).click(function(){
            $(this).parent().parent().parent().find("div.selected").remove();
            $(this).parent().parent().parent().parent().parent().attr("data-day", $(this).attr("data-date"));
            $("<div class=\"selected\"></div>").appendTo($(this));

            var day = picker.attr("data-day");
            var month = picker.attr("data-month");
            var year = picker.attr("data-year");
            var mom = moment(year + "-" + pad(month, 2) + "-" + pad(day, 2));

            picker.find(".p-main").text(moment.weekdaysShort()[mom.day()] + ", " + moment.monthsShort()[mom.month()] + " " + pad(day, 2));
            picker.find(".p-small").text(year);
        });
    });
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function initializeExpansions(){
    $("[data-type='expansion']").each(function(){
        var title = $($(this).find("[data-type='expansion-title']")[0]).html();
        var disableActions = $(this).attr("data-disable-actions") || false;
        var elements = [];
        $(this).find("[data-type='expansion-element']").each(function(){
            elements .push($(this).html());
        });
        var body = $($(this).find("[data-type='expansion-body']")[0]).html();
        var actions = [];
        $(this).find("[data-type='expansion-action']").each(function(){
            actions.push($(this));
        });

        var expansion = $("<div></div>");
        expansion.attr("class", "expansion");

        var panel = $("<div></div>");
        panel.attr("class", "expansion-panel");
        panel.appendTo(expansion);

        var header = $("<div></div>");
        header.attr("class", "expansion-header");
        header.appendTo(panel);

        var table = $("<table></table>");
        table.attr("class", "clear-table expansion-table");
        table.appendTo(header);

        var tBody = $("<tbody></tbody>");
        tBody.appendTo(table);

        var row = $("<tr></tr>");
        row.appendTo(tBody);

        var titleDiv = $("<td></td>");
        titleDiv.attr("class", "primary");
        titleDiv.html(title);
        titleDiv.appendTo(row);

        for(i in elements){
            var element = elements[i];
            var td = $("<td></td>");
            td.html(element);
            td.appendTo(row);
        }

        var chevronTD = $("<td></td>");
        var chevronSpan = $("<span></span>");
        var chevron = $("<i></i>");

        chevron.attr("class", "fa fa-chevron-down");
        chevronSpan.attr("class", "expansion-chevron");
        chevron.appendTo(chevronSpan);
        chevronSpan.appendTo(chevronTD);
        chevronTD.appendTo(row);

        var divBody = $("<div></div>");
        divBody.attr("class", "expansion-body clearfix");
        divBody.html(body);
        divBody.appendTo(panel);

        if(!disableActions){
            var hr = $("<hr>");
            hr.attr("class", "expansion-divider");
            hr.appendTo(divBody);

            var divActions = $("<div></div>");
            divActions.attr("class", "expansion-actions");
            divActions.appendTo(divBody);

            for(i in actions){
                actions[i].detach().appendTo(divActions);
            }
        }

        expansion.insertAfter($(this));
        $(this).detach();
    })
    $(".expansion").each(function(){
        var that = $(this);
        var body = $($(this).find(".expansion-body")[0]);
        var chevron = $($($(this).find(".expansion-chevron")[0]).find("i")[0]);
        $($(this).find(".expansion-header")).click(function(){
            var state = body.attr("data-state") || "closed";
            if(state === "open"){
                body.attr("data-state", "closed");
                body.slideUp();
                chevron.attr("class", "fa fa-chevron-down");
            }else if(state === "closed"){
                body.attr("data-state", "open");
                body.slideDown();
                chevron.attr("class", "fa fa-chevron-up");
            }
        })
    });
}

function launchDialog(selector){
    $(selector).css("visibility", "visible").css("opacity", 1).css("transition", "opacity 0.2s linear");
}

function initializeDialogs(){
    $("[data-type=\"dialog\"]").each(function(){
        $($(this).find(".dialog-foreground")[0]).click(function(e){
            e.stopImmediatePropagation();
        });
        $(this).click(function(){
            $(this).css("visibility", "hidden").css("opacity", 0).css("transition", "visibility 0s 0.2s, opacity 0.2s linear");
        })
    });
}

function initializeDropdowns(){
    $("[data-type=\"dropdown\"]").click(function(){
        if($(this).attr("class") === "dropdown-close"){
            var original = $($(this).find("span")[0]).text();
            $(this).attr("data-save-text", original);
            $($(this).find("span")[0]).text("");

            $(this).find(".dropdown-entry").each(function(){
                $(this).css("display", "block");
            });
            $(this).attr("class", "dropdown-open");
            $($(this).find(".fa.fa-chevron-down")[0]).css("display", "none");
        }
    });

    $(".dropdown-entry").click(function(e){
        e.stopImmediatePropagation();
        var content = $(this).text();
        var parent = $($(this).parent());
        parent.attr("class", "dropdown-close");
        parent.find(".dropdown-entry").each(function(){
            $(this).css("display", "none");
            $(this).attr("class", "dropdown-entry");
            if($(this).text() === content){
                $(this).attr("class", "dropdown-entry active");
            }
        });
        parent.find(".fa.fa-chevron-down").css("display", "block");
        $(parent.find("span")[0]).text(content);
    });
}

function loadFonts(){
    WebFontConfig = {
        google: {
            families: ['Roboto:400,500,700,900']
        }
    };

    (function(d) {
        var wf = d.createElement('script'), s = d.scripts[0];
        wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
        wf.async = true;
        s.parentNode.insertBefore(wf, s);
    })(document);
}

function convertCheckboxes(){
    $("input[type=\"checkbox\"]:not([data-converted])").each(function(){
        var style= $(this).attr("data-style") || "light";
        var setting = $(this).prop("checked") || false;

        var outer = $("<div></div>");
        outer.attr("class", "checkbox-slider-back");
        outer.attr("data-type", "toggle");
        outer.attr("data-state", setting === false ? "off" : "on");
        outer.attr("data-style", style + (setting === false ? "off" : "on"));

        var inner = $("<div></div>");
        inner.attr("class", "checkbox-inner");
        inner.attr("data-style", style + (setting === false ? "off" : "on"));
        inner.css("left", setting === false ? "-3px" : "10px");

        $(this).attr("data-converted", true);
        inner.appendTo(outer);
        outer.insertAfter($(this));

        $(this).detach().appendTo(outer);
        outer.click(function(){
            var state = $(this).attr("data-state") || "off";
            var inner = $($(this).find(".checkbox-inner")[0]);
            var input = $($(this).find("input")[0]);
            var style = $(this).attr("data-style").replace("on", "").replace("off", "");
            if(state === "off"){
                $(this).attr("data-state", "on");
                inner.css("left", "10px");
                input.prop("checked", true);

                $(this).attr("data-style", style + "on");
                inner.attr("data-style", style + "on");
            }else{
                $(this).attr("data-state", "off");
                inner.css("left", "-3px");
                input.prop("checked", false);

                $(this).attr("data-style", style + "off");
                inner.attr("data-style", style + "off");
            }
        });
    });
}