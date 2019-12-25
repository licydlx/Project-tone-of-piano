/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-10-08 10:12:00
 * @LastEditors: Please set LastEditors
 */
cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad() {},

    onDestroy() {},

    onWebFinishLoad: function (target, eventType) {
        switch (eventType) {
            case cc.WebView.EventType.ERROR:
                console.log('webview block error');

                break;
            case cc.WebView.EventType.LOADING:
                console.log('webview block loading');

                break;
            case cc.WebView.EventType.LOADED:
                console.log('webview block loaded');
                this.target = target;

                console.log(target)
                // 设置乐谱盒子大小
                this.target._impl._iframe.contentWindow.postMessage(
                    JSON.stringify({
                        type: "LY_NOTES_BOXSIZE",
                        handleData: {
                            width: this.node.width,
                            height: this.node.height
                        }
                    }),
                    '*'
                )

                break;
            default:
                break;
        }
    },

    update(dt) {
        if (this.tag) {

        }
    }
});