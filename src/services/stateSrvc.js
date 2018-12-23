exports.stateSrvc = () => {
  const srefReg = /^[a-zA-Z0-9.]*$/;
  const obj = {};
  const initState = window.location.href.replace(/^.*\/(.*)$/, '$1');
  const history = [initState];
  let currIndex = 0;
  const changeFuncs = [];

  function runChangeFuncs() {
    for (let index = 0; index < changeFuncs.length; index += 1) {
      changeFuncs[index]();
    }
  }

  function getIndex(offset) {
    let diff = offset;
    if (offset === undefined) {
      diff = 0;
    }
    const newIndex = Math.ceil(currIndex + diff);
    if (newIndex > -1 && newIndex < history.length) {
      return newIndex;
    }

    if (newIndex <= -1) {
      return 0;
    }

    return history.length - 1;
  }

  function go(numOstr) {
    let sref;
    if (typeof numOstr === 'number') {
      const newIndex = Number.parseInt(numOstr, 10);
      sref = history[newIndex];
      currIndex = newIndex;
    } else if (typeof numOstr === 'string' && numOstr.match(srefReg)) {
      sref = numOstr;
      currIndex = history.length;
    } else {
      throw new Error(`arg either needs to be a number or a string that matches
        this regex expression ${srefReg}\n\tYour argument was '${numOstr}' of
        type ${typeof numOstr}`);
    }

    history.push(sref);
    runChangeFuncs();
  }

  function getRange(range) {
    let end = getIndex(range / 2);
    let remainR = range - (end - currIndex);
    let start = getIndex(remainR * -1);
    if (end - start < range) {
      remainR = -1 * ((currIndex - remainR));
      end = getIndex((remainR + end) - currIndex);
    }

    const copy = [];
    while (start < end + 1) {
      copy.push({ sref: history[start], index: start });
      start += 1;
    }
    return copy;
  }

  function getState() {
    return history[currIndex];
  }
  function getPath() {
    return getState().replace(/\./g, '/');
  }

  function onChange(func) {
    if (typeof func === 'function') {
      changeFuncs.push(func);
    }
  }

  obj.getIndex = getIndex;
  obj.onChange = onChange;
  obj.getPath = getPath;
  obj.getState = getState;
  obj.getRange = getRange;
  obj.go = go;
  return obj;
};
