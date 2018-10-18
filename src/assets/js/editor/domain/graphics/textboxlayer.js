/**
 * 
 */
'use strict';

define(['underscore', './layer', 'text!data/xml/textbox.xml'],
        function(_, Layer, textBoxTemplate) {
    
    /**
     * This class defines attributes for textual content.
     * 
     * @constructor
     */
    var TextBoxLayer = Layer.extend({
        
        svgTemplate: textBoxTemplate,
        
        defaults: {
            type: 'TextBox',
            text: ['请输入文字...'],
            fill: '#000000',
            fontFamily: '宋体',
            fontSize: 16,
            fontWeight: 'normal',
            fontStyle: 'normal',
            lineHeight: 1.2,
            textAnchor: 'start', // [start|middle|end]
            writingMode: 'lr', // [lr|rl|tb]
            x: 0,
            y: 0,
        },
        
        syncToSvg: function() {
            Layer.prototype.syncToSvg.apply(this, arguments);            
            var attributes = this.toJSON();           
            
            attributes.text
                && this.svgAccessor('text').attr('text', attributes.text);
            attributes.fill
                && this.svgAccessor('text').attr('fill', attributes.fill);
            attributes.fontFamily
                && this.svgAccessor('text').attr('font-family', attributes.fontFamily);
            attributes.fontWeight
                && this.svgAccessor('text').attr('font-weight', attributes.fontWeight);
            attributes.fontStyle
                && this.svgAccessor('text').attr('font-style', attributes.fontStyle);
            attributes.fontSize
                && this.svgAccessor('text').attr('font-size', attributes.fontSize);
            attributes.textAnchor
                && this.svgAccessor('text').attr('text-anchor', attributes.textAnchor);
            this.svgAccessor('text').attr('x', attributes.x);
            this.svgAccessor('text').attr('y', attributes.y);
            if(this.svgAccessor('text').getBBox().width>0){
               this.svgAccessor('text').attr('textLength', this.svgAccessor('text').getBBox().width);
            }else{
                 this.svgAccessor('text').attr('textLength','');
            }
            //console.log(this.svgAccessor('text'))
            attributes.lineHeight
                && this.svgAccessor('text').attr('line-height', attributes.lineHeight);            
            // tune text tspans
            var tspans = this.svgAccessor().selectAll('tspan');
            for (var i = 0; i < tspans.length; i++) {
                i > 0 && tspans[i].attr('dy', (attributes.fontSize * attributes.lineHeight) + 'px');
                tspans[i].attr('x', attributes.x);
            }
            
        },
        
        isEmpty: function() {
            return !this.has('text') || /^\s*$/.test(this.get('text'));
        },
    });
    
    _(TextBoxLayer.prototype.defaults).extend(_(Layer.prototype.defaults).omit('type'));

    return TextBoxLayer;
});