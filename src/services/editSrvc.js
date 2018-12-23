exports.editSrvc = () => {
  const obj = {};
  obj.KEYWORD = 'Keywords';
  obj.CONTENT = 'Content';
  obj.DATA = 'Data';
  obj.LINK = 'Links';
  obj.CSS = 'Css';
  const types = [obj.KEYWORD, obj.CONTENT, obj.DATA, obj.LINK, obj.CSS];
  const validation = {};

  const DATA = {};
  DATA[obj.KEYWORD] = {};

  function set(type, data, identifier) {
    if (types.indexOf(type) === -1) {
      throw new Exception(`Unknown type '${type}'`);
    }

    if (type === obj.KEYWORD) {
      if (identifier === undefined || identifier === '') {
        throw new Exception('You must define an identifier');
      }
      DATA[type][identifier] = data;
    } else {
      DATA[type] = data;
    }
  }

  function isJson(string) {
    JSON.parse(string);
    return true;
  }

  function noScript(string) {
    if (string.match('<script>.*</script>')) {
      throw new Exception('Your string contains javascript, this will be ' +
                          'removed upon submission.');
    }
    return true;
  }

  function validLinks(data) {
    const keys = Object.keys(data);
    const invalid = {};
    for (let index = 0; index < keys.length(); index += 1) {
      const key = keys[index];
      if (typeof key !== 'string' || key === '') {
        invalid[key] = 'Value must not be an empty string';
      }
    }
    if (Object.keys(invalid).length() === 0) {
      return true;
    }
    return invalid;
  }

  function validate(type, data) {
    if (validation[type]) {
      validation[type](data);
    }
    return true;
  }

  validation[obj.DATA] = isJson;
  validation[obj.KEYWORD] = noScript;
  validation[obj.CONTENT] = noScript;
  validation[obj.LINK] = validLinks;
  obj.validate = validate;
  obj.set = set;

  return obj;
};
