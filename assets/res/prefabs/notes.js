const { dispatchFn } = require("untils");

cc.Class({
    extends: cc.Component,
    onLoad() { 

    },

    onCollisionEnter: function (other, self) {
        if (Object.is(other.tag, 1)) {
            dispatchFn(this.node, "addState", {id:this.node.noteId,used:false});
        }
    },

    onCollisionStay: function (other, self) {

    },

    onCollisionExit: function (other, self) {
        dispatchFn(this.node, "removeState", '');
    },

    update(dt) {
        this.node.x -= 50 * dt;

        if (this.node.x < 100) {
            this.node.destroy();
        }
    },
});
