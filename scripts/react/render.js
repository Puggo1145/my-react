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
 * 从而避免主线程长时间阻塞
 */
let nextUnitOfWork = null

function workLoop(deadline) {
    let shouldYield = false
    // 还在执行当前单元，不 yield 的时候
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        // 时间差不多了，准备下班！！！
        shouldYield = deadline.timeRemaining() < 1
    }

    requestIdleCallback(workLoop) // 想下班？开干！
}

function performUnitOfWork(nextUnitOfWork) {}