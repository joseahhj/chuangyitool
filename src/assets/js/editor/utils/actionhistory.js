/**
 * @fileoverview
 *     A simplified implementation of redo/undo
 */
define(['underscore', 'backbone'], function(_, Backbone) {
	
	var ID = 0;
	
	var Action = function(invoker, revoker) {
		this.invoker = invoker;
		this.revoker = revoker;
		this.id = ID++;
	};
	
	var ActionHistory = function(capacity) {
		this.undoStack = [];
		this.redoStack = [];
		this.capacity = capacity;
		_(this).extend(Backbone.Events);
	};
	
	/**
	 * Reset states.
	 */
	ActionHistory.prototype.reset = function() {
		this.undoStack = [];
		this.redoStack = [];
		this.trigger("change", this);
	};
	
	/**
	 * Create a new Action object in ActionHistory. Omits all currently
	 * redoable actions.
	 * 
	 * @param {Function} invoker
	 *     Function to call when an Action is 'redo'ed.
	 * @param {Function} revoker
	 *     Function to call when an Action is 'undo'ed.
	 */
	ActionHistory.prototype.newAction = function(invoker, revoker) {
		var action = new Action(invoker, revoker);
		this.undoStack.push(action);
		if (this.capacity > 0) {
			var high = this.undoStack.length, low = high - this.capacity;
			this.undoStack = this.undoStack.slice(low, high);
		}
		this.redoStack = [];
		this.trigger("change", this);
	};
	
	/**
	 * Undo the previously performed action.
	 */
	ActionHistory.prototype.undo = function() {
		var action = this.undoStack.pop();
		if (action) {
			action.revoker.call();
			this.redoStack.push(action);
		}
		this.trigger("change", this);
	};
	
	/**
	 * Redo the previously revoked action.
	 */
	ActionHistory.prototype.redo = function() {
		var action = this.redoStack.pop();
		if (action) {
			action.invoker.call();
			this.undoStack.push(action);
		}
		this.trigger("change", this);
	};
	
	ActionHistory.prototype.isUndoable = function() {
		return !!(this.undoStack && this.undoStack.length > 0);
	};
	
	ActionHistory.prototype.isRedoable = function() {
		return !!(this.redoStack && this.redoStack.length > 0);
	}
	
	return ActionHistory;
});