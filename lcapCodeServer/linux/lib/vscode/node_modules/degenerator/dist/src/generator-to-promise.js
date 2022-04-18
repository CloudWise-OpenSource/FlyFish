"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isGenerator(fn) {
    return fn && fn.next && fn.throw;
}
function isGeneratorFunction(fn) {
    return (typeof fn == 'function' && fn.constructor.name == 'GeneratorFunction');
}
function createDeferred() {
    let r;
    let j;
    const promise = new Promise((resolve, reject) => {
        r = resolve;
        j = reject;
    });
    if (!r || !j) {
        throw new Error('Creating Deferred failed');
    }
    return { promise, resolve: r, reject: j };
}
function generatorFnToPromise(generatorFunction) {
    if (!isGeneratorFunction(generatorFunction)) {
        if (typeof generatorFunction === 'function') {
            return function (...args) {
                return Promise.resolve(true).then(() => {
                    return generatorFunction.apply(this, args);
                });
            };
        }
        throw new Error('The given function must be a generator function');
    }
    return function (...args) {
        const generator = generatorFunction.apply(this, args);
        return generatorToPromise(generator);
    };
}
exports.default = generatorFnToPromise;
function generatorToPromise(generator) {
    const deferred = createDeferred();
    (function next(err, value) {
        let genState = null;
        try {
            if (err) {
                genState = generator.throw(err);
            }
            else {
                genState = generator.next(value);
            }
        }
        catch (e) {
            genState = { value: Promise.reject(e), done: true };
        }
        if (isGenerator(genState.value)) {
            genState.value = generatorToPromise(genState.value);
        }
        if (genState.done) {
            deferred.resolve(genState.value);
        }
        else {
            Promise.resolve(genState.value)
                .then(promiseResult => next(null, promiseResult))
                .catch(err => next(err));
        }
    })();
    return deferred.promise;
}
//# sourceMappingURL=generator-to-promise.js.map