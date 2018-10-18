/**
 * @fileoverview Definition of basic editable units
 */
'use strict';

define(['./layer', './textboxlayer', './imagelayer'],
         function(Layer, TextBoxLayer, ImageLayer) {

    var LayerFactory = {};

    var LAYER_CONSTRUCTOR_MAP = LayerFactory.LAYER_CONSTRUCTOR_MAP = {
        'TextBox': TextBoxLayer,
        'Image': ImageLayer,              
    }

    var create = LayerFactory.create = function(type, data, options) {        
        var constructor = LAYER_CONSTRUCTOR_MAP[type] || Layer;
        return new constructor(data, options);
    };    
    return LayerFactory;
});