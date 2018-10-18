
function PlaceholderHelper()
{
}


PlaceholderHelper.prototype.settings = {
	color : "rgb(169,169,169)", // darkGrey does not work in ie
	dataName : "original-font-color" // the name of the data tag used by this module
};
		
PlaceholderHelper.prototype.isPlaceHolderSupport = function() {
	return 'placeholder' in document.createElement('input');
}
		
		// -- Bind event to components --
PlaceholderHelper.prototype.init = function(target, settings){
			
	if(null == target || PlaceholderHelper.isPlaceHolderSupport()) {
		return;
	}
	
	// Merge default settings with the ones provided
	if(settings)
	{
		$.extend(PlaceholderHelper.settings, settings);
	}
	
	// -- Util Methods --	
	var getContent = function(element){
		return $(element).val();		
	};

	var setContent = function(element, content){
		$(element).val(content);		
	};
	
	var getPlaceholder = function(element){
		return $(element).attr("placeholder");
	};
	
	var isContentEmpty = function(element){
		var content = getContent(element);
		return (content.length === 0) || content == getPlaceholder(element);
	};
		
	var setPlaceholderStyle = function(element){
		$(element).data(PlaceholderHelper.settings.dataName, $(element).css("color"));
		$(element).css("color", PlaceholderHelper.settings.color);		
	};
	
	var clearPlaceholderStyle = function(element){
		$(element).css("color", $(element).data(PlaceholderHelper.settings.dataName));		
		$(element).removeData(PlaceholderHelper.settings.dataName);
	};
	
	var showPlaceholder = function(element){
		setContent(element, getPlaceholder(element));
		setPlaceholderStyle(element);	
	};
	
	var hidePlaceholder = function(element){
		if($(element).data(PlaceholderHelper.settings.dataName)){
			setContent(element, "");
			clearPlaceholderStyle(element);
		}
	};
	
	// -- Event Handlers --
	var inputFocused = function(){
		if(isContentEmpty(this)){
			hidePlaceholder(this);		
		}
	};
	
	var inputBlurred = function(){
		if(isContentEmpty(this)){
			showPlaceholder(this);
		}
	};
	
	var parentFormSubmitted = function(){
		if(isContentEmpty(this)){
			hidePlaceholder(this);		
		}	
	};
	
	// -- Execution --
	if($(target).attr("placeholder")){
		$(target).focus(inputFocused);
		$(target).blur(inputBlurred);
		$(target).bind("parentformsubmitted", parentFormSubmitted);
		
		// triggers show place holder on module init
		//$(target).trigger("blur");
		if(isContentEmpty(target)){
			showPlaceholder(target);
		}
		
		
		// triggers form submitted event on parent form submit
		$(target).parents("form").submit(function(){
			$(target).trigger("parentformsubmitted");
		});
	}
	
	return;
}
        
// When form is submitted by JS, call this before submit to avoid submitting the PlaceholderHelper value
PlaceholderHelper.prototype.cleanBeforeSubmit = function(target){
    // Choose all forms if not given
	if(null == target || PlaceholderHelper.isPlaceHolderSupport()) {
       return;
    }
    
    // Triggering this event will do the necessary cleanup
    $(target).trigger("parentformsubmitted");
    
    return;
}
	

var PlaceholderHelper = new PlaceholderHelper();
