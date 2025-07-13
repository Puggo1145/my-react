export const REACT_ELEMENT = Symbol("react_element");

// fiber
// tag
export const FunctionComponent = 0;
export const ClassComponent = 0;
export const HostRoot = 3;
export const HostComponent = 5;
export const HostText = 6;

// side effect flags
export const NoFlags = 0b00000000000000000000;
export const Placement = 0b00000000000000000010;
export const ChildDeletion = 0b00000000000000001000;

// lanes
export const NoLanes = 0b0000000000000000000000000000000;
