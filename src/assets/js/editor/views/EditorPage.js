/**
 * @fileoverview Implementation of EditorPage
 */
define(['jquery', 'underscore', 'backbone',
        '../constant/KeyCode', '../utils/helper', './CanvasView',
        './editing/TextEditView',
        './editing/ImageEditView',
        './editing/BatchEditView',
        './SaveView','./editing/ImageSkuEditView',], 
        function($, _, Backbone,
                KeyCode, helper, CanvasView,
        		TextEditView,
        		ImageEditView,
        		BatchEditView,
        		SaveView,ImageSkuEditView) {
		
	/**
     * EditorPage defines the whole view where user can edits Canvases.
     * 
     * @constructor
     */
	var EditorPage = Backbone.View.extend({	
		
	    initialize: function(options) {
            var settingGroup = this.settingGroup_ = {
                    'TextBox': new TextEditView({el: '#setBox3'}),
                    'Image': new ImageEditView({el: '#setBox4'}),
                    'ImageSku': new ImageSkuEditView({el: '#setBoxSku'}),
                    'Batch': new BatchEditView({el: '#setBox1'}),               
            };            
            var canvasView = this.canvas_ = new CanvasView({el: '#modelBox'});
           
            var saveView = this.save_ = new SaveView({model: this.model, el: '#saveDrop'});
   			var me =this
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'canvas:layers:change:selected canvas:layers:rearrange', this.renderEditView);
            $(document).on('keydown', this.model,this.KeyboardShortcutHandler)
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
	        'mousedown .sizeBox': function(e) {
	        	if (e.which != 1) {
	                return false;
	            }
	            var canvas = this.model.get('canvas');
	            canvas  && _(canvas.findAll({selected: true})).forEach(function(layer) {
	                layer.set({selected: false});
	            });
	        },
	        'blur .ipt-sku': function(){
	        	$('.ipt-sku').removeClass('errTip')
                $('.err-color').html('')
	        }	        
		},
		
		KeyboardShortcutHandler: function(e,me) {
			$('.save-image').hide();
			$('.save-image input[name="chicun"]').eq(0).prop('checked',true);				 
			$('#ruleSize').remove();
			if ($('input:focus').size() > 0) {
				return;
			}
			var editor = e.data,
			    canvas = editor.get('canvas'),

			    layers = canvas && canvas.findAll({selected: true}),
			    options = {revocable: true, validate: true};

			switch (e.keyCode) {
			case KeyCode.DEL:	// remove layer
				// $('.modal-delete').show();
				// $('body').append('<div class="modal-backdrop in"></div>');
				editor.removeLayers()

				break;
			case KeyCode.MACDEL:
				// $('.modal-delete').show();
				// $('body').append('<div class="modal-backdrop in"></div>');
				editor.removeLayers()
				break;
			case KeyCode.Z: // undo
				(e.ctrlKey || e.metaKey) && editor.undoActions(1); 
				break;
			case KeyCode.Y: // redo
				(e.ctrlKey || e.metaKey) && editor.redoActions(1); break;
			case KeyCode.C: // copy
				console.log(e.ctrlKey || e.metaKey);
				(e.ctrlKey || e.metaKey) && editor.copyLayers(); break;
			case KeyCode.V: // paste
			           (e.ctrlKey || e.metaKey) && editor.pasteLayers(); break;
			case KeyCode.LEFT_ARROR: // move left
			    helper.translateLayers(layers, e.shiftKey ? -1 : -5, 0, options); break;
			case KeyCode.UP_ARROR: // move up
			    helper.translateLayers(layers, 0, e.shiftKey ? -1 : -5, options); break;
			case KeyCode.RIGHT_ARROR: // move right
			    helper.translateLayers(layers, e.shiftKey ? 1 : 5, 0, options); break;
			case KeyCode.DOWN_ARROR: // move down
			    helper.translateLayers(layers, 0, e.shiftKey ? 1 : 5); break;
			};
			
			var myTextBox = canvas && canvas.findAll({type: 'TextBox'}),
				myPicture = canvas && canvas.findAll({groupId: 'picture'});
			if(!myTextBox || myTextBox.length<1){
				$('#batchText').hide()
			}
			if(!myPicture || myPicture.length<1){
				$('#batchPicute').hide()
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
		    _(this.settingGroup_).forEach(function(view) {
		        view && view.undelegateEvents().$el.hide();
		    });
		    var canvas = this.model.get('canvas'),
		        layer = canvas && canvas.find({selected: true}),
		        type = layer && layer.get('type'),
		        groupId = layer && layer.get('groupId'),
		        view = null;
		      if(type=='Image'&&groupId=='picture'){
		      	view =type && this.settingGroup_['ImageSku']
		      }else{
		      	view =type && this.settingGroup_[type]
		      }    
		    if (layer) {
		        if (view) {
		        	//view.$('input:text').focus();
		            view.setModel(layer);

		        } 
		    } else{
		        view = this.settingGroup_['Batch'];
		        view.setModel(canvas);
		    }
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