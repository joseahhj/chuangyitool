/**
 * 
 */
'use strict';

define(['jquery', 'underscore', 'backbone', 'file_upload'],
    function($, _, Backbone) {

        var deleteBox = Backbone.View.extend({
            initialize: function() {
                this.setElement($(this.template({ 'deleteLayers': this.model.toJSON() })));
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'remove', this.remove);
            },
            events: {
                'click p': 'clickSelect'
            },
            template: _.template($('#deleteLayer').html()),
            clickSelect(e) {
                var isSelect = this.model.get('selected')
                this.model.set({ selected: !isSelect });
                var liParent = event.target.nodeName == 'P' ||
                    event.target.nodeName == 'I' ? $(e.target).parent() : $(e.target).parent().parent();
                if (liParent.hasClass('select-on')) {
                    liParent.removeClass('select-on');
                } else {
                    liParent.addClass('select-on')
                }
            },
            render: function() {
                return this;
            },
        });
        var deleteLen = Backbone.View.extend({
            initialize: function() {
                this.setElement($(this.template({ 'deleteLen': this.model })));
            },
            template: _.template($('#deleteLen').html()),
            render: function() {
                return this;
            },
        });
        var fixBox = Backbone.View.extend({
            initialize: function(attributes) {
                this.setElement($(this.template({ 'listLayer': this.model.toJSON() })));
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'remove', this.remove);
                this.preModel = attributes.preModel;
            },
            template: _.template($('#BatchFix').html()),
            events: {
                'click p': 'setSelected',
                'click .deleteLayer': 'clickDelete'
            },
            setSelected() {
                this.model.set({ selected: true });
            },
            clickDelete(e) {
                e.cancelBubble = true;
                e.stopPropagation()
                this.model.set({ selected: true });
                this.preModel.removeLayers()
            },
            render() {
                return this;
            },
        });

        var BatchEditView = Backbone.View.extend({
            initialize: function(attributes, options) {
                this.views_ = [];
                //this.deleteViews_ = [];
            },
            // modelEvents: {
            //     'layers:rearrange': function() { this.setModel(this.model); },
            // },
            setModel: function(newModel, newPreModel) {
                let me = this
                me.model && me.stopListening(me.model);
                _(me.views_).forEach(function(view) { view.remove(); });
                //_(me.deleteViews_).forEach(function(view) { view.remove(); });
                me.views_ = [];
                //this.deleteViews_ = [];
                me.model = newModel;
                var newPortfolio = newPreModel && newPreModel.get('portfolio');
                var whiteSkuPicUrl = newPortfolio && newPortfolio.get('whiteSkuPicUrl')
                me.model && me.model.get('layerList').forEach(function(layer) {
                    var groupId = layer.get('groupId');
                    var view = new fixBox({ model: layer, preModel: newPreModel })
                    me.views_.push(view);
                    me.$('.fix-dl').append(view.render().$el).prepend(' ');
                }, this);

                var curWidth = me.model.get('width')
                var curHeight = me.model.get('height')
                var delKeys = curWidth + '*' + curHeight
                var deleteLayer = newPreModel && newPreModel.get('deleteLayer');
                var  delegetInner = deleteLayer[delKeys]
                _(delegetInner).forEach(function(layer, index) {
                    layer && layer.set({ selected: true, txtIndex: index })
                    var viewDelete = new deleteBox({ model: layer })
                    me.views_.push(viewDelete);
                    $('.delete-layer-ul').append(viewDelete.render().$el).prepend(' ');
                })
                var viewDeleteLen = new deleteLen({ model: delegetInner && delegetInner.length || 0 })
                me.views_.push(viewDeleteLen);
                $('#deleteBtn').html(viewDeleteLen.render().$el);
                this.model && this.listenTo(this.model, this.modelEvents);
                this.model && this.render();
            },

            render: function() {
                //_(this.views_).forEach(function(view) { view.render(); });
                return this;
            },
        });

        return BatchEditView;
    });