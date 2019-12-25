cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.camera = this.getComponent(cc.Camera);

        this.tag = false; 
    },

    followTarget() {
        this.tag = true;
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        if (this.tag) {
            let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
            let pos = this.node.parent.convertToNodeSpaceAR(targetPos);
            this.node.y = pos.y;
        }

        // let ratio = targetPos.y / cc.winSize.height;
        // this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
    },

});