import React from "./react/index.js";

// 这是 React.createElement 的结果
// js object: react element

// const element = {
//     type: "h1", // 标签
//     props: {
//         title: "foo", // DOM 节点属性
//         children: "Hello React" // DOM 节点 children
//     }
// }
const element = React.createElement(
    "div",
    { id: "foo" },
    React.createElement("a", { href: "" }, "bar"),
    React.createElement("b")
)

// 获取页面根元素
const container = document.getElementById("root");

// 将 element 渲染为 DOM node
React.render(element, container);
// const node = document.createElement(element.type);
// node.title = element.props.title;
// // 渲染 element 的 children
// const text = document.createTextNode("");
// text.nodeValue = element.props.children;
// // 将子节点添加到父 node/element
// node.appendChild(text);

// container.appendChild(node);