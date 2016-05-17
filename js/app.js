/*
 * CSS Document for 应用
 * http://xxx.com/
 *
 * author wen
 * http://www.xxx.com/
 * 业务脚本
 * Date: 2016-xx-xx
 * 1、公共
 * 2、首页卡片菜单
 * 3、应用列表
 * 4、图片加密
 * 5、LESS编译CSS
 */

/******************************
 -	1、公共	-
 ********************************/
const remote = require('electron').remote;
const win = remote.getCurrentWindow();
const dialog = remote.dialog;
const fs = require("fs");
const less = require('less');

$(".button").button();
$(document).on("click",".app_max",function(){
    var $this = $(this);
    if($this.hasClass("on")){
        $this.removeClass("on").attr("title","最大化窗口");
        win.unmaximize();
        $this.addClass("fa-plus-square-o").removeClass("fa-square-o");
    }else{
        $this.addClass("on").attr("title","还原窗口");
        win.maximize();
        $this.addClass("fa-square-o").removeClass("fa-plus-square-o");
    }
});
$(document).on("click",".app_min",function(){
    var $this = $(this);
    win.minimize();
});
$(document).on("click",".app_close",function(){
    var $this = $(this);
    win.close();
});

/******************************
 -	2、首页卡片菜单	-
 ********************************/
var Effect = function( a, w, h, s, p, x, y, callback){
    var _3Deffect = function( array , width, height, stage, per, x, y, callback ){
        this.oDoc = stage[0];

        this.stage = stage;

        this.width = width;

        this.height = height;

        this.path = array;

        this.domStr = "<dt id=\"shadow\"></dt>";

        this.perspective = per,

            this.rotateX = x,

            this.rotateY = y,

            this.speedX = 0,

            this.speedY = 0,

            this.zoom = 1;

    }

    _3Deffect.prototype = {

        transform : function( elem, value, key ){
            key = key || "transform";

            [ "-webkit-", "-moz-", "-ms-", "-o-", "" ].forEach( function( pre )
            {
                elem.style[ pre + key ] = value;
            });

            return elem;
        },

        piece : function( value, key ){
            var str = "";

            key = key || "transform";

            [ "-webkit-", "-moz-", "-ms-", "-o-",  "" ].forEach( function( pre )
            {
                str += ( key + ":" + pre + value );
                return false;
            });

            return str;
        },

        addEvent : function ( obj, sEvent, fn ){
            if( obj.attachEvent )
            {
                obj.attachEvent( "on" + sEvent, fn );
            }
            else
            {
                obj.addEventListener( sEvent, fn, false );
            };
        },

        onMouseWheel : function( e ){
            var _o = this;
            if( e.wheelDelta ? e.wheelDelta < 0 : e.detail > 0 ){
                if(_o.zoom > .2){
                    _o.zoom -= .1;
                }
            }else{
                if(_o.zoom < 1){
                    _o.zoom += .1;
                }
            };

            _o.transform( _o.stage[0], "perspective(" + _o.perspective + "px) rotateX("+ _o.rotateX +"deg) rotateY(" + _o.rotateY +"deg)" );
            _o.transform( _o.stage[0], _o.zoom ,"zoom");

            if( e.preventDefault )
            {
                e.preventDefault();
            };

            return false;
        },

        startMove : function startMove( obj ){
            var _o = this;

            obj.timer = obj.timer || null;

            clearInterval( obj.timer );

            obj.timer = setInterval (function ()
            {
                _o.rotateX -= _o.speedY;
                _o.rotateY += _o.speedX;

                _o.speedY *= 0.93;
                _o.speedX *= 0.93;

                if( Math.abs( _o.speedX ) < 0.1 && Math.abs( _o.speedY ) < 0.1 )
                {
                    _o.stopMove( obj.timer );
                };

                _o.transform( obj, "perspective(" + _o.perspective + "px) rotateX("+ _o.rotateX +"deg) rotateY(" + _o.rotateY +"deg)" );
                _o.transform( _o.stage[0], _o.zoom ,"zoom");

            }, 30);
        },

        stopMove : function( t ){
            clearInterval( t );
        },

        init : function(){
            var _o = this;

            $.each( _o.path, function( i,n ){
                var temp_n = Math.random()*350;
                if(typeof n == "object"){
                    var shadow = _o.piece( "linear-gradient(top, rgb(0, 0, 0) 50%, rgba(255, 255, 255, .2));", "background-image" ),
                        shadow = "<div class=\"over\" style=\"opacity:0.2;" + shadow + "\"></div>";

                    _o.domStr += '<dd class="menu" data-url="'+ n.url +'" style="background:url(images/bg.jpg) '+ temp_n +'px '+ temp_n +'px"><div class="menu_txt"><h1>' + n.title + '</h1><p>'+ n.detail +'</p></div>'+ shadow +'</dd>';
                }else{
                    var shadow = _o.piece( "linear-gradient(top, rgb(0, 0, 0) 50%, rgba(255, 255, 255, 0)), url(" + this + ");", "background-image" ),
                        shadow = "<div class=\"over\" style=\"opacity:0.2;" + shadow + "\"></div>";

                    _o.domStr += "<dd style=\"background-image:url("+ this +");\">" + shadow + "</dd>";
                }
            });

            $( _o.stage ).html( _o.domStr );

            var _oList = $( "dd",  _o.stage ),

                _sLen = _o.path.length,

                _deg = 360/_sLen,

                _tranZ = ( _o.width/2 + 40 ) / Math.tan( ( 360/_sLen/2 ) * Math.PI / 180 ),

                _i = _sLen;

            while( _i > 0 ){
                ( function( d, len, _oList, _o ){
                    setTimeout( function(){
                        var idx = len - d,
                            oThis = _oList[ idx ]

                        //oThis.children[0].style.opacity = 0.2;

                        _o.transform( oThis, "rotateY(" + ( idx*_deg ) +"deg) translateZ(" + _tranZ + "px)" );

                    }, d * 200 );

                })( _i-- , _sLen, _oList, _o );
            };

            var wheel = function( e ){
                _o.onMouseWheel.call( _o, e || window.event );
            };

            _o.addEvent( _o.oDoc, "mousewheel", wheel );
            _o.addEvent( _o.oDoc, "DOMMouseScroll", wheel );

            var AuiDoc = $( _o.oDoc );

            AuiDoc.mousedown( function( e ){
                var moveX = e.clientX,
                    moveY = e.clientY;

                var startX = _o.rotateX;
                var startY = _o.rotateY;

                var lastX = moveX;
                var lastY = moveY;

                _o.speedX = _o.speedY = 0;

                AuiDoc.mousemove( function( e ){
                    var x = e.screenX,
                        y = e.screenY;

                    _o.rotateX = startX - ( e.clientY - moveY )/10;
                    _o.rotateY = startY + ( e.clientX - moveX )/10;

                    _o.transform( _o.stage[0], "perspective("+ _o.perspective +"px) rotateX("+ _o.rotateX +"deg) rotateY(" + _o.rotateY +"deg)" );
                    _o.transform( _o.stage[0], _o.zoom ,"zoom");

                    _o.speedX =( e.clientX - lastX )/5;

                    _o.speedY =( e.clientY - lastY )/5;

                    lastX = e.clientX;
                    lastY = e.clientY;

                });

                AuiDoc.mouseup( function(e){
                    var $this = $(this);
                    $this.off("mousemove");
                    $this.off("mouseup");

                    var upX = e.clientX,
                        upY = e.clientY;

                    if(upX == moveX && upY == moveY){
                        if($(e.target).parents().is(".menu")){
                            typeof callback == "function"?callback(_o,$(e.target).parents(".menu")):"";
                        }
                    }else{
                        _o.startMove( _o.stage[0] );
                    }
                });

                _o.stopMove( _o.stage[0].timer );

                return false;
            } );

            return _o;
        }

    };

    return new _3Deffect( a, w, h, s, p, x, y, callback);
};

$( function(){
    var path = [
        "images/01.jpg",
        "images/02.jpg",
        "images/03.jpg",
        "images/01.jpg",
        "images/02.jpg",
        "images/03.jpg",
        "images/01.jpg",
        "images/02.jpg",
        "images/03.jpg",
        "images/01.jpg",
        "images/02.jpg",
        "images/03.jpg",
        "images/01.jpg",
        "images/02.jpg",
        "images/03.jpg",
        "images/01.jpg",
        "images/02.jpg",
        "images/03.jpg"
    ];
    var path = [
        {"title":"HTML","detail":"详细说明详细说明详细说明详细说明"},
        {"title":"JavaScript","detail":"详细说明详细说明详细说明详细说明"},
        {"title":"CSS","detail":"详细说明详细说明详细说明详细说明"},
        {"title":"nodeJS","detail":"详细说明详细说明详细说明详细说明"},
        {"title":"PhoneGap","detail":"详细说明详细说明详细说明详细说明"},
        {"title":"Cordova","detail":"详细说明详细说明详细说明详细说明"},
        {"title":"Other","detail":"详细说明详细说明详细说明详细说明"},
        {"title":"PHP","detail":"详细说明详细说明详细说明详细说明"},
        {"title":"图像加密","detail":"用于对PNG图像进行加密，防止他人盗图，起到保护版权作用。","url":"applist/index.html"}
    ];

    $.ajax({
        type: "GET",
        url: "data/menu.json",
        dataType: 'json',
        success: function(response) {
            path = response;
            Effect( path,200,300,$("#stage"),2000,-8,0,function(o,e){
                //console.log(o);
                $("#stage").off();
                o.transform( e[0], "10","z-index" );
                o.transform( e[0], "scale(.5)" );
                window.setTimeout(function(){
                    e.siblings().each(function(i,n){
                        o.transform( n, "scale(.5)" );
                    });
                },1000);
                o.transform( $("#stage")[0], "800ms all ease 1s", "transition" );
                window.setTimeout(function(){
                    $("#stage").css("transform","translateY(-3000px)");
                    window.setTimeout(function(){
                        $(".loading").fadeIn(function(){
                            $.ajax({
                                type: "GET",
                                url: e.data("url"),
                                dataType: 'html',
                                success: function(response) {
                                    //console.log(response);
                                    $(".app_page").html(response);
                                    $("html").addClass("encrypt");
                                    $(".loading").fadeOut(2000);
                                    $(".button").button();
                                },
                                error: function (e) {
                                    $(".app_menu").trigger("click");
                                }
                            });
                        });

                    },1500);
                },1500);
            }).init();
        },
        error: function (e) {
            alert("获取菜单数据出错！");
        }
    });

    /******************************
     -	3、应用列表	-
     ********************************/
    $(document).on("click",".app_menu",function(){
        var bgColors = ["CF001F","F43C12","C3522F","D35400","1D64A2","4198D9","D35400","2EA77B","52B054","1ABC9C","46BFBD","F0DB4F","E0853B","222222","1E2B33","605E5E","B9BFC1"];
        var list = [],l = bgColors.length;
        $(".loading").fadeIn(function(){
            $.ajax({
                type: "GET",
                url: "data/menu.json",
                dataType: 'json',
                success: function(response) {
                    $.each(response,function(i,n){
                        var c = Math.floor(Math.random()*l);
                        var t = '<div class="menu_list animated bounceIn" style="border-color:#'+ bgColors[c] +'" data-url="'+ n.url +'"><h1 style="background-color:#'+ bgColors[c] +';">'+ n.title +'</h1><p>'+ n.detail +'</p></div>';
                        list.push(t);
                    });
                    $(".app_page").html('<section class="section menu_page embed_page"><div class="menu_listbox">'+ list.join("") +'</div></section>');
                    $(".loading").fadeOut();
                },
                error: function (e) {
                    dialog.showMessageBox({
                        type:"error",//"none", "info", "error", "question" 或 "warning"
                        buttons:["确定"],
                        defaultId:0,
                        title:"提示",
                        message:"无法获取应用列表！",
                        cancelId:0
                    },function(){

                    });
                }
            });
        });
    });
    $(".app_page").on("click",".menu_list",function(){
        var $this = $(this);
        var pageUrl = $this.data("url");
        $(".loading").fadeIn(function(){
            $.ajax({
                type: "GET",
                url: pageUrl,
                dataType: 'html',
                success: function(response) {
                    //console.log(response);
                    $(".app_page").html(response);
                    $("html").addClass("encrypt");
                    $(".loading").fadeOut(2000);
                    $(".button").button();
                },
                error: function (e) {
                    $(".app_menu").trigger("click");
                }
            });
        });

    });

    /******************************
     -	4、图片加密	-
     ********************************/
    //加解密切换
    $(".app_page").on("click","#triggerEncrypt",function(){
        var $this = $(this);
        if($this.hasClass("on")){
            //$this.text("我要加密");
            $this.button( "option", "label", "我要加密" );
            $this.prev("h1").html("图片解密（针对已经加密的图片）");
            $(".decode_cz_box").show();
            $(".encrypt_cz_box").hide();
            $this.removeClass("on");
        }else{
            //$this.text("我要解密");
            $this.button( "option", "label", "我要解密" );
            $this.prev("h1").html("图片防盗版加密（只支持输出PNG格式）");
            $(".decode_cz_box").hide();
            $(".encrypt_cz_box").show();
            $this.addClass("on");
        }

    });

    //保存路径
    $(".app_page").on("click","#encryptSelectPath",function(){
        dialog.showOpenDialog({
            title:"选择保存加密图片路径",
            properties:['openDirectory']//['openFile','openDirectory', 'multiSelections']
        },function(path){
            console.log(path&&path.length&&path[0]);
            path&&path.length&&$(".show_path").val(path[0]);
        });
    });

    var files = [],savePath="",imgN = 0;
    function analyzeFiles(f){
        var l = f.length,i = 0;
        if(l>0){
            var checkType = true,getpath = true;
            !$("#picBox ul").length&&$("#picBox").append("<ul>");
            for(;i<l;i++){
                var file = f[i];
                getpath?savePath=file.path:"";
                function readfile(file,i){
                    getpath = false;
                    var reader = new FileReader();
                    if(/image\/png/.test(file.type)||/image\/jpg/.test(file.type)||/image\/jpeg/.test(file.type)) {
                        imgN += 1;
                        function rf(file,imgN){
                            reader.onload = function() {
                                var img = new Image();
                                img.onload = function(){
                                    var h = img.height;
                                    var w = img.width;

                                    var canv = document.createElement("canvas");
                                    canv.id = "oldPic"+imgN;
                                    canv.setAttribute("height",h);
                                    canv.setAttribute("width",w);
                                    canv.style.display = "none";
                                    document.getElementById("picBox").appendChild(canv);

                                    var ctx = canv.getContext('2d');
                                    ctx.drawImage(img, 0, 0);
                                    // 获取指定区域的canvas像素信息
                                    var oldData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

                                    var f = {};
                                    f.name = file.name;
                                    f.path = file.path;
                                    f.id = "oldPic"+imgN;
                                    f.data = oldData;
                                    files.push(f);

                                    $("#picBox ul").append( $("<li>").append(img).append('<i class="fa fa-close del_encrypt" title="删除" data-id="'+ f.id +'" aria-hidden="true"></i>') );
                                }
                                img.src = this.result;
                            }
                            reader.readAsDataURL(file);
                        }
                        rf(file,imgN);
                    }else{
                        if(checkType){
                            //alert("非png/jpg图片文件，将自动忽略");
                            dialog.showMessageBox({
                                type:"warning",//"none", "info", "error", "question" 或 "warning"
                                buttons:["确定"],
                                defaultId:0,
                                title:"提示",
                                message:"非png/jpg图片文件，将自动忽略！",
                                cancelId:0
                            },function(){

                            });
                            checkType = false;
                        }
                    }
                }

                readfile(file,i);

            }
            if(!imgN){
                $("#selectPic").val("");
                files=[];
                $("#picBox ul,#picBox canvas").remove();
                $("#picBox").removeClass("flex-start");
            }else{
                //selectPic.style.display = "none";
                $("#selectPic").parent().hide();
                $("#picBox").addClass("flex-start");
            }
        }
    }
    //选择图片
    $(document).on("change","#selectPic",function(){
        var $this = $(this);
        analyzeFiles($this[0].files);
        return false;
    });
    //图片拖拽
     $(document).on("dragover","#picBox",function(e){
        //console.log("dragover----#picBox");
        e.preventDefault();
        return false;
    });
    //图片拖拽
    $(document).on("drop","#picBox",function(e){
        console.log("drop----#picBox");
        var f = e.originalEvent.dataTransfer.files;
        var newLessFiles = [];
        var checkRepeat = true;
        $.each(f,function(i,n){
            var newName = n.name;
            var newPath = n.path;
            var repeat = false;
            $.each(files,function(b,a){
                var fname = a.name;
                var fpath = a.path;
                if(fname == newName && fpath == newPath){
                    //f.splice(i,1);
                    repeat = true;
                    if(checkRepeat){
                        dialog.showMessageBox({
                            type:"warning",//"none", "info", "error", "question" 或 "warning"
                            buttons:["确定"],
                            defaultId:0,
                            title:"提示",
                            message:"存在相同文件，将自动忽略！",
                            cancelId:0
                        },function(){

                        });
                        checkRepeat = false;
                    }
                    return false;
                }
            });
            if(!repeat){
                typeof n == "object"?newLessFiles.push(n):"";
            }
        });
        f = newLessFiles;
        analyzeFiles(f);
        e.preventDefault();
        return false;
    });

    //清空
    $(".app_page").on("click","#encryptClearAll,#encryptClearAll1",function(){
        $("#selectPic").val("");
        files=[];
        savePath="";
        imgN = 0;
        $(".encrypt_tips").show();
        $("#picBox").removeClass("box_normal flex-start");
        $("#picBox ul,#picBox canvas").remove();
    });
    //删除
    $(".app_page").on("click",".del_encrypt",function(){
        var $this = $(this);
        var _id = $this.data("id");
        $this.parent("li").remove();
        $.each(files,function(i,n){
            if(n.id == _id){
                files.splice(i,1);
                $("#picBox canvas#"+id).remove();
                return false;
            }
        });
        if(files.length == 0){
            $(".encrypt_tips").show();
            savePath="";
            $("#picBox ul,#picBox canvas").remove();
            $("#picBox").removeClass("flex-start");
        }
    });
    //加密
    $(".app_page").on("click","#encrypt",function(){
        //var pic = $("#selectPic").val();
        var txt = $("#copyrightTxt").val();
        var i = 0,l = files.length;
        if((!txt)||l==0){
            dialog.showMessageBox({
                type:"warning",//"none", "info", "error", "question" 或 "warning"
                buttons:["确定"],
                defaultId:0,
                title:"提示",
                message:"请选择要加密的图片并输入加密信息！",
                cancelId:0
            },function(){

            });
            return false;
        }

        if(!!$(".show_path").val()){
            savePath = $(".show_path").val().replace(/\\/g,"/");
        }else{
            savePath = savePath.replace(/[\/|\\]\w+\.(jpg|png)/,"");
            savePath = savePath.replace(/\\/g,"/")+'/encrypt';
            if(!fs.existsSync(savePath)){
                fs.mkdirSync(savePath);
            }
        }
        for(;i<l;i++){
            var h = files[i].data.height;
            var w = files[i].data.width;
            var oldData = files[i].data;
            var canvTxt = document.createElement("canvas");
            canvTxt.setAttribute("height",h);
            canvTxt.setAttribute("width",w);

            //var ctx1 = document.getElementById('canvTxt').getContext('2d');
            var ctx1 = canvTxt.getContext('2d');
            ctx1.font = '20px bold';
            ctx1.fillStyle = 'red';
            ctx1.textAlign="center";
            ctx1.fillText(txt, w*.5, h*.5);
            var newData = ctx1.getImageData(0, 0, ctx1.canvas.width, ctx1.canvas.height).data;
            //console.log(newData);

            var encrypt_1 = new copyrightPic();
            var newPic = encrypt_1.mergeData(oldData,newData);
            ctx1.putImageData(newPic, 0, 0);

            //更新files数组对应的data
            files[i].data.data = newPic;
            //修改保存的图片类型，但会毁坏加密信息（加密信息只支持png格式）
            var newImg = new Image();
            //参数1：类型；参数2：质量（清晰度）
            //newImg.src = ctx1.canvas.toDataURL("image/jpeg",.2);
            newImg.src = ctx1.canvas.toDataURL();

            var picBuffer = ctx1.canvas.toDataURL().replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(picBuffer, 'base64');

            function wf(dataBuffer,i){
                fs.writeFile(savePath + '/' +Date.now()+".png", dataBuffer , function(err){
                    if(err){
                        dialog.showMessageBox({
                            type:"error",//"none", "info", "error", "question" 或 "warning"
                            buttons:["确定"],
                            defaultId:0,
                            title:"出错提示",
                            message:"文件写入失败！",
                            detail:files[i].name,
                            cancelId:0
                        },function(){

                        });
                    }else{
                        if(i == l-1){
                            dialog.showMessageBox({
                                type:"none",//"none", "info", "error", "question" 或 "warning"
                                buttons:["确定"],
                                defaultId:0,
                                title:"加密提示",
                                message:"加密完成！",
                                detail:"文件保存在："+savePath,
                                cancelId:0
                            },function(){

                            });
                        }
                    }

                });
            }
            wf(dataBuffer,i);
        }

    });

    //解密
    $(".app_page").on("click","#encryptDecode",function(){
        var i = 0,l = files.length;
        if(l==0){
            dialog.showMessageBox({
                type:"warning",//"none", "info", "error", "question" 或 "warning"
                buttons:["确定"],
                defaultId:0,
                title:"提示",
                message:"请选择要解密的图片！",
                cancelId:0
            },function(){

            });
            return false;
        }
        for(;i<l;i++){
            var encrypt_decode = new copyrightPic();
            var newPic = encrypt_decode.processData(files[i].data);
            var ctx = $("canvas#"+files[i].id)[0].getContext('2d');
            ctx.putImageData(newPic, 0, 0);
        }
        dialog.showMessageBox({
            type:"none",//"none", "info", "error", "question" 或 "warning"
            buttons:["确定"],
            defaultId:0,
            title:"解密提示",
            message:"解密完成！",
            cancelId:0
        },function(){
            $("#picBox ul").hide();
            $("#picBox").addClass("box_normal");
            $("#picBox canvas").css({"display":"block","margin":"10px auto","max-width":"100%"}).show();
        });
    });



    /******************************
        -	5、LESS编译CSS	-
     ********************************/
    //切换
    $(".app_page").on("click","#triggerLess",function(){
        var $this = $(this);
        if($this.hasClass("on")){
            $this.button( "option", "label", "编译文件" );
            $(".decode_cz_box").show().css({"opacity":0}).animate({"opacity":1},1000);
            $(".now_less").css({"display":"flex","opacity":0}).animate({"opacity":1},1000);
            $(".encrypt_cz_box,.encrypt_picbox").hide();
            $this.removeClass("on");
        }else{
            $this.button( "option", "label", "实时编译" );
            $(".decode_cz_box").hide();
            $(".now_less").hide();
            $(".encrypt_cz_box,.encrypt_picbox").show().css({"opacity":0}).animate({"opacity":1},1000);
            $this.addClass("on");
        }
    });
    var lessFiles = [],lessSavePath="",lessN = 0;
    function analyzeLessFiles(f){
        var l = f.length,i = 0;
        if(l>0){
            var checkType = true,getpath = true;
            !$("#lessBox .less_file_list").length&&$("#lessBox").append("<div class='less_file_list'>");
            for(;i<l;i++){
                var file = f[i];
                getpath?lessSavePath=file.path:"";
                function readfile(file,i){
                    getpath = false;
                    if(/(\.less)|(\.less)$/.test(file.name)) { //less文件没有type类型，只能以后缀名判断
                        lessN += 1;
                        var f = {};
                        f.name = file.name;
                        f.id = "oldPic"+imgN;
                        f.path = file.path;
                        lessFiles.push(f);
                        $("#lessBox .less_file_list").append( $("<p>").append('<span>'+ file.path +'</span>').append('<i class="fa fa-close del_less" title="删除" data-id="'+ f.id +'" aria-hidden="true"></i>') );

                    }else{
                        if(checkType){
                            dialog.showMessageBox({
                                type:"warning",//"none", "info", "error", "question" 或 "warning"
                                buttons:["确定"],
                                defaultId:0,
                                title:"提示",
                                message:"非less文件，将自动忽略！",
                                cancelId:0
                            },function(){

                            });
                            checkType = false;
                        }
                    }
                }

                readfile(file,i);

            }
            if(!lessN){
                $("#selectLess").val("");
                lessFiles=[];
                $("#lessBox .less_file_list").remove();
                $("#lessBox").removeClass("flex-start");
            }else{
                //selectPic.style.display = "none";
                $("#selectLess").parent().hide();
                $("#lessBox").addClass("flex-start");
            }
        }
    }
    //选择less文件
    $(document).on("change","#selectLess",function(){
        var $this = $(this);
        analyzeLessFiles($this[0].files);
        return false;
    });
    //拖拽
    $(document).on("dragover","#lessBox",function(e){
        e.preventDefault();
        return false;
    });
    //less文件拖拽
    $(document).on("drop","#lessBox",function(e){
        var f = e.originalEvent.dataTransfer.files;
        var newLessFiles = [];
        var checkRepeat = true;
        $.each(f,function(i,n){
            var newName = n.name;
            var newPath = n.path;
            var repeat = false;
            $.each(lessFiles,function(b,a){
                var fname = a.name;
                var fpath = a.path;
                if(fname == newName && fpath == newPath){
                    //f.splice(i,1);//f是文件对象不是数组，会出错
                    repeat = true;
                    if(checkRepeat){
                        dialog.showMessageBox({
                            type:"warning",//"none", "info", "error", "question" 或 "warning"
                            buttons:["确定"],
                            defaultId:0,
                            title:"提示",
                            message:"存在相同文件，将自动忽略！",
                            cancelId:0
                        },function(){

                        });
                        checkRepeat = false;
                    }
                    return false;
                }
            });
            if(!repeat){
                typeof n == "object"?newLessFiles.push(n):"";
            }
        });
        f = newLessFiles;
        analyzeLessFiles(f);
        e.preventDefault();
        return false;
    });

    //清空
    $(".app_page").on("click","#encryptClearLess",function(){
        $(".less_txt,.css_txt").val("");
    });
    //删除
    $(".app_page").on({
        "click":function(){
            var $this = $(this);
            var _id = $this.data("id");
            $this.parent("p").remove();
            $.each(lessFiles,function(i,n){
                if(n.id == _id){
                    lessFiles.splice(i,1);
                    return false;
                }
            });
            if(lessFiles.length == 0){
                $(".encrypt_tips").show();
                lessSavePath="";
                $("#lessBox .less_file_list").remove();
                $("#lessBox").removeClass("flex-start");
            }
        },
        mouseenter: function() {
            $(this).addClass("animated rotateIn").css("color","red");
        },
        mouseleave: function() {
            $(this).removeClass("animated rotateIn").css("color","#000");
        }
    },".del_less");

    //编译文件
    $(".app_page").on("click","#lessEncrypt",function() {
        console.log(lessFiles);
        //文件编译
        var FL = lessFiles.length,current = 0;
        var savePath = $(".show_path").val();
        savePath = savePath?savePath.replace(/\\/g,"/"):undefined;

        if(!!$(".show_path").val()){
            lessSavePath = $(".show_path").val().replace(/\\/g,"/");
        }else{
            lessSavePath = lessSavePath.replace(/[\/|\\]\w+\.less/,"");
            lessSavePath = lessSavePath.replace(/\\/g,"/")+'/css';
            if(!fs.existsSync(lessSavePath)){
                fs.mkdirSync(lessSavePath);
            }
        }

        if(FL){
            $.each(lessFiles,function(i,n){
                encodeLess(n,lessSavePath);
            });
        }else{
            dialog.showMessageBox({
                type:"warning",//"none", "info", "error", "question" 或 "warning"
                buttons:["确定"],
                defaultId:0,
                title:"提示",
                message:"请选择要编译的less文件",
                cancelId:0
            },function(){

            });
        }
        //less编译方法
        function encodeLess(n,newPath){
            var fileName = n.name.replace(/\.less$/,".css"),pathName;
            pathName = n.path.replace(/\\/g,"/");
            fs.readFile(pathName, 'utf8', function(e, data) {
                if (!e) {
                    less.render(data, function(e, css) {
                        console.log(css.css);
                        fs.writeFile(newPath+"/"+fileName,css.css, 'utf8', function(e, data) {
                            if (!e) {
                                current += 1;
                                if(current == FL){
                                    dialog.showMessageBox({
                                        type:"info",//"none", "info", "error", "question" 或 "warning"
                                        buttons:["确定"],
                                        defaultId:0,
                                        title:"提示",
                                        message:"所有less文件已编译完成",
                                        detail:"编译文件保存在："+ newPath,
                                        cancelId:0
                                    },function(){

                                    });
                                }
                            }
                        });
                    })
                }
            });
        }

    });

    //实时编译
    $(".app_page").on("click","#nowLessEncrypt",function() {
        var txt = $.trim($(".less_txt").val());
        if(txt){
            //字符串编译
             less.render(txt, function (e, output) {
                 if(output.css){
                     $(".css_txt").val(output.css);
                 }else{
                     dialog.showMessageBox({
                         type:"error",//"none", "info", "error", "question" 或 "warning"
                         buttons:["确定"],
                         defaultId:0,
                         title:"提示",
                         message:"编译出错，请检查less代码",
                         cancelId:0
                     },function(){

                     });
                 };
             });
        }else{
            dialog.showMessageBox({
                type:"warning",//"none", "info", "error", "question" 或 "warning"
                buttons:["确定"],
                defaultId:0,
                title:"提示",
                message:"请输入要编译的less代码",
                cancelId:0
            },function(){

            });
        }

    });



});