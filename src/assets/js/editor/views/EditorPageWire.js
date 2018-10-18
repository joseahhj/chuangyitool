/**
 * @fileoverview Implementation of EditorPage
 */
define(['jquery', 'underscore', 'backbone', '../utils/helper', './CanvasView',
        './editing/BatchEditViewWire',
        './SaveView'], 
        function($, _, Backbone, helper, CanvasView, BatchEditView, SaveView) {
		
	/**
     * EditorPage defines the whole view where user can edits Canvases.
     * 
     * @constructor
     */
	var EditorPage = Backbone.View.extend({	
		
	    initialize: function(options) {
            var settingGroup = this.settingGroup_ = {
                    'Batch': new BatchEditView({el: '#setBox1'}),               
            };   
            var me =this         
            var canvasView = this.canvas_ = new CanvasView({el: '#modelBox'});
           
            var saveView = this.save_ = new SaveView({model: this.model, el: '#saveDrop'});
   			
            this.listenTo(this.model, 'change', this.render);
            // this.listenTo(this.model, 'canvas:layers:change:selected canvas:layers:rearrange', this.renderEditView);
            $(document).on('keydown', this.model, this.KeyboardShortcutHandler);
            
        },        
		events: {
			'mousedown .operate': function(e) {
				if (e.which != 1) {
			                return false;
			            }
			            var canvas = this.model.get('canvas');
			            canvas  && _(canvas.findAll({selected: true})).forEach(function(layer) {
			                layer.set({selected: false});
			            });
			},
			        
		},
		
		KeyboardShortcutHandler: function(e) {
			$('.save-image').hide();
			$('.save-image input[name="chicun"]').eq(1).prop('checked',true);				 
			$('#ruleSize').remove();
			if ($(':focus').size() > 0) {
				return;
			}
			
			e.stopPropagation();
		},
		
		renderCanvas: function(newModel) {
		    if (newModel) {
		        this.canvas_.setModel(newModel);
		    }
		    this.canvas_.render();
		    return this;
		},
		
		renderEditView: function() {
		    // _(this.settingGroup_).forEach(function(view) {
		    //     view && view.undelegateEvents().$el.hide();
		    // });
		    var canvas = this.model.get('canvas'),
		        layer = canvas && canvas.find({selected: true}),
		        type = layer && layer.get('type'),
		        view = type && this.settingGroup_[type];		    
		    // if (layer) {
		    //     if (view) {
		    //     	//view.$('input:text').focus();
		    //         view.setModel(layer);

		    //     } 
		    // } else{
		        view = this.settingGroup_['Batch'];
		        view.setModel(canvas);
		    //}
		    if (view) {
	            view.delegateEvents().render().$el.show();
		        //view.$('input:text').focus();
		    }
			return this;
		},		
		render: function() {			
			var canvas = this.model.get('canvas');
			if (canvas) {
			    this.renderCanvas(canvas, canvas.get('layerList'))
			        .renderEditView();
			}
			return this;
		},

		remove: function() {
			$(document).off('keydown', this.KeyboardShortcutHandler);
			Backbone.View.prototype.remove.apply(this, arguments);
		}
	});
	
	return EditorPage;
});