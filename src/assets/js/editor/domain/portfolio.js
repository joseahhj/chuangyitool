'use strict';

define(['backbone', './creativework'],
    function(Backbone, CreativeWork) {
        /* Import javascript routers */


        var CreativeWorks = Backbone.Collection.extend({
            model: CreativeWork,
        });

        var Portfolio = Backbone.Model.extend({

            defaults: {
                id: null,
                industry: null,
                label: null,
                name: null,
                picUrl: null,
                templateType: null,
                device: 1,
                score: 0,
                sourceId: 0,
                createTime: NaN,
                modifyTime: NaN,
                uid: "_root",
                use: 1,
                templateSizeList: null,
                yn: 1,

            },

            initialize: function(attributes, options) {
                this.set('templateSizeList', new CreativeWorks());
            },

            validate: function(attributes, options) {
                if (attributes.name === null || attributes.name.length === 0) {
                    return 'Portfolio name is missing';
                }
            },

            findCreativeWork: function(criterion) {
                return this.get('templateSizeList').findWhere(criterion);
            },

            findAllCreativeWorks: function(criterion) {
                return this.get('templateSizeList').where(criterion);
            },

            savePortfolio: function() {
                var _this = this;
                if (!this.isValid()) {
                    console.error(this.validationError);
                    return false;
                };

                var deferredList = [];
                this.get('templateSizeList').forEach(function(creativeWork) {
                    var deferredSyncFile = creativeWork.syncFile();
                    var deferredSyncDot = creativeWork.removeDot();
                    deferredSyncFile && deferredList.push(deferredSyncFile);
                    deferredSyncDot && deferredList.push(deferredSyncDot);
                }, this);
                _this.set({ "yn": 1 }, { validate: true, revocable: true });
                var deferred = $.Deferred();
                // After all AJAX requests have finished, portfolio is ready to be saved.
                $.when.apply(this, deferredList).done(_(function() {
                    var snapshotCreative = this.findCreativeWork({ width: 200, height: 200, yn: 1 });
                    if (!snapshotCreative || snapshotCreative.get('yn')) {
                        snapshotCreative = this.findCreativeWork({ yn: 1 });
                    }

                    if (snapshotCreative) {
                        this.set('picUrl', snapshotCreative.get('picUrl'));
                    }
                    var name = $('.save-input').val();
                    if (name.indexOf('\\') >= 0 || name.indexOf('/') >= 0) {
                        $('#confirmBox #tipMsg').html(data.msg || '模板名称不能包含"/"或"\\"')
                        $('#confirmBox').show()
                        $('.save-input').addClass('erro-border');
                        _this.set({ "yn": 0 }, { validate: true, revocable: true });
                    } else {
                        $.ajax({
                            type: "POST",
                            url: "/picmaker/template/saveTemplate",
                            data: JSON.stringify(this.composeJson_(this.toJSON())),
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8"
                        }).done(function(data, textStatus, jqXhr) {
                            switch (data.code) {
                                case 1:
                                    _this.set({ "id": data.content.id }, { validate: true, revocable: true });
                                    _.each(_this.get('templateSizeList').models, function(templateSize, index) {
                                        templateSize.set({ "id": data.content.templateSizeList[index].id }, { validate: true, revocable: true })
                                        templateSize.set({ "templateId": data.content.templateSizeList[index].templateId }, { validate: true, revocable: true })
                                    })
                                    _this.parseJson_(data);
                                    deferred.resolve(data);
                                    break;
                                case -200:
                                    $('#confirmBox #tipMsg').html(data.msg)
                                    $('#confirmBox').show()
                                    _this.set({ "yn": 0 }, { validate: true, revocable: true });
                                    break
                                case -5:
                                    $('#confirmBox #tipMsg').html('您已存在相同名称的模板，请取过一个新的名称！！')
                                    $('#confirmBox').show()
                                        //alert('您已存在相同名称的模板，请取过一个新的名称！！');
                                    $('.save-input').addClass('erro-border');
                                    _this.set({ "yn": 0 }, { validate: true, revocable: true });
                                    break;

                                case -6:
                                    // alert('模板名称不能包含"/"或"\\"');
                                    $('#confirmBox #tipMsg').html(data.msg || '模板名称不能包含"/"或"\\"')
                                    $('#confirmBox').show()
                                    $('.save-input').addClass('erro-border');
                                    _this.set({ "yn": 0 }, { validate: true, revocable: true });
                                    break;
                                case -100: //未登录
                                    var oldHref = window.location.href;
                                    window.location.href = '//passport.jd.com/new/login.aspx?ReturnUrl=' + oldHref
                                    break;
                                case -300: //没有权限
                                    var oldHost = window.location.host;
                                    window.location.href = oldHost + '/toolpage/static/notWhite.html';
                                    break;
                            }


                        }).fail(function(jqXhr, textStatus, errorThrown) {
                            console.error('Failed to update portfolio', textStatus, errorThrown);
                            deferred.reject('fail');
                        });
                    }
                }).bind(this)).fail(function() {
                    deferred.reject('fail');
                });

                return deferred;
            },

            composeJson_: function(data) {
                var result = _(data).pick('id', 'industry', 'label', 'name', 'picUrl', 'modifyTime');
                result.templateSizeList = [];
                data.templateSizeList.forEach(function(creativeWork, index) {
                    var json = creativeWork.omit('canvas', 'platforms');
                    result.templateSizeList.push(json);
                });
                return result;
            },

            parseNewJson_: function(data) {
                data = _(data).pick('id', 'templateSizeList');
                var creativeWorks = this.get('templateSizeList');
                _(data.templateSizeList).forEach(function(json, index) {
                    var creativeWork = creativeWorks.at(index);
                    creativeWork.set(_(json).pick('id'));
                });
                this.set(_(data).omit('templateSizeList'));
            },

            parseJson_: function(data) {
                data = _(data).pick('id', 'industry', 'label', 'name', 'picUrl', 'modifyTime', 'templateSizeList');

                _(data).forEach(function(value, key) {
                    if (value === null || value === undefined || value === 0) {
                        delete data[key];
                    }
                });
                _(data.templateSizeList).forEach(function(json, key) {
                    _(json).forEach(function(value, key) {
                        if (value === null || value === undefined || value === 0) {
                            delete json[key];
                        }
                    });
                });

                this.set(_(data).omit('templateSizeList'));

                var creativeWorks = this.get('templateSizeList');
                _(data.templateSizeList).forEach(function(json) {
                    var creativeWork = creativeWorks.findWhere({ id: json.id });
                    if (!creativeWork) {
                        creativeWork = creativeWorks.findWhere({ width: json.width, height: json.height });
                    }
                    if (!!creativeWork) {
                        creativeWork.set(json);
                    }
                });

            },
        });

        return Portfolio;
    });