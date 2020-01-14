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

        if (this.node.x < -460 && this.tag) {
            this.tag = false;
            this.node.runAction(cc.fadeTo(.5, 0));
            dispatchFn(this.node, "monster", "");

            setTimeout(() => {
                this.node.destroy();
            }, 500);
        }

    },

});
