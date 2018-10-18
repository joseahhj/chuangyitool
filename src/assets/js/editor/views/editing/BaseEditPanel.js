/**
 * 
 */
'use strict';

define(['backbone'],
    function(Backbone) {

        var BaseEditPanel = Backbone.View.extend({

            initialize: function(options) {},

            modelEvents: {},

            setModel: function(newModel) {
                this.model && this.stopListening(this.model);
                this.model = newModel;
                this.model && this.listenTo(this.model, this.modelEvents);
                this.model && this.render();
            },

            updateModel: function(changedAttributes) {
                if (!this.model) {
                    console.error('this.model is missing!', this.model);
                    return false
                }
                this.model.set(changedAttributes, { validate: true, revocable: true });
            },
        });

        return BaseEditPanel;
    });