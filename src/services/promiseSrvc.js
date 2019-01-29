exports.promiseSrvc = () => {
  const scope = {};
  const proms = {};
  const types = {};
  const states = {};

  proms.funcs = {};

  types.ALL_FAILURE = 'all-failure';
  types.ALL_SUCCESS = 'all-success';
  types.ALL_COMPLETE = 'all-complete';
  types.EACH_SUCCESS = 'each-success';
  types.EACH_FAILURE = 'each-failure';


  states.SUCCESS = 'success';
  states.FAILURE = 'failure';
  states.PENDING = 'pending';

  function itterateOverFuncs(promObj, funcs, state) {
    for (let index = 0; index < funcs.length; index += 1) {
      if (state === undefined || state === promObj.states[index]) {
        funcs[index](promObj.datas);
      }
    }
  }

  function itterateOverIds(type, identifier, runObj) {
    if (runObj.shouldRun) {
      const keys = Object.keys(proms.funcs);
      const promObj = proms[type][identifier];
      promObj.mainFunc(promObj.datas);
      for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];
        if (key.indexOf(identifier) === 0) {
          const funcs = proms.funcs[key];
          itterateOverFuncs(promObj, funcs, runObj.state);
        }
      }
    }
  }

  function allFailure(type, identifier) {
    const promObj = proms[type][identifier];
    return promObj.fail === promObj.states.length;
  }

  function allSuccess(type, identifier) {
    const promObj = proms[type][identifier];
    return promObj.success === promObj.states.length;
  }

  function allComplete(type, identifier) {
    const promObj = proms[type][identifier];
    return promObj.complete === promObj.states.length;
  }

  function runFuncs(type, identifier) {
    let shouldRun = false;
    let state;
    if (proms[type][identifier].states === undefined) {
      return { shouldRun };
    }
    switch (type) {
      case types.ALL_FAILURE:
        shouldRun = allFailure(type, identifier);
        break;
      case types.ALL_SUCCESS:
        shouldRun = allSuccess(type, identifier);
        break;
      case types.ALL_COMPLETE:
        shouldRun = allComplete(type, identifier);
        break;
      case types.EACH_SUCCESS:
        shouldRun = true;
        state = states.SUCCESS;
        break;
      case types.EACH_FAILURE:
        shouldRun = true;
        state = states.FAILURE;
        break;
      default:
        throw new Exception('Invalid promise type');
    }
    return { shouldRun, state };
  }

  function callBack(type, identifier, index, state) {
    function func(data) {
      const prom = proms[type][identifier];
      prom.states[index] = state;
      prom.datas[index] = data;

      if (state === states.FAILURE) {
        prom.fail += 1;
      } else {
        prom.success += 1;
      }
      prom.complete += 1;

      const runObj = runFuncs(type, identifier);
      itterateOverIds(type, identifier, runObj);
    }
    return func;
  }

  function addPromiseObj(type, identifier, promises, mainFunc) {
    proms[type] = proms[type] || {};
    proms[type][identifier] = proms[type][identifier] || {};
    const promObj = proms[type][identifier];

    promObj.states = [];
    promObj.datas = [];
    promObj.mainFunc = mainFunc;
    promObj.success = 0;
    promObj.complete = 0;
    promObj.fail = 0;

    for (let index = 0; index < promises.length; index += 1) {
      const promise = promises[index];
      if (promise && typeof promise.then === 'function') {
        promObj.states.push(states.PENDING);
        promise.then(callBack(type, identifier, index, states.SUCCESS),
            callBack(type, identifier, index, states.FAILURE));
      } else {
        promObj.states.push(states.FAILURE);
      }
    }
  }

  function parentHasLoaded(identifier) {
    let has = false;

    function searchIds(tKey) {
      const type = types[tKey];
      function shouldRun(key) {
        if (!has && proms[type] && proms[type][key] && runFuncs(type, key).shouldRun) {
          has = true;
        }
      }
      if (proms[type]) {
        Object.keys(proms[type]).forEach(shouldRun);
      }
    }

    Object.keys(types).forEach(searchIds);
    return has;
  }

  function create(type, identifier, promises, mainFunc) {
    let promOproms = promises;
    if (!Array.isArray(promOproms)) {
      promOproms = [promises];
    }
    addPromiseObj(type, identifier, promOproms, mainFunc);
  }

  function destroy(type, identifier) {
    delete proms[type][identifier].states;
    delete proms[type][identifier].datas;
  }

  function on(type, identifier, func) {
    proms[type] = proms[type] || {};
    proms[type][identifier] = proms[type][identifier] || {};
    if (typeof func !== 'function') {
      throw new Error('Invalid function');
    }
    proms.funcs[identifier] = proms.funcs[identifier] || [];
    proms.funcs[identifier].push(func);
    const runObj = runFuncs(type, identifier);
    if (parentHasLoaded(identifier)) {
      func(proms[type][identifier].data);
    }
  }

  scope.types = types;
  scope.states = states;
  scope.create = create;
  scope.destroy = destroy;
  scope.on = on;
  return scope;
};
