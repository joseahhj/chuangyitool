/**
 * 
 */
'use strict';

define(['snap.svg', './layer', 'text!data/xml/background.xml'],
        function(Snap, Layer, backgroundTemplate) {

    var BackgroundLayer = Layer.extend({
        
        svgTemplate: backgroundTemplate,
        
        defaults: {
            type: 'Background',
            fill: '#eee',
            groupId: 'background',
        },
        
        syncToSvg: function() {
            Layer.prototype.syncToSvg.apply(this, arguments); 
            var attributes = this.toJSON();            
            // if (Snap.color(attributes.fill).error) {
            //     this.svgAccessor('image').attr({
            //         'xlink:href': attributes.fill,
            //         'display': 'inline',
            //     })
            //     this.svgAccessor('rect').attr({
            //         'display': 'none',
            //     });
            // } else {
                this.svgAccessor('rect').attr({
                    'fill': attributes.fill,
                    'display': 'inline',
                });
                // this.svgAccessor('image').attr({
                //     'display': 'none',
                // });
            //}
            
            var viewBox = this.svgAccessor().parent().attr('viewBox');
            if (viewBox) {
                this.svgAccessor('rect').attr({x: viewBox.x, y: viewBox.y});
                //this.svgAccessor('image').attr({x: viewBox.x, y: viewBox.y});
            }
        },
    });
    
    _(BackgroundLayer.prototype.defaults)
        .extend(_(Layer.prototype.defaults)
                .omit(_(BackgroundLayer.prototype.defaults).keys()));

    return BackgroundLayer;
});