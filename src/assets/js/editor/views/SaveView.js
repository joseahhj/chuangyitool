define(['jquery', 'backbone'],
    function($, Backbone) {
        var getQueryString = function(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        };

        var SaveView = Backbone.View.extend({
            initialize: function() {
                var _this = this;
                $('.modal-save').on('click', '#btn-yes', function() {
                    $('.modal-small').hide();
                    $('.modal-backdrop').remove();
                    _this.savePortfolio();
                }).on('click', '.btn-close,#btn-no', function() {
                    $('.modal-small').hide();
                    $('.modal-backdrop').remove();
                });
                $('.editName').on('keyup change', '.save-input', function() {
                    _this.changeInput()
                }).on('blur', '.save-input', function() {
                    $('this').removeClass('erro-border');
                    $('.editName .err-color').remove();
                });
                $('body').on("click keydown", ".list-size a,.editName>input, #setBox1 input, #setBox4 input, #setBox3, .drawingboard>g", function(e) {
                    var target = $(e.target);
                    if (target.closest(".btnList").length == 0) {
                        $('.save-image').hide();
                        $('.save-image input[name="chicun"]').eq(0).prop('checked', true);
                        $('#ruleSize').remove();
                    }
                });

            },
            events: {
                'click #save-save-btn': function(event) {
                    var name = $('.save-input').val();
                    //var textInput = Array.prototype.slice.call($('#batchText input'));
                    var portfolio = this.model.get('portfolio');
                    var _this = this;
                    var flag = false;
                    //var num = 0;
                    if ($('.modal-save #selectAll').is(':checked')) {
                        flag = true;
                    };
                    this.$('.ipt-sku').removeClass('errTip');
                    this.$('#skuTip').html('')
                    if ($.trim(name) == '') {
                        if ($('.editName .err-color').length == 0) {
                            $('.editName').append('<span class="err-color ml10">创意任务名称不能为空！</span>');
                        };
                        $('.editName .save-input').addClass('erro-border').focus();
                        return false;
                    } else if (!flag && $.trim(name) == portfolio.get('name') && portfolio.get('yn') == 1) {
                        $('.editName .err-color').remove();
                        $('.editName .save-input').removeClass('erro-border');
                        $('.modal-save').show();
                        $('body').append('<div class="modal-backdrop in"></div>');
                    } else {
                        let isLable14 = portfolio.get('label').indexOf(',14')
                        if (~isLable14 && ($('#textBoxIptError').html() || $('#batchIptError').html())) {
                            return
                        }
                        portfolio.set('name', $.trim(name));
                        _this.savePortfolio();
                    };


                    event.stopPropagation();
                },
                'click .btn-red-border': function(e) {

                    this.cerateImage();
                    e.stopPropagation();
                },
                'click .save-image input': function() {
                    $('#ruleSize').remove();
                },
                'change .preView-model .jad-checkbox-input': 'selectMask',

            },
            selectMask(e) {
                let isCheck = $(e.target).prop('checked')
                var portfolio = this.model.get('portfolio');
                if (portfolio) {
                    var auditStandardPicUrl = portfolio.get('auditStandardPicUrl');
                    var lempBox = document.getElementById('maskImage1');
                    if (isCheck) {
                        $('.maskImage').show()
                        lempBox.href.baseVal = auditStandardPicUrl
                    } else {
                        $('.maskImage').hide()
                    }

                }

            },
            render: function() {
                var portfolio = this.model.get('portfolio');
                portfolio && $('.save-input').val(portfolio.get('name'));
                return this;
            },
            cerateImage: function() {
                var portfolio = this.model.get('portfolio');
                var _this = this;
                var tempId = portfolio.get('id');
                var sizeList = [];
                var newSizeList = [];

                _.each(portfolio.get('templateSizeList').models, function(templateSize, index) {
                    sizeList.push(templateSize.get("id"))
                })
                var radioValue = $('input[name="chicun"]:checked').val();
                var stip = '';
                if (radioValue == 1) {
                    newSizeList = [];
                    var index = $('.list-size .sizeOn').index();
                    newSizeList.push(sizeList[index]);
                    stip = '当前尺寸';
                } else if (radioValue == 2) {
                    newSizeList = sizeList;
                    stip = '所有尺寸';
                }
                if ($('.radio-con input').is(':checked')) {
                    $('#saveDrop #ruleSize').remove();
                    $.ajax({
                        url: '/picmaker/originality/saveImg',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            "templateId": tempId,
                            "sizeIdList": newSizeList
                        }),
                        beforeSend: function() {
                            var tip = '<div class="modal-small modal-save" id="loadingDiv">' +
                                '<div class="mo-bd tipA">' +
                                '<div class="load-tips" ></div>' +
                                '<p style="text-align:center;font-size:14px">图片保存中，请稍候...</p>' +
                                '</div>' + '</div>' + '<div class="modal-backdrop in"></div>';

                            $('body').append(tip)
                        }
                    }).done(function(data) {
                        if (data.code == 1) {
                            $('#loadingDiv').remove();
                            $('.modal-backdrop').remove();
                            var str = '<span id="ruleSize">已将' + stip + '保存至<a href="./myTemplateList.html?key=pic" target="_blank"  class="color-blue" >我的创意图片</a></span>';
                            $('.save-image').prepend(str);
                            //_this.downLoadImg(data.content)						
                        } else if (data.code == -100) { //未登录
                            $('#loadingDiv').remove();
                            $('.modal-backdrop').remove();
                            var oldHref = window.location.href;
                            window.location.href = '//passport.jd.com/new/login.aspx?ReturnUrl=' + oldHref
                        } else if (data.code == -300) { //没有权限
                            $('#loadingDiv').remove();
                            $('.modal-backdrop').remove();
                            var oldHost = window.location.host;
                            window.location.href = oldHost + '/toolpage/static/notWhite.html'
                        } else {
                            $('#loadingDiv').remove();
                            $('.modal-backdrop').remove();
                            alert(data.msg)
                        }
                    })
                } else {
                    var str = '<span class="err-color" id="errTip">请选择尺寸</span>';
                    if ($('.save-image .err-color').length == 0) {
                        $('.save-image').append(str);
                    };
                    return false;
                }

            },
            changeInput: function() {
                var len = $('.editName .save-input').val().length;
                $('.editName .save-input').removeClass('erro-border');
                $('.editName .err-color').remove();
                if (len > 31) {
                    $('.editName').append('<span class="err-color">长度不能超过30个字符</span>');
                    $('.editName .save-input').addClass('erro-border').focus();
                    var value = $('.editName .save-input').val().substring(0, 31);
                    $('.editName .save-input').val(value);
                    return false;
                } else if (len <= 30) {
                    $('.editName .err-color').remove();
                    $('.editName .save-input').removeClass('erro-border');
                }
                //$('.editName .err-color').remove();

            },
            downLoadImg: function(dataIds) {

                var inData = {
                    'templateIds': dataIds,
                    'templateId': portfolio.get('id'),
                    'materialIds': dataIds,
                    'flag': 1
                };
                var option = {
                    url: '/picmaker/template/downloadTemplatePic', //请求的url
                    data: {
                        "templateIds": dataIds,
                        "templateId": portfolio.get('id'),
                        "materialIds": dataIds,
                        "flag": 1
                    }
                };
                this.DownLoadFile(option)
            },
            cerateHtImage: function() {
                var portfolio = this.model.get('portfolio');
                var _this = this;
                var tempId = portfolio.get('id');
                var sizeList = [];
                var newSizeList = [];

                _.each(portfolio.get('templateSizeList').models, function(templateSize, index) {
                    sizeList.push(templateSize.get("id"))
                })
                var radioValue = $('.setToudi input[name="pic"]:checked').val();
                var stip = '';
                var autotext = $('.batchTextCheckBox').attr('data-autotext')
                var isAuto = autotext == 'true' ? 1 : 0
                if ($('.setToudi input[name="pic"]').is(':checked')) {
                    $('#saveDrop #ruleSize').remove();
                    $.ajax({
                        url: '/picmaker/originality/saveImg',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            "templateId": tempId,
                            "sizeIdList": sizeList,
                            "materialType": Number(radioValue),
                            "aiText": isAuto
                        }),
                        beforeSend: function() {
                            var tip = '<div class="modal-small modal-save" id="loadingDiv">' +
                                '<div class="mo-bd tipA">' +
                                '<div class="load-tips" ></div>' +
                                '<p style="text-align:center;font-size:14px">图片保存中，请稍候...</p>' +
                                '</div></div><div class="modal-backdrop in"></div>';

                            $('body').append(tip)
                        }
                    }).done(function(data) {
                        if (data.code == 1) {
                            $('#loadingDiv').remove();
                            $('.modal-backdrop').remove();
                            $('.save-image .mrA').hide();
                            window.location.href = "./myTemplateList.html?key=pic&label=14"

                        } else if (data.code == -100) { //未登录
                            $('#loadingDiv').remove();
                            $('.modal-backdrop').remove();
                            var oldHref = window.location.href;
                            window.location.href = '//passport.jd.com/new/login.aspx?ReturnUrl=' + oldHref
                        } else if (data.code == -300) { //没有权限
                            $('#loadingDiv').remove();
                            $('.modal-backdrop').remove();
                            var oldHost = window.location.host;
                            window.location.href = oldHost + '/toolpage/static/notWhite.html'
                        } else {
                            $('#loadingDiv').remove();
                            $('.modal-backdrop').remove();
                            alert(data.msg)
                        }
                    })
                } else {
                    var str = '<span class="err-color" id="errTip">请选择模板类型</span>';
                    if ($('.save-image .err-color').length == 0) {
                        $('.save-image').append(str);
                    };

                }

            },
            savePortfolio: function() {
                var me = this;
                var canvas = this.model.get('portfolio');

                portfolio.savePortfolio().done(function(data) {
                    $('.save-image').show();
                    if (canvas.get('label').indexOf(',11') > -1 || canvas.get('label').indexOf(',14') > -1) {
                        $('.save-image .mrA').hide();
                    }
                    if (canvas.get('label').indexOf(',12') > -1) {
                        $('.save-image input[name="chicun"]').eq(1).prop('checked', true);
                        $('.save-image .mrA').hide();
                    }
                    if (canvas.get('label').indexOf(',14') > -1) {
                        $('.save-image').hide();
                        $('.save-image .mrA').hide();
                        if (data.code == 1) {
                            me.cerateHtImage()
                        }

                    }

                    $('#save').click();
                }).fail(function() {
                    alert('保存失败');
                }).always(function() {
                    $('#LoadingMask').hide();
                });

            },
            DownLoadFile: function(options) {
                var config = $.extend(true, { method: 'post' }, options);
                var $iframe = $('<iframe id="down-file-iframe" />');
                var $form = $('<form enctype="application/json" target="down-file-iframe" method="' + config.method + '" />');
                $form.attr('action', config.url);
                for (var key in config.data) {
                    $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
                }
                $iframe.append($form);
                $(document.body).append($iframe);
                $form[0].submit();
                $iframe.remove();
            }

        });

        return SaveView;
    });