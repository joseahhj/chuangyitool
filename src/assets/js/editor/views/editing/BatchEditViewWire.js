/**
 * 
 */
'use strict';

define(['jquery', 'underscore', 'backbone', 'file_upload'],
    function($, _, Backbone) {

        var TextBoxView = Backbone.View.extend({
            initialize: function() {
                this.setElement($(this.template()));
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'remove', this.remove);

            },
            events: {
                'keyup .set-input': 'onChangeText',
                'change .set-input': 'onChangeText',
            },
            onChangeText: function(e) {
                this.model.set('text', [this.$('.set-input').val()], { revocable: true, validate: true });
            },
            template: _.template($('#TextBoxBatchSetting').html()),
            render: function() {
                var json = this.model.toJSON();
                var me = this;

                if (json.text && this.$('.set-input').is(':not(:focus)')) {
                    this.$('.set-input').val(json.text);
                }
                return this;
            },
        });
        var ImageList = Backbone.View.extend({
            initialize: function(options) {
                this.setElement($(this.template({ 'listPic': this.model })));
            },
            template: _.template($('#SelectPicture').html()),
            events: {
                'click li': 'toggleSelected',
            },
            toggleSelected: function(e) {
                var me = this
                var liParent = event.target.nodeName == 'IMG' ? $(e.target).parent() : $(e.target);
                if (liParent.hasClass('select-on')) {
                    liParent.removeClass('select-on');
                    Backbone.trigger('uploadPic')
                } else {
                    var newSrc = liParent.find('img').attr('src')
                    $('.list-shop-small li').removeClass('select-on')
                    liParent.addClass('select-on')
                    Backbone.trigger('uploadPic', newSrc)
                }
            },
        });
        var ImageUpload = Backbone.View.extend({
            initialize: function(options) {
                this.setElement($(this.template({ 'listPic': this.model })));
            },
            template: _.template($('#UploadPicture').html()),
            events: {
                'click li': 'toggleSelected',
            },
            toggleSelected: function(e) {
                var me = this
                var liParent = event.target.nodeName == 'IMG' ? $(e.target).parent() : $(e.target);
                if (liParent.hasClass('select-on')) {
                    liParent.removeClass('select-on');
                    Backbone.trigger('uploadPic')
                } else {
                    var newSrc = liParent.find('img').attr('src')
                    $('.list-shop-small li').removeClass('select-on')
                    liParent.addClass('select-on')
                    Backbone.trigger('uploadPic', newSrc)
                }
            },
        })
        var ImageView = Backbone.View.extend({
            initialize: function() {
                var groupId = this.model.get('groupId');
                this.setElement($(this.template()));
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'remove', this.remove);
                var me = this
                Backbone.on('uploadPic', this.uploadPic, this);
            },
            template: _.template($('#PictureBatchSetting').html()),
            events: {
                'click #skuSubmit': 'onSubmitSku',
                'keyup .ipt-sku': 'onChangeSku',
                'blur .ipt-sku': 'onChangeSku',
                'change #fileLoad': function() {
                    if (this.oncheckFile('fileLoad')) {
                        this.onChangeFile();
                    }
                }
            },

            onChangeSku() {
                this.$('.ipt-sku').val(this.$('.ipt-sku').val().replace(/[^\d]/g, ''));
                this.$('.ipt-sku').removeClass('errTip')
                this.$('.err-color').html('')
            },
            onSubmitSku() {
                var me = this;
                var content = this.$('.ipt-sku').val();
                if (content == '') {
                    this.$('.ipt-sku').focus();
                    this.$('.ipt-sku').addClass('errTip')
                    this.$('.err-color').html('请输入属于该PIN的一个有效的SKU ID获取商品图')
                    return
                }

                $.ajax({
                    url: '/picmaker/originality/getPicBySku',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        "sku": content
                    },
                    success: function(data) {
                        if (data.code == 1) {
                            var dataList = data.content
                            me.$('.ipt-sku').val('')
                            me.renderPicList(dataList)
                        } else {
                            me.$('.ipt-sku').addClass('errTip')
                            me.$('.ipt-sku').focus();
                            me.$('.err-color').html(data.msg)
                        }
                    }
                })
            },
            renderPicList: function(dataList) {
                var me = this
                var view = new ImageList({ model: dataList });
                $('#listPic').html(view.render().$el)
                $('.setPicture').find('.c9a').show()
            },
            oncheckFile: function(fileid) {
                var fileSize = 0;
                if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test($("#" + fileid).val())) {
                    alert("图片类型必须是jpeg,jpg,png中的一种");
                    $("#" + fileid).val('');
                    return false;
                } else {
                    if ($.support.msie) {
                        var objFSO = new ActiveXObject("Scripting.FileSystemObject");
                        var filePath = $("#" + fileid)[0].value;
                        var objFile = objFSO.getFile(filePath);
                        fileSize = objFile.size;
                    } else {
                        fileSize = $("#" + fileid)[0].files[0].size //size in kb
                    }
                    if (fileSize > 200 * 1024) {
                        alert('图片超过200Kb啦！！');
                        return false;
                    }
                };
                return true;
            },
            uploadPic: function(newSrc) {
                var me = this
                me.model.set({
                    'xlinkHref': newSrc,
                }, { revocable: true, validate: true });
            },
            onChangeFile: function() {
                var me = this;
                var id = $('#fileLoad').attr("id");
                $.ajaxFileUpload({
                    url: '/picmaker/template/upload',
                    secureuri: false,
                    fileElementId: id,
                    data: { "fileId": id },
                    dataType: 'json',
                    success: function(data) {
                        if (data.code == 1) {
                            var newData = data.content.src;
                            me.renderUpload(newData);
                        } else {
                            alert(data.msg)
                        }
                    },
                    error: function(data) {
                        alert("上传失败，请重试！");
                    }
                });
            },
            renderUpload: function(pic) {
                var dataList = [pic]
                var view = new ImageUpload({ model: dataList });
                $('#uploadPic').html(view.render().$el)
                $('.setPicture').find('.c9a').show()
            },
            render: function() {
                var json = this.model.toJSON();
                var me = this
                return this;
            },
        });

        var ViewMapping = {
            'TextBox': TextBoxView,
            'Image': ImageView,
            // 'Shape': ShapeView,
            // 'Button': ButtonView,
            //'Background': BackgroundView,
        };

        var BatchEditView = Backbone.View.extend({
            initialize: function(attributes, options) {
                this.views_ = [];
            },
            modelEvents: {
                'layers:rearrange': function() { this.setModel(this.model); },
            },
            setModel: function(newModel) {
                this.model && this.stopListening(this.model);
                _(this.views_).forEach(function(view) { view.remove(); });
                this.views_ = [];

                this.model = newModel;

                this.model && this.model.get('layerList').forEach(function(layer) {
                    var type = layer.get('type'),
                        groupId = layer.get('groupId');
                    var Constructor = ViewMapping[type];
                    if (!!Constructor && !!groupId) {
                        var view = new Constructor({ model: layer });
                        this.views_.push(view);
                        if (groupId == 'picture') {
                            this.$('.pictureList').before(view.render().$el);
                        } else {
                            this.$('.set-body').prepend(view.render().$el).prepend(' ');
                        }
                    }

                }, this);
                this.model && this.listenTo(this.model, this.modelEvents);
                this.model && this.render();
            },

            render: function() {
                _(this.views_).forEach(function(view) { view.render(); });
                return this;
            },
        });

        return BatchEditView;
    });