/**
 * 
 */
define(['jquery', 'jquery-ui'], function(jQuery) {
(function($) {
    
    /**
     * 
     */
    $.widget('mediaeditor.BaseWidget', {
        _create: function() {
            this.element.disableSelection();
        },
        
        _setOptions: function() {
            this._superApply(arguments);
            this._ui_refresh();
        },
        
        _setOption: function(key, value) {
            this._superApply(arguments);
            this._ui_refresh();
        },
        
        _ui_refresh: function() {
            throw 'Not implemented!';
        },
        
        _destroy: function() {
            this.element.enableSelection();
        },
    });
    
    /**
     * 
     */
    $.widget('mediaeditor.ToggleButton', $.mediaeditor.BaseWidget, {
        options: {
            value: null,
        },
        
        _create: function() {
            this._superApply(arguments);
            
            var self = this;
            this.element.on('click', function(event) {
                if (self.options.disabled) return false;
                
                var dataValue = self.element.data('value');
                if (self.options.value === dataValue) {
                    self._setOption('value', null);
                } else {
                    self._setOption('value', dataValue);
                }
                self.element.change();
            });
        },
        
        _ui_refresh: function() {
            var dataValue = this.element.data('value');
            this.element.toggleClass('selected', (this.options.value === dataValue));
        },
        
        _destroy: function() {
            this.element.off();
            this._superApply(arguments);
        },
    });
    
    /**
     * TODO
     */
    $.widget('mediaeditor.RadioButton', $.mediaeditor.BaseWidget, {
        options: {
            value: null,
        },
        
        _create: function() {
            this._superApply(arguments);
            
            var self = this;
            this.options.value = this.element.data('value');
            this.element.on('click', function(event) {
                self._ui_refresh();
                self.element.change();
            });
        },
        
        _ui_refresh: function() {
            if (!this.element.parent()) {
                throw 'dangling RadioButton';
            }
            
            var self = this;
            var dataGroup = this.element.data('group');
            this.element.parent().find('[data-group="' + dataGroup + '"]').each(function(el, index) {
                
            });
        },
        
        _destroy: function() {
            this._superApply(arguments);
        },
    });
    
    /**
     * 
     */
    $.widget('mediaeditor.DropDownList', $.mediaeditor.BaseWidget, {
        options: {
            value: null,
        },
        
        _create: function() {
            this._superApply(arguments);
            
            var self = this;
            this.element.on('click', '.select', function(event) {
                if (self.options.disabled) return false;
                
                $(this).addClass('focus');
                event.stopPropagation();
            }).on('click', '.select-option', function(event) {
                var oldValue = self.options.value;
                self._setOption('value', $(this).data('value'));
                self.element.find('.select').removeClass('focus');
                var newValue = self.options.value;
                if (oldValue !== newValue) {
                    self.element.change();
                }
                event.stopPropagation();
            }).on('mouseup', '.select-down', function(event) {
                event.stopPropagation();
            });
        },
        
        _ui_refresh: function() {
            var value = this.options.value;
            this.element.find('.select-option').removeAttr('selected');
            var option = this.element.find('.select-option[data-value="' + value + '"]');
            option.attr('selected', '');
            this.element.find('.select-selected').attr('data-value', value).html(option.html());
        },
        
        _destroy: function() {
            this.element.find('.select,.select-down,.select-option').off();
            this._superApply(arguments);
        },
    });
    
    $.widget('mediaeditor.DropDownSlider', $.mediaeditor.BaseWidget, {
        options: {
            value: null,
            min: 0,
            max: 100,
            step: 1,
        },

        _create: function() {
            this._superApply(arguments);
            var self = this;
            
            // drop down
            this.element.on('click', '.select', function(event) {
                if (self.options.disabled) return false;
                
                $(this).addClass('focus');
                // align slider's position
                var sliderWidth = $(this).find('+').innerWidth(),
                    distanceToLeft = $(this).innerWidth() - 10;
                var value = self.options.value || self.options.min,
                    min = self.options.min,
                    max = self.options.max,
                    mid = (max - min) / 2 + min;
                var marginLeft = -1 * sliderWidth * (value - min) / (max - min) + 20 * (value - mid) / (max - min) + distanceToLeft;
                $(this).find('+').css('margin-left', marginLeft);
                event.stopPropagation();
            });
            
            // slider
            var getValue = function(marginToLeft, parentWidth, min, max) {
                return value = (marginToLeft / parentWidth) * (max - min) + min;
            };
            this.element.find('.select-range-control').draggable({
                containment: 'parent',
                axis: 'x',
                drag: function(event) {
                    var min = self.options.min,
                        max = self.options.max,
                        step = self.options.step,
                        parentWidth = $(this).parent().innerWidth(),
                        marginToLeft = $(this).position().left;
                    var value = self._constrain(getValue(marginToLeft, parentWidth, min, max), min, max, step);
                    self.element.find('.select-selected .value').text(value);
                },
                stop: function(event) {
                    var min = self.options.min,
                        max = self.options.max,
                        parentWidth = $(this).parent().innerWidth(),
                        marginToLeft = $(this).position().left;
                    var oldValue = self.options.value;
                        newValue = getValue(marginToLeft, parentWidth, min, max);
                    self._setOption('value', newValue);
                    newValue = self.options.value;
                    if (oldValue !== newValue) {
                        self.element.change();
                    }
                },
            }).on('click', function(event) { event.stopPropagation(); });
            
            this.element.on('click', '.select-range-bg', function(event) {
                $(this).find('.select-range-control').css('left', (event.clientX - $(event.target).offset().left));
                var min = self.options.min,
                    max = self.options.max,
                    parentWidth = $(this).innerWidth(),
                    marginToLeft = $(this).find('.select-range-control').position().left;
                var oldValue = self.options.value;
                    newValue = getValue(marginToLeft, parentWidth, min, max);
                self._setOption('value', newValue);
                newValue = self.options.value;
                if (oldValue !== newValue) {
                    self.element.change();
                }
                event.stopPropagation();
            });//.on('mouseup', '.select-range-bg', function(event) { event.stopPropagation(); });
        },
        
        _setOptions: function(options) {
            var min = (typeof options.min === 'number' ? options.min : this.options.min),
                max = (typeof options.max === 'number' ? options.max : this.options.max),
                step = (typeof options.step === 'number' ? options.step : this.options.step);
            
            options.value = this._constrain(options.value, min, max, step);
            this._super(options);
        },
        
        _constrain: function(input, min, max, step) {
            if (typeof input !== 'number' || isNaN(input)) {
                input = this.options.value;
            } else if (input < min) {
                input = min;
            } else if (input > max) {
                input = max;
            }
            input = Math.round(input / step) * step;
            return input;
        },
        
        _setOption: function(key, value) {
            if (key === 'value') {
                value = this._constrain(value, this.options.min, this.options.max, this.options.step);
            }
            this._super(key, value);
        },
        
        _ui_refresh: function() {
            var value = this.options.value,
                min = this.options.min,
                max = this.options.max;
            this.element.find('.select-selected .value').text(value);
            this.element.find('.select-range-control').css('left', ((value - min) / (max - min) * 100) + '%');
        },
        
        _destroy: function() {
            this.element.find('.select-range-control').draggable('destroy');
            this._superApply(arguments);
        },
    });
    
    $(document).on('click', function(event) { $('.select.focus').removeClass('focus'); });
    
})(jQuery);
});