cc.Class({
    extends: cc.Component,
    onLoad() { },

    update(dt) {
        this.node.x -= window.noteSpeed * window.noteRate * dt;

        if (this.node.x < -900) {
            this.node.destroy();
        }
    },
});
