'use strict';

define(['underscore', 'backbone', 'snap.svg'],
        function(_, Backbone, Snap) {

    var SvgModel = Backbone.Model.extend({
        
        svgTemplate: null,
        
        initialize: function(attributes, options) {            
            var svgNode = options && options.svgNode;
            if (svgNode && typeof svgNode.tagName === 'string') {
                // Creates from given svg element
                this.svgAccessor_ = Snap(options.svgNode);
            } else {
                // Creates from template
                if (!this.svgTemplate) {
                    throw 'SVG template is empty';
                }
                var fragment = Snap.parse(this.svgTemplate);
                if (fragment.node.tagName !== 'svg' && !fragment.select('*')) {
                    throw 'Failed to create svg node from template';
                } else if (fragment.node.tagName === 'svg') {
                    this.svgAccessor_ = Snap(fragment.node);
                } else {
                    this.svgAccessor_ = fragment.select('*');
                }
            }
            this.svgNode_ = this.svgAccessor_.node;
            
            //this.syncToSvg();
            this.on('change', this.syncToSvg);
        },
        
        svgAccessor: function(selector) {
            if (typeof selector === 'string') {
                return this.svgAccessor_.select(selector);
            }
            return this.svgAccessor_;
        },
        
        syncToSvg: function() {
            throw 'Not implemented!';
        },
        
        clone: function() {
            var copy = Backbone.Model.prototype.clone.apply(this, arguments);
            copy.svgTemplate = this.svgTemplate;
            copy.svgNode_ = this.svgNode_ && this.svgNode_.cloneNode(true);
            copy.svgAccessor_ = copy.svgNode_ && Snap(copy.svgNode_);
            return copy;
        },
    });

    return SvgModel;
});