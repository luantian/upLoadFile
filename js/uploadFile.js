/*
* @Author: Terence
* @Date:   2019-07-23 15:45:11
* @Last Modified by:   Terence
* @Last Modified time: 2019-07-27 15:07:18
*/

;(function() {

    var $_$Upload = function(params) {
        return new Upload(params);
    }

    function Upload(params) {

        this.wrap = params.container;
        this.url = params.url;

        if (!this.wrap) throw new Error('container为必传参数');
        if (!this.url) throw new Error('url为必传参数');
        var types = ['upload-banner', 'upload-long-img', 'upload-normal-img', 'upload-copywriting', 'upload-car-model'];
        this.imgTypes = ['png', 'jpg', 'jpeg', 'gif'];
        this.videoTypes = ['avi', 'mov', 'rmvb', 'rm', 'flv', 'mp4', '3gp'];
        
        if ( types.includes(params.uploadType) ) {
            this.uploadType = params.uploadType;
        } else {
            this.uploadType = types[0]; //设置uploadType默认值
        }

        this.isShowUploadBtn = params.isShowUploadBtn || true;
        this.isShowDeleteBtn = params.isShowDeleteBtn || true;
        this.isShowSubmitBtn = params.isShowSubmitBtn || true;

        this.data = params.data || {};
        this.imgUrl = params.imgUrl || 'www.baidu.png';

        this.onDelete = params.onDelete;

        this.mainTitle = params.mainTitle || '';
        this.subTitle = params.subTitle || '';
        this.monthRent = params.monthRent || '';
        this.textareaValue = params.textareaValue || '';

        var btns = ['上传', '删除', '提交'];
        var btnsKey = ['uploadBtnName', 'deleteBtnName', 'submitBtnName'];
        var btnCallBack = ['uploadCallBack', 'submitCallBack'];
        for (var i = 0; i < btns.length; i++) {
            this[btnsKey[i]] = params[btnsKey[i]] || btns[i];
            this[btnCallBack[i]] = params[btnCallBack[i]];
        }

        this.error = params.error;
        this.success = params.success;

        this.init();

    }


    Upload.prototype.init = function() {
        
        this.inputFile = setAttr( createDOM('input'), { _id: 'input-file', type: 'file' } );

        var _this = this;
        var uploadBtn = this.isShowUploadBtn && setAttr( createDOM('div'), { _id: 'upload-btn' }, this.uploadBtnName );
        var deleteBtn = this.isShowDeleteBtn && setAttr( createDOM('div'), { _id: 'delete-btn' }, this.deleteBtnName );
        var submitBtn = this.isShowSubmitBtn && setAttr( createDOM('div'), { _id: 'submit-btn' }, this.submitBtnName );

        var btnsWrap = setAttr( createDOM('div'), { _id: 'btns-wrap' } );
 
        switch (this.uploadType) {
            case 'upload-copywriting':
                var copywritingTitle = setAttr( createDOM('div'), { _id: 'copywriting-title'}, '文案' );
                var textarea = setAttr( createDOM('textarea'), { _id: 'textarea', placeholder: '请输入文案' } );
                this.textareaValue && (textarea.value = this.textareaValue);
                var imgTitle = setAttr( createDOM('div'), { _id: 'img-title'}, '图片' );
                break;
            case 'upload-car-model':
                var titleWrap1 = setAttr( createDOM('div'), { _id: 'main-title'} );
                var titleWrap2 = setAttr( createDOM('div'), { _id: 'main-title'} );
                var titleWrap3 = setAttr( createDOM('div'), { _id: 'main-title'} );

                var mainTitle = setAttr( createDOM('label'), { _id: 'label'}, '主标题:' );
                var subTitle = setAttr( createDOM('label'), { _id: 'label'}, '副标题:' );
                var monthRent = setAttr( createDOM('label'), { _id: 'label'}, '月租:' );

                var mainInput = this.mainTitle ? setAttr( createDOM('span'), {}, this.mainTitle) : setAttr( createDOM('input'), { _id: 'title-input', placeholder: '请输入车型主标题'} );
                var subInput = this.subTitle ? setAttr( createDOM('span'), {}, this.subTitle) : setAttr( createDOM('input'), { _id: 'title-input', placeholder: '请输入车型副标题'} );
                var monthInput = this.monthRent ? setAttr( createDOM('span'), {}, this.monthRent) : setAttr( createDOM('input'), { _id: 'title-input', placeholder: '请输入月租金额'} );

                // this.mainTitle && (mainInput.value = this.mainTitle);
                // this.subTitle && (subInput.value = this.subTitle);
                // this.monthRent && (monthInput.value = this.monthRent);

                titleWrap1.appendChild(mainTitle);
                titleWrap1.appendChild(mainInput);

                titleWrap2.appendChild(subTitle);
                titleWrap2.appendChild(subInput);

                titleWrap3.appendChild(monthRent);
                titleWrap3.appendChild(monthInput);

                break;
        }
        
        this.typeLayer = setAttr( createDOM('div'), { _id: this.uploadType } );

        if ( uploadBtn ) {
            uploadBtn.appendChild( this.inputFile );
            btnsWrap.appendChild( uploadBtn );
        };
        if ( deleteBtn ) btnsWrap.appendChild( deleteBtn );
        if ( submitBtn ) btnsWrap.appendChild( submitBtn );

        var fileType = 'img';
        if ( isImg.call(this, this.imgUrl) ) { fileType = 'img' };
        if ( isVideo.call(this, this.imgUrl) ) { fileType = 'video' };
        // if ( isPDF.call(this, this.imgUrl) ) { fileType = 'pdf' };

        var obj = { _id: this.uploadType.replace('upload-', ''), _type: fileType, src: this.imgUrl };
        fileType == 'video' && obj.controls = 'controls';
        this.readyUploadType = setAttr( createDOM(fileType), obj );

        switch (this.uploadType) {
            case 'upload-copywriting':
                this.typeLayer.appendChild( copywritingTitle );
                this.typeLayer.appendChild( textarea );
                this.typeLayer.appendChild( imgTitle );
                break;
            case 'upload-car-model':
                this.typeLayer.appendChild( titleWrap1 );
                this.typeLayer.appendChild( titleWrap2 );
                this.typeLayer.appendChild( titleWrap3 );
                break;
            default:
                // statements_def
                break;
        }
        
        this.typeLayer.appendChild( this.readyUploadType );
        this.typeLayer.appendChild( btnsWrap );
        this.wrap.appendChild( this.typeLayer );

        this.inputFile.onchange = function() {
            _this.uploadFile();
        }
        deleteBtn.onclick = function() {
            _this.onDelete && _this.onDelete();
        }
        submitBtn.onclick = function() {
            _this.submit();
        }
        
    }

    Upload.prototype.uploadFile = function(e, input) {
        var _this = this;
        var file = this.inputFile.files[0];

        console.log('file', file.type);


        // 确认选择的文件是图片                
        if(file.type.indexOf("image") == 0) {
            this.readyUploadType.remove();
            if ( this.readyUploadVideo ) {
                this.readyUploadVideo.remove();
                this.readyUploadVideo = null;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);                    
            reader.onload = function(e) {
                var newUrl = this.result;
                if (_this.readyUploadImg) {
                    setAttr(_this.readyUploadImg, { src: newUrl });
                } else {
                    _this.readyUploadImg = setAttr( createDOM('img'), { _id: _this.uploadType.replace('upload-', ''), _type: 'img', src: newUrl } );
                    _this.typeLayer.insertBefore(_this.readyUploadImg, _this.typeLayer.lastChild);
                }
            };
        }

        if (file.type.indexOf("video") == 0) {
            this.readyUploadType.remove();
            if ( this.readyUploadImg ) {
                this.readyUploadImg.remove();
                this.readyUploadImg = null;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);                    
            reader.onload = function(e) {
                // 图片base64化
                var newUrl = this.result;
                if (_this.readyUploadVideo) {
                    setAttr(_this.readyUploadVideo, { src: newUrl });
                } else {
                    _this.readyUploadVideo = setAttr( createDOM('video'), { _id: _this.uploadType.replace('upload-', ''), _type: 'video', src: newUrl, controls: "controls" } );
                    _this.typeLayer.insertBefore(_this.readyUploadVideo, _this.typeLayer.lastChild);
                }
            };
        }


        this.formData = new FormData();
        this.formData.append('file', file);
        this.formData.enctype = "multipart/form-data";

        this.uploadCallBack && this.uploadCallBack();
    }


    Upload.prototype.delete = function(e) {
        console.log('delete');
        console.log('this.typeLayer', this.typeLayer)
        this.typeLayer.remove();
    }

    Upload.prototype.submit = function(e) {
        if (!this.formData) return alert('请先上传图片');
        var _this = this;
        this.submitCallBack && this.submitCallBack();

        this.mainTitle && (this.data.mainTitle = this.mainTitle);
        this.subTitle && (this.data.subTitle = this.subTitle);
        this.monthRent && (this.data.monthRent = this.monthRent);
        this.textareaValue && (this.data.textareaValue = this.textareaValue);

        for ( key in this.data ) {
            this.formData.append(key, this.data[key]);
        }

        $.ajax({
            type: "POST",                             //请求的类型
            url: _this.url,                       //请求的路径
            data: _this.formData,                   //请求的参数
            processData: false,
            contentType: false,
            success: function (data) {                 //成功返回触发的方法
                _this.success && _this.success(data);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                _this.error && _this.error();
            }
        })
    }

    function createDOM(domStr) {
        var doc = document;
        var el = doc.createElement(domStr);
        return el;
    }

    function setAttr(el, obj, html) {
        var attr = obj || {};
        for (key in attr) {
            el.setAttribute(key, attr[key]);
        }

        html && (el.innerHTML = html);
        return el;
    }

    function isImg(url) {
        var type = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        if ( this.imgTypes.includes(type) ) return true;
        return false;
    }

    function isVideo(url) {
        var type = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        if ( this.videoTypes.includes(type) ) return true;
        return false;
    }

    // function isPDF(url) {
    //     var type = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    //     if ( this.pdfTypes.includes(type) ) return true;
    //     return false;
    // }


    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = $_$Upload;
    } else {
        window.$_$Upload = $_$Upload;
    }

})();