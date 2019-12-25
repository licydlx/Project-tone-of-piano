
cc.Class({
    extends: cc.Component,

    properties: {
        startBut: {
            default: null,
            type: cc.Node,
            displayName: "开始按钮"
        },

        study: {
            default: null,
            type: cc.Node,
            displayName: "学习系统"
        },

        launchs: {
            default: [],
            type: [cc.Node]
        },

        launchCam: {
            default: null,
            type: cc.Node
        },

        wallSwitchs: {
            default: [],
            type: [cc.Node]
        },

        sweetCon: {
            default: null,
            type: cc.Node
        },

        pointer: {
            default: null,
            type: cc.Node,
            displayName: "指针"
        },

        cdMusic: {
            default: null,
            type: cc.Node,
            displayName: "被选中的乐曲"
        },

        modalTrigger: {
            default: null,
            type: cc.Node,
            displayName: "乐曲弹出框"
        },

        sweetPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 糖果对象池
        this.sweetPool = new cc.NodePool();
        let initCount = 60;
        for (let i = 0; i < initCount; ++i) {
            let sweet = cc.instantiate(this.sweetPrefab);
            this.sweetPool.put(sweet);
        }

        this.tag = true;
        this.startBut.runAction(cc.repeatForever(cc.rotateBy(2.0, 360)));

        cc.director.getPhysicsManager().enabled = true;
        this.num = 0;
        this.heightRule = 2126;

        // 绑定 乐曲
        if (this.modalTrigger.children.length > 0) {
            for (let i = 0; i < this.modalTrigger.children.length; i++) {
                this.modalTrigger.children[i].on(cc.Node.EventType.TOUCH_START, (e) => {
                    let spr = this.cdMusic.getComponent(cc.Sprite);
                    let espr = e.target.getComponent(cc.Sprite);
                    spr.spriteFrame = espr.spriteFrame;
                }, this);
            }
        }

    },

    start() {
        let interval = .2;
        let repeat = 24;
        let delay = .2;
        this.schedule(() => {
            this.createSweet(cc.v2(-400, 80));
            this.createSweet(cc.v2(400, 80));
        }, interval, repeat, delay);

    },

    createSweet(pos) {
        let sweet = null;
        if (this.sweetPool.size() > 0) {
            sweet = this.sweetPool.get();
        } else {
            sweet = cc.instantiate(this.sweetPrefab);
        }

        sweet.parent = this.sweetCon;
        if (pos) {
            sweet.position = pos;
        }
    },

    // 乐曲弹出框
    musicModal() {
        this.modalTrigger.active = this.modalTrigger.active ? false : true;
    },

    // 调节速度
    controlSpeed(e, ced) {
        if (ced) {
            this.pointer.runAction(cc.rotateTo(1, ced));
        }
    },

    // 启动动画
    launchAni() {
            let camJs = cc.find("camera").getComponent("cam-control");
            camJs.followTarget();
            for (let i = 0; i < 3; i++) {
                this.wallSwitchs[i].destroy();
            }
    },

    update(dt) {
      
    },

});
