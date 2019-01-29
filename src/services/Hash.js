exports.Hash = () => {
  let hashFunc;
  function stringHash(string, noType) {
    let hashString = string;
    if (!noType) {
      hashString = `string${string}`;
    }
    let hash = 0;
    for (let i = 0; i < hashString.length; i += 1) {
      const character = hashString.charCodeAt(i);
      hash = ((hash << 5) - hash) + character;
      hash &= hash; // Convert to 32bit integer
    }
    return hash;
  }

  function objectHash(obj, exclude) {
    if (exclude.indexOf(obj) > -1) {
      console.log('Excluded');
      return undefined;
    }
    let hash = '';
    const keys = Object.keys(obj).sort();
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      const keyHash = hashFunc(key);
      const attrHash = hashFunc(obj[key], exclude, key);
      exclude.push(obj[key]);
      hash += stringHash(`object${keyHash}${attrHash}`, true);
    }
    return stringHash(hash, true);
  }

  function Hash(unkType, exclude, key) {
    if (unkType === null) {
      return 0;
    }
    if (unkType === undefined) {
      return undefined;
    }
    let ex = exclude;
    if (ex === undefined) {
      ex = [];
    }
    console.log(key);
    switch (typeof unkType) {
      case 'object':
        return objectHash(unkType, ex);
      case 'function':
        return stringHash(unkType.toString());
      default:
        if (!isNaN(unkType) && typeof unkType !== 'string') {
          return unkType;
        }
        return stringHash(String(unkType));
    }
  }

  hashFunc = Hash;

  return Hash;
};
