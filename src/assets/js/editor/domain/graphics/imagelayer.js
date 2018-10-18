/**
 * 
 */
'use strict';

define(['underscore', './layer', 'text!data/xml/image.xml'],
        function(_, Layer, imageTemplate) {

    /**
     * This class defines attributes for image displaying.
     * 
     * @constructor
     */
    var ImageLayer = Layer.extend({
        
        svgTemplate: imageTemplate,
        
        defaults: {
            type: 'Image',
            width: 100,
            height: 75,
            xlinkHref: '',
            x: 0,
            y: 0,
        },
        
        syncToSvg: function() {

            Layer.prototype.syncToSvg.apply(this, arguments);
            
            var attributes = this.toJSON();            
            (attributes.width >= 0.0) && this.svgAccessor('image').attr('width', attributes.width);
            (attributes.height >= 0.0) && this.svgAccessor('image').attr('height', attributes.height);
            !isNaN(attributes.x) && this.svgAccessor('image').attr('x', attributes.x);
            !isNaN(attributes.y) && this.svgAccessor('image').attr('y', attributes.y);
            if (attributes.xlinkHref !== this.svgAccessor('image').attr('xlink:href')) {
                this.svgAccessor('image').attr('xlink:href', attributes.xlinkHref);
            }
        },
        
        isEmpty: function() {
            return !this.has('xlinkHref') || /^\s*$/.test(this.get('xlinkHref'));
        },
    });
    
    _(ImageLayer.prototype.defaults).extend(_(Layer.prototype.defaults).omit('type'));

    return ImageLayer;
});