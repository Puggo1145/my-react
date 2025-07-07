import { REACT_ELEMENT } from "./constants"

function createElement(type, config, ...children) {
    let key = null;
    let ref = null;
    let props = {};

    // filter out ref, key
    if (config) {
        if (config.key != undefined) {
            key = config.key
        }
        if (config.ref != undefined) {
            ref = config.ref
        }

        // paste config to props except key and ref
        for (const propName in config) {
            if (propName !== "key" && propName !== "ref") {
                props[propName] = config[propName]
            }
        }
    }

    // handle children
    if (children.length > 0) {
        if (children.length === 1) {
            props.children = children[0]
        } else {
            props.children = children
        }
    }

    return {
        $$typeof: REACT_ELEMENT,
        type,
        key,
        ref,
        props
    }
}

export default {
    createElement
}
