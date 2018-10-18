/**
 * 
 */
define(['jquery', 'underscore'],
        function($, _) {
	
	var ExternalDataLoader = { };
	ExternalDataLoader.load = function(url, parser, imgUrl) { 
		
	    var defer = $.Deferred();
	    defer.resolve(parser.parse(url, {templateUrl: '',imgUrl:imgUrl})); 	    
		return defer;
	};	
	return ExternalDataLoader;
});
