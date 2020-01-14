
cc.Class({
    extends: cc.Component,
    onload(){
        this.flag = false;
    },

    move(){
        this.flag = true;
    },

    update (dt) {
        if (this.flag) {
            this.node.x -= window.noteSpeed * window.noteRate * dt;
        } 
    },
});
