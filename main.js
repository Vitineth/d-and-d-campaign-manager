const electron = require('electron')
const {shell, dialog, app, globalShortcut, Menu, MenuItem} = require('electron')
var bus = require('./resources/js/system-emitter.js');
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function constructMenu(){
    var dividerItem = new MenuItem({
        type: 'separator'
    });
    //File
    // - New
    // - Open
    // - ----
    // - Exit
    var newItem = new MenuItem({
        label: "New Campaign",
        accelerator: "CommandOrControl+N",
        click: function(){

        },
        id: "menu_new"
    });
    var openItem = new MenuItem({
        label: "Open Campaign",
        accelerator: "CommandOrControl+O",
        click: function(){
            dialog.showOpenDialog({
                title: "Load Campaign File",
                filters: [
                    { name: "Campaign Data", extensions: ["json"] }
                ],
                multiSelections: false,
            }, function(path){
                if(path) bus.emit("load-campaign", path);
            });
        },
        id: "menu_open"
    });
    var saveItem = new MenuItem({
        label: "Save Changes",
        accelerator: "CommandOrControl+S",
        click: function(){
            bus.emit("command-save");
        },
        enabled: false,
        id: "menu_save"
    })
    var exitItem = new MenuItem({
        role: "quit",
        id: "menu_quit"
    });

    var fileMenu = new MenuItem({
        label: "File",
        submenu: [newItem, openItem, saveItem, dividerItem, exitItem],
        id: "menu_file"
    });

    //Navigate
    // - Open Search
    // - Open Edit
    // - Open Characters
    // - Open Encounters
    // - Open Monsters
    // - Open Dice
    // - Open Scenes
    // - Open Puzzles
    var searchItem = new MenuItem({
        label: "Open Search",
        accelerator: "CommandOrControl+F",
        click: function(){
            bus.emit("command-search");
        },
        enabled: false,
        id: "menu_search"
    });
    var editItem = new MenuItem({
        label: "Open Edit",
        accelerator: "CommandOrControl+Shift+J",
        click: function(){
            bus.emit("command-edit");
        },
        enabled: false,
        id: "menu_edit"
    });
    var charactersItem = new MenuItem({
        label: "Open Characters",
        accelerator: "CommandOrControl+Shift+C",
        click: function(){
            bus.emit("command-characters");
        },
        enabled: false,
        id: "menu_characters"
    });
    var encountersItem = new MenuItem({
        label: "Open Encounters",
        accelerator:"CommandOrControl+Shift+E",
        click: function(){
            bus.emit("command-encounters");
        },
        enabled: false,
        id: "menu_encounters"
    });
    var monstersItem = new MenuItem({
        label: "Open Monsters",
        accelerator: "CommandOrControl+Shift+M",
        click: function(){
            bus.emit("command-monsters");
        },
        enabled: false,
        id: "menu_monsters"
    });
    var diceItem = new MenuItem({
        label: "Open Dice",
        accelerator: "CommandOrControl+Shift+D",
        click: function(){
            bus.emit("command-dice");
        },
        enabled: false,
        id: "menu_dice"
    });
    var scenesItem = new MenuItem({
        label: "Open Scenes",
        accelerator: "CommandOrControl+Shift+S",
        click: function(){
            bus.emit("command-scenes");
        },
        enabled: false,
        id: "menu_scenes"
    });
    var puzzlesItem = new MenuItem({
        label: "Open Puzzles",
        accelerator: "CommandOrControl+Shift+P",
        click: function(){
            bus.emit("command-puzzles");
        },
        enabled: false,
        id: "menu_puzzles"
    });

    var navigateMenu = new MenuItem({
        label: "Navigate",
        submenu: [searchItem, editItem, charactersItem, encountersItem, monstersItem, diceItem, scenesItem, puzzlesItem],
        id: "menu_nav"
    });
    //Debug
    // - Reload
    // - Force Reload
    // - ----
    // - Open Console
    var reloadItem = new MenuItem({
        role: "reload",
        id: "menu_reload"
    });
    var forceReloadItem = new MenuItem({
        role: "forcereload",
        id: "menu_force"
    });
    var openConsoleItem = new MenuItem({
        role: "toggledevtools",
        id: "menu_toggle"
    });

    var debugMenu = new MenuItem({
        label: "Debug",
        submenu: [reloadItem, forceReloadItem, dividerItem, openConsoleItem],
        id: "menu_debug"
    });
    //Help
    // - About
    // - ----
    // - Electron Website
    var aboutItem = new MenuItem({
        label: "About",
        click: function(){

        },
        id: "menu_about"
    });
    var electronSiteItem = new MenuItem({
        label: "Visit Electron",
        click: function(){
            shell.openExternal('http://electron.atom.io');
        },
        id: "menu_electron"
    });

    var helpMenu = new MenuItem({
        label: "Help",
        submenu: [aboutItem, dividerItem, electronSiteItem],
        id: "menu_help"
    });
    
    bus.on("enable-campaign", function(){
        searchItem.enabled = true;
        editItem.enabled = true;
        charactersItem.enabled = true;
        encountersItem.enabled = true;
        monstersItem.enabled = true;
        diceItem.enabled = true;
        scenesItem.enabled = true;
        puzzlesItem.enabled = true;
    });
    
    bus.on("disable-campaign", function(){
        searchItem.enabled = false;
        editItem.enabled = false;
        charactersItem.enabled = false;
        encountersItem.enabled = false;
        monstersItem.enabled = false;
        diceItem.enabled = false;
        scenesItem.enabled = false;
        puzzlesItem.enabled = false;
    });

    var menu = new Menu();
    menu.append(fileMenu);
    menu.append(navigateMenu);
    menu.append(debugMenu);
    menu.append(helpMenu);

    return menu;
}

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1600, height: 1800, icon: path.join("resources", "img", "icon-01.png")})
    var menu = constructMenu();
    mainWindow.setMenu(menu);
    Menu.setApplicationMenu(menu);

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
