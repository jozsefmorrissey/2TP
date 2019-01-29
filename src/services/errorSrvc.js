exports.errorSrvc = (Hash) => {
  const errors = {};
  const funcObj = {};

  function runFuncs(hash) {
    const funcs = funcObj[hash];
    if (funcs) {
      const errorArr = errors[hash];
      for (let index = 0; index < funcs.length; index += 1) {
        if (errorArr && errorArr.length > 0) {
          funcs[index](errors[hash]);
        } else {
          funcs[index](undefined);
        }
      }
    }
  }

  function error(identifier, value) {
    const hash = Hash(identifier);
    if (value === null) {
      errors[hash] = [];
      runFuncs(hash);
      return undefined;
    }
    if (!errors[hash]) {
      errors[hash] = [];
    }

    if (typeof value !== 'function') {
      if (value) {
        errors[hash].push(value);
        runFuncs(hash);
        return undefined;
      }
    } else {
      if (!funcObj[hash]) {
        funcObj[hash] = [];
      }
      if (funcObj[hash].indexOf(value) === -1) {
        funcObj[hash].push(value);
      }
    }

    return errors[hash];
  }

  return error;
};
