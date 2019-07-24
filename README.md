# 生成上传插件 
### 原生js，ajax需要依赖jquery，可以很轻松替换ajax方式

### 使用实例, * 表示必传参数
```javascript
    $_$Upload({
        container: document.getElementById('wrap1'),
        uploadType: 'upload-banner',
    });

``` 
### 配置参数
|param|type|default|need|description|enum|
|:----:|:----:|:----:|:----:|:----:|
|container|DOM|null|true|加载树结构的dom节点||
|uploadType|String|'upload-banner'|false|保存在formData的额外参数|'upload-banner', 'upload-long-img', 'upload-normal-img', 'upload-copywriting', 'upload-car-model'|
|data|Object|{}|false|保存在formData的额外参数||
|imgUrl|String|null|false|默认显示的图片地址||
|mainTitle|String|null|false|车型主标题||
|subTitle|String|null|false|车型副标题||
|monthRent|String|null|false|车型月供||
|textareaValue|String|null|false|文案||
|success|Function|null|false|上传成功的回调函数||
|error|Function|null|false|上传失败的回调函数||
|uploadCallBack|Function|null|false|点击"上传"按钮的回调函数||
|deleteCallBack|Function|null|false|点击"删除"按钮的回调函数||
|submitCallBack|Function|null|false|点击"提交"按钮的回调函数||




