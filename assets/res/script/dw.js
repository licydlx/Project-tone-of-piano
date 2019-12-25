
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { 
        this.createTag = true;
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (selfCollider.tag !== otherCollider.tag && otherCollider.tag !== 4) {
            contact.disabled = true;
        }

        if (selfCollider.tag == 2 &&　otherCollider.tag == 4 && this.node.y < -3000) {
            if (this.createTag) {
                this.createTag = false;
                let studyJs = cc.find("root/studyBox").getComponent("studyBox")
                studyJs.createSugar(null, 0) 
            }
        }

    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
    },
});
