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
 */
//=============================================================================

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