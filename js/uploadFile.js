/*
* @Author: Terence
* @Date:   2019-07-23 15:45:11
* @Last Modified by:   Terence
* @Last Modified time: 2019-07-24 20:06:58
*/

;(function() {

    var $_$Upload = function(params) {
        return new Upload(params);
    }

    function Upload(params) {

        this.wrap = params.container;

        if (!this.wrap) throw new Error('container为必传参数');
        var types = ['upload-banner', 'upload-long-img', 'upload-normal-img', 'upload-copywriting', 'upload-car-model'];
        
        if ( types.includes(params.uploadType) ) {
            this.uploadType = params.uploadType;
        } else {
            this.uploadType = types[0]; //设置uploadType默认值
        }

        this.isShowUploadBtn = params.isShowUpload || true;
        this.isShowDeleteBtn = params.isShowDeleteBtn || true;
        this.isShowSubmitBtn = params.isShowSubmitBtn || true;
        this.data = params.data || {};
        this.imgUrl = params.imgUrl || 'www.baidu.com';

        this.mainTitle = params.mainTitle || '';
        this.subTitle = params.subTitle || '';
        this.monthRent = params.monthRent || '';
        this.textareaValue = params.textareaValue || '';

        var btns = ['上传', '删除', '提交'];
        var btnsKey = ['uploadBtnName', 'deleteBtnName', 'submitBtnName'];
        var btnCallBack = ['uploadCallBack', 'deleteCallBack', 'submitCallBack'];
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
        var uploadBtn = /*( this.isShowUpLoadBtn || this.uploadCallBack ) &&*/ setAttr( createDOM('div'), { _id: 'upload-btn' }, this.uploadBtnName );
        var deleteBtn = /*( this.isShowDeleteBtn || this.deleteCallBack ) &&*/ setAttr( createDOM('div'), { _id: 'delete-btn' }, this.deleteBtnName );
        var submitBtn = /*( this.isShowSubmitBtn || this.submitCallBack ) &&*/ setAttr( createDOM('div'), { _id: 'submit-btn' }, this.submitBtnName );

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
        
        var typeLayer = setAttr( createDOM('div'), { _id: this.uploadType } );

        if ( uploadBtn ) {
            uploadBtn.appendChild( this.inputFile );
            btnsWrap.appendChild( uploadBtn );
        };
        if ( deleteBtn ) btnsWrap.appendChild( deleteBtn );
        if ( submitBtn ) btnsWrap.appendChild( submitBtn );

        this.readyUploadImg = setAttr( createDOM('img'), { _id: this.uploadType.replace('upload-', ''), _type: 'img', src: this.imgUrl } );

        switch (this.uploadType) {
            case 'upload-copywriting':
                typeLayer.appendChild( copywritingTitle );
                typeLayer.appendChild( textarea );
                typeLayer.appendChild( imgTitle );
                break;
            case 'upload-car-model':
                typeLayer.appendChild( titleWrap1 );
                typeLayer.appendChild( titleWrap2 );
                typeLayer.appendChild( titleWrap3 );
                break;
            default:
                // statements_def
                break;
        }
        
        typeLayer.appendChild( this.readyUploadImg );
        typeLayer.appendChild( btnsWrap );
        this.wrap.appendChild( typeLayer );

        this.inputFile.onchange = function() {
            _this.uploadFile();
        }
        deleteBtn.onclick = function() {
            _this.delete();
        }
        submitBtn.onclick = function() {
            _this.submit();
        }
        
    }

    Upload.prototype.uploadFile = function(e, input) {
        var _this = this;
        var file = this.inputFile.files[0];
        // 确认选择的文件是图片                
        if(file.type.indexOf("image") == 0) {
            var reader = new FileReader();
            reader.readAsDataURL(file);                    
            reader.onload = function(e) {
                // 图片base64化
                var newUrl = this.result;
                setAttr(_this.readyUploadImg, { src: newUrl });
            };
        }

        this.formData = new FormData();
        this.formData.append('file', file);
        this.formData.enctype = "multipart/form-data";


        this.uploadCallBack && this.uploadCallBack();
    }


    Upload.prototype.delete = function(e) {
        console.log('delete');
        this.deleteCallBack && this.deleteCallBack();
    }

    Upload.prototype.submit = function(e) {
        if (!this.formData.get('file')) return alert('请先上传图片');

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
            type:"POST",                             //请求的类型
            url:"/user/test",                       //请求的路径
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


    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = $_$Upload;
    } else {
        window.$_$Upload = $_$Upload;
    }

})();