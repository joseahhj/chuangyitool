/**
 * 
 */
define(['jquery', 'underscore', 'snap.svg'],
    function($, _, Snap) {

        var CanvasXmlV3Parser = {};

        var extendRelativePath = function(path, baseUrl) {
            if (path && path.match(/^\.\/|^\.\.\//)) { // if "xlink:href" is a relative location
                return baseUrl + '/' + path;
            }
            return path;
        };

        /**
         * Converts SVG to JSON data.
         */
        var parse = CanvasXmlV3Parser.parse = function(xml, options) {
            var canvas = {};
            //console.log(xml,'xml')
            if ($(xml).length !== 1) {
                console.warn('SVG xml may be corrupted.');
                return canvas;
            }
            var baseUrl = '';

            var root = $(xml).get(0);

            canvas['width'] = parseFloat($(xml).attr('width'));
            canvas['height'] = parseFloat($(xml).attr('height'));
            canvas['viewBox'] = parseViewBox(Snap(root).attr('viewBox').vb);
            canvas['layerList'] = [];
            canvas['svgNode'] = root;
            _.each($(xml).find('g'), function(el, i) {
                var layer = {};
                var group = Snap(el);
                var fragment = Snap.parse(el);
                var newId = $(el).attr('id');
                var nID = '';

                if (!!newId && newId.indexOf('_') > -1) {

                    nID = newId.substring(0, newId.indexOf('_'))
                } else {
                    nID = newId;
                }
                layer['transform'] = group.transform().localMatrix.toString();
                layer['visible'] = !group.hasClass('hidden');
                layer['locked'] = false;
                // layer['locked'] = newId&&newId.indexOf('locked')>-1 || group.hasClass('locked');
                layer['opacity'] = parseFloat(attr(el, 'opacity')) || 1.0;
                layer['groupId'] = nID == 'background' ? 'background1' : nID;
                layer['type'] = null;
                if (!!group.select('text') && !group.hasClass('text')) {
                    layer['transform'] = group.select('text').transform().localMatrix.toString();
                    $(el).attr('id', nID);
                } else if (!!group.select('image') && !group.hasClass('image')) {
                    layer['transform'] = group.select('image').transform().localMatrix.toString();
                }
                
                var id = group.attr('id');
                if (!!group.select('text')) {
                    layer['type'] = 'TextBox';
                    // layer['isper'] = nID&&nID.indexOf('per')>-1;  
                    // if(nID&&nID.indexOf('limit')>-1){
                    //     var num = nID.split('-')[1];
                    //     layer['limit']= num.replace(/[^0-9]/ig,"")
                    // }           
                    _.extend(layer, parseTextBox(el));
                } else if (!!group.select('image')) {
                    layer['type'] = 'Image';
                    _.extend(layer, parseImage(el, baseUrl));
                } else if (group.hasClass('background') || group.attr('id') === 'background') {
                    layer['type'] = 'Background';
                    _.extend(layer, parseBackground(el));
                } else {
                    layer['svgNode'] = el;
                }
                if(newId =='product' && options.imgUrl){
                    layer['xlinkHref'] = options.imgUrl;
                }
                // if (newId && newId.indexOf('Background')) {
                //     layer['groupId'] = 'background';
                // }

                group.remove();
                canvas.layerList.push(layer);
            }, {
                'root': xml
            });

            // if (!_(canvas.layerList).findWhere({groupId: 'background'})) {
            //     canvas.layerList.unshift({type: 'Background', groupId: 'background'});
            // }

            //console.info('Parses ', root, '(version=4) to ', canvas);
            return canvas;
        };

        var attr = function(el, key, defaultValue) {
            var styleString = $(el).attr('style');
            var styleMap = _(styleString && styleString.split(';')).chain().map(
                function(e, i) {
                    var tuple = e.split(':');
                    return tuple.length >= 2 ? [tuple[0].trim(),
                        tuple[1].trim()
                    ] : undefined;
                }).compact().object().value();
            return styleMap[key] || $(el).attr(key) || defaultValue || undefined;
        };

        var parseViewBox = function(viewBoxString) {
            var array = _((viewBoxString || '').split(/[,\s]+/)).map(parseFloat);

            if (array.length !== 4) {
                return null;
            } else {
                return {
                    x: array[0],
                    y: array[1],
                    width: array[2],
                    height: array[3]
                };
            }
        };

        var parseBackground = function(el) {
            var result = {};

            if ($('>*:not([display="none"])', el).length > 0) {
                var xlinkHref = $('>*:not([display="none"])', el).attr('xlink:href');
                var fill = $('>*:not([display="none"])', el).attr('fill');
                if (xlinkHref) {
                    result['fill'] = xlinkHref;
                } else if (fill) {
                    result['fill'] = fill
                }
            }
            return result;
        };

        var parseTextBox = function(el) {
            var result = {};
            var $text = $('text', el);
            var fontFobj = {
                'ARIAL': 'Arial',
                'Arial': 'Arial',
                'Black': 'Arial Black',
                'Impact': 'Impact',
                'HeiTi': '黑体',
                'Kaiti': '楷体',
                'sinsum': '宋体',
                'MicrosoftYaHei': '微软雅黑',
                'FZZYJW': '方正综艺简体',
                'FZZHJW': '方正正黑简体',
                'FZZZH': '方正正中黑简体',
                'FZXBSJW': '方正小标宋简体',
                'FZLTTHK': '方正兰亭特黑',
                'FZLTZCH': '方正兰亭中粗黑',
                'FZLTHJ': '方正兰亭黑简体',
                'FZLTXH': '方正兰亭纤黑',
                'FZKATJW': '方正卡通简体',
                'FZKTJW': '方正楷体简体',
                'FZHTJW': '方正黑体简体',
                'FZDBSJW': '方正大标宋简体',
                'FZHZGBJW': '方正汉真广标简体',
                'STHeiti': '华文黑体',
                'MicrosoftYaHei-Bold': '微软雅黑加粗',
            }
            var fontFm = function(ft) {
                for (var i in fontFobj) {
                    if (ft.indexOf(i) > -1) {
                        return fontFobj[i]
                    }
                }
                return ft;
            }
            if ($('text', el).length > 0) {

                var content = [];
                var fontFamily = '';
                if ($text.find('tspan').length > 0 && !Snap(el).hasClass('text')) {
                    content = _($text.find('tspan')).map(function(el) {

                        return $(el).text().trim();
                    });
                    var oldFm = attr($text.find('tspan').eq(0), 'font-family');
                    var newFm = '';
                    if (oldFm.indexOf("\'") > -1 && oldFm.lastIndexOf("\'") > -1) {
                        newFm = oldFm.substring(1, oldFm.length - 1);
                    } else {
                        newFm = oldFm;
                    }


                    result['text'] = [content.join('')];
                    result['fill'] = attr($text.find('tspan').eq(0), 'fill');
                    result['fontFamily'] = fontFm(newFm);
                    result['fontWeight'] = attr($text.find('tspan').eq(0), 'font-weight');
                    result['fontStyle'] = attr($text.find('tspan').eq(0), 'font-style');
                    result['fontSize'] = parseFloat(attr($text.find('tspan').eq(0), 'font-size'));
                    result['textAnchor'] = attr($text.find('tspan').eq(0), 'text-anchor');
                    result['x'] = parseFloat($text.find('tspan').eq(0).attr('x')) || 0;
                    result['y'] = parseFloat($text.find('tspan').eq(0).attr('y')) || 0;
                    //result['textLength'] = result['fontSize']? parseInt(result['fontSize'] ) *content.join('').length:'';
                } else {
                    content = [$text.text().trim()];

                    var oldFm = attr($text, 'font-family');
                    var newFm = '';
                    if (oldFm.indexOf("\'") > -1 && oldFm.lastIndexOf("\'") > -1) {
                        newFm = oldFm.substring(1, oldFm.length - 1);
                    } else {
                        newFm = oldFm;
                    }
                    result['text'] = [content.join('')];
                    result['fill'] = attr($text, 'fill');
                    result['fontFamily'] = fontFm(newFm);
                    result['fontWeight'] = attr($text, 'font-weight');
                    result['fontStyle'] = attr($text, 'font-style');
                    result['fontSize'] = parseFloat(attr($text, 'font-size'));
                    result['textAnchor'] = attr($text, 'text-anchor');
                    result['x'] = parseFloat($text.attr('x')) || 0;
                    result['y'] = parseFloat($text.attr('y')) || 0;
                    //result['textLength'] = result['fontSize']? parseInt(result['fontSize'] ) *content.join('').length:'';
                }

                // result['text'] = content;
                // result['fill'] = attr($text, 'fill');
                // result['fontFamily'] = attr($text, 'font-family');
                // result['fontWeight'] = attr($text, 'font-weight');
                // result['fontStyle'] = attr($text, 'font-style');
                // result['fontSize'] = parseFloat(attr($text, 'font-size'));
                // result['textAnchor'] = attr($text, 'text-anchor');
                // result['x'] = parseFloat($text.attr('x')) || 0;
                // result['y'] = parseFloat($text.attr('y')) || 0;

                var lineHeight = $text.attr('editor:line-height');
                if (!!lineHeight) {
                    if (lineHeight.match(/[^%]%$/)) { // parse percentage (e.g 23%
                        // -> 0.23)
                        lineHeight = parseFloat(lineHeight) / 100.0;
                    } else {
                        lineHeight = parseFloat(lineHeight);
                    }
                }
                result['lineHeight'] = lineHeight;
            }
            return result;
        };

        var parseImage = function(el, baseUrl) {
            var result = {};

            if ($('image', el).length > 0) {
                var $image = $('image', el);
                var imageHref = $image.attr('xlink:href');
                result['width'] = parseFloat($image.attr('width'));
                result['height'] = parseFloat($image.attr('height'));
                result['x'] = parseFloat($image.attr('x')) || 0;
                result['y'] = parseFloat($image.attr('y')) || 0;
                result['xlinkHref'] = imageHref;
            }
            return result;
        };
        var parseClipPath = function(el, baseUrl) {
            var result = {};

            var group = Snap(el);
            var $image = $('image', el);
            result['width'] = parseFloat($image.attr('width'));
            result['height'] = parseFloat($image.attr('height'));
            result['x'] = parseFloat($image.attr('x')) || 0;
            result['y'] = parseFloat($image.attr('y')) || 0;
            //result['transform'] = group.select('g').transform().localMatrix.toString();
            result['xlinkHref'] = $image.attr('xlink:href');
            return result;
        };



        return CanvasXmlV3Parser;
    });