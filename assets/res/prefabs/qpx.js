cc.Class({
    extends: cc.Component,
    onCollisionEnter: function (other, self) {},
    onCollisionStay: function (other, self) {},
    onCollisionExit: function (other, self) {
        this.node.runAction(cc.fadeOut(1.5))
    },
});
