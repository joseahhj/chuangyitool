/**
 * @fileoverview Implementation of EditorPage
 */
define(['jquery', 'underscore', 'backbone',
        '../constant/KeyCode', '../utils/helper', './CanvasView',
        './editing/TextEditView',
        './editing/ImageEditView',
        './editing/BatchEditViewHt',
        './editing/BatchEditViewFix',
        './SaveView'
    ],
    function($, _, Backbone,
        KeyCode, helper, CanvasView,
        TextEditView,
        ImageEditView,
        BatchEditView,
        BatchEditViewFix,
        SaveView) {

        /**
         * EditorPage defines the whole view where user can edits Canvases.
         * 
         * @constructor
         */
        var EditorPage = Backbone.View.extend({

            initialize: function(options) {
                this.settingGroup_ = {
                    'TextBox': new TextEditView({ el: '#setBox3' }),
                    'Image': new ImageEditView({ el: '#setBox4' }),
                    'Batch': new BatchEditView({ el: '#setBox1' }),
                    'BatchFix': new BatchEditViewFix({ el: '#setBoxFix' }),
                };
                this.canvas_ = new CanvasView({ el: '#modelBox' });

                this.save_ = new SaveView({ model: this.model, el: '#saveDrop' });
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'canvas:layers:change canvas:layers:rearrange', this.renderViewFix);
                this.listenTo(this.model, 'canvas:layers:change:selected canvas:layers:rearrange', this.renderEditView);
                $(document).on('keydown', this.model, this.KeyboardShortcutHandler)

            },
            events: {
                'mousedown .operate': function(e) {
                    if (e.which != 1) {
                        return false;
                    }
                    var canvas = this.model.get('canvas');
                    canvas && _(canvas.findAll({ selected: true })).forEach(function(layer) {
                        layer.set({ selected: false });
                    });

                },
                'mousedown .sizeBox': function(e) {
                    if (e.which != 1) {
                        return false;
                    }
                    var canvas = this.model.get('canvas');
                    canvas && _(canvas.findAll({ selected: true })).forEach(function(layer) {
                        layer.set({ selected: false });
                    });
                },
                'click .delete-modal-medium .jad-btn-medium': 'onSure'
            },
            onSure() {
                var deleteLayer = this.model.get('deleteLayer');
                var canvas = this.model.get('canvas');
                var selectLy = []
                var endDeleteLayer = []
                var curWidth = canvas.get('width')
                var curHeight = canvas.get('height')
                var delKeys = curWidth + '*' + curHeight
                var siblings = []
                if (deleteLayer[delKeys] && deleteLayer[delKeys].length) {
                    deleteLayer[delKeys].forEach((item) => {
                        if (item.get('selected')) {
                            selectLy.push(item)
                        } else {
                            let groupId = item.get('groupId')
                            endDeleteLayer.push(groupId)
                        }
                    })
                    for(let key in deleteLayer){
                        if(delKeys!=key){
                            siblings = deleteLayer[key].filter((item)=>{
                                let groupId = item.get('groupId')
                                return endDeleteLayer.indexOf(groupId) < 0
                            })
                        }
                        deleteLayer[key] = deleteLayer[key].filter((item)=>{
                            let groupId = item.get('groupId')
                            return endDeleteLayer.indexOf(groupId)>-1
                        })

                    }
                    this.model.set({'deleteLayer': deleteLayer})
                    this.model.addRedoLayers(selectLy, siblings)
                    //canvas.add(selectLy, { revocable: true })
                }

            },
            KeyboardShortcutHandler: function(e, me) {
                $('.save-image').hide();
                $('.save-image input[name="chicun"]').eq(0).prop('checked', true);
                $('#ruleSize').remove();
                if ($('input:focus').size() > 0) {
                    return;
                }
                var editor = e.data,
                    canvas = editor.get('canvas'),

                    layers = canvas && canvas.findAll({ selected: true }),
                    options = { revocable: true, validate: true };
                var type = layers && layers[0] && layers[0].get('type'),
                    groupId = layers && layers[0] && layers[0].get('groupId');

                switch (e.keyCode) {
                    case KeyCode.DEL: // remove layer
                        if (groupId != 'product' && type != 'TextBox') {
                            editor.removeLayers()
                        }
                        break;
                    case KeyCode.MACDEL:
                        // $('.modal-delete').show();
                        // $('body').append('<div class="modal-backdrop in"></div>');
                        if (groupId != 'product' && type != 'TextBox') {
                            editor.removeLayers()
                        }
                        break;
                        // case KeyCode.Z: // undo
                        //     (e.ctrlKey || e.metaKey) && editor.undoActions(1);
                        //     break;
                        // case KeyCode.Y: // redo
                        //     (e.ctrlKey || e.metaKey) && editor.redoActions(1);
                        //     break;
                        // case KeyCode.C: // copy
                        //     (e.ctrlKey || e.metaKey) && editor.copyLayers();
                        //     break;
                        // case KeyCode.V: // paste
                        //     (e.ctrlKey || e.metaKey) && editor.pasteLayers();
                        //     break;
                    case KeyCode.LEFT_ARROR: // move left
                        helper.translateLayers(layers, e.shiftKey ? -1 : -5, 0, options);
                        break;
                    case KeyCode.UP_ARROR: // move up
                        helper.translateLayers(layers, 0, e.shiftKey ? -1 : -5, options);
                        break;
                    case KeyCode.RIGHT_ARROR: // move right
                        helper.translateLayers(layers, e.shiftKey ? 1 : 5, 0, options);
                        break;
                    case KeyCode.DOWN_ARROR: // move down
                        helper.translateLayers(layers, 0, e.shiftKey ? 1 : 5);
                        break;
                };

                var myTextBox = canvas && canvas.findAll({ type: 'TextBox' }),
                    myPicture = canvas && canvas.findAll({ groupId: 'picture' });
                if (!myTextBox || myTextBox.length < 1) {
                    $('#batchText').hide()
                }
                // if(!myPicture || myPicture.length<1){
                // 	$('#batchPicute').hide()
                // }

                e.stopPropagation();
            },

            renderCanvas: function(newModel) {
                if (newModel) {
                    this.canvas_.setModel(newModel);
                }

                this.canvas_.render();
                return this;
            },
            renderViewFix:function(){
                var canvas = this.model.get('canvas');
                var viewFix = this.settingGroup_['BatchFix'];
                viewFix.setModel(canvas, this.model);
                viewFix.render()
            },
            renderEditView: function() {
                _(this.settingGroup_).forEach(function(view) {
                    if (view) {
                        let id = view.undelegateEvents().$el.attr('id')
                        id != 'setBoxFix' && view.undelegateEvents().$el.hide();
                    }
                });
                var canvas = this.model.get('canvas'),
                    layer = canvas && canvas.find({ selected: true }),
                    type = layer && layer.get('type'),
                    groupId = layer && layer.get('groupId'),
                    view = null;
                var portfolio = this.model.get('portfolio');
                type == 'Image' && groupId == 'product' ?
                    (layer = '') : (view = type && this.settingGroup_[type])

                layer ? 
                (view && view.setModel(layer)) 
                : (view = this.settingGroup_['Batch'],
                    view.setModel(canvas, portfolio))

                view && view.delegateEvents().$el.show();
                
                return this;
            },
            render: function() {
                var canvas = this.model.get('canvas');

                if (canvas) {
                    this.renderCanvas(canvas, canvas.get('layerList'))
                        //.renderEditView();// 循环渲染了
                    
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