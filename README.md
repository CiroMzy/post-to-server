# post-to-server README

- 用来实现在文件变更时，调用接口，将当前编辑的文件和文件路径传送到服务器。
- This plug-in is used to call the interface when the file is changed, and transmit the currently edited file and file path to the server.

## usage
  - 在本地添加配置文件 .post-to-setver.json
  - 配置介绍：

* `enable`: <boolean> 启用/关闭 本扩展。enable/disable this extension
* `url`: <string> 请求接口地址。request interface address
* `headers`: <object>请求头设置，配置参考 axios。Request header settings, configuration reference axios [axios headers 配置](http://axios-js.com/zh-cn/docs/index.html)
* `ignore`: <[string]> 忽略文件。ignore files
* `tipsOnSuccess`: <boolean> 保存成功后是否提示。Whether to prompt after saving successfully

```json
{
  "open": true,
  "uploadOnSave": true,
  "url": "https://abc.com",
  "headers": {
    "content-type": "application/json",
    "x-fpp-origin": "demo123",
    "authorization": "123"
  },
  "ignore": [
    ".gitignore", ".post-to-setver.json"
  ],
  "tipsOnSuccess": true
}
```

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://github.com/CiroMzy/post-to-server)

**Enjoy!**
