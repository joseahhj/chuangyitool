/**
 * 
 */
'use strict';

define(['jquery', 'underscore', './BaseEditPanel', 'file_upload'],
    function($, _, BaseEditPanel) {
        var ImageSkuList = BaseEditPanel.extend({
            initialize: function(options) {
                this.setElement($(this.template({ 'listPic': this.model })));
            },
            template: _.template($('#SelectSkuPicture').html()),
            events: {
                'click li': 'toggleSelected',
            },
            toggleSelected: function(e) {
                var me = this
                var liParent = event.target.nodeName == 'IMG' ? $(e.target).parent() : $(e.target);
                if (liParent.hasClass('select-on')) {
                    liParent.removeClass('select-on');
                    Backbone.trigger('uploadSkuPic')
                } else {
                    var newSrc = liParent.find('img').attr('src')
                    $('.list-shop-small li').removeClass('select-on')
                    liParent.addClass('select-on')
                    Backbone.trigger('uploadSkuPic', newSrc)
                }
            },
        });
        var ImageSkuUpload = BaseEditPanel.extend({
            initialize: function(options) {

                this.setElement($(this.template({ 'listPic': this.model })));
            },
            template: _.template($('#UploadSkuPicture').html()),
            events: {
                'click li': 'toggleSelected',
            },
            toggleSelected: function(e) {
                var me = this
                var liParent = event.target.nodeName == 'IMG' ? $(e.target).parent() : $(e.target);
                if (liParent.hasClass('select-on')) {
                    liParent.removeClass('select-on');
                    Backbone.trigger('uploadSkuPic')
                } else {
                    var newSrc = liParent.find('img').attr('src')
                    $('.list-shop-small li').removeClass('select-on')
                    liParent.addClass('select-on')
                    Backbone.trigger('uploadSkuPic', newSrc)
                }
            },
        })
        var ImageSkuView = BaseEditPanel.extend({
            initialize: function() {
                var me = this //renderSkuUpload
                Backbone.on('uploadSkuPic', this.uploadSkuPic, this);
                Backbone.on('renderSkuUpload', this.renderSkuUpload, this);
                Backbone.on('renderSkuList', this.renderSkuList, this);
            },
            events: {
                'click #skuSubmit': 'onSubmitSku',
                'keyup .ipt-sku': 'onChangeSku',
                'blur .ipt-sku': 'onChangeSku',
                'change #fileSku': function() {
                    if (this.oncheckFile('fileSku')) {
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
                            var dataList = data.content && data.content.length ? data.content : [];
                            me.$('.ipt-sku').val('')
                            me.renderSkuList(dataList)
                            Backbone.trigger('renderPicList', dataList)
                        } else {
                            me.$('.ipt-sku').addClass('errTip')
                            me.$('.ipt-sku').focus();
                            me.$('.err-color').html(data.msg)
                        }
                    }
                })
            },
            renderSkuList: function(dataList) {
                var me = this
                var view = new ImageSkuList({ model: dataList });
                this.$('#listPic').html(view.render().$el)
                if (dataList.length) {
                    this.$('.setSkuPicture').find('.c9a').show()
                } else {
                    this.$('.setSkuPicture').find('.c9a').hide()
                }

            },
            oncheckFile: function(fileid) {
                var fileSize = 0;
                console.log($("#" + fileid).val(),'23')
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
            uploadSkuPic: function(newSrc) {
                var me = this
                me.model.set({
                    'xlinkHref': newSrc,
                }, { revocable: true, validate: true });
            },
            onChangeFile: function() {
                var me = this;
                var id = $('#fileSku').attr("id");
                $.ajaxFileUpload({
                    url: '/picmaker/template/upload',
                    secureuri: false,
                    fileElementId: id,
                    data: { "fileId": id },
                    dataType: 'json',
                    success: function(data) {
                        if (data.code == 1) {
                            var newData = data.content.src;
                            me.renderSkuUpload(newData);
                            Backbone.trigger('renderUpload', newData)
                        } else {
                            alert(data.msg)
                        }
                    },
                    error: function(data) {
                        alert("上传失败，请重试！");
                    }
                });
            },
            renderSkuUpload: function(pic) {
                var dataList = [pic]
                var view = new ImageSkuUpload({ model: dataList });
                this.$('#uploadPic').html(view.render().$el)
                this.$('.setSkuPicture').find('.c9a').show()

            },
            render: function() {
                return this;
            },
        });

        return ImageSkuView;
    });