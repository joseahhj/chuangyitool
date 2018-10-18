/**
 * @fileoverview
 */
'use strict';

define(['underscore', './svgmodel', './layer',
        './textboxlayer', './imagelayer',
        'utils/helper', 'text!data/xml/canvas.xml'
    ],
    function(_, SvgModel, Layer,
        TextBoxLayer, ImageLayer, Helper, canvasTemplate) {

        /**
         * A list of Layers.
         * @constructor
         */
        var LayerList = Backbone.Collection.extend({
            initialize: function(models, options) {
                this.on('add remove sort reset', this.updateIndices_);
            },
            comparator: 'index',
            model: function(attributes, options) {
                var type = attributes.type;
                var LAYER_CONSTRUCTOR_MAP = {
                    'TextBox': TextBoxLayer,
                    'Image': ImageLayer,
                };
                var constructor = LAYER_CONSTRUCTOR_MAP[type] || Layer;
                return new constructor(attributes, options);
            },
            updateIndices_: function() {
                this.forEach(function(model, index) {
                    var nIndex = ((model.cid).match(/\d+$/gi))[0];
                    model.set('index', Number(nIndex), { silent: true });
                    model.set('txtIndex', index, { silent: true });
                });
            },
        });


        /**
         * A Canvas object represents an editable banner of specified size.
         * @constructor
         */
        var Canvas = SvgModel.extend({

            svgTemplate: canvasTemplate,

            defaults: {
                width: 0,
                height: 0,
                viewBox: null,
                lastModifiedTime: NaN,
                version: '3.0',
            },

            initialize: function(attributes, options) {

                SvgModel.prototype.initialize.apply(this, arguments);

                var width = this.get('width'),
                    height = this.get('height');

                !this.has('viewBox') && this.set('viewBox', {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                }, { silent: true });
                this.set('layerList', new LayerList());
                this.listenTo(this.get('layerList'), 'all', Helper.eventReporter('layers', this));
                this.svgAccessor().selectAll('g').remove();
            },

            /* public methods */

            syncToSvg: function(recursive) {
                var attributes = this.toJSON();

                attributes.width &&
                    this.svgAccessor().attr('width', attributes.width);
                attributes.height &&
                    this.svgAccessor().attr('height', attributes.height);
                attributes.viewBox &&
                    this.svgAccessor().attr('viewBox', attributes.viewBox);
                this.svgAccessor().attr('xmlns:editor', 'editor');

                if (recursive === true) {
                    this.get('layerList').forEach(function(layer) {
                        layer.syncToSvg(recursive);
                    });
                }
            },

            add: function(layers, options) {
                console.log(options,'options')
                options = options || {};
                var layerList = this.get('layerList');
                options.previousModels = _(layerList.models).clone();
                options.parent = this;
                options.sort = true;

                var viewport = this.get('viewBox'),
                    center = {
                        x: viewport.x + viewport.width / 2,
                        y: viewport.y + viewport.height / 2,
                    },
                    deltaTransform = 'matrix(1,0,0,1,' + center.x + ',' + center.y + ')';
                if (_(layers).isArray()) {
                    _(layers).forEach(function(layer) {
                        !layer.has('transform') && layer.set({ 'transform': deltaTransform });
                        layer.set({ selected: false })
                    });
                } else {
                    var layer = layers;
                    !layer.has('transform') && layer.set('transform', deltaTransform);
                    layer.set({ selected: false })
                }

                var result = layerList.add(layers, options);
                this.rearrangeLayers_(layerList, options);
                return result;
            },

            remove: function(layers, options) {
                options = options || {};
                var layerList = this.get('layerList');
                options.previousModels = _(layerList.models).clone();
                options.parent = this;
                var result = layerList.remove(layers, options);
                this.rearrangeLayers_(layerList, options);

                return result;
            },

            reset: function(layers, options) {
                options = options || {};
                var layerList = this.get('layerList');
                options.previousModels = _(layerList.models).clone();
                options.parent = this;
                options.sort = false;
                var result = layerList.reset(layers, options);
                this.rearrangeLayers_(layerList, options);
                return result;
            },

            sort: function(options) {
                options = options || {};
                var layerList = this.get('layerList');
                options.previousModels = _(layerList.models).clone();
                options.parent = this;
                var result = layerList.sort(options);
                this.rearrangeLayers_(layerList, options);
                return result;
            },

            find: function(criteria) {
                return this.get('layerList').findWhere(criteria);
            },

            findAll: function(criteria) {
                return this.get('layerList').where(criteria);
            },

            cleanEmptyLayers: function() {
                var layers = this.get('layerList').filter(function(layer) {
                    return layer.isEmpty();
                });
                this.get('layerList').remove(layers);
            },

            /* private methods */

            rearrangeLayers_: function(layerList, options) {
                var previousModels = options && options.previousModels,
                    toBeRemoved = _(previousModels).difference(layerList.models);

                _(toBeRemoved).forEach(function(layer) {
                    layer.svgAccessor().remove();
                });
                layerList.forEach(function(layer) {
                    // Clear `removed` flag set by Snap.svg after elements were 
                    // removed from container so they can be appended to container
                    // again.
                    layer.svgAccessor().removed = false;
                    layer.svgAccessor().appendTo(this.svgAccessor());
                }, this);
                layerList.trigger('rearrange', layerList, options);
            },

        });
        return Canvas;
    });