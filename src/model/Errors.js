class KeyError extends Error {
  constructor(...args) {
    super(...args);
    Error(this, KeyError);
  }
}

class ValueError extends Error {
  constructor(...args) {
    super(...args);
    Error(this, ValueError);
  }
}

class DuplicateError extends Error {
  constructor(...args) {
    super(...args);
    Error(this, DuplicateError);
  }
}

class MissingError extends Error {
  constructor(...args) {
    super(...args);
    Error(this, MissingError);
  }
}

export { KeyError, ValueError, DuplicateError, MissingError };
