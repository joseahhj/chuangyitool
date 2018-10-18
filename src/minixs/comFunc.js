export default {
	methods: {
		//批量操作提示
		filterSelect(tag,mark,listLen,selectedLen){
			if(listLen==0){
				Jad.Modal.info({
					title:'提示',
					content: '暂时没有可选的'+mark+'，您可以先新建'+mark,
				})
				return false
			}
			if(selectedLen==0){
				Jad.Modal.info({
					title:'提示',
					content: '请选择需要'+tag+'的'+mark, 
				})

				return false
			}
			return true
		},
		getQueryString(name) {
		    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		    var r = window.location.search.substr(1).match(reg);
		    //var r = search.match(reg);
		    if (r != null) {
		        return unescape(r[2]);
		    }
		    return null;
		}
	}
}