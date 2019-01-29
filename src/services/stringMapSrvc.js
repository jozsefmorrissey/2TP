exports.stringMapSrvc = () => {
  function clean(string) {
    let retStr = string.replace(/<[^<^>]*>/g, ' ');
    retStr = retStr.replace(/&lt;.*?&gt;/g, ' ');
    retStr = retStr.replace(/([a-zA-Z])[^0-9^a-z^A-Z^\s]([a-zA-Z])/, '$1$2');
    retStr = retStr.replace(/\\n\\t/, ' ');
    retStr = retStr.replace(/[^0-9^a-z^A-Z^\s]/g, ' ');
    return retStr.replace(/\s{1,}/g, ' ');
  }

  function mapFunc(string, cleanFunc) {
    let retStr = string;
    if (typeof cleanFunc === 'function') {
      retStr = cleanFunc(string);
    } else {
      retStr = clean(string);
    }

    const words = retStr.split(/\s/);
    const map = {};
    if (words) {
      for (let index = 0; index < words.length; index += 1) {
        const word = words[index];
        if (word !== '') {
          map[word] = map[word] ? map[word] : 1;
          map[word] += 1;
        }
      }
    }
    return map;
  }

  return mapFunc;
};
