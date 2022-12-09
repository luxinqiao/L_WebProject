var Upload = {
    /**
     添加图片
     @param {String} inputId input的id
     @param {Function} callback 回调函数
     @return {String}
     */
    addImg: function(inputId, callback) {
        var that = this
        $('.uploadForm').remove()
        var $form = $('<form enctype="multipart/form-data" class="uploadForm"></form>')
            .appendTo($('body'))
        var $file = $('<input type="file" id="file'+inputId+'" accept="image/*" style="display:none;">')
            .appendTo($form)
            .on('change', function() {
                that.uploadFile($file[0], callback)
            })
        $file[0].click()
    },
    /**
     上传图片
     @param {object}file 文件
     @param {Function}callback 回调函数
     @return
     */
    uploadFile: function(file, callback) {
        var _this = this
        if ($('#show3').length<=0) {
            let loding = '<img src="./src/assets/img/personCenter/loading.gif" style="position: absolute;top: 55%;left: 0;right:0;margin:auto; width:40px; display:none;" id="show3"/>'
            $('body').append(loding)
        }
        $('#show3').show()
        var reads = new FileReader()
        reads.readAsDataURL(file.files[0])
        reads.onload = function(e) {
            //const pic = _this.dataURLtoBlob(e.target.result)
            _this.compressImg(e.target.result, function(blob) {
                AjaxUtils.ajax({
                    header: {
                        REQUESTAPP: 1
                    },
                    type: "POST",
                    url: request_path.sts_request,
                    data: {},
                    success: function(data, textStatus, jqXHR) {
                        let client = new OSS({
                            accessKeyId: data.AccessKeyId,
                            accessKeySecret: data.AccessKeySecret,
                            stsToken: data.SecurityToken,
                            bucket: 'rightinhome',
                            region: 'oss-cn-hangzhou'
                        })
                        async function put() {
                            try {
                                const fileName = 'L_WebProject/'+CommonUtils.dateFormat(new Date(), 'YYYY/MM/DD')+'/'+new Date().getTime()+'.jpeg'
                                let result = await client.put(fileName, blob)
                                var res = result.url.substring(result.url.indexOf('L_WebProject'))
                                callback(result.url, res)
                            } catch (e) {
                                DialogUtils.tip('添加图片失败')
                            }
                        }
                        put()
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {

                    }
                })
            })
        }
    },
    /**
     图片压缩
     @param
     @return
     */
    compressImg: function(src, callback) {
        //base64流转Image对象
        var img = new Image()
        img.src = src
        img.onload = function() {
            //Image对象转canvas
            var canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
            //canvas转Blob
            canvas.toBlob(function(blob) {
                callback(blob)
            }, 'image/jpeg', 0.1)
        }
    },
    /**
     base64转blob
     @param {Object}dataurl base64文件流
     @return {Object} blob文件流
     */
    dataURLtoBlob: function(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
}