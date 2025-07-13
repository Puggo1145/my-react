# My React

Core source code of React.js

## 1. Basic Rendering Process

JSX -> ReactElement -> Fiber -> Commit

1. **Compile**: JSX -> createElement(node): ReactElement
2. **Render**: ReactElement -> fiber tree
3. **Commit**: fiber tree -> DOM

### 1.1 JSX

JSX (JavaScript XML) is a syntax extension for JavaScript that allows developers
to write HTML-like code directly within JavaScript.

Babel helps compile JSX to JS

- for a normal DOM element in JSX

```javascript
const element = <div className="hello">content</div>;
const element = React.createElement(
    "div",
    { className: "hello" },
    "content",
);
```

- Functional Component

```javascript
const element = <App title="hello" />;
const element = React.createElement(
    App,
    { title: "hello" },
);
```

In react, to call a component, we need to capitalize the first letter of the
component name. Because Babel converts the tags with capitalized first letters
into components, and converts the tags with lowercase first letters into DOM
elements.

> **Sum up**: Wherever there is a "<>", Babel converts it to a
> React.createElement function call.

### 1.2 React.createElement

This is the definition of **React.createElement**

```javascript
function createElement(type, config, children) {
    // implementation...
    return {
        // A mark for a React component
        $$typeof: REACT_ELEMENT,
        // type of current component: html tag, className, function name, special marks
        type: type,
        // key in React
        key: key,
        // ref in React
        ref: ref,
        // other attributes (including children)
        props: props,
    };
}
```

for example, a ReactElement might look like this

```javascript
// HTML tag -> ReactElement:
const element = <div className="hello">content</div>
{
    $$typeof: Symbol(react.element)
    type: "div",
    key: null,
    ref: null,
    props: {
        className: "hello",
        children: "content"
    }
}

// Nested tags
const element = <div className="hello">
    Hello
    <p>React</p>
</div>
{
    $$typeof: Symbol(react.element)
    type: "div",
    key: null,
    ref: null,
    props: {
        className: "hello",
        children: [
            "Hello",
            {
                $$typeof: Symbol(react.element)
                type: "p",
                key: null,
                ref: null,
                props: {
                    children: "React"
                }
            }
        ]
    }
}

// Component
const element = <App title="hello" />
{
    $$typeof: Symbol(react.element),
    type: App,
    key: null,
    ref: null,
    props: {
        title: "hello"
    }
}
```

You can see that a ReactElement is basically a javascript object.

> refer to **react.js** for the source code of **React.createElement()**

## 2. Fiber

React Fiber is a new reconciler introduced in React 16, designed especially for
incremental rendering. It breaks rendering into multiple work units, allowing to
pause, reuse and end work.

### 2.1 The problem of synchronous rendering blocking

In React 15, the reconcile process requires recursive reactElement function
call. The overall process is synchronous and not interruptable. The time
consumed by the reconciler can be very long especially when there are a large
number of elements, causing a block in the main thread.

Very unfortunately, the JS execution and browser rendering is serial, which
means the end users cannot see any changes on their screen until the js
execution is finished. So developers introduced **Fiber** to solve this problem.

The main idea of fiber is very plain: since we cannot control the JS execution
and browser rendering directly, how about we **split our rendering tasks into
small units and make them interruptable**.

For example, a user wants to input something into a textarea, but there is also
a very heavy rendering task needs to be executed at the same time. With fiber,
react will respond to user input first and pause the current unit to ensure a
seamless and fast user experience. After that, unfinished task will resume
automatically based on the current situation.

### 2.2 What do we have on a fiber node

- **basic attributes**: tag, type, props, keys, ...
- **tree pointers**: child, sibling, return
- **state**: pendingProps, memoizedProps, memoizedState, updateQueue
- **side effects**: flags, subtreeFlags, deletions
- **priority**：lanes, childlanes, ...\
  ...\
  That's a lot, but we don't have to understand everything for now. Let's break
  them down step by step. \

### 2.3 A fiber node

Your first fiber node looks like this:

```javascript
function FiberNode(tag, pendingProps, key) {
    // basic properties
    this.tag = tag;
    this.pendingProps = pendingProps;
    this.key = key;
    this.type = null;
    this.ref = null;
    // tree pointer
    this.return = null; // points to father node
    this.child = null;
    this.sibling = null;
    // state
    this.memoizedState = null;
    this.memoizedProps = null;
    this.updateQueue = null;
    // side effects
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
    // priority
    this.lanes = NoLanes;
    this.childLanes = NoLanes;

    this.index = 0;
    this.mode = null;
    this.stateNode = null;
    this.deletions = null;
    // double buffering for switch between new and old fiber trees
    this.alternative = null;
}
```

> Actually, there are other properties on a fiber node, but for now we just use
> some of them to avoid introducing too much concepts at once. We will
> supplyment some if we need in the future

we also need a factory function to create our fiber node:

```javascript
function createFiber(tag, pendingProps, key) {
    return new FiberNode(tag, pendingProps, key);
}
```

### 2.4 create a fiber node

There are different types of nodes like DOM node, function component, text node,
root node. we need to handle them in different ways, so here we got:

- createFiberFromElement

```javascript
function createFiberFromElement(element) {
    const { type, props, key } = element;

    let tag = null;
    // check if current element is a DOM tag
    if (typeof type === "string") {
        tag = HostComponent;
        // check if this is a class component or a functional component
    } else if (typeof type == "function") {
        // for every class component, there is a isReactComponent mark
        if (type.isReactComponent) {
            tag = ClassComponent;
        } else {
            tag = FunctionComponent;
        }
    }

    // create a fiber node
    const fiberNode = createFiber(tag, props, key);
    fiberNode.type = element.type;

    return fiberNode;
}
```

- createFiberFromText

```javascript
function createFiberFromText(text) {
    return FiberNode(HostText, text, null);
}
```

Text in DOM has different behavior to other nodes. It only contains pure texts,
and it has No attributes, events or child nodes.\
Also, updating a text node only contains changes in texts. No need for events,
child nodes diff, etc.\
There are more differences, but now we know that handling text node separately
is good for performance and complexity.

- createHostRootFiber

```javascript
function createHostRootFiber() {
    return FiberNode(HostRoot, null, null);
}
```

root node will be encapsulated into a fiber node for unified management

### 2.5 Double Buffering

As we mentioned before, developers want the rendering process to be
interruptable. Rendering might be paused in the middle. If we commit a "half
tree" to the page, that would be a disaster 😇. So we need to ensure the
consistency of current UI. In other words, the fiber tree represents the current
UI shown on user's screen should stay untouched until an update is completely
finished.

For that, React often keeps 2 fiber trees in the memory at the same time.

- current tree: the fiber tree represents current UI shown to the user
- workInProgress tree: the fiber tree used to calculate the next update during
  the rendering process

Nodes on the two trees are correspondingly connected by a property called:
**alternative**. For example, if we access current.alternative on a fiber node,
it points to its corresponding fiber node on the workInProgress tree vice versa.

#### 2.5.1 workInProgress

React uses createWorkInProgress function to create or reuses a workInProgress
fiber node from a current fiber node.

It first checks if there is a reusable workInProgress fiber node for the current
fiber node. Because after the initial rendering, there is only a current fiber
tree in the memory. If a current fiber node already has a workInProgress fiber
node, it can reuse most things on that node and just pass the new pendingProps
to it to save some memory.

```javascript
function createWorkInProgress(current, pendingProps) {
    let workInProgress = current.alternative;
    // create one if there is no workInProgress fiber node.
    // This happens in the first update after initial rendering.
    // there is no workInProgress fiber nodes in memory
    // So we create one for update
    if (workInProgress === null) {
        workInProgress = createFiber(current.tag, pendingProps, current.key);
        // stateNode represents real DOM node
        workInProgress.stateNode = current.stateNode;
        // connect two fiber nodes
        workInProgress.alternative = current;
        current.alternative = workInProgress;
    } // if there is a workInProgress fiber node here
    // we just reuse it and pass the new pendingProps to it
    else {
        workInProgress.pendingProps = pendingProps;
    }

    // sync other properties
    workInProgress.type = current.type;
    workInProgress.child = current.child;

    return workInProgress;
}
```
