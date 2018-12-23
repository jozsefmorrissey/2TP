exports.errorSrvc = (Hash) => {
  const errors = {};
  function error (identifier, value) {
    const hash = Hash(identifier);
    if (errors[hash] === undefined) {
      errors[hash] = [];
    }

    if (value) {
      errors[hash].push(value);
      return undefined;
    }
    return errors[hash];
  }

  return error;
}
