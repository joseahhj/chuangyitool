/**
 * 
 */
'use strict';

define(['jquery', 'underscore', './BaseEditPanel', 'file_upload'],
        function($, _, BaseEditPanel) {

    /**
     * ImageEditView defines the dialog to show when user edits an Image
     * element.
     * 
     * @constructor
     */
    var ImageEditView = BaseEditPanel.extend({
        initialize: function() {
    
        },
        modelEvents: {
            'change': function() { this.render(); },
        },
        
        events: {
            //'change .opacity': 'onChangeOpacity',
            'change #fileLoad': function(){               
                if(this.oncheckFile('fileLoad')){                   
                    this.onChangeFile();
                }
            }
        },
        oncheckFile :function(fileid){ 
            var fileSize =0; 
            if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test($("#" + fileid).val())) {  
                alert("图片类型必须是jpeg,jpg,png中的一种");  
                $("#" + fileid).val('');  
                return false;  
            }else{
                if ($.support.msie) {
                    var objFSO = new ActiveXObject("Scripting.FileSystemObject"); 
                    var filePath = $("#" + fileid)[0].value;
                    var objFile = objFSO.getFile(filePath);
                    fileSize = objFile.size;
                } else{
                     fileSize = $("#" + fileid)[0].files[0].size //size in kb
                }
                if(fileSize>200*1024){
                    alert('图片超过200Kb啦！！');
                    return false;  
                }                
            };
            return true;
        },
        onChangeFile:function(){
            var _this = this;
            var id=$('#fileLoad').attr("id");
            $.ajaxFileUpload({
                url:'/picmaker/template/upload',
                secureuri:false,
                fileElementId:id,
                data: {"fileId": id},
                dataType: 'json',
                success: function (data){                    
                    if(data.code == 1){  
                        var newData =  data.content;  
                        _this.updateModel({
                            'xlinkHref': newData.src, 
                            'width': newData.width,
                            'height': newData.height              
                        });                      
                    }else{                           
                       alert(data.msg)
                    }
                },
                error: function (data){
                    alert("上传失败，请重试！");
                }
            });
        },
        onChangeOpacity: function(e) {
            var opacity = this.$('.opacity').DropDownSlider('option', 'value') / 100;
            this.updateModel({'opacity': opacity});
        },
        render: function() {
            var json = this.model.toJSON();            
            this.$('input:file').prop('disabled', this.model.get('locked'));
             var widgetStatus = this.model.get('locked') ? 'disable' : 'enable';
            // this.$('.opacity').DropDownSlider(widgetStatus);
            
            this.$('.group').toggle(this.model.has('groupId'));

            return this;
        },
        
        remove: function() {
           // this.$('.opacity').DropDownSlider('destroy');
            BaseEditPanel.prototype.remove.apply(this, arguments);
        },
    });

    return ImageEditView;
});