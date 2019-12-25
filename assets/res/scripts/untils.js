const dispatchFn = (node, name, detail) => {
    let config = new cc.Event.EventCustom(name, true);
    config.setUserData(detail);
    node.dispatchEvent(config);
}

module.exports = {
    dispatchFn
}