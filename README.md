# My React

Core source code of React.js

## 1. Basic Rendering Process

JSX -> ReactElement -> Fiber -> Commit

1. JSX -> createElement(node): ReactElement
2. **RENDER**: ReactElement -> fiber tree
3. use fiber tree commit to DOM

### 1.1 JSX

JSX (JavaScript XML) is a syntax extension for JavaScript that allows developers
to write HTML-like code directly within JavaScript.\
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
React Fiber is a new reconciler introduced in React 16, designed especially for incremental rendering. It breaks rendering into multiple work units, allowing to pause, reuse and end work. 
### 2.1 The problem of synchronous rendering blocking
In React 15, the reconcile process requires recursive reactElement function call. The overall process is synchronous and not interruptable. The time consumed by the reconciler can be very long especially when there are a large number of elements, causing a block in the main thread. \
Very unfortunately, the JS execution and browser rendering is serial, which means the end users cannot see any changes on their screen until the js execution is finished. So developers introduced **Fiber** to solve this problem.
### 2.2 What do we have on a fiber node
- **basic attributes**: tag, type, props, keys, ...
- **tree pointers**: child, sibling, return
- **state**: pendingProps, memoizedProps, memoizedState, updateQueue
- **side effects**: flags, subtreeFlags, deletions
- **priority**：lanes, childlanes, ...\
...\
That's a lot, but we don't have to understand everything for now. Let's break them down step by step.
