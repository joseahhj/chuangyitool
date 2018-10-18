
    function printHeader(pin, activeId, _domain, _callback, _toAppendZt, _showNotice) {
        if (_domain == void 0) {
		    _domain="";
		}
		if(_domain.indexOf('//injzt.jd.com')>-1 || _domain.indexOf('//mmjzt.jd.com')>-1 ){
            var domain = _domain;
        }else{
            var domain = "//jzt.jd.com";
        }

        document.writeln('<link rel="stylesheet" type="text/css" href="//misc-jzt.jd.com/jzt/css/topbar-new2015.css" />');
        document.writeln('<link rel="stylesheet" type="text/css" href="//misc-jzt.jd.com/jzt/css/font.css" />');
        document.writeln('<link rel="stylesheet" type="text/css" href="//misc-jzt.jd.com/jzt/css/jzt_page.css" />');
        document.writeln('<link rel="stylesheet" type="text/css" href="//misc-jzt.jd.com/jzt/css/topbar_2th.css" />');
        document.writeln('<div class="jztHeader_2">');
        document.writeln('<div class="logo"><a href="' + domain + '"></a></div>');
        document.writeln('<div class="nav relative"><ul>');
        document.writeln('<li class="dropdown">');
        document.writeln('<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">营销产品<span class="icon-caret-down vm offset5"></span></a>');
        document.writeln('<ul class="dropdown-menu">');
                    document.writeln('<li id="header_jxzw"><a href="' + domain + '/featured/jindex">京选展位</a></li>');
                        document.writeln('<li id="header_union"><a href="//jtk-jzt.jd.com">京挑客</a></li>');
        					document.writeln('<li id="header_feeds"><a href="' + domain + '/feeds/index">京东智推</a></li>');
		        document.writeln('</ul>');
        document.writeln('</li>');

        document.writeln('<li class="dropdown">');
        document.writeln('<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">平台工具<span class="icon-caret-down vm offset5"></span></a>');
        document.writeln('<ul class="dropdown-menu">');
                    document.writeln('<li id="header_dmp">');
            document.writeln('<a href="' + domain + '/dmp/tag/list">DMP</a>');
            document.writeln('</li>');
                                        document.writeln('<li id="header_cxtb">');
        document.writeln('<a href="//hd-jzt.jd.com">活动提报</a>');
        document.writeln('</li>');
         document.writeln('<li id="header_cygj">');
        document.writeln('<a href="' + domain + '/picmaker/template.html">创意工具</a>');
        document.writeln('</li>');       
        document.writeln('</ul>');
        document.writeln('</li>');
		        document.writeln('<li class="dropdown" id="header_account">');
        document.writeln('<a class="dropdown-toggle" href="' + domain + '/v/subAccount/info" >我的账户</a>');
        document.writeln('</li>');
        document.writeln('</ul>');

        <!-- 新手引导 -->
        document.writeln('<div class="guide-panel" id="new_guide_panel" style="display: none;">');
        document.writeln('<div class="guide-inner relative">');
        document.writeln('<div class="arrow"></div>');
        document.writeln('<div class="guide-content">');
        document.writeln('<span><img src="//misc-jzt.jd.com/jzt/images/guide.jpg" width="355" height="218" alt=""></span>');
        document.writeln('</div>');
        document.writeln('<div class="guide-header">');
        document.writeln('<a  id="guide_header_common" data-dismiss="modal" tabindex="-1" aria-hidden="false">×</a>');
        document.writeln('</div>');
        document.writeln('</div>');
        document.writeln('</div>');
        document.writeln('</div>');

        document.writeln('<div id="profile-status">');
        document.writeln('<ul>');
        document.writeln('<li class="i">');
        document.writeln('<i class="icon-user"></i>');
        document.writeln('<span>pin：</span>');
        document.writeln('<span>' + pin + '</span>');
        document.writeln('</li>');
        if (_showNotice === false) {
            document.writeln('<li id="fat-menu" class="dropdown">');
            document.writeln('<a id="drop" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">');
            document.writeln('<i class="icon-envelope"></i><em id="letter_count"></em>站内信<span class="caret"></span></a>');
            document.writeln('<ul class="dropdown-menu" id="inner-dropdown-menu" aria-labelledby="drop3">');
            document.writeln('</ul>');
            document.writeln('</li>');
        }
        document.writeln('<li><a href="' + domain + '/ca/logout"><i class="icon-logout"></i><span>退出</span></a></li>');
        document.writeln('<li><a href="' + domain + '/msg/"><i class="icon-help"></i><span>建议</span></a></li>');
            document.writeln('<li><i class="icon-new-right"></i><a href="//xjzt.jd.com/calss/index.jhtml"><i class="icon-learn"></i><span>在线学习</span></a></li>');

        document.writeln('</ul>');
        document.writeln('</div>');
        document.writeln('</div>');


        //高亮
        var lDom = document.getElementById(activeId);
        if(!!lDom){
            if(lDom.className != ""){
                lDom.className = 'dropdown active';
            }else{
                lDom.className = 'active';
            }
        }

        //回调
        !!_callback && _callback();


        if (typeof _showNotice == "undefined" || _showNotice == false) {
            if (typeof define === 'function' && define.amd && define.amd.jQuery) {
                require(['jquery'], loadMsgInfo);
            } else {
                loadMsgInfo($);
            }
        }


        if (typeof define === 'function' && define.amd && define.amd.jQuery) {
            require(['jquery'], ready);
        } else {
            ready($);
        }



        //站内信
        function loadMsgInfo($) {
            var last = '<li><a href="/notice/list" target="_blank">查看全部</a></li>';

            $.ajax({
                url: domain + '/notice/index_inner_letter',
                dataType: 'jsonp',
                success: function (_res) {

                    try {
                        if (_res.success) {

                            var len = _res.data.length;
                            if (len > 0 && len <= 99) {
                                $("#letter_count").addClass('letter-num').text(len);
                                $(".fat-menu").addClass('open');
                            }
                            if (len > 99) {
                                $("#letter_count").addClass('letter-num').text("99+");
                                $(".fat-menu").addClass('open');
                            }

                            var strArray = [];
                            for (var i = 0; i < len; i++) {
                                if (i > 2) break;
                                strArray.push('<li><a href="javaScript:;"  target="_blank" class="noticeUrl" notice-value="' + _res.data[i].noticeBelongTo + '" notice-id="' + _res.data[i].id + '"><span class="icon-circle2"></span>' + _res.data[i].subject + '</a></li>');
                            }
                            if (strArray.length > 0) {
                                strArray.push('<li role="separator" class="divider line"></li>');
                            }

                        }
                        $("#inner-dropdown-menu").append(strArray.join("")).append(last);
                    } catch (e) {
                    }
                }
            });

        }


        function ready() {

            var hrefMap = {
                1: '//jzt.jd.com/v/subAccount/info',
                2: '//jzt.jd.com/v/subAccount/info',
                3: '//jzt.jd.com/v/subAccount/info',
                4: '//dl.jzt.jd.com/r/rlist',
                5: '//dl.jzt.jd.com/entrust/list',
                6: '//dl.jzt.jd.com/entrust/list',
                7: '//dl.jzt.jd.com/entrust/list',
                8: '//dl.jzt.jd.com/entrust/list',
                9: '//jzt.jd.com/camp',
                10: '//jzt.jd.com/fcpm/campaign/list'
            };

            $(function () {
                $("body").on('click', '.noticeUrl', function (e) {
                    var flag = e.target.attributes.getNamedItem('notice-value').value;
                    var id = e.target.attributes.getNamedItem('notice-id').value;
                    $.ajax({
                        url: domain + '/notice/inner_letter?id=' + id,
                        dataType: 'jsonp',
                        success: function (_res) {
                            var belongTo = _res.data.noticeBelongTo;
                            var tempwindow = window.open('_blank');
                            var url = hrefMap[belongTo] || '//jzt.jd.com/v/subAccount/info';
                            tempwindow.location = url;
                        }

                    })
                });

            });

        }
    }
