define(['jquery', 'underscore', 'backbone', 'snap.svg',
        './CanvasItemView'
    ],
    function($, _, Backbone, Snap,
        CanvasItemView) {

        var URL_PATTERN = /url\((.*)\)/;

        /**
         * This class represents the view of Canvas.
         * 
         */
        var CanvasView = Backbone.View.extend({
            initialize: function() {
                this.controls_ = [];
                if (!this.svgAccessor_) {
                    this.svgAccessor_ = Snap(this.$('svg.drawingboard')[0]);
                }
                $(window).resize(this, this.onWindowResize);
            },
            svgAccessor: function(selector) {
                if (typeof selector === 'string') {
                    return this.svgAccessor_.select(selector);
                }
                return this.svgAccessor_;
            },

            setModel: function(newModel) {
                if (this.model) {

                    this.model.svgAccessor().remove();
                    this.stopListening(this.model);
                }
                if (!newModel) { return; }

                var self = this;
                this.model = newModel;

                // attach new canvas SVG to this view
                this.svgAccessor('.canvas').append(this.model.svgAccessor());

                this.adaptToParent().atCenter();
                this.listenTo(this.model, {
                    'change:layerList': this.render,
                    'layers:rearrange': this.resetControls_,
                });

                this.model.sort();
            },
            onWindowResize: function(event) {
                (event.data).adaptToParent().atCenter();
            },
            resetControls_: function(layers) {
                // whatever it works!
                var self = this;
                _(this.controls_).forEach(function(control) {
                    control.remove();
                });
                self.controls_ = [];
                layers.forEach(function(layer) {
                    if (layer.get('groupId') === 'background') {
                        return;
                    }
                    var control = new CanvasItemView({ model: layer, parent: self.svgAccessor('.transform-controls') });
                    self.controls_.push(control);
                });
                _(this.controls_).forEach(function(child) {
                    self.svgAccessor('.transform-controls').append(child.control_.el);
                    child.render();
                });
            },
            adaptToParent: function() {
                var $container = this.$el || $(window);
                var innerHeight = this.svgAccessor('.canvas svg').attr('height');

                if ($container) {
                    var w = $container.width(),
                        h = parseInt($(window).height() - $container.offset().top - 4),
                        lastH = innerHeight > h ? (Number(innerHeight) + 60) : h;
                    change = {
                        width: w,
                        height: lastH,
                        viewBox: {
                            x: 0,
                            y: 0,
                            width: w,
                            height: lastH,
                        },
                    };
                    this.svgAccessor().attr(change);
                }
                return this;
            },
            atCenter: function() {
                if (!this.svgAccessor('.canvas svg')) {
                    return this;
                };
                this.svgAccessor('.canvas svg').attr({ 'overflow': 'visible', });
                var outerWidth = parseFloat(this.svgAccessor().attr('width')) || 0,
                    outerHeight = parseFloat(this.svgAccessor().attr('height')) || 0,
                    innerBox = this.svgAccessor('.canvas svg').attr('viewBox');
                var delta = Snap.matrix().translate(innerBox.x, innerBox.y);
                var innerWidth = this.svgAccessor('.canvas svg').attr('width');
                var innerHeight = this.svgAccessor('.canvas svg').attr('height');
                this.svgAccessor('.canvas').transform(delta);
                this.svgAccessor('.background>rect').attr({ 'height': innerHeight })
                var offset = {
                        dx: innerBox.cx - outerWidth / 2,
                        dy: innerBox.cy - outerHeight / 2,
                    },
                    viewBox = {};
                if (outerWidth <= innerWidth) {
                    outerWidth = innerWidth;
                    offset['dx'] = 0;

                }
                viewBox = {
                    x: offset.dx,
                    y: offset.dy,
                    width: outerWidth,
                    height: outerHeight,
                };
                this.svgAccessor().attr('viewBox', viewBox);
                var outerBox = this.svgAccessor().attr('viewBox'),
                    template = 'M{outer.x},{outer.y}h{outer.width}v{outer.height}h-{outer.width}z' +
                    'M{inner.x},{inner.y}v{inner.height}h{inner.width}v-{inner.height}z',
                    path = Snap.format(template, { outer: outerBox, inner: innerBox });

                this.svgAccessor('.view-rectangle').attr('d', path);
                var h = $('.editeMain').height();
                $('.sizeBox').height(h);
                return this;
            },
            render: function() {
                this.svgAccessor('.canvas').append(this.model.svgAccessor());
                var width = this.svgAccessor('.canvas svg').attr('width')
                $('#svgInnerBg rect').attr('width', width)
                this.adaptToParent().atCenter();
                _(this.controls_).forEach(function(control) {
                    control.render();
                });
                var path = this.setupOutline(this.svgAccessor('#svgInnerBg')).attr('path')
                this.svgAccessor('.view-border').attr('d', path);
                return this;
            },
            remove: function() {
                _(this.controls_).forEach(function(control) {
                    control.remove();
                });
                this.controls_ = [];
                $(window).off('resize', this.onWindowResize);
                Backbone.View.prototype.remove.apply(this, arguments);
            },
            setupOutline: function(outline) {
                var bbox = outline.getBBox(true),
                    matrix = outline.transform().localMatrix;
                this.TL = [matrix.x(bbox.x, bbox.y), matrix.y(bbox.x, bbox.y)];
                this.TM = [matrix.x(bbox.cx, bbox.y), matrix.y(bbox.cx, bbox.y)];
                this.TR = [matrix.x(bbox.x2, bbox.y), matrix.y(bbox.x2, bbox.y)];
                this.ML = [matrix.x(bbox.x, bbox.cy), matrix.y(bbox.x, bbox.cy)];
                this.MR = [matrix.x(bbox.x2, bbox.cy), matrix.y(bbox.x2, bbox.cy)];
                this.BL = [matrix.x(bbox.x, bbox.y2), matrix.y(bbox.x, bbox.y2)];
                this.BM = [matrix.x(bbox.cx, bbox.y2), matrix.y(bbox.cx, bbox.y2)];
                this.BR = [matrix.x(bbox.x2, bbox.y2), matrix.y(bbox.x2, bbox.y2)];
                outline.update = function(positions) {
                    var pathString = _(positions).reduce(function(memo, p) {
                        return memo + p[0] + ',' + p[1] + 'L';
                    }, 'M', this);
                    pathString = pathString.substring(0, pathString.length - 1) + 'Z';
                    this.attr({ 'path': pathString });
                };
                outline.update(_(['TM', 'TR', 'MR', 'BR', 'BM', 'BL', 'ML', 'TL', 'TM']).map(function(key) {
                    return this[key]
                }, this));
                return outline;
            }
        });

        return CanvasView;
    });