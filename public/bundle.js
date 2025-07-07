(function () {
    'use strict';

    var REACT_ELEMENT = Symbol("react_element");

    function createElement(type, config) {
      var key = null;
      var ref = null;
      var props = {};

      // filter out ref, key
      if (config) {
        if (config.key != undefined) {
          key = config.key;
        }
        if (config.ref != undefined) {
          ref = config.ref;
        }

        // paste config to props except key and ref
        for (var propName in config) {
          if (propName !== "key" && propName !== "ref") {
            props[propName] = config[propName];
          }
        }
      }

      // handle children
      for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
      }
      if (children.length > 0) {
        if (children.length === 1) {
          props.children = children[0];
        } else {
          props.children = children;
        }
      }
      return {
        $$typeof: REACT_ELEMENT,
        type: type,
        key: key,
        ref: ref,
        props: props
      };
    }
    var React = {
      createElement: createElement
    };

    var element = /*#__PURE__*/React.createElement("div", null, "division", /*#__PURE__*/React.createElement("p", null, "paragraph"));
    function App() {
      return /*#__PURE__*/React.createElement("div", null, "division in functional component");
    }
    console.log("element", element);
    console.log("app", /*#__PURE__*/React.createElement(App, null));

})();
//# sourceMappingURL=bundle.js.map
