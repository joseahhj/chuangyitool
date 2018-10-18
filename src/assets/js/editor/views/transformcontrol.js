/**
 * 
 */
define(['underscore', 'backbone', 'snap.svg', 'text!data/xml/transformbox.xml'],
    function(_, Backbone, Snap, transformBoxTemplate) {

        var setupControlDot = function(dot, xTag, yTag) {
            dot.position = function(pair) {
                if (_(pair).isArray() && pair.length === 2) {
                    this.attr(xTag, pair[0]);
                    this.attr(yTag, pair[1]);
                }
                return [parseFloat(this.attr(xTag)), parseFloat(this.attr(yTag))];
            };
            return dot;
        };

        var setupOutline = function(outline) {
            outline.update = function(positions) {
                var pathString = _(positions).reduce(function(memo, p) {
                    return memo + p[0] + ',' + p[1] + 'L';
                }, 'M', this);
                pathString = pathString.substring(0, pathString.length - 1) + 'Z';
                this.attr({ 'path': pathString });
            };
            return outline;
        };

        var setupAntenna = function(antenna) {
            antenna.update = function(position1, position2) {
                this.attr({ x1: position1[0], y1: position1[1], x2: position2[0], y2: position2[1] });
            };
            return antenna;
        };

        var degAngleFrom = function($v1, $v2) {
            var deg = $v1.angleFrom($v2) * 180 / Math.PI;
            if ($v1.to3D().cross($v2.to3D()).e(3) > 0) {
                deg = 360 - deg;
            }
            return deg;
        };

        /**
         * Dictionary to look up the opposite handle's name
         */
        var OPPOSITE = {
            'TL': 'BR',
            'TM': 'BM',
            'TR': 'BL',
            'MR': 'ML',
            'BR': 'TL',
            'BM': 'TM',
            'BL': 'TR',
            'ML': 'MR'
        };

        function leftKey(mouseEventHandler, context) {
            return function(event) {
                if (event.which === 1 && _.isFunction(mouseEventHandler)) {
                    mouseEventHandler.apply(context, arguments);
                    event.stopPropagation();
                } else {
                    return true;
                }
            };
        };

        // Snap.svg's dragging handler is weird, poorly documented :-p
        function leftKeyDrag(mouseEventHandler, context) {
            return function() {
                var event = arguments[arguments.length - 1];
                if (event.which === 1 && _.isFunction(mouseEventHandler)) {
                    mouseEventHandler.apply(context, arguments);
                    event.stopPropagation();
                } else {
                    return true;
                }
            };
        };

        var I = function() {
            return new Snap.Matrix(1, 0, 0, 1, 0, 0);
        };

        /**
         * This class represents the transforming handle box of a graphic object.
         * 
         *                  rotate(TOP)
         *                     o
         *                     |scale(TM)
         *  scale(TL) +--------+--------+ scale(TR)
         *            |                 |
         * scale(ML)  +    translate    +  scale(MR)
         *            |                 |
         *  scale(BL) +--------+--------+ scale(BR)
         *                  scale(BM)
         *
         */
        var TransformControl = function(subject, parent) {
            if (!transformBoxTemplate) {
                throw 'TransformBox template is empty';
            }

            var fragment = Snap.parse(transformBoxTemplate);
            this.svgAccessor_ = fragment.select('*');
            if (!this.svgAccessor_) {
                throw 'Not a valid template';
            }
            this.svgAccessor_.appendTo(parent);

            this.OUTLINE = this.svgAccessor('.translate');
            setupOutline(this.OUTLINE);
            this.TOP = this.svgAccessor('.rotate');
            setupControlDot(this.TOP, 'cx', 'cy');
            this.ANTENNA = this.svgAccessor('.antenna');
            setupAntenna(this.ANTENNA);
            _(['TM', 'TR', 'MR', 'BR', 'BM', 'BL', 'ML', 'TL']).forEach(function(key) {
                this[key] = this.svgAccessor('.scale-' + key.toLowerCase());
                setupControlDot(this[key], 'x', 'y');
            }, this);

            _(this).extend(Backbone.Events);
            this.__bindEvents();

            this.subject_ = subject;
        };

        TransformControl.prototype.svgAccessor = function(selector) {
            if (typeof selector === 'string') {
                return this.svgAccessor_.select(selector);
            }
            return this.svgAccessor_;
        };

        TransformControl.prototype.reset = function(showOrHide) {
            this.render(showOrHide);
        };

        TransformControl.prototype.render = function(showOrHide) {
            var bbox = this.subject_.getBBox(true),
                matrix = this.subject_.transform().localMatrix;

            // update handles' position
            this.TL.position([matrix.x(bbox.x, bbox.y), matrix.y(bbox.x, bbox.y)]);
            this.TM.position([matrix.x(bbox.cx, bbox.y), matrix.y(bbox.cx, bbox.y)]);
            this.TR.position([matrix.x(bbox.x2, bbox.y), matrix.y(bbox.x2, bbox.y)]);
            this.ML.position([matrix.x(bbox.x, bbox.cy), matrix.y(bbox.x, bbox.cy)]);
            this.MR.position([matrix.x(bbox.x2, bbox.cy), matrix.y(bbox.x2, bbox.cy)]);
            this.BL.position([matrix.x(bbox.x, bbox.y2), matrix.y(bbox.x, bbox.y2)]);
            this.BM.position([matrix.x(bbox.cx, bbox.y2), matrix.y(bbox.cx, bbox.y2)]);
            this.BR.position([matrix.x(bbox.x2, bbox.y2), matrix.y(bbox.x2, bbox.y2)]);
            var vBM2TM = $V(this.TM.position()).subtract($V(this.BM.position())),
                v = ((vBM2TM.toUnitVector()).x(vBM2TM.modulus() + 25)).add($V(this.BM.position()));
            this.TOP.position([v.e(1), v.e(2)]);
            this.ANTENNA.update(this.TOP.position(), this.TM.position());

            // update outline position
            this.OUTLINE.update(_(['TM', 'TR', 'MR', 'BR', 'BM', 'BL', 'ML', 'TL', 'TM']).map(function(key) {
                return this[key].position();
            }, this));

            // update arrow styles
            var vB2TOP = $V(this.TOP.position()).subtract($V(this.BM.position())),
                vUp = $V([0, -1]),
                theta = degAngleFrom(vB2TOP, vUp),
                names = ['TM', 'TL', 'ML', 'BL', 'BM', 'BR', 'MR', 'TR'],
                d = Math.floor((theta + 22.5) / 45);
            names = names.slice(d).concat(names.slice(0, d));
            var arrowStyles = ['n-resize', 'nw-resize', 'w-resize', 'sw-resize', 's-resize', 'se-resize', 'e-resize', 'ne-resize'];
            _(names).each(function(key, i) {
                this[key].attr("cursor", showOrHide ? arrowStyles[i] : "auto");
            }, this);

            var topLeftPoint = {
                x: this.TR.position()[0],
                y: this.TR.position()[1],
            };
            this.svgAccessor('.groupTag').transform('translate(' + topLeftPoint.x + ',' + topLeftPoint.y + ') rotate(' + theta + ')');
            this.svgAccessor().toggleClass('selected', showOrHide);
        };

        TransformControl.prototype.__center = function() {
            var vC = ($V(this.TM.position()).add($V(this.BM.position()))).x(0.5);
            return [vC.e(1), vC.e(2)];
        };

        TransformControl.prototype.__bindEvents = function() {
            this.svgAccessor().mousedown(leftKey(function(event, x, y) {
                this.trigger('select');
            }, this));

            this.svgAccessor().drag(leftKeyDrag(function(dx, dy, x, y, event) { // dragging 
                this.delta = this.translate(dx, dy, event);
                this.trigger('translateMove', this.delta);
            }, this), leftKeyDrag(function(x, y, event) { // drag start
                this.delta = [I, I];
                this.lastState = { 'vCenter': $V(this.__center()), 'vStart': $V([x, y]) };
                this.trigger('translateStart', this.delta);
            }, this), leftKeyDrag(function(event) { // drag end
                this.trigger('translateEnd', this.delta);
            }, this));

            this.TOP.drag(leftKeyDrag(function(dx, dy, x, y, event) {
                this.delta = this.rotate(dx, dy, event);
                this.trigger('rotateMove', this.delta);
            }, this), leftKeyDrag(function(x, y, event) {
                this.delta = [I, I];
                this.lastState = {
                    'vCenter': $V(this.__center()),
                    'vStart': $V(this.TOP.position()),
                    'vBottom': $V(this.BM.position())
                };
                this.trigger('rotateStart', this.delta);
            }, this), leftKeyDrag(function(event) {
                this.trigger('rotateEnd', this.delta);
            }, this));

            _(['TM', 'TR', 'MR', 'BR', 'BM', 'BL', 'ML', 'TL']).forEach(function(key) {
                this[key].drag(leftKeyDrag(function(dx, dy, x, y, event) {
                    this.delta = this.scale(key, dx, dy, event);
                    this.trigger('scaleMove', this.delta);
                }, this), leftKeyDrag(function(x, y, event) {
                    this.delta = [I, I];
                    this.lastState = {
                        'vOpposite': $V(this[OPPOSITE[key]].position()),
                        'vStart': $V(this[key].position()),
                        'vCenter': $V(this.__center()),
                        'uHeight': $V(this.BM.position()).subtract($V(this.TM.position())).toUnitVector(),
                        'uWidth': $V(this.MR.position()).subtract($V(this.ML.position())).toUnitVector()
                    };
                    this.trigger('scaleStart', this.delta);
                }, this), leftKeyDrag(function(event) {
                    this.trigger('scaleEnd', this.delta);
                }, this));
            }, this);
        };

        TransformControl.prototype.__unbindEvents = function() {
            this.svgAccessor().unmousedown();
            _(['TM', 'TR', 'MR', 'BR', 'BM', 'BL', 'ML', 'TL', 'TOP']).forEach(function(key) {
                this[key].undrag();
            }, this);
        };

        TransformControl.prototype.translate = function(dx, dy, event) {
            // hold shift key to translate along X or Y direction.
            if (event.shiftKey) {
                return (Math.abs(dx) > Math.abs(dy) ? [I().translate(dx, 0), I()] : [I().translate(0, dy), I()]);
            } else {
                return [I().translate(dx, dy), I()];
            }
        };

        TransformControl.prototype.rotate = function(dx, dy, event) {
            // hold ctrl key to rotate against bottom-middle position
            var vC = (event.ctrlKey ? this.lastState.vBottom : this.lastState.vCenter);

            var vC2Old = $V(this.lastState.vStart).subtract(vC),
                vC2New = vC2Old.add($V([dx, dy])),
                deg = degAngleFrom(vC2New, vC2Old);

            // hold shift key to rotate degree aligned to 15
            if (event.shiftKey) {
                var vUp = $V([0, -1]);
                deg = Math.floor(degAngleFrom(vC2New, vUp) / 15) * 15 - degAngleFrom(vC2Old, vUp);
            }
            return [I().rotate(deg, vC.e(1), vC.e(2)), I()];
        };

        TransformControl.prototype.scale = function(key, dx, dy, event) {
            var MIN_DISTANCE = 10,
                vC = (event.ctrlKey ? $V(this.lastState.vCenter) : $V(this.lastState.vOpposite)),
                sX = sY = 1.0,
                cX = cY = 0.0,
                uWidth = this.lastState.uWidth,
                uHeight = this.lastState.uHeight;

            var vOld = $V(this.lastState.vStart).subtract(vC),
                vNew = vOld.add($V([dx, dy]));

            var bbox = this.subject_.getBBox(true);

            var vOldHeight = uHeight.x(vOld.dot(uHeight)),
                vOldWidth = uWidth.x(vOld.dot(uWidth)),
                vNewHeight = uHeight.x(vNew.dot(uHeight)),
                vNewWidth = uWidth.x(vNew.dot(uWidth));

            if (vNewHeight.dot(vOldHeight.toUnitVector()) < MIN_DISTANCE) {
                vNewHeight = vNewHeight.toUnitVector().x(MIN_DISTANCE);
            }
            if (vNewWidth.dot(vOldWidth.toUnitVector()) < MIN_DISTANCE) {
                vNewWidth = vNewWidth.toUnitVector().x(MIN_DISTANCE);
            }

            if (key === 'TM' || key === 'BM') { // vertical
                sY = vNewHeight.modulus() / vOldHeight.modulus();
                cX = bbox.cx;
                cY = (key === 'TM' ? bbox.y2 : bbox.y);
            } else if (key === 'ML' || key === 'MR') { // horizontal
                sX = vNewWidth.modulus() / vOldWidth.modulus();
                cX = (key === 'ML' ? bbox.x2 : bbox.x);
                cY = bbox.cy;
            } else { // diagonal
                sX = vNewWidth.modulus() / vOldWidth.modulus();
                sY = vNewHeight.modulus() / vOldHeight.modulus();
                // hold shift key to scale while keeping aspect ratio
                //if (event.shiftKey) {
                sX = sY = Math.max(sX, sY);
                //}
                cX = ((key.match(/^[TB]L$/)) ? bbox.x2 : bbox.x);
                cY = ((key.match(/^T[LR]$/)) ? bbox.y2 : bbox.y);
            }
            // hold ctrl key to scale against center position
            if (event.ctrlKey) {
                cX = bbox.cx;
                cY = bbox.cy;
            }
            return [I(), I().scale(sX, sY, cX, cY)];
        };

        TransformControl.prototype.dispose = function() {
            this.__unbindEvents();
            this.svgAccessor().remove();
        };

        return TransformControl;
    });