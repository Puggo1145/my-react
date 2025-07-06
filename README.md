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
        $$typeof: REACT_ELEMENT_TYPE,
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