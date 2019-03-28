exports.range = () => {
  function filter(input, start, end) {
    start = parseInt(start);
    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = parseInt(end)
    }

    for (var i=start; i<end; i++) {
      input.push(i);
    }

    return input;
  }
  return filter;
};
