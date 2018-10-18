'use strict';

define(['underscore'], function(_) {
    
    var ua = window.navigator.userAgent,
        msie = ua.indexOf('MSIE ');

    if (!window.console) {
        /* 
         * http://stackoverflow.com/questions/15949819/ie9-script-only-works-in-debugger-but-not-when-not-debugging
         */
        window.console = {
            info: function() {},
            warn: function() {},
            log: function() {},
            error: function() {},
            debug: function() {},
        };
    }
    
    var config = {};
    
    config.jsRoutes = jsRoutes;

    config.CREATIVE_PLATFORMS = [
        {
            key: 'qzone',  // SiteSetId="1"
            name: 'QQ空间',
        }, {
            key: 'friend',  // SiteSetId="8"
            name: '朋友社区',
        }, {
            key: 'qqClient',  // SiteSetId="9"
            name: 'QQ/Q+\n客户端',
        }, {
            key: 'qqMusic',  // SiteSetId="14"
            name: 'QQ音乐\n客户端',
        }, {
            key: 'mobile', // SiteSetId="15"
            name: '移动平台',
        }, {
            key: 'pc',  // SiteSetId="28"
            name: 'PC联盟',
        }, {
            key: 'qq',  // SiteSetId="19"
            name: '腾讯网',
        }, {
            key: 'misc',
            name: '其它',
        },
    ];
    
    config.CREATIVE_SPECS = _([
        {
            width: 135,
            height: 100,
            platforms: [{
                key: 'qzone',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/qzfeedsadx.png',
            }],
        },
        {
            width: 140,
            height: 140,
            platforms: [{
                key: 'qqClient',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/displaybox/qqshow140x140_x.jpg',
            }],
        },
        {
            width: 140,
            height: 226,
            platforms: [{
                key: 'pc',
                preview: null,
            }],
        },
        {
            width: 140,
            height: 240,
            platforms: [{
                key: 'misc',
                preview: null,
            }],
        },
        {
            width: 140,
            height: 40,
            platforms: [{
                key: 'qqClient',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/qq-chart-140x40x.jpg',
            }, {
                key:'qqMusic',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/displaybox/qqmusic-140-40x.jpg',
            }],
        },
        {
            width: 142,
            height: 185,
            platforms: [{
                key: 'friend',
                preview: 'http://qzonestyle.gtimg.cn/qzonestyle/sns/gdt/create/images/ad/py142x105_01x.jpg',
            }],
        },
        {
            width: 160,
            height: 120,
            platforms: [{
                key: 'qzone',
                preview: 'http://imgcache.qq.com/qzonestyle/sns/gdt/create/images/ad/160x120_02x.jpg',
            }, {
                key: 'friend',
                preview: 'http://imgcache.qq.com/qzonestyle/sns/gdt/create/images/ad/py160x120_01x.jpg',
            }],
        },
        {
            width: 160,
            height: 210,
            platforms: [{
                key: 'qzone',
                preview: 'http://imgcache.qq.com/qzonestyle/sns/gdt/create/images/ad/160x210_01x.jpg',
            }, {
                key: 'friend',
                preview: 'http://imgcache.qq.com/qzonestyle/sns/gdt/create/images/ad/py160x210_01x.jpg',
            }],
        },
        {
            width: 198,
            height: 100,
            platforms: [{
                key: 'qqClient',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/qq_198x100x.jpg',
            }],
        },
        {
            width: 198,
            height: 183,
            platforms: [{
                key: 'misc',
                preview: null,
            }],
        },
        {
            width: 198,
            height: 40,
            platforms: [{
                key: 'qqClient',
                preview: 'http://qzonestyle.gtimg.cn/qzonestyle/sns/gdt/create/images/ad/qqshow_01x.jpg',
            }],
        },
        {
            width: 200,
            height: 200,
            platforms: [{
                key: 'pc',
                preview: null,
            }],
        },
        {
            width: 200,
            height: 40,
            platforms: [{
                key: 'misc',
                preview: null,
            }],
        },
        {
            width: 220,
            height: 120,
            platforms: [{
                key: 'qzone',
                preview: 'http://qzonestyle.gtimg.cn/qzonestyle/sns/gdt/create/images/ad/220x160_01x.jpg',
            }, {
                key: 'qqMusic',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/displaybox/qqmusic-banner220x120x.jpg',
            }, {
                key: 'misc',
                preview: null,  
            }],
        },
        {
            width: 230,
            height: 92,
            platforms: [{
                key: 'qzone',
                preview: 'http://imgcache.qq.com/qzonestyle/sns/gdt/create/images/ad/230x92_01x.jpg',
            }, {
                key: 'friend',
                preview: 'http://imgcache.qq.com/qzonestyle/sns/gdt/create/images/ad/py_zzz_x.jpg',
            }],
        },
        {
            width: 240,
            height: 38,
            platforms: [{
                key: 'mobile',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/touch-qz-bannerx.png',
            }],
        },
        {
            width: 264,
            height: 54,
            platforms: [{
                key: 'qqMusic',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/displaybox/music264x54_03x.jpg',
            }],
        },
        {
            width: 270,
            height: 130,
            platforms: [{
                key: 'misc',
                preview: null,
            }],
        },
        {
            width: 300,
            height: 250,
            platforms: [{
                key: 'mobile',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/interstitial-ax.png',
            }],
        },
        {
            width: 300,
            height: 80,
            platforms: [{
                key: 'qqMusic',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/displaybox/qqmusic-indexx.jpg',
            }, {
                key: 'qq',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/newsad1x.jpg',
            }],
        },
        {
            width: 320,
            height: 50,
            platforms: [{
                key: 'mobile',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/touch-qz-bannerx.png',
            }],
        },
        {
            width: 350,
            height: 70,
            platforms: [{
                key: 'misc',
                preview: null,
            }],
        },
        {
            width: 480,
            height: 75,
            platforms: [{
                key: 'mobile',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/touch-qz-bannerx.png',
            }],
        },
        {
            width: 565,
            height: 250,
            platforms: [{
                key: 'qzone',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/565x250_01x.jpg',
            }, {
                key: 'friend',
                preview: 'http://imgcache.qq.com/qzonestyle/sns/gdt/create/images/ad/576x221_01x.jpg',
            }],
        },
        {
            width: 600,
            height: 500,
            platforms: [{
                key: 'mobile',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/interstitial-ax.png',
            }],
        },
        {
            width: 640,
            height: 100,
            platforms: [{
                key: 'mobile',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/touch-qz-bannerx.png',
            }],
        },
        {
            width: 72,
            height: 72,
            platforms: [{
                key: 'mobile',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/displaybox/lm-cp-qpx.jpg',
            }],
        },
        {
            width: 75,
            height: 75,
            platforms: [{
                key: 'qzone',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/75x75_05x.jpg',
            }, {
                key: 'qqClient',
                preview: 'http://qzonestyle.gtimg.cn/qzonestyle/sns/gdt/create/images/ad/py75x75_02x.jpg',
            }],
        },
        {
            width: 760,
            height: 75,
            platforms: [{
                key: 'qzone',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/760x75_01x.jpg',
            }],
        },
        {
            width: 760,
            height: 90,
            platforms: [{
                key: 'misc',
                preview: null,
            }],
        },
        {
            width: 960,
            height: 75,
            platforms: [{
                key: 'qzone',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/960x75_01.jpg',
            }, {
                key: 'pc',
                preview: null,
            }],
        },
        {
            width: 960,
            height: 90,
            platforms: [{
                key: 'misc',
                preview: null,
            }],
        },
        {
            width: 1000,
            height: 560,
            platforms: [{
                key: 'mobile',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/gdt_advertise/ad/qzfeeds2-sjx.png',
            }],
        },
        {
            width: 120,
            height: 387,
            platforms: [{
                key: 'misc',
                preview: null,
            }],
        },
        {
            width: 210,
            height: 100,
            platforms: [{
                key: 'qqClient',
                preview: 'http://qzonestyle.gtimg.cn/img/displaybox/qq-search-210-100-x.png',
            }],
        },
        {
            width: 300,
            height: 120,
            platforms: [{
                key: 'misc',
                preview: null,
            }],
        },
        {
            width: 512,
            height: 120,
            platforms: [{
                key: 'qzone',
                preview: 'http://qzonestyle.gtimg.cn/open_proj/img/displaybox/icent-feedsx.jpg',
            }],
        },
    ]).sortBy(function(spec) {
        return spec.width * spec.height;
    }).reverse();
    
    return config;
});