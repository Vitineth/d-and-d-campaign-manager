$(document).ready(function(){
    $(".expander").each(function(){
        var header = $(this).find(".expander-header");
        var image = $(this).find(".expander-image");
        var body = $(this).find(".expander-content");

        header.click(function(){
            image.addClass("spinner");
            body.slideToggle(400, function(){
                image.removeClass("spinner");
            });
        });


    })

    $(".tabs").each(function(){
        var that = this;
        $(this).find(".tab-button").click(function(){
            $(that).find(".tab-button").removeClass("active");
            $(this).addClass("active");
            if($(this).attr("data-tab") !== undefined){
                $(that).find(".tab").each(function(){
                    $(this).css("display", "none");
                });
                $($(this).attr("data-tab")).css("display", "block");
            }
        })
    });



    $(".modal.back").click(function(){
        toggleModal($(this).parent());
    });

}); 

function toggleModal(reference){
    reference.children().each(function(){$(this).fadeToggle()});
}
function launchSearchModal(type){
    $("#search-modal").find(".tab-button").removeClass("active");
    $("#search-modal").find(".tab").css("display", "none");
    if(type=="all"){
        $("#search-modal").find("#tab0").css("display", "block");
        $("#search-modal").find("[data-tab=\"#tab0\"]").addClass("active");
    }
    if(type=="characters"){
        console.log("hey?");
        $("#search-modal").find("#tab1").css("display", "block");
        $("#search-modal").find("[data-tab=\"#tab1\"]").addClass("active");
    }
    if(type=="encounters"){
        $("#search-modal").find("#tab2").css("display", "block");
        $("#search-modal").find("[data-tab=\"#tab2\"]").addClass("active");
    }
    if(type=="monsters"){
        $("#search-modal").find("#tab3").css("display", "block");
        $("#search-modal").find("[data-tab=\"#tab3\"]").addClass("active");
    }
    if(type=="puzzles"){
        $("#search-modal").find("#tab4").css("display", "block");
        $("#search-modal").find("[data-tab=\"#tab4\"]").addClass("active");
    }
    if(type=="scenes"){
        $("#search-modal").find("#tab5").css("display", "block");
        $("#search-modal").find("[data-tab=\"#tab5\"]").addClass("active");
    }
    toggleModal($("#search-modal"));
}

function toggleNav(){
    var size = 97;
    var status = $(".global-nav").attr("data-shown") === undefined ? "hidden" : $(".global-nav").attr("data-shown");
    if(status == "shown"){
        $(".global-nav").attr("data-shown", "hidden");
        $(".clip-nav").animate({
            width: "-=" + size
        });
    }else{
        $(".global-nav").attr("data-shown", "shown");
        $(".clip-nav").animate({
            width: "+=" + size
        });     
    }
}

bus.on("command-search", function(){
    launchSearchModal("all");
});

bus.on("command-edit", function(){
    launchSearchModal("edit");
});

bus.on("command-characters", function(){
    launchSearchModal("characters");
});

bus.on("command-encounters", function(){
    launchSearchModal("encounters");
});

bus.on("command-monsters", function(){
    launchSearchModal("monsters");
});

bus.on("command-dice", function(){
    launchSearchModal("dice");
});

bus.on("command-scenes", function(){
    launchSearchModal("scenes");
});

bus.on("command-puzzles", function(){
    launchSearchModal("puzzles");
});