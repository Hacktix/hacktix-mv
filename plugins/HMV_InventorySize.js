//=============================================================================
// Hacktix Plugins - Inventory Size
// HMV_InventorySize.js
//=============================================================================

var Imported = Imported || {};
Imported.InventorySize = true;

var Hacktix = Hacktix || {};
Hacktix.InventorySize = Hacktix.InventorySize || {};
Hacktix.InventorySize.version = 0.1;

//=============================================================================
/*:
 * @plugindesc v0.1 An expansion to the basic inventory system
 * allowing for carrying limits for each individual item category.
 * @author Hacktix
 * 
 * @help
 * NOTE: This Plugin is still in development. Not all features may be
 * implemented as described yet.
 * 
 * ============================================================================
 * Dependencies
 * ============================================================================
 * 
 * IMPORTANT!
 * This Plugin requires the HMV_CoreUI Plugin in order to work correctly.
 * 
 * ============================================================================
 * Basic Introduction
 * ============================================================================
 * 
 * The Inventory Size Plugin allows for the definition of weight values
 * for each individual item using Notetags. Additionally, a carrying limit
 * can be defined for each individual item category, determining how much
 * the player can carry at any given point.
 * 
 * Attempting to pick up an item that would exceed the maximum carrying
 * capacity will prompt the player with a selection of their items, in which
 * they have to decide which item(s) to discard.
 * 
 * ============================================================================
 * Notetags
 * ============================================================================
 * 
 * The following Notetag can be added to an item in order to define its weight:
 * 
 *   <ItemWeight:[weight]>
 * 
 */
//=============================================================================

//=============================================================================
// Library Check
//=============================================================================
if(!Imported.HacktixUI || Hacktix.UI.version < 1.1) {
    require('nw.gui').Window.get().showDevTools();
    throw new Error("Inventory Size requires HMV_CoreUI.js >= v1.1");
}

//=============================================================================
// Scene_Item
//=============================================================================

Scene_Item.prototype.createItemWindow = function() {
    var wy = this._categoryWindow.y + this._categoryWindow.height;
    var wh = Graphics.boxHeight - wy - this._helpWindow.fittingHeight(1);
    this._itemWindow = new Window_ItemList(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
    this._categoryWindow.setItemWindow(this._itemWindow);
};

Scene_Item.prototype.createCapacityWindow = function() {
    this._capacityWindow = new Window_ItemCapacity();
    this.addWindow(this._capacityWindow);
}

Hacktix.InventorySize.Scene_Item_create = Scene_Item.prototype.create;
Scene_Item.prototype.create = function() {
    Hacktix.InventorySize.Scene_Item_create.call(this);
    this.createCapacityWindow();
    this._categoryWindow.setCapacityWindow(this._capacityWindow);
}

Hacktix.InventorySize.Scene_Item_onItemOk = Scene_Item.prototype.onItemOk;
Scene_Item.prototype.onItemOk = function() {
    Hacktix.InventorySize.Scene_Item_onItemOk.call(this);
    this._capacityWindow.refresh();
};

//=============================================================================
// Window_ItemCapacity
//=============================================================================

function Window_ItemCapacity() {
    this.initialize.apply(this, arguments);
}

Window_ItemCapacity.prototype = Object.create(Window_HacktixLabel.prototype);
Window_ItemCapacity.prototype.constructor = Window_ItemCapacity;

Window_ItemCapacity.prototype.initialize = function() {
    this._category = 'none';
    this._data = [];
    let yPos = Graphics.boxHeight - this.fittingHeight(1);
    Window_HacktixLabel.prototype.initialize.call(this, 0, yPos, Graphics.boxWidth, '', 1);
};

Window_ItemCapacity.prototype.setCategory = function(category) {
    if (this._category !== category) {
        this._category = category;
        this.recalculateCapacity();
    }
}

Window_ItemCapacity.prototype.includes = function(item) {
    switch (this._category) {
    case 'item':
        return DataManager.isItem(item) && item.itypeId === 1;
    case 'weapon':
        return DataManager.isWeapon(item);
    case 'armor':
        return DataManager.isArmor(item);
    case 'keyItem':
        return DataManager.isItem(item) && item.itypeId === 2;
    default:
        return false;
    }
};

Window_ItemCapacity.prototype.recalculateCapacity = function() {
    let usedCapacity = 0;
    $gameParty.allItems().filter(function(item) {
        return this.includes(item);
    }, this).forEach(item => {
        usedCapacity += $gameParty.numItems(item) * (item.note.match(/<ITEMWEIGHT:(\d+)>/i) ? parseInt(RegExp.$1) : 0);
    });
    this._text = `Capacity: ${usedCapacity}/100`;
    this.refresh();
}

Window_ItemCapacity.prototype.refresh = function() {
    this.contents.clear();
    this.drawTextEx(this._text, this.textPadding(), 0);
}

//=============================================================================
// Window_ItemCategory
//=============================================================================

Window_ItemCategory.prototype.setCapacityWindow = function(capacityWindow) {
    this._capacityWindow = capacityWindow;
}

Hacktix.InventorySize.Window_ItemCategory_update = Window_ItemCategory.prototype.update;
Window_ItemCategory.prototype.update = function() {
    Hacktix.InventorySize.Window_ItemCategory_update.call(this);
    if (this._capacityWindow) {
        this._capacityWindow.setCategory(this.currentSymbol());
    }
};