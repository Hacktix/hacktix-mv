//=============================================================================
// Hacktix Plugins - Quicksave
// Quicksave.js
//=============================================================================

var Imported = Imported || {};
Imported.Quicksave = true;

var Hacktix = Hacktix || {};
Hacktix.Quicksave = Hacktix.Quicksave || {};
Hacktix.Quicksave.version = 1.11;

//=============================================================================
/*:
 * @plugindesc v1.11 A plugin that adds simple quicksaves to the game,
 * allowing players to save and load game states on the fly.
 * @author Hacktix
 * 
 * @help
 * ============================================================================
 * Basic Introduction
 * ============================================================================
 * 
 * The Quicksave Plugin allows players to create "quicksaves", which are
 * save files that don't actually use up any save slots, and are only
 * available until the game is closed. These can be created and loaded at
 * any time during the game, either through the provided menu options or
 * through Plugin Commands.
 * 
 * ============================================================================
 * Scripted Conditional Branches
 * ============================================================================
 * 
 * It's possible to determine whether or not a Quicksave was already created
 * using the following line within a Scripted Conditional Branch:
 * 
 *   Hacktix.Quicksave.save
 * 
 * The Conditional Branch will only be entered if a Quicksave exists.
 * Otherwise, if it exists, the else-branch will be entered.
 * 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * 
 *   Quicksave Save
 *   - Creates a Quicksave File
 * 
 *   Quicksave Load
 *   - Loads a Quicksave (if one was created, does nothing otherwise)
 * 
 * @param Quicksave Creation Label
 * @desc Text for the Quicksave Creation button in the menu.
 * @type text
 * @default Create Quicksave
 * 
 * @param Quicksave Loading Label
 * @desc Text for the Quicksave Loading button in the menu.
 * @type text
 * @default Load Quicksave
 * 
 * @param Show Quicksave Menu Options
 * @desc Whether or not the menu options for Quicksaves should be shown.
 * @type boolean
 * @default true
 * @on Yes
 * @off No
 */
//=============================================================================

//=============================================================================
// Parameters
//=============================================================================

Hacktix.Quicksave.param = PluginManager.parameters('Quicksave');
Hacktix.Quicksave.Dict = {
    createString: String(Hacktix.Quicksave.param['Quicksave Creation Label']),
    loadString: String(Hacktix.Quicksave.param['Quicksave Loading Label'])
};
Hacktix.Quicksave.showInMenu = eval(Hacktix.Quicksave.param['Show Quicksave Menu Options']);

//=============================================================================
// Window_MenuCommand
//=============================================================================

Window_MenuCommand.prototype.addQuicksaveCommand = function() {
    let enableQuicksaveCreate = true;
    let enableQuicksaveLoad = !!Hacktix.Quicksave.save;

    this.addCommand(Hacktix.Quicksave.Dict.createString, 'createquicksave', enableQuicksaveCreate);
    this.addCommand(Hacktix.Quicksave.Dict.loadString, 'loadquicksave', enableQuicksaveLoad);
};

Hacktix.Quicksave.Window_MenuCommand_addSaveCommand = Window_MenuCommand.prototype.addSaveCommand;
Window_MenuCommand.prototype.addSaveCommand = function() {
    Hacktix.Quicksave.Window_MenuCommand_addSaveCommand.call(this);
    if(Hacktix.Quicksave.showInMenu) {
        this.addQuicksaveCommand();
    }
};

//=============================================================================
// Scene_Menu
//=============================================================================

Scene_Menu.prototype.commandCreateQuicksave = function() {
    Hacktix.Quicksave.save = JsonEx.stringify(DataManager.makeSaveContents());
    this.popScene();
}

Scene_Menu.prototype.commandLoadQuicksave = function() {
    var json = Hacktix.Quicksave.save;
    DataManager.createGameObjects();
    DataManager.extractSaveContents(JsonEx.parse(json));
    this.fadeOutAll();
    Scene_Load.prototype.reloadMapIfUpdated();
    SceneManager.goto(Scene_Map);
}

Hacktix.Quicksave.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    Hacktix.Quicksave.Scene_Menu_createCommandWindow.call(this);
    if(Hacktix.Quicksave.showInMenu) {
        this._commandWindow.setHandler('createquicksave', this.commandCreateQuicksave.bind(this));
        this._commandWindow.setHandler('loadquicksave', this.commandLoadQuicksave.bind(this));
    }
};

//=============================================================================
// Game_Interpreter
//=============================================================================

Hacktix.Quicksave.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Hacktix.Quicksave.Game_Interpreter_pluginCommand.call(this, command, args);
    if(command === "Quicksave")
        this.processQuicksavePluginCommands(args.join(" ").trim());
}

Game_Interpreter.prototype.processQuicksavePluginCommands = function(line) {
    if(line.match(/SAVE/i)) {
        Hacktix.Quicksave.save = JsonEx.stringify(DataManager.makeSaveContents());
    } else if(line.match(/LOAD/i)) {
        if(Hacktix.Quicksave.save) {
            var json = Hacktix.Quicksave.save;
            DataManager.createGameObjects();
            DataManager.extractSaveContents(JsonEx.parse(json));
            SceneManager._scene.fadeOutAll();
            Scene_Load.prototype.reloadMapIfUpdated();
            SceneManager.goto(Scene_Map);
        }
    }
}