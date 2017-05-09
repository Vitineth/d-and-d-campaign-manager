// Page Section Injector
// =====================
//
// This module is a quick and dirty injector for the index page. This will take any html files in 
// /injector/pages and wrap them in a section with the ID using thier file names with the HTML removed.
// They will default to a hidden display css unless a default is specified. Within the file the following
// function lines can be used
//   #default <display mode>
//     Display mode must be one of the valid css properties for 'display'. If left out it will use 'none'
//     by default. If this file exists multiple times in files then it will use the last one it finds.
//   #script <location>
//     Loads the given path as a <script> with the location as a src and injects it at the bottom of the
//     body
//   #link <location>
//     Loads the given path as a <link> with the location as its rel and injects it at the bottom of the 
//     head
//

// Path is used to build the relative paths to the files once they have been queried.
const path = require('path');
// The file system is required to list the files in the injector folder and to load the
// data from those files.
const fs = require('fs');
// To signal when the loading has finished and everything has been injected we need to use the bus
// this is designed so that the rest of the renderer scripts won't be run until all pages have been
// injected in case they need to do any set up before everything is shown. We will be using the
// 'injected' event.
const bus = require('./system-emitter.js');

// To make sure that the rest of the scripts are only loaded after we have finished all the injections,
// we need to use a counter as the majority of the tasks are asynchronous. This means that we can't jus
// wait for them to finish. Hit stores the number of pages that have been processed and hitCount will
// eventually store the total number that we need to processes.
let hit = 0;
let hitCount;

// To inject we need to list all the files within the injector pages folder, filter out the
// non-html files (or at least those without the .html extension). Then we must filter out 
// any folders then, we must load the actual file and get the data before passing it on the
// processInjection function providing there are no errors.
//
// Dealing with hits here is very messy as we need to handle each error state as a processed 
// page. This is the best way I have thought of right now but there may be room for improvement
// in the future.
fs.readdir(path.join(".", "injector", "pages"), (err, files) => {
    if(!err){
        hitCount = files.length;
        files.forEach(file => {
            var fullFile = path.join(".", "injector", "pages", file);
            fs.stat(fullFile, function (err, stats){
                if(!err){
                    if(!stats.isDirectory()){
                        if(path.extname(file) == ".html"){
                            var id = file.replace(".html", "");
                            fs.readFile(fullFile, "utf8", function(err, data){
                                if(!err){
                                    processInjection(id, data);
                                }
                                processHit();
                            });
                        }else{
                            processHit();
                        }
                    }else{
                        processHit();
                    }
                }else{
                    processHit();
                }
            });
        });
    }
});


// This function just checks whether we have finished processing the pages by using the hit
// system described above. It is has it emits the injected event which will trigger the rest 
// of the requires to be included in the index.html page.
function processHit(){
    hit++;
    if(hit == hitCount) {
        bus.emit("injected");
    }
}

// The actual generation of the injection is simple enough, the process is as follows:
// 1. Split the data into its line so we can access the function lines
// 2. If the line is a function line (starts with a hash) then check its type
// 3. If it is a script then load it and append it to the body
// 4. If it is a link then load it and append it to the head
// 5. If it is the default then store it to be used later
// 6. If it is not a function line then append it back to the data storage
// 7. Build the element and wrap it in a section with the given id
// 8. Set its display mode either to the default of none or the given mode
// 9. Inject to the bottom of the main component of which there should only be one.
function processInjection(id, data){
    var lines = data.split("\n");
    var repl = "";
    var def;
    for(var i = 0; i < lines.length; i++){
        if(lines[i].indexOf("#") == 0){
            if(lines[i].indexOf("script") == 1) loadScript(lines[i]);
            if(lines[i].indexOf("link") == 1) loadLink(lines[i]);
            if(lines[i].indexOf("default") == 1) def = lines[i].replace("#default ", "");
        }else{
            repl += lines[i] + "\n";
        }
    }
    
    var element = $(repl);
    var container = $("<section></section>").attr("id", id);
    
    if(def) container.attr("style", "display: " + def);
    else container.attr("style", "display: none");
    
    $("main").append(container.append(element));
}

// The two functions below are very simple so no full documentation is provided, they 
// create a script or a link, set the origin and append to the right place in short.

function loadScript(line){
    var script = line.replace("#script ", "");
    var element = $("<script></script>").attr("src", script);
    $("body").append(element);
}

function loadLink(line){
    var link = line.replace("#link ", "");
    var element = $("<link></link>").attr("href", link);
    $("head").append(element);
}