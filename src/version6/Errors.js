
class KeyError extends Error {
    constructor(...args) {
        super(...args)
        Error.captureStackTrace(this, KeyError)
    }
}

class ValueError extends Error {
    constructor(...args) {
        super(...args)
        Error.captureStackTrace(this, ValueError)
    }
}

class DuplicateError extends Error {
    constructor(...args) {
        super(...args)
        Error.captureStackTrace(this, DuplicateError)
    }
}

class MissingError extends Error {
    constructor(...args) {
        super(...args)
        Error.captureStackTrace(this, MissingError)
    }
}

export { KeyError as KeyError };
export { ValueError as ValueError };
export { DuplicateError as DuplicateError };
export { MissingError as MissingError };
