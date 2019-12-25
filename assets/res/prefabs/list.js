cc.Class({
    extends: cc.Component,
    onLoad() {},

    update(dt) {
        this.node.x -= 100 * dt;

        if (this.node.x < -900) {
            this.node.destroy();
        }
    },
});
