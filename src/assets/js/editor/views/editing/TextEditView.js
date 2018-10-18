/**
 * 
 */
'use strict';

define(['jquery', 'underscore', './BaseEditPanel', '../FontConf'],
    function($, _, BaseEditPanel, FontConf) {

        /**
         * This view class defines the dialog to edit a Text item.
         * 
         * @constructor   
         */
        var TextEditView = BaseEditPanel.extend({
            initialize: function() {
                var fontFamilyTemplate = _.template(this.$('#TextBoxFontFamilyDropListTemplate').html());
                //var fontSizeTemplate = _.template(this.$('#TextBoxFontSizeDropListTemplate').html());
                this.$('#fontFamily').html(fontFamilyTemplate({ options: FontConf.FONT_FAMILIES }));
                this.$('#fontSize').append(fontFamilyTemplate({ options: FontConf.FONT_SIZES }));
                this.$('.bold,.italic').ToggleButton();
                this.$('.opacity').DropDownSlider({ min: 0, max: 100, step: 1, });
                this.type = 'change'
                this.renderTime = 2
                this.isChange = false
            },
            events: {
                'keyup .ipt-name': 'onChangeContent1',
                'change .ipt-name': 'onChangeContent',
                'blur .ipt-name': 'onBlurContent',
                'change #fontFamily': 'onChangeFontFamily',
                'change #fontSize': 'onChangeFontSize',
                'change .bold': 'onChangeBold',
                'change .italic': 'onChangeItalic',
                'change .jscolor': 'onChangeColor',
                'change .opacity': 'onChangeOpacity',
            },

            onBlurContent() {
                if ($('.batchTextCheckBox').length) {
                    var content = this.$('.ipt-name').val();
                    this.type = 'change'
                    this.renderTime = 1
                    if (this.isChange) {
                        this.checkTextVal(content)
                    }
                    this.isChange = false
                }
            },
            onChangeContent1(e) {
                this.type = e.type + ''
                var content = this.$('.ipt-name').val();
                var json = this.model.toJSON();
                var reg = /^(0|[1-9]\d{0,2})([.][0-9]{1})?$/;
                if ($(e.target).attr('isper')) {
                    this.$('.ipt-name').val(this.$('.ipt-name').val().replace(/\.+/g, '.'))
                    this.$('.ipt-name').val(this.$('.ipt-name').val().replace(/[^\d.]/g, ''))
                    var tempVal = this.$('.ipt-name').val();
                    if (!reg.test(tempVal)) {
                        if (!isNaN(parseInt(tempVal))) {
                            this.$('.ipt-name').val(tempVal.replace(/\.+/g, '.'));
                            this.$('.ipt-name').val(tempVal.replace(/[^\d.]/g, ''));
                            if (tempVal.indexOf('.') > -1 && tempVal.indexOf('.') == tempVal.lastIndexOf('.')) {
                                var len = tempVal.split('.')[1].length
                                if (len > 1) {
                                    this.$('.ipt-name').val(tempVal.replace(tempVal, Math.round(tempVal * 10) / 10));
                                }
                            } else {
                                this.$('.ipt-name').val(tempVal.replace(tempVal, parseFloat(tempVal)));
                            }

                        } else {
                            this.$('.ipt-name').val('')
                        }
                    }
                    if (tempVal > 100) {
                        if ($.isArray(json.text)) {
                            json.text = json.text.join('')
                        }
                        this.$('.ipt-name').val(json.text.substring(4, json.text.indexOf('％')));
                    }
                    content = this.$('.ipt-name').val();
                    var newContent = '最高再返' + content + '％'
                    this.updateModel({ 'text': $.trim(newContent).split(/\n/) });


                } else {
                    this.updateModel({ 'text': $.trim(content).split(/\n/) });
                }

                //this.updateModel({'text': $.trim(content).split(/\n/)});
            },
            onChangeContent(e) {
                this.type = e.type + ''
                var autotext = $('.batchTextCheckBox').attr('data-autotext')
                var isAuto = autotext == 'true' ? true : false
                if (isAuto) {
                    this.$('.ipt-name').val('此处是自动化文案')
                    this.$('.ipt-name').removeClass('erro-border')
                    $('#textBoxIptError').html('').hide()
                }
                var content = this.$('.ipt-name').val();
                this.isChange = true
                if ($(e.target).attr('isper')) {
                    this.$('.ipt-name').val(Number(this.$('.ipt-name').val()))
                    if (this.$('.ipt-name').val() < 0.1 || this.$('.ipt-name').val() > 100) {
                        var json = this.model.toJSON();
                        if ($.isArray(json.text)) {
                            json.text = json.text.join('')
                        }
                        this.$('.ipt-name').val(json.text.substring(4, json.text.indexOf('％')));
                    }

                    content = this.$('.ipt-name').val();
                    var newContent = '最高再返' + content + '％';
                    this.updateModel({ 'text': $.trim(newContent).split(/\n/) });
                } else {
                    this.updateModel({ 'text': $.trim(content).split(/\n/) });
                }

            },
            checkTextVal(val) {
                var me = this
                // var tipLabel = ['年中大促', '直降', '秒杀', '折', '元', '限时', '低至', '整点抢', '半价', '特价', '红包', '返利', '让利', '立减', '立省', '领券', '抢满减券']
                // var isLabel = false
                // for (var i = 0; i < tipLabel.length; i++) {
                //     if (~val.indexOf(tipLabel[i])) {
                //         isLabel = true
                //         me.$('.ipt-name').addClass('erro-border')
                //         $('#textBoxIptError').html('请修改文案，文案中不允许出现“'+tipLabel[i]+'”，凡是不通用的文案都会被驳回').show()
                //         break;
                //     } else {
                //         isLabel = false
                //         me.$('.ipt-name').removeClass('erro-border')
                //         $('#textBoxIptError').html('').hide()
                //     }
                // }
                //console.log('checkTextVal',val)
                this.renderTime = 2
                var autotext = $('.batchTextCheckBox').attr('data-autotext')
                var isAuto = autotext == 'true' ? true : false
                if (!isAuto) {
                    $.ajax({
                        url: '/picmaker/template/validateTemplateText',
                        type: 'POST',
                        data: {
                            "text": val
                        },
                    }).done(function(res) {
                        if (res.code == 1) {
                            me.$('.ipt-name').removeClass('erro-border')
                            $('#textBoxIptError').html('').hide()
                        } else {
                            me.$('.ipt-name').addClass('erro-border')
                            $('#textBoxIptError').html('请修改文案，文案中不允许出现“'+res.msg+'”，凡是不通用的文案都会被驳回').show()
                        }
                    })
                }
            },
            onChangeFontFamily: function(e) {
                var fontFamily = this.$('#fontFamily').find("option:selected").text();
                this.updateModel({
                    'fontFamily': fontFamily
                });
            },
            onChangeFontSize: function(e) {
                var fontSize = this.$('#fontSize').find("option:selected").text();
                this.updateModel({ 'fontSize': fontSize });
            },
            onChangeColor: function(e) {
                var color = this.$('.jscolor').val();
                this.updateModel({ 'fill': '#' + color });
            },
            onChangeOpacity: function(e) {
                var opacity = this.$('.opacity').DropDownSlider('option', 'value') / 100;
                this.updateModel({ 'opacity': opacity });
            },
            onChangeBold: function(e) {
                var value = this.$('.bold').ToggleButton('option', 'value');
                var fontWeight = (value === 'bold' ? 'bold' : 'normal');
                this.updateModel({ 'fontWeight': fontWeight });
            },
            onChangeItalic: function(e) {
                var value = this.$('.italic').ToggleButton('option', 'value');
                var fontStyle = (value === 'italic' ? 'italic' : 'normal');
                this.updateModel({ 'fontStyle': fontStyle });
            },
            render: function() {
                var json = this.model.toJSON();
                var me = this;
                //console.log('this.renderTime',this.renderTime)
                me.$('.ipt-name').removeClass('erro-border')
                $('#textBoxIptError').html('').hide()
                this.renderTime++;
                if (json.isper) {
                    if ($.isArray(json.text)) {
                        json.text = json.text.join('')
                    }

                    if (this.$('.ipt-name').parent().text().indexOf('最高再返') < 0) {
                        this.$('.ipt-name').before('<span class="perTxt">最高再返</span> ')
                        this.$('.ipt-name').css('width', '80px')
                        this.$('.ipt-name').attr('isper', 'true')
                        this.$('.ipt-name').after(' <span class="perTxt">％</span>')
                        var cont = Number(json.text.substring(4, json.text.indexOf('％')));
                        this.$('.ipt-name').val(cont > 0 ? cont : '0.1');
                    } else {
                        this.$('.ipt-name').val(json.text.substring(4, json.text.indexOf('％')));
                    }
                    $('.set-input').blur(function() {
                        if ($(this).val() < 0.1 && $(this).attr('isper')) {
                            me.$('.ipt-name').val('0.1')
                            me.updateModel({ 'text': $.trim('最高再返1％').split(/\n/) });
                        }
                    })

                } else {
                    $('.perTxt').remove()
                    this.$('.ipt-name').val(json.text);
                    this.$('.ipt-name').removeAttr('isper')
                    this.$('.ipt-name').css('min-width', '300px')
                    setTimeout(() => {
                        this.$('.ipt-name').focus()
                    }, 0);

                }

                var fontFamilyTemplate = _.template(this.$('#TextBoxFontFamilyDropListTemplate').html());
                this.$('#fontFamily').html(fontFamilyTemplate({ options: FontConf.FONT_FAMILIES }));
                this.$('#fontFamily').find("option:selected").text(json.fontFamily);
                this.$('#fontSize').find("option:selected").text(json.fontSize);
                this.$('.jscolor').val(json.fill);
                var color = this.$('.jscolor')[0];
                color.jscolor && color.jscolor.fromString(json.fill);

                this.$('.bold').ToggleButton('option', 'value', (json.fontWeight === 'bold' ? 'bold' : 'normal'));
                this.$('.italic').ToggleButton('option', 'value', (json.fontStyle === 'italic' ? 'italic' : 'normal'));

                this.$('.ipt-name,.color').prop('disabled', json.locked);
                var widgetStatus = (json.locked ? 'disable' : 'enable');
                // this.$('#fontFamily').DropDownList(widgetStatus);
                this.$('.bold,.italic').ToggleButton(widgetStatus);
                this.$('.opacity').DropDownSlider(widgetStatus);

                this.$('.group').toggle(this.model.has('groupId'));
                if ($('.batchTextCheckBox').length) {
                    var autotext = $('.batchTextCheckBox').attr('data-autotext')
                    var isAuto = autotext == 'true' ? true : false
                    this.$('.ipt-name').prop('disabled', isAuto)
                    if (me.type == 'change' && this.renderTime == 3) {
                        
                        me.checkTextVal(me.$('.ipt-name').val())
                            //console.log(me.$('.ipt-name').val(), me.type, '请求', this.renderTime)
                    }
                }

                return this;
            },

            remove: function() {
                this.$('#fontFamily').DropDownList('destroy');
                this.$('.bold,.italic').ToggleButton('destroy');
                //this.$('.opacity').DropDownSlider('destroy');           
                BaseEditPanel.prototype.remove.apply(this, arguments);
            },
        });

        return TextEditView;
    });