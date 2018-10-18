'use strict';

define(['underscore', 'backbone'],
        function(_, Backbone) {
    
    /* Import JavaScript routers */
    
    var CreativeWork = Backbone.Model.extend({        
        defaults: {
            id: null,
            size:0,            
            svgInfo: null,
            picUrl: null,
            templateId: null,            
            createTime:NaN,           
            modifyTime:NaN,
            sourceId:0,
            yn:1,
            canvas: null,
            disabled:true,
            
        },
        
        initialize: function(attributes, options) {
            this.on('change:modifyTime change:canvas', function() {
                var canvas = this.get('canvas'),
                    modifyTime = this.get('modifyTime');
                canvas && canvas.set('lastModifiedTime', modifyTime);
            });
            this.size = this.get('size').split('*');
        },
        
        syncFile: function() {
            // if (this.get('svgInfo') && this.isCanvasModified()) {
            //     return null;
            // }            
            this.get('canvas').cleanEmptyLayers();
            this.set({'svgInfo':this.get('canvas').svgAccessor().outerSVG()});        
            return this
        },
        removeDot:function(){
            this.unset('disabled');

        },
        isCanvasModified: function() {
            var canvas = this.get('canvas');            
            if (!canvas) {
                return false;
            }
            return this.get('modifyTime') == canvas.get('lastModifiedTime');
        },
    });
    
    return CreativeWork;
});