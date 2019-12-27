const { XGY } = require("staffs");

cc.Class({
    extends: cc.Component,

    properties: {
        sweetFac: {
            default: null,
            type: cc.Node
        },

        sweetPre: {
            default: null,
            type: cc.Prefab
        },

        gywxp: {
            default: null,
            type: cc.Node,
            displayName: "高音五线谱"
        },

        dywxp: {
            default: null,
            type: cc.Node,
            displayName: "低音五线谱"
        },

        notePre: {
            default: null,
            type: cc.Prefab
        },

        scoreArea: {
            default: [],
            type: [cc.Sprite]
        },

        scoreSF: {
            default: [],
            type: [cc.SpriteFrame]
        },

        scorePro: {
            default: null,
            type: cc.ProgressBar
        },

        dataList: {
            default: null,
            type: cc.Node
        },

        noteList: {
            default: null,
            type: cc.Node
        },

        dataPre: {
            default: null,
            type: cc.Prefab
        },

        labelPre: {
            default: null,
            type: cc.Prefab
        },
    },

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        this.bnState = [];
        this.curScore = 0;
        this.noteId = 1;

        this.notePos = [-25, -25, -16, -16, -16, -7, -7, 3, 3, 12, 12, 21, 21, 30, -25, 48];
        this.noteTag = ['C', '^C', 'D', 'D2', '^D', 'E', 'E2', 'F', '^F', 'G', '^G', 'A', '^A', 'B', 'c,4', '-'];
        this.noteObj = {
            'c,4': 39,
            'C': 39,
            '^C': 40,
            'D': 41,
            'D2': 41,
            '^D': 42,
            'E': 43,
            'E2': 43,
            'F': 44,
            '^F': 45,
            'G': 46,
            '^G': 47,
            'A': 48,
            '^A': 49,
            'B': 50,
            '-': '-'
        };

        this.dataObj = {
            '39': 'C',
            '40': '^C',
            '41': 'D',
            '42': '^D',
            '43': 'E',
            '44': 'F',
            '45': '^F',
            '46': 'G',
            '47': '^G',
            '48': 'A',
            '49': '^A',
            '50': 'B'
        };

        this.node.on("createSugar", this.createSugar, this);
        this.node.on("addState", this.addState, this);
        this.node.on("removeState", this.removeState, this);

        // 接受app数据
        this.tag = true;
        window.setAudioData = function (data) {
            if (data) {
                if (this.bnState.length > 0 && this.tag) {
                    this.tag = false;
                    let seqArr = data["keyIndex"];
                    let obj = this.bnState.find((v) => v.used == false);
                    if (obj) {
                        let cur = this.gywxp.children.find((v) => v.noteId == obj.id);
                        // 展示数据
                        let curData = this.dataList.children.find((v) => v.noteId == obj.id);
                        let cd = curData.getChildByName("label").getComponent(cc.Label);

                        if (seqArr) {
                            cd.string = seqArr + '(' + this.dataObj[seqArr] ? this.dataObj[seqArr] : '' + ')';
                        }

                        if (seqArr.indexOf(this.noteObj[cur.noteTag]) !== -1) {
                            this.curScore++;

                            cur.children.forEach(v => {
                                v.color = new cc.Color(50, 205, 50);
                            });

                            this.removeSweet(cur.noteId);
                            this.changeScore(this.curScore);

                            this.bnState = this.bnState.map((v) => {
                                if (Object.is(cur.noteId, v.id)) {
                                    v.used = true;
                                }
                                return v;
                            })
                        }
                    }
                    this.tag = true;
                }
            }
        }.bind(this);
    },

    btCall(e, ced) {
        if (this.bnState.length > 0) {
            let obj = this.bnState.find((v) => v.used == false);
            if (obj) {
                let cur = this.gywxp.children.find((v) => v.noteId == obj.id);

                if (Object.is(cur.noteTag, ced)) {
                    this.curScore++;
                    cur.children.forEach(v => {
                        v.color = new cc.Color(50, 205, 50);
                    });

                    this.removeSweet(cur.noteId);
                    this.changeScore(this.curScore);

                    this.bnState = this.bnState.map((v) => {
                        if (Object.is(cur.noteId, v.id)) {
                            v.used = true;
                        }
                        return v;
                    })
                }

            }
        }
    },

    changeScore(score) {
        this.scoreArea[0].spriteFrame = this.scoreSF[score / 10];
        this.scoreArea[1].spriteFrame = this.scoreSF[score % 10];
        this.scorePro.progress = score / 60;
    },

    addState(e) {
        e.stopPropagation();
        this.bnState.push(e.detail);
    },

    removeState(e) {
        e.stopPropagation();
        this.bnState.shift();
    },

    removeSweet(noteId) {
        let obj = this.sweetFac.children.find((v) => v.noteId == noteId);
        if (obj) {
            obj.destroy();
        }

    },

    

    // 创建糖果栏
    createSugar(event, tag) {
        if (event) {
            event.stopPropagation();
        }

        let seq;
        if (tag) {
            seq = 0;
        } else {
            seq = this.noteId - 1;
        }

        if (!XGY['treble'][seq]) {
            return;
        }

        // 创建糖果
        let sweetItem = cc.instantiate(this.sweetPre);
        sweetItem.parent = this.sweetFac;
        sweetItem.noteId = this.noteId;
        let sweetJs = sweetItem.getComponent("sweetBox");
        sweetJs.create(Math.floor(Math.random() * 12));

        // 创建高音蝌蚪文
        if (XGY['treble'][seq]) {
            let noteItem = cc.instantiate(this.notePre);
            noteItem.parent = this.gywxp;
            noteItem.noteId = this.noteId;
            noteItem.noteTag = XGY['treble'][seq];

            let index = this.noteTag.indexOf(XGY['treble'][seq]);
            if (index !== -1) {
                noteItem.position = cc.v2(900, this.notePos[index]);
                let noteJs = noteItem.getComponent("notes");
                noteJs.noteConfig(XGY['treble'][seq]);
            }
        }

        // 创建低音蝌蚪文
        if (XGY['bass'][seq]) {
            let noteItem = cc.instantiate(this.notePre);
            noteItem.parent = this.dywxp;
            noteItem.noteId = this.noteId;
            noteItem.noteTag = XGY['bass'][seq];

            let index = this.noteTag.indexOf(XGY['bass'][seq]);
            if (index !== -1) {
                noteItem.position = cc.v2(900, this.notePos[index]);
                let noteJs = noteItem.getComponent("notes");
                noteJs.noteConfig(XGY['bass'][seq]);
            }
        }


        let labelItem = cc.instantiate(this.labelPre);
        labelItem.parent = this.noteList;
        labelItem.noteId = this.noteId;
        let li = labelItem.getChildByName("label").getComponent(cc.Label);
        li.string = XGY['treble'][seq] + '(' + this.noteObj[XGY['treble'][seq]] + ')';;


        let dataItem = cc.instantiate(this.dataPre);
        dataItem.parent = this.dataList;
        dataItem.noteId = this.noteId;

        this.noteId++;
    },
});
