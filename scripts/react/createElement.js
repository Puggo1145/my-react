function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            // 根据 children 类型创建对应结构的 element object
            children: children.map(child =>
                typeof child === "object" 
                    ? child
                    : createTextElement(child)
            ),
        },
    }
};

// 创建纯文本 react element
// children 可能不是一个 react element object（例如 string）
function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    }
};

export default createElement;