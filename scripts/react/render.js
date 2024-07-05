function render(element, container) {
    // 根据 element object 创建 dom 节点
    const dom = element.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(element.type);

    // 向 node 分配属性
    const isProperty = key => key !== "children";
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = element.props[name]
        })

    // 递归创建子节点
    // TODO: concurret mode
    element.props.children.forEach(child => {
        render(child, dom);
    })

    container.appendChild(dom);
}

/**
 * concurrent：将 render 拆分成多个子 units
 * 当一个 unit 完成后，浏览器可以选择打断渲染，处理优先级更高的事务（e.g. input）
 * 从而避免全部递归造成主线程长时间阻塞
 */
let nextUnitOfWork = null;

function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )

        // deadline 是 requestIdleCallback 传递的参数
        // 检查距离浏览器再次控制前的剩余时间
        shouldYield = deadline.timeRemaining() < 1;
    }

    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// Fiber
// 执行当前的 render unit 并返回下一个 unit
function performUnitOfWork(nextUnitOfWork) {

}

export default render;