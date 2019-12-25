
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

        wxp: {
            default: null,
            type: cc.Node,
            displayName: "五线谱"
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
        // [-19, -12, -5, 2, 9, 16, 23, 30, 37, 44, 51, 58];
        this.notePos = [-19, -19, -12, -12, -5, -5, 2, 9, 9, 16, 16, 23];
        this.noteId = 1;
        this.noteTag = ['C', '^C', 'D', '^D', 'E', 'F', '^F', 'G', '^G', 'A', '^A', 'B'];

        this.noteObj = {
            'C': 39,
            '^C': 40,
            'D': 41,
            '^D': 42,
            'E': 43,
            'F': 44,
            '^F': 45,
            'G': 46,
            '^G': 47,
            'A': 48,
            '^A': 49,
            'B': 50
        };

        this.dataObj = {
            '39':'C',
            '40':'^C',
            '41':'D',
            '42':'^D',
            '43':'E',
            '44':'F',
            '45':'^F',
            '46':'G',
            '47':'^G',
            '48':'A',
            '49':'^A',
            '50':'B'
        };

        this.node.on("createSugar", this.createSugar, this);
        this.node.on("addState", this.addState, this);
        this.node.on("removeState", this.removeState, this);

        this.bnState = [];
        this.curScore = 0;
        this.tag = true;

        // 接受app数据
        window.setAudioData = function (data) {
            if (data) {     
                if (this.bnState.length > 0 && this.tag) {
                    this.tag = false;
                    let seqArr = data["keyIndex"];
                    let obj = this.bnState.find((v) => v.used == false);
                    if (obj) {
                        let cur = this.wxp.children.find((v) => v.noteId == obj.id);
                        // 展示数据
                        let curData = this.dataList.children.find((v) => v.noteId == obj.id);
                        let cd = curData.getChildByName("label").getComponent(cc.Label);
                        if (seqArr) {
                            cd.string = seqArr + '(' + this.dataObj[seqArr] ? this.dataObj[seqArr] : '' + ')';
                        }
                        
                        if (seqArr.indexOf(this.noteObj[cur.noteTag]) !== -1) {
                            this.curScore++;
                            cur.getChildByName('body').color = new cc.Color(50, 205, 50);
                            cur.getChildByName('head').color = new cc.Color(50, 205, 50);
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
                let cur = this.wxp.children.find((v) => v.noteId == obj.id);
                if (Object.is(cur.noteTag, ced)) {
                    this.curScore++;
                    cur.getChildByName('body').color = new cc.Color(50, 205, 50);
                    cur.getChildByName('head').color = new cc.Color(50, 205, 50);
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

    createSugar(event, seq) {
        if (event) {
            event.stopPropagation();
        }

        if (isNaN(seq)) {
            seq = Math.floor(Math.random() * 12);
        } else {
            console.log("window.AudioRecorderInterface");
            if (window.AudioRecorderInterface) {
                console.log("AudioRecorderInterface 开始")
                window.AudioRecorderInterface.startAduioRecorder("");
            }
        }

        let sweetItem = cc.instantiate(this.sweetPre);
        sweetItem.parent = this.sweetFac;
        sweetItem.noteId = this.noteId;

        let sweetJs = sweetItem.getComponent("sweetBox");
        sweetJs.create(seq);

        let noteItem = cc.instantiate(this.notePre);
        noteItem.parent = this.wxp;
        noteItem.noteId = this.noteId;
        noteItem.noteTag = this.noteTag[seq];
        noteItem.position = cc.v2(940, this.notePos[seq]);

        let labelItem = cc.instantiate(this.labelPre);
        labelItem.parent = this.noteList;
        labelItem.noteId = this.noteId;
        let li = labelItem.getChildByName("label").getComponent(cc.Label);
        li.string = this.noteTag[seq] +'('+ this.noteObj[this.noteTag[seq]] +')';

        let dataItem = cc.instantiate(this.dataPre);
        dataItem.parent = this.dataList;
        dataItem.noteId = this.noteId;

        this.noteId++;
    },

    start() {

    },

    // update (dt) {},
});
