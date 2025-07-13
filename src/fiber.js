import { ClassComponent, FunctionComponent, HostComponent, HostRoot, HostText, NoFlags, NoLanes } from "./constants";

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

function createFiber(tag, pendingProps, key) {
    return new FiberNode(tag, pendingProps, key);
}

// fiber is created from react element, we need to convert it first
function createFiberFromElement(element) {
    const {type, props, key} = element;
    
    let tag = null;
    // check if current element is a DOM tag
    if (typeof type === "string") {
        tag = HostComponent;
    // check if this is a class component or a functional component
    } else if (typeof type == 'function') {
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

// react also handles text node separately
function createFiberFromText(text) {
    return FiberNode(HostText, text, null);
}

// root node will be encapsulated into a fiber node for unified management
function createHostRootFiber() {
    return FiberNode(HostRoot, null, null);
}

// there are other fiber nodes like Fragment...


// createWorkInProgress is a implementation of "Double Buffering" mechanism
// It creates or reuses a workInProgress fiber node for any node update
// without affecting current fiber tree on the screen

// react makes two fiber tree at the same time
// 1. current fiber: the mounted fiber tree
// 2. workInProgress fiber: the fiber tree under construction during the update process
// the two fiber is connected with an "alternative" pointer

// since there are fiber nodes that can be directly reused, 
// this can save some meories and lower the pressure of GC

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
    } 
    // if there is a workInProgress fiber node here
    // we just reuse it and pass the new pendingProps to it
    else {
        workInProgress.pendingProps = pendingProps;
    }

    // sync other properties
    workInProgress.type = current.type;
    workInProgress.child = current.child;

    return workInProgress;
}
