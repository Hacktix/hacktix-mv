//=============================================================================
// Hacktix Plugins - UI Library
// HMV_CoreUI.js
//=============================================================================

var Imported = Imported || {};
Imported.HacktixUI = true;

var Hacktix = Hacktix || {};
Hacktix.UI = Hacktix.UI || {};
Hacktix.UI.version = 1.0;

//=============================================================================
/*:
 * @plugindesc v1.0 A requirement for Hacktix MV Plugins utilizing custom
 * User Interfaces and Menus.
 * @author Hacktix
 * 
 * @help
 * ============================================================================
 * Basic Introduction
 * ============================================================================
 * 
 * The Hacktix UI Library has no direct use for RPG creation itself. It is
 * only a collection of code segments which make the development of custom
 * menus and user interfaces easier for other plugins, and is required for
 * some to work.
 * 
 * ============================================================================
 * For Advanced Users
 * ============================================================================
 * 
 * The following is a description of the newly implemented classes added by
 * the library.
 * 
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 *  Window_HacktixCommand
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 * 
 * The Window_HacktixCommand class allows for easy creation of simple Command
 * List Windows, defining most properties in the constructor:
 * 
 *   new Window_HacktixCommand(<x>, <y>, <w>, <commands>);
 * 
 *   <x> / <y>  - The x- and y-Coordinates the window should have on screen
 *   <w>        - The width of the window measured in pixels
 *   <commands> - An array of command objects, which are structured:
 *                {
 *                    label:   <string>,  // The text which should be used
 *                                           for the menu option
 *                    id:      <string>,  // The ID under which handlers
 *                                           can be added
 *                    enabled: <boolean>  // Whether or not the menu option
 *                                           should be enabled
 *                }
 * 
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 *  Window_HacktixLabel
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 * 
 * The Window_HacktixLabel class allows for creation of helptext boxes and
 * is based on the Window_Help class. All relevant parameters can be set in
 * the constructor of the class:
 * 
 *   new Window_HacktixLabel(<x>, <y>, <w>, [<text>], [<lines>]);
 * 
 *   <x/y>   - The x- and y-Coordinates the window should have on screen
 *   <w>     - The width of the window measured in pixels
 *   <text>  - Optional, the text which should be displayed in the box
 *             (Default: Empty String)
 *   <lines> - Optional, the amount of lines the box should be able to
 *             display at most (Default: 2)
 * 
 */
//=============================================================================

//=============================================================================
// Window_HacktixLabel
//=============================================================================

function Window_HacktixLabel() {
    this.initialize.apply(this, arguments);
}

Window_HacktixLabel.prototype = Object.create(Window_Base.prototype);
Window_HacktixLabel.prototype.constructor = Window_HacktixLabel;

Window_HacktixLabel.prototype.initialize = function(x, y, w, text = '', numLines = 2) {
    var width = w || Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 2);
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.setText(text);
};

Window_HacktixLabel.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};

Window_HacktixLabel.prototype.refresh = function() {
    this.contents.clear();
    this.drawTextEx(this._text, this.textPadding(), 0);
};

//=============================================================================
// Window_HacktixCommand
//=============================================================================

function Window_HacktixCommand() {
    this.initialize.apply(this, arguments);
}

Window_HacktixCommand.prototype = Object.create(Window_Command.prototype);
Window_HacktixCommand.prototype.constructor = Window_HacktixCommand;

Window_HacktixCommand.prototype.initialize = function(x, y, w, commands) {
    this._w = w;
    this._commands = commands;
    Window_Command.prototype.initialize.call(this, x, y);
};

Window_HacktixCommand.prototype.windowWidth = function() {
    return this._w;
};

Window_HacktixCommand.prototype.numVisibleRows = function() {
    return this.maxItems();
};

Window_HacktixCommand.prototype.makeCommandList = function() {
    for(let cmd of this._commands)
        this.addCommand(cmd.label, cmd.id, cmd.enabled);
};