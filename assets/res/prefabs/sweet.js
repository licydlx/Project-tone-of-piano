
cc.Class({
    extends: cc.Component,

    properties: {
        sweetFrames: {
            default: [],
            type: [cc.SpriteFrame]
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.tag = true;
        let spr = this.getComponent(cc.Sprite);
        spr.spriteFrame = this.sweetFrames[Math.floor(Math.random() * 12)];
        this.pcc = this.node.getComponent(cc.PhysicsCircleCollider);
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.tag == 5) {
            this.node.destroy();
        }

        if (selfCollider.tag !== otherCollider.tag && otherCollider.tag !== 4) {
            contact.disabled = true;
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

    update(dt) {
        if (this.tag) {
            if (this.node.y < -1500) {
                if (this.node.x < -200) {
                    this.pcc.tag = 1;
                } else if (this.node.x > 200) {
                    this.pcc.tag = 3;
                } else {
                    this.pcc.tag = 2;
                }
                this.tag = false;
            }
        }
    }
});
