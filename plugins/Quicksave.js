//=============================================================================
// Hacktix Plugins - Quicksave
// Quicksave.js
//=============================================================================

var Imported = Imported || {};
Imported.Quicksave = true;

var Hacktix = Hacktix || {};
Hacktix.Quicksave = Hacktix.Quicksave || {};
Hacktix.Quicksave.version = 1.0;

//=============================================================================
/*:
 * @plugindesc v1.0 A plugin that adds simple quicksaves to the game,
 * allowing players to save and load game states on the fly.
 * @author Hacktix
 * 
 * @help
 * TODO: Actually write stuff here
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
    this.addQuicksaveCommand();
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
    this._commandWindow.setHandler('createquicksave', this.commandCreateQuicksave.bind(this));
    this._commandWindow.setHandler('loadquicksave', this.commandLoadQuicksave.bind(this));
};