/**
 *
 */
'use strict';

define(['jquery', 'underscore', 'backbone',
        './graphics/textboxlayer',
        './graphics/imagelayer',
        'utils/helper', 'utils/actionhistory'
    ],
    function($, _, Backbone,
        TextBoxLayer,
        ImageLayer,
        helper, ActionHistory) {

        var IndependentLayerAttributes = ['locked', 'selected', 'index', 'transform'];

        /**
         * Editor class defines conceptual attributes to implement mediaEditor.
         * 
         * @constructor
         */
        var Editor = Backbone.Model.extend({

            defaults: {
                portfolio: null,
                creativeWork: null,
                canvas: null,
                clipboard: null,
                actionHistory: null,
                lastSavedData: {},
                zoom: 1.0,
                deleteLayer: {
                    '1125*762':[],
                    '590*470':[]
                },
                tempDelete:[]
            },

            initialize: function() {
                var actionHistory = new ActionHistory();
                this.set('actionHistory', actionHistory);
                this.set('clipboard', []);
                this.listenTo(actionHistory, 'all', helper.eventReporter('actionhistory', this));

                this.on('change:canvas', function() {
                    var currentCanvas = this.get('canvas');
                    // maintain logic consistency
                    currentCanvas && this.listenTo(currentCanvas, {
                        'layers:change': this.maintainChangeConsistency_,
                        'layers:add': this.addToSiblingCanvases_,
                        'layers:remove': this.removeFromSiblingCanvases_,
                    });

                    // record action history
                    currentCanvas && this.listenTo(currentCanvas, {
                        'layers:rearrange': this.recordRearrangeAction_,
                        'layers:change': this.recordLayerChangeAction_,
                    });

                    // forward events
                    currentCanvas && this.listenTo(currentCanvas, {
                        'all': helper.eventReporter('canvas', this),
                    });
                });
            },

            /* public methods */

            switchCreativeWork: function(creativeWork) {
                var portfolio = this.get('portfolio');
                if (!creativeWork) {
                    creativeWork = portfolio && portfolio.findCreativeWork({ disabled: false });
                }

                var canvas = (creativeWork && creativeWork.get('canvas')),
                    previous = this.get('canvas');

                if (previous && (previous !== canvas)) {
                    this.stopListening(previous);
                }
                this.set('creativeWork', creativeWork);

                this.listenTo(creativeWork, 'change:canvas', function(model, newCanvas) {
                    this.set('canvas', newCanvas);
                });
                this.set('canvas', canvas);

                this.get('actionHistory').reset();
            },

            undoActions: function(steps) {
                this.get('actionHistory').undo(steps);
            },
            redoActions: function(steps) {
                this.get('actionHistory').redo(steps);
            },
            selectLayer: function(selectedLayer) {
                var canvas = this.get('canvas');
                if (!canvas) {
                    return;
                }
                _(canvas.findAll({ selected: true })).forEach(function(layer) {
                    layer.set('selected', false);
                });
                selectedLayer && selectedLayer.set('selected', true);
            },

            copyLayers: function() {
                var canvas = this.get('canvas');
                if (!canvas) {
                    return;
                }
                var data = _(canvas.findAll({ selected: true }))
                    .map(function(layer) {
                        var replica = layer.clone();
                        var groupId = layer.groupId;
                        var tagText = '',
                            tagNum = '';
                        if (groupId) {
                            tagText = groupId.match(/^[a-z|A-Z]+/gi),
                                tagNum = groupId.match(/\d+$/gi);
                        }
                        replica.set({ selected: false, groupId: tagText, locked: false });
                        return replica;
                    });
                this.set('clipboard', data);
            },

            pasteLayers: function() {
                var canvas = this.get('canvas');
                if (!canvas) {
                    return;
                }
                var data = _(this.get('clipboard'))
                    .map(function(layer) {
                        helper.translateLayers([layer], 5, 5);
                        return layer.clone();
                    });
                if (data.length > 0) {
                    canvas.add(data, { revocable: true });
                }
            },
            toggleLayerLock: function() {
                var canvas = this.get('canvas');
                if (!canvas) {
                    return;
                }
                var selectedLayer = canvas.find({ selected: true });
                selectedLayer && selectedLayer.set('locked', !selectedLayer.get('locked'), { revocable: true });
            },
            removeLayers: function() {
                var me = this
                var canvas = this.get('canvas');
                var label = this.get('portfolio').get('label');
                var cWidth = canvas.get('width')
                var cHeight = canvas.get('height')
                var keys = cWidth + '*' + cHeight
                if (!canvas) {
                    return;
                }
                var toBeRemoved = canvas.findAll({ selected: true, locked: false });
                
                // Prevent background layer from being removed
                // toBeRemoved = _(toBeRemoved).reject(function(layer) {
                //     return layer.get('groupId') === 'background';
                // });
                let deleteLayer = me.get('deleteLayer')
                _(toBeRemoved).forEach(function(layer) {
                    layer.set('selected', false);
                    if(label.indexOf('14,')>-1){
                        var groupId = layer.get('groupId');
                        if (!!groupId) {
                            var affectedCanvases = _(me.getEnabledCanvases_())
                                .chain()
                                .filter(function(canvas) {
                                    return (canvas.find({ groupId: groupId }) !== null);
                                }).without(canvas)
                                .value();
                            
                            _(affectedCanvases).forEach(function(otherCanvas) {
                                var otherLayer = otherCanvas.find({ groupId: groupId });
                                var otherWidth = otherCanvas.get('width')
                                var otherHeight = otherCanvas.get('height')
                                var otherkeys = otherWidth + '*' + otherHeight
                                let otherCurrent = deleteLayer[otherkeys] ? deleteLayer[otherkeys] : [];
                                otherCurrent.push(otherLayer)
                                deleteLayer[otherkeys] = otherCurrent
                            });
                        }
                        let current = deleteLayer[keys] ? deleteLayer[keys] : [];
                        deleteLayer[keys].push(layer)
                    }
                });
                if(label.indexOf('14,')>-1){
                    this.set('deleteLayer', deleteLayer) 
                }
                canvas.remove(toBeRemoved, { revocable: true });
            },
            addRedoLayers:function(addlayers,siblinglayer){
                var me = this
                var currentCanvas = this.get('canvas'),
                    siblingCanvases = _(this.getEnabledCanvases_()).without(currentCanvas);
                if (_(siblinglayer).isArray()) {
                    _(siblinglayer).forEach(function(newLayer) {
                        me.siblingLayer_(newLayer, siblingCanvases)
                    });
                } else {
                    var newLayer = siblinglayer;
                    this.siblingLayer_(newLayer, siblingCanvases)
                }
                currentCanvas.add(addlayers, { revocable: true });
            },
            siblingLayer_(newLayer,siblingCanvases){
                newLayer.has('groupId') && _(siblingCanvases).forEach(function(canvas) {
                    canvas.add(newLayer, { revocable: true});
                    canvas.set('lastModifiedTime', _.now());
                });
            },
            shiftLayers: function(steps) {
                var canvas = this.get('canvas');
                if (!canvas) {
                    return;
                }
                var delta = (!isNaN(steps) && steps !== 0 ? (steps / Math.abs(steps)) * 0.1 : 0);
                _(canvas.findAll({ selected: true })).forEach(function(layer) {
                    layer.set('index', layer.get('index') + steps + delta);
                });
                canvas.sort({ revocable: true });
                var backgroundLayer = canvas.find({ groupId: 'background' });
                backgroundLayer && backgroundLayer.set('index', -1);
                canvas.sort();
            },
            /* private methods */

            addLayerByType_: function(type, withGroupId) {
                var canvas = this.get('canvas');
                if (!canvas) {
                    return false;
                }
                var layerConstructor = {
                    'TextBox': TextBoxLayer,
                    'Image': ImageLayer,
                }[type];
                if (!layerConstructor) {
                    return false;
                }
                var viewBox = canvas.get('viewBox'),
                    cx = ((viewBox.x + viewBox.width / 2) || 0),
                    cy = ((viewBox.y + viewBox.height / 2) || 0);
                var layer = new layerConstructor({
                    groupId: (withGroupId ? helper.pseudoUuid() : null),
                    transform: 'matrix(1,0,0,1,' + cx + ',' + cy + ')',
                });
                canvas.add(layer, { revocable: true });
                layer.set('selected', true);
                return layer;
            },

            addToSiblingCanvases_: function(newLayer) {
                var currentCanvas = this.get('canvas'),
                    siblingCanvases = _(this.getEnabledCanvases_()).without(currentCanvas);
                var label = this.get('portfolio').get('label');
                if(label.indexOf('14,') < 0 ){
                    newLayer.has('groupId') && _(siblingCanvases).forEach(function(canvas) {
                        var clonedLayer = newLayer.clone(),
                            viewBox = canvas.get('viewBox'),
                            cx = ((viewBox.x + viewBox.width / 2) || 0),
                            cy = ((viewBox.y + viewBox.height / 2) || 0);
                        clonedLayer.set('transform', 'matrix(1,0,0,1,' + cx + ',' + cy + ')');
                        canvas.add(clonedLayer, { revocable: true});
                        canvas.set('lastModifiedTime', _.now());
                    });
                } 
                
            },

            removeFromSiblingCanvases_: function(removedLayer) {
                var currentCanvas = this.get('canvas'),
                    siblingCanvases = _(this.getEnabledCanvases_()).without(currentCanvas);
                removedLayer.has('groupId') && _(siblingCanvases).forEach(function(canvas) {
                    var groupId = removedLayer.get('groupId'),
                        layer = canvas.find({ groupId: groupId });
                    canvas.remove(layer);
                    canvas.set('lastModifiedTime', _.now());
                });
            },

            getEnabledCanvases_: function() {
                var portfolio = this.get('portfolio'),
                    canvases = _(portfolio.findAllCreativeWorks({ yn: 1 }))
                    .chain()
                    .map(function(creativeWork) {
                        return creativeWork.get('canvas');
                    }).compact().value();
                return canvases;
            },

            recordRearrangeAction_: function(layers, options) {
                if (options.revocable !== true) {
                    return;
                }
                var previousLayers = options.previousModels,
                    currentLayers = _(layers.models).clone(),
                    canvas = options.parent;

                if (!canvas) {
                    return;
                }

                // set current timestamp when canvas is modified
                var lastModifiedTime = canvas.get('lastModifiedTime');
                var currentModifiedTime = _.now();
                canvas.set('lastModifiedTime', currentModifiedTime);

                this.get('actionHistory').newAction(function() {
                    canvas.reset(currentLayers);
                    canvas.set('lastModifiedTime', currentModifiedTime);
                }, function() {
                    canvas.reset(previousLayers);
                    canvas.set('lastModifiedTime', lastModifiedTime);
                });
            },

            recordLayerChangeAction_: function(layer, options) {
                if (options.revocable !== true) {
                    return;
                }
                var canvas = this.get('canvas'),
                    changed = layer.changedAttributes(),
                    previous = _(layer.previousAttributes()).pick(_(changed).keys());

                if (!canvas || !canvas.get('layerList').get(layer)) {
                    return;
                }
                // set current timestamp when canvas is modified
                var lastModifiedTime = canvas.get('lastModifiedTime');
                var currentTime = _.now();
                canvas.set('lastModifiedTime', currentTime);

                this.get('actionHistory').newAction(function() {
                    layer.set(changed);
                    canvas.set('lastModifiedTime', currentTime);
                }, function() {
                    layer.set(previous);
                    canvas.set('lastModifiedTime', lastModifiedTime);
                });
            },

            maintainChangeConsistency_: function(layer, options) {
                var canvas = this.get('canvas');
                // rule 1: only ONE layer can be selected
                if (layer && layer.get('selected')) {
                    canvas && _(canvas.findAll({ selected: true }))
                        .chain().without(layer).forEach(function(otherLayer) {
                            otherLayer.set('selected', false);
                        });
                }

                // rule 2: update other layers with the same groupId
                
                var groupId = layer.get('groupId'),
                    INDEPENDENT_KEYS = ['locked', 'selected', 'index', 'transform', 'visible'];
                if (!!groupId) {
                    var portfolio = this.get('portfolio'),
                        affectedCanvases = _(this.getEnabledCanvases_())
                        .chain()
                        .filter(function(canvas) {
                            return (canvas.find({ groupId: groupId }) !== null);
                        }).without(canvas)
                        .value(),
                        changed = _(layer.changedAttributes()).omit(INDEPENDENT_KEYS);
                    var currentTime = _.now();

                    _(affectedCanvases).forEach(function(otherCanvas) {
                        var otherLayer = otherCanvas.find({ groupId: groupId });
                        if (otherLayer) {
                            otherLayer.set(changed);
                            otherLayer.hasChanged() && otherCanvas.set('lastModifiedTime', currentTime);
                        }
                    });
                }
            },
        });
        return Editor;
    });