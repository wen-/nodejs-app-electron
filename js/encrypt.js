/*
 * CSS Document for 应用
 * http://xxx.com/
 *
 * author wen
 * http://www.xxx.com/
 * 公共脚本
 * Date: 2016-xx-xx
 * 1、图片加密
 */

function copyrightPic(obj){
    //this.picSrc = obj.pic;
    //this.txt = obj.txt;
    //this.logoSrc = obj.logo;
}

copyrightPic.prototype = {
    //加密
    mergeData : function(oldData, newData, color){
        var color = color||"R";
        var oData = oldData.data;
        var bit, offset;  // offset的作用是找到alpha通道值，这里需要大家自己动动脑筋

        switch(color){
            case 'R':
                bit = 0;
                offset = 3;
                break;
            case 'G':
                bit = 1;
                offset = 2;
                break;
            case 'B':
                bit = 2;
                offset = 1;
                break;
        }

        for(var i = 0; i < oData.length; i++){
            if(i % 4 == bit){
                // 只处理目标通道
                if(newData[i + offset] === 0 && (oData[i] % 2 === 1)){
                    // 没有信息的像素，该通道最低位置0，但不要越界
                    if(oData[i] === 255){
                        oData[i]--;
                    } else {
                        oData[i]++;
                    }
                } else if (newData[i + offset] !== 0 && (oData[i] % 2 === 0)){
                    // 有信息的像素，该通道最低位置1，可以想想上面的斑点效果是怎么实现的
                    oData[i]++;

                    //处理透明通道
                    if(oData[i+offset] === 0){
                        oData[i + offset] = 1;
                        oData[i] = newData[i];
                    }
                }
            }
        }
        //ctx.putImageData(orginalData, 0, 0);
        return oldData;
    },

    //解密
    processData : function(originalData,color){
        var color = color||"R";
        var data = originalData.data;
        var bit, offset;

        switch(color){
            case 'R':
                bit = 0;
                offset = 3;
                break;
            case 'G':
                bit = 1;
                offset = 2;
                break;
            case 'B':
                bit = 2;
                offset = 1;
                break;
        }

        for(var i = 0; i < data.length; i++){
            if(i % 4 == bit){
                // 红色分量
                if(data[i] % 2 == 0){
                    data[i] = 0;
                } else {
                    data[i] = 255;
                    data[i+offset] = 255;
                }
            } else if(i % 4 == offset){
                // alpha通道不做处理
                continue;
            }else{
                // 关闭其他分量，不关闭也不影响答案，甚至更美观 o(^▽^)o
                //data[i] = 0;
            }
        }
        // 将结果绘制到画布
        //ctx.putImageData(originalData, 0, 0);
        return originalData;
    }

};