import React from "./react"

const element = <div>
    division
    <p>paragraph</p>
</div>

function App() {
    return (
        <div>division in functional component</div>
    )
}

console.log("element", element);
console.log("app", <App />);
