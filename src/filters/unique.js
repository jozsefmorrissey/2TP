exports.unique = () => {
  function filter(input, key) {
    const unique = {};
    const uniqueList = [];
    for (let i = 0; i < input.length; i += 1) {
      if (unique[input[i][key]] === undefined) {
        unique[input[i][key]] = '';
        uniqueList.push(input[i]);
      }
    }
    return uniqueList;
  }
  return filter;
};
