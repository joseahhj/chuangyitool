define(['underscore', 'backbone', 'snap.svg'],
        function(_, Backbone, Snap) {
    
    var Helper = {};
    
    var MATRIX_PATTERN = /^matrix\(([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^\)]*)\)$/;
    
    /**
     * 
     */
    var parseMatrix = Helper.parseMatrix = function(matrixString) {
        var values = [1, 0, 0, 1, 0, 0]; // identity matrix
        if (typeof matrixString === 'string') {
            var result = matrixString.match(MATRIX_PATTERN);
            result && (values = result.slice(1,7));
        }
        return new Snap.Matrix(values[0], values[1], values[2], values[3], values[4], values[5]);
    };
    
    /**
     *         
     * 
     */
    var translateLayers = Helper.translateLayers = function(layers, dx, dy, options) {
        _(layers).forEach(function(layer) {
            var I = parseMatrix('matrix(1,0,0,1,0,0)'),
                matrix = parseMatrix(layer.get('transform'));
            layer.set({'transform': I.translate(dx, dy).add(matrix).toString()}, options);
        });
    };
    
    /*
     * Simple implementation to generate a pseudo unique ID.
     * See:
     * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
     */
    var pseudoUuid = Helper.pseudoUuid = function() {
        var delimiter = '-';
        var s4 = function() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return (s4() + s4() + delimiter + s4() + delimiter + s4()
                + delimiter + s4() + delimiter + s4() + s4() + s4());
    };
    
    /**
     * 
     */
    var eventReporter = Helper.eventReporter = function(namespace, context) {
        return function(var_args) {
            var eventName = arguments[0],
                options = arguments[arguments.length - 1],
                forward = options && options.forward,
                args = Array.prototype.slice.call(arguments, 1);
            args.unshift(namespace + ':' + eventName);
            Backbone.Events.trigger.apply(context, args);
        };
    };
    
    return Helper;
});