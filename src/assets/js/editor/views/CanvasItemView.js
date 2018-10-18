/**
 * 
 */
define(['backbone', '../utils/helper',
        './transformcontrol'],
        function(Backbone, Helper, 
                 TransformControl) {

    /**
     * This class defines a basic view to display BaseItem.
     * 
     * @constructor
     */
    var CanvasItemView = Backbone.View.extend({

        initialize: function(options) {
            
            this.control_ = new TransformControl(this.model.svgAccessor(), options.parent);

            this.listenTo(this.model, 'change', this.render);
            this.listenToOnce(this.model, 'remove', this.remove);

            this.bindEvents();
        },

        __whenEditable: function(handler) {
            return function(var_args) {
                !this.model.get('locked')
                    && this.model.get('groupId') !== 'background'
                    && handler.apply(this, arguments);
            };
        },

        bindEvents: function() {
            // this.listenTo(this.control_, 'select', function() {
            //     this.model.set({selected: true});
            // });
            this.listenTo(this.control_, 'select',  this.__whenEditable(function(delta) {
                this.model.set({selected: true});
            }));
            this.listenTo(this.control_, 'translateMove rotateMove scaleMove',
                    this.__whenEditable(function(delta) {
                        var init = Helper.parseMatrix(this.model.get('transform'));
                        var matrix = init;
                        matrix = delta[0] && delta[0].add(matrix);
                        matrix = delta[1] && matrix.add(delta[1]);
                        this.model.svgAccessor().transform(matrix);
                        this.control_.render(true);
                    }));

            this.listenTo(this.control_, 'translateEnd rotateEnd scaleEnd', this
                    .__whenEditable(function(delta) {
                        var endState = this.model.svgAccessor().transform()
                            .localMatrix.toString();
                        this.updateModel({'transform': endState});
                    }));
        },

        unbindEvents: function() {
            this.stopListening(this.control_);
        },
        
        updateModel: function(changedAttributes) {
            this.model.set(changedAttributes, {validate: true, revocable: true});
        },

        render: function() {
            var visible = this.model.get('visible');
            var selected = this.model.get('selected');
            this.model.syncToSvg();
            this.control_.render(visible && selected);
            this.control_.svgAccessor().toggleClass('grouped', this.model.has('groupId'));
            return this;
        },

        remove: function() {
            this.unbindEvents();
            this.control_.dispose();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return CanvasItemView;
})