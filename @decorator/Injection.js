import React, { createElement, Component } from 'react';
import lodashDebounce from 'lodash/debounce';
import shallowequal from 'shallowequal';

export default (actions, { debounce = 400 }) => (component) => {
  // avoid calling unecessary callback when there's a new request
  let latestRequestId = 0;
  // cache the props selector, skip fetch when variables are not changed
  const selectorVariables = {};

  // function to check if the variable has changed
  const checkVariableChange = (props, name, action) => {
    const { shouldUpdateSelector } = action;

    if (!shouldUpdateSelector) {
      return false;
    }

    return shallowequal(selectorVariables[name], shouldUpdateSelector(props));
  };

  // start execute request
  const startRequest = lodashDebounce((props, callback) => {
    const currentRequestId = ++latestRequestId;
    const promises = [];

    Object.keys(actions).forEach(name => {
      let { shouldUpdateSelector, operation } = actions[name];
      const shouldUpdate = shouldUpdateSelector ?  selectorVariables[name]

      // if the variable is only a function
      if (typeof actions[name] === 'function') {
        operation = actions[name];
      }

      const shouldUpdate = !props || (!!shouldUpdateSelector &&
        !shallowequal(shouldUpdateSelector(props), shouldUpdateSelector(nextProps)));

      // if load only after mounted, return for other situation
      if (!shouldUpdate) {
        return;
      }


      const result = operation(nextProps);

      if (typeof result.then === 'function') {
        promises.push(result.then(data => ({ name, data })));
      } else {
        promises.push(Promise.resolve({ name, data: result}));
      }
    });

    if (!promises.length) {
      return;
    }

    loadingCallback();

    Promise.all(promises).then(results => {
      // if there're newer requests, drop the old ones
      if (latestRequestId === currentRequestId) {
        const joined = results.reduce((prev, { name, data }) => ({ ...prev, [name]: data }));
        callback(joined);
      }
    });
  }, debounce);

  // the wrapper Component
  class AutoFetch extends Component {
    calculateOptions() {

    }

    componentDidMount() {
      this.calculateOptions();

    }

    componentWillReceiveProps(nextProps) {
      const shouldUpdate = Object.keys(actions).some(name => {
        return checkVariableChange(nextProps, name, action[name]);
      });
    }

    render() {

      return createElement(component, newProps);
    }

  }

  return AutoFetch;
};
