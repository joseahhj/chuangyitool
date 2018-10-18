/**
 * 
 */
'use strict';

define(['jquery', 'underscore', 'backbone', 'file_upload'],
    function($, _, Backbone) {

        var TextBoxView = Backbone.View.extend({
            initialize: function(attributes) {
                this.setElement($(this.template()));
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'remove', this.remove);
                
                this.type = 'change'
                this.textAll = attributes.textAll
                this.currentIndex = attributes.currentIndex
                this.isChange = false
            },
            template: _.template($('#TextBoxBatchSetting').html()),
            events: {
                'keyup .set-input': 'onChangeText',
                'change .set-input': 'onChangeText',
                'blur .set-input': 'onBlurText'
            },
            
            onBlurText() {
                this.type = 'change'
                if(this.isChange){
                    var val = this.$('.set-input').val()
                    this.checkTextVal(val)
                    //console.log('onBlurText')
                }
                
            },
            onChangeText(e) {
                var autotext = $('.batchTextCheckBox').attr('data-autotext')
                var isAuto = autotext == 'true' ? true : false
                if (isAuto) {
                    this.$('.set-input').val('此处是自动化文案')
                    this.$('.set-input').removeClass('erro-border')
                    $('#batchIptError').html('').hide()
                }
                var content = this.$('.set-input').val()
                this.type = e.type + ''
                if(this.type == 'change') {
                    this.isChange = true
                }
                this.model.set('text', [content], { revocable: true, validate: true });
            },
            checkTextVal(val) {
                var me = this
                // var tipLabel = ['年中大促', '直降', '秒杀', '折', '元', '直降', '低至', '整点抢', '半价', '特价', '红包', '返利', '让利', '立减', '立省', '领券', '抢满减券', '满减']
                // var isLabel = false
                
                var deferred = $.Deferred();
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
                            me.$('.set-input').removeClass('erro-border')
                        } else {
                            me.$('.set-input').addClass('erro-border')
                        }

                    })
                   
                    if(this.currentIndex == this.textAll || this.isChange){
                        var myInput  = $('.set-input')
                        var textNew = ''
                        
                        myInput.each(function(){
                            textNew +=$(this).val()
                        })
                        var newVal = myInput.length == this.textAll ? textNew : (textNew+val)
                        $.ajax({
                            url: '/picmaker/template/validateTemplateText',
                            type: 'POST',
                            data: {
                                "text": newVal 
                            },
                        }).done(function(res) {
                            if (res.code == 1) {
                                //me.$('.set-input').removeClass('erro-border')
                                $('#batchIptError').html('').hide()
                            } else {
                                //me.$('.set-input').addClass('erro-border')
                                $('#batchIptError').html('请修改文案，文案中不允许出现“'+res.msg+'”，凡是不通用的文案都会被驳回').show()
                            }
                            me.isChange = false
                        })
                    }
                    
                }

                // setTimeout(() => {
                //     if (!$('.set-input').hasClass('erro-border')) {
                //         $('#batchIptError').html('').hide()
                //     }
                // }, 0);

            },
            render() {
                var json = this.model.toJSON();
                var me = this
                if (json.text && this.$('.set-input').is(':not(:focus)')) {
                    this.$('.set-input').val(json.text);
                }
                var autotext = $('.batchTextCheckBox').attr('data-autotext')
                var isAuto = autotext == 'true' ? true : false
                //console.log($('#batchText input').val(),'val')
                    
                this.$('.set-input').prop('disabled', isAuto)
                if (this.type == 'change' 
                    && $('#setBox3').css('display') == 'none' 
                    && $('#setBox4').css('display') == 'none') {
                    me.checkTextVal(json.text.toString(),)
                }
                return this;
            },
        });
        var ImageView = Backbone.View.extend({
            initialize: function(attributes) {
                //var groupId = this.model.get('groupId');
                this.setElement($(this.template()));
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'remove', this.remove);
                this.portfolio = attributes.portfolio;
            },
            template: _.template($('#ToudiBatchSetting').html()),
            events: {
                'click .radio-con': 'changeRadio'
            },
            changeRadio(e) {
                //var me = this
                var tagId = $(e.target).attr('data-value') ? $(e.target).attr('data-value') : $(e.target).val()
                var portfolio = this.portfolio;
                var hasTransparentPic = portfolio.get('hasTransparentPic'),
                    newSrc = tagId == 1 ? portfolio.get('whiteSkuPicUrl') :
                    portfolio.get('transparentSkuPicUrl');
                this.uploadPic(newSrc)
                if (hasTransparentPic && tagId == 2) {
                    this.$('.tips-toud').show()
                } else {
                    this.$('.tips-toud').hide()
                }
            },
            uploadPic: function(newSrc) {
                var me = this
                me.model.set({
                    'xlinkHref': newSrc,
                }, { revocable: true, validate: true });
            },
            render: function() {
                return this;
            },
        });

        var ViewMapping = {
            'TextBox': TextBoxView,
            'Image': ImageView,
        };

        var BatchEditView = Backbone.View.extend({
            initialize: function(attributes, options) {
                this.views_ = [];
                this.textAll = 0
            },
            // modelEvents: {
            //     'layers:rearrange': function() { this.setModel(this.model); },
            // },
            setModel: function(newModel, newPortfolio) {
                this.model && this.stopListening(this.model);
                _(this.views_).forEach(function(view) { view.remove(); });
                this.views_ = [];
                this.model = newModel;
                let me = this
                let textAll = 0
                this.model && this.model.get('layerList').forEach(function(layer) {
                    var type = layer.get('type'),
                        groupId = layer.get('groupId');
                    if (type == 'TextBox') {
                            //textHtml += view.render().$el
                           //console.log(view.$el)
                           textAll += 1
                    }
                })
                let currentIndex = 0
                this.model && this.model.get('layerList').forEach(function(layer) {
                    var type = layer.get('type'),
                        groupId = layer.get('groupId');
                    var Constructor = ViewMapping[type];
                    if (groupId == 'product' || type == 'TextBox') {
                        // if (groupId == 'product') {
                        //     var oldLink = layer.get('xlinkHref')
                        //     layer.set({
                        //         'xlinkHref': newPortfolio && newPortfolio.get('whiteSkuPicUrl') || oldLink, //换成默认白底图
                        //     })
                        // }
                        var view = null
                        if (groupId == 'product') {
                            view = new Constructor({ model: layer, portfolio: newPortfolio });
                            this.$('.setToudi').append(view.render().$el)
                        }
                        if (type == 'TextBox') {
                            //textHtml += view.render().$el
                           //console.log(view.$el)
                            currentIndex += 1
                            view = new Constructor({ model: layer, textAll: textAll,currentIndex:currentIndex });
                            this.$('.set-body').append(view.render().$el).prepend(' ');
                            //this.textAll += layer.get('text')
                        }
                        this.views_.push(view);
                    }
                }, this);
                
                this.model && this.listenTo(this.model, this.modelEvents);
                //this.model && this.render();
            },

            render: function() {
                // 循环渲染了
                //_(this.views_).forEach(function(view) { view.render(); });
                return this;
            },
        });

        return BatchEditView;
    });