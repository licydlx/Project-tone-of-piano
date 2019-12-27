const { dispatchFn } = require("untils");

cc.Class({
    extends: cc.Component,

    properties: {
        sweetFrames: {
            default: [],
            type: [cc.SpriteFrame]
        },

        sweets: {
            default: [],
            type: [cc.Sprite]
        }
    },

    onLoad() {
        this.tag = true;
        this.flag = true;
    },

    create(data) {
        for (let i = 0; i < this.sweets.length; i++) {
            this.sweets[i].spriteFrame = this.sweetFrames[data];
        }
    },

    update(dt) {
        this.node.x -= window.noteSpeed * window.noteRate * dt;

        if (this.node.x < 764 && this.flag) {
            this.flag = false;
            dispatchFn(this.node, "createSugar", "");
        }

        if (this.node.x < -520 && this.tag) {
            this.tag = false;
            this.node.runAction(cc.fadeTo(1.0, 0));
            setTimeout(() => {
                this.node.destroy();
            }, 1000);
        }

    },

});
