const { dispatchFn } = require("untils");

cc.Class({
    extends: cc.Component,
    onLoad() {
        this.head = this.node.getChildByName('head');
        this.etHead = this.node.getChildByName('etHead');
        this.body = this.node.getChildByName('body');
        this.wire = this.node.getChildByName('wire');
        this.rail = this.node.getChildByName('rail');
        this.oo = this.node.getChildByName('oo');

        this.noteObj = {
            'C': [this.head, this.body, this.wire],
            '^C': [this.head, this.body, this.wire],
            'D': [this.head, this.body],
            'D2': [this.etHead, this.body],
            '^D': [this.head, this.body],
            'E': [this.head, this.body],
            'E2': [this.etHead, this.body],
            'F': [this.head, this.body],
            '^F': [this.head, this.body],
            'G': [this.head, this.body],
            '^G': [this.head, this.body],
            'A': [this.head, this.body],
            '^A': [this.head, this.body],
            'B': [this.head, this.body],
            'c,4': [this.oo],
            '-': [this.rail],
        };
    },

    noteConfig(note) {
        if (note) {
            this.noteObj[note].forEach((v) => v.active = true);
        }
    },

    onCollisionEnter: function (other, self) {
        if (Object.is(other.tag, 1)) {
            if (self.node.noteTag !== '-') {
                dispatchFn(this.node, "addState", { id: this.node.noteId, used: false });
            }
            
            // switch (self.node.noteTag) {
            //     case 'c,4':
            //         window.noteSpeed = 200;
            //         break;
            //     case 'D2':
            //         window.noteSpeed = 400;
            //         break;
            //     case 'E2':
            //         window.noteSpeed = 400;
            //         break;
            //     case '-':
            //         break;
            //     default:
            //         window.noteSpeed = 800;
            //         break;
            // }
        }
    },

    onCollisionStay: function (other, self) {

    },

    onCollisionExit: function (other, self) {
        if (self.node.noteTag !== '-') {
            dispatchFn(this.node, "removeState", { id: this.node.noteId });
        }
        this.node.runAction(cc.fadeOut(1))
    },

    update(dt) {
        // this.node.x -= window.noteSpeed * window.noteRate * dt * 1/2;

        // if (this.node.x < 150) {
        //     this.node.destroy();
        // }
    },
});
