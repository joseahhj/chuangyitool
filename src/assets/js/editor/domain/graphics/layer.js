/**
 * @fileoverview
 *     
 */
'use strict';

define(['underscore', './svgmodel', 'text!data/xml/layer.xml'],
        function(_, SvgModel, layerTemplate) {
	
	/**
	 * A Layer object consists of a number (currently 1) of Elements. It is the 
	 * basic stackable unit in Canvas. 
	 * 
	 * @constructor
	 */
	var Layer = SvgModel.extend({
	    
	    svgTemplate: layerTemplate,
	    
		defaults: {
		    type: layerTemplate,
	        groupId:    null,
			visible:	true,
			locked:		false,
			selected:	false,
			opacity: 1.0,
			transform: 'matrix(1,0,0,1,0,0)',
	        index:  NaN,
		},
		
		validate: function(attributes, options) {
		    if (attributes.locked) {
		        return 'layer is locked';
		    }
		},
		
		syncToSvg: function() {
		    var attributes = this.toJSON();
	        attributes.type
                && this.svgAccessor().attr('editor:type', attributes.type);
		    attributes.groupId
		        && this.svgAccessor().attr('id', attributes.groupId);
		    this.svgAccessor().toggleClass('hidden', !attributes.visible);
            this.svgAccessor().toggleClass('locked', attributes.locked);
            this.svgAccessor().toggleClass('selected', attributes.selected);
		    (typeof attributes.opacity === 'number' && !isNaN(attributes.opacity))
		        && this.svgAccessor().attr('opacity', attributes.opacity);
		    attributes.transform 
                && this.svgAccessor().attr('transform', attributes.transform);
		},
		
	    isEmpty: function() {
	        return false;
	    },
	});
	return Layer;
});