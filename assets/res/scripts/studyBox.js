const { XGY } = require('staffs');

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
			displayName: '高音五线谱'
		},

		dywxp: {
			default: null,
			type: cc.Node,
			displayName: '低音五线谱'
		},

		kdFac: {
			default: null,
			type: cc.Node,
			displayName: '蝌蚪容器'
		},

		notePre: {
			default: null,
			type: cc.Prefab,
			displayName: '蝌蚪文'
		},

		qpxPre: {
			default: null,
			type: cc.Prefab,
			displayName: '曲谱线'
		},

		scoreArea: {
			default: [],
			type: [ cc.Sprite ]
		},

		scoreSF: {
			default: [],
			type: [ cc.SpriteFrame ]
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
        
        monsterAni:{
            default:[],
            type:[cc.Animation]
        }

	},

	onLoad() {
		cc.director.getCollisionManager().enabled = true;
		// cc.director.getCollisionManager().enabledDebugDraw = true;
		this.bnState = [];
		this.curScore = 0;
		this.noteId = 1;

		this.notePos = [ 26, 26, 44, 44, 44, 62, 62, 80, 80, 98, 98, 116, 116, 134, 26, -124 ];
		this.noteTag = [ 'C', '^C', 'D', 'D2', '^D', 'E', 'E2', 'F', '^F', 'G', '^G', 'A', '^A', 'B', 'c,4', '-' ];
		this.noteObj = {
			'c,4': 39,
			C: 39,
			'^C': 40,
			D: 41,
			D2: 41,
			'^D': 42,
			E: 43,
			E2: 43,
			F: 44,
			'^F': 45,
			G: 46,
			'^G': 47,
			A: 48,
			'^A': 49,
			B: 50,
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

		this.twoTone = [ 'E2', 'D2' ];
		this.wholeTone = [ 'c,4' ];

		this.node.on('createSugar', this.createSugar, this);
		this.node.on('addState', this.addState, this);
        this.node.on('removeState', this.removeState, this);
        this.node.on('monster', this.monster, this);
        
		// 接受app数据
		this.tag = true;
		window.setAudioData = function(data) {
			if (data) {
				if (this.bnState.length > 0 && this.tag) {
					this.tag = false;
					let seqArr = data['keyIndex'];
					let obj = this.bnState.find((v) => v.used == false);
					
					if (obj) {
						let cur = this.kdFac.children.find((v) => v.noteId == obj.id);
						// 展示数据
						let curData = this.dataList.children.find((v) => v.noteId == obj.id);
						let cd = curData.getChildByName('label').getComponent(cc.Label);
						console.log("收到的信息");
						console.log(seqArr);
						console.log("乐谱的信息");
						console.log(this.noteObj[cur.noteTag]);
						if (seqArr) {
							cd.string = this.dataObj[seqArr[0]];
						}

						if (seqArr.indexOf(this.noteObj[cur.noteTag]) !== -1) {
							this.curScore++;

							cur.children.forEach((v) => {
								v.color = new cc.Color(50, 205, 50);
							});

							this.removeSweet(cur.noteId);
							this.changeScore(this.curScore);

							this.bnState = this.bnState.map((v) => {
								if (Object.is(cur.noteId, v.id)) {
									v.used = true;
								}
								return v;
							});
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
				let cur = this.kdFac.children.find((v) => v.noteId == obj.id);
				if (Object.is(cur.noteTag, ced)) {
					this.curScore++;
					cur.children.forEach((v) => {
						v.color = new cc.Color(50, 205, 50);
					});

					this.removeSweet(cur.noteId);
					this.changeScore(this.curScore);

					this.bnState = this.bnState.map((v) => {
						if (Object.is(cur.noteId, v.id)) {
							v.used = true;
						}
						return v;
					});
				}
			}
		}
	},

	createStaff() {
		let originPos = 0;

		for (let i = 0; i < XGY.length; i++) {
			if (XGY[i]['qpx']) {
				let qpxItem = cc.instantiate(this.qpxPre);
				qpxItem.parent = this.kdFac;
				qpxItem.position = cc.v2(originPos - 90, 0);
			} else {
				if (XGY[i]['treble']) {
					let noteItem = cc.instantiate(this.notePre);
                    noteItem.parent = this.kdFac;
                    noteItem.noteId = this.noteId;
                    noteItem.noteTag = XGY[i]['treble'];

                    let index = this.noteTag.indexOf(XGY[i]['treble']);
                    if (index !== -1) {
                        noteItem.position = cc.v2(originPos, this.notePos[index]);
                        let noteJs = noteItem.getComponent('notes');
                        noteJs.noteConfig(XGY[i]['treble']);
                    }

                    // 创建糖果
                    let sweetItem = cc.instantiate(this.sweetPre);
                    sweetItem.parent = this.sweetFac;
                    sweetItem.noteId = this.noteId;
                    sweetItem.x = originPos + 930;
                    let sweetJs = sweetItem.getComponent('sweetBox');
                    sweetJs.create(Math.floor(Math.random() * 12));
                } 

                if (XGY[i]['bass']) {
                    let noteItem = cc.instantiate(this.notePre);
                    noteItem.parent = this.kdFac;
                    noteItem.noteId = this.noteId;
                    noteItem.noteTag = XGY[i]['bass'];

                    let index = this.noteTag.indexOf(XGY[i]['bass']);
                    if (index !== -1) {
                        noteItem.position = cc.v2(originPos, this.notePos[index]);
                        let noteJs = noteItem.getComponent('notes');
                        noteJs.noteConfig(XGY[i]['bass']);
                    }
                }

                if (this.wholeTone.indexOf(XGY[i]['treble']) !== -1) {
                    originPos = originPos + 540;
                } else if (this.twoTone.indexOf(XGY[i]['treble']) !== -1) {
                    originPos = originPos + 360;
                } else {
                    originPos = originPos + 180;
				}
				
                this.noteId++;
			}
		}
	},

	changeScore(score) {
		this.scoreArea[0].spriteFrame = this.scoreSF[Math.floor(score / 10)];
		this.scoreArea[1].spriteFrame = this.scoreSF[score % 10];
		this.scorePro.progress = score / 60;
	},

    monster(e){
        e.stopPropagation();
        this.monsterAni[0].play("01");
        this.monsterAni[1].play("02");
        this.monsterAni[2].play("03");
    },

	addState(e) {
		e.stopPropagation();
		this.bnState.push(e.detail);
		console.log("addState")
		console.log(this.bnState)
	},

	removeState(e) {
		e.stopPropagation();
		// this.bnState.shift();
		this.bnState.forEach((v)=>{
			if (v.id == e.detail.id) {
				v.used = true;
			}
		});
	},

	removeSweet(noteId) {
		let obj = this.sweetFac.children.find((v) => v.noteId == noteId);
		if (obj) {
			obj.destroy();
		}
	},

	// 创建糖果栏
	createSugar(event, tag) {
        this.createStaff();
        let kdFac = this.kdFac.getComponent('kdFac');
        kdFac.move();



        return;
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
		let sweetJs = sweetItem.getComponent('sweetBox');
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
				let noteJs = noteItem.getComponent('notes');
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
				let noteJs = noteItem.getComponent('notes');
				noteJs.noteConfig(XGY['bass'][seq]);
			}
		}

		let labelItem = cc.instantiate(this.labelPre);
		labelItem.parent = this.noteList;
		labelItem.noteId = this.noteId;
		let li = labelItem.getChildByName('label').getComponent(cc.Label);
		li.string = XGY['treble'][seq] + '(' + this.noteObj[XGY['treble'][seq]] + ')';

		let dataItem = cc.instantiate(this.dataPre);
		dataItem.parent = this.dataList;
		dataItem.noteId = this.noteId;

		this.noteId++;
	},
});
