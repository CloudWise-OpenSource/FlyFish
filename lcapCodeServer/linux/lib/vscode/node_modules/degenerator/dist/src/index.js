"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const util_1 = require("util");
const escodegen_1 = require("escodegen");
const esprima_1 = require("esprima");
const ast_types_1 = require("ast-types");
const vm_1 = require("vm");
const supports_async_1 = __importDefault(require("./supports-async"));
const generator_to_promise_1 = __importDefault(require("./generator-to-promise"));
/**
 * Compiles sync JavaScript code into JavaScript with async Functions.
 *
 * @param {String} code JavaScript string to convert
 * @param {Array} names Array of function names to add `await` operators to
 * @return {String} Converted JavaScript string with async/await injected
 * @api public
 */
function degenerator(code, _names, { output = 'async' } = {}) {
    if (!Array.isArray(_names)) {
        throw new TypeError('an array of async function "names" is required');
    }
    // Duplicate the `names` array since it's rude to augment the user args
    const names = _names.slice(0);
    const ast = esprima_1.parseScript(code);
    // First pass is to find the `function` nodes and turn them into async or
    // generator functions only if their body includes `CallExpressions` to
    // function in `names`. We also add the names of the functions to the `names`
    // array. We'll iterate several time, as every iteration might add new items
    // to the `names` array, until no new names were added in the iteration.
    let lastNamesLength = 0;
    do {
        lastNamesLength = names.length;
        ast_types_1.visit(ast, {
            visitVariableDeclaration(path) {
                if (path.node.declarations) {
                    for (let i = 0; i < path.node.declarations.length; i++) {
                        const declaration = path.node.declarations[i];
                        if (ast_types_1.namedTypes.VariableDeclarator.check(declaration) &&
                            ast_types_1.namedTypes.Identifier.check(declaration.init) &&
                            ast_types_1.namedTypes.Identifier.check(declaration.id) &&
                            checkName(declaration.init.name, names) &&
                            !checkName(declaration.id.name, names)) {
                            names.push(declaration.id.name);
                        }
                    }
                }
                return false;
            },
            visitAssignmentExpression(path) {
                if (ast_types_1.namedTypes.Identifier.check(path.node.left) &&
                    ast_types_1.namedTypes.Identifier.check(path.node.right) &&
                    checkName(path.node.right.name, names) &&
                    !checkName(path.node.left.name, names)) {
                    names.push(path.node.left.name);
                }
                return false;
            },
            visitFunction(path) {
                if (path.node.id) {
                    let shouldDegenerate = false;
                    ast_types_1.visit(path.node, {
                        visitCallExpression(path) {
                            if (checkNames(path.node, names)) {
                                shouldDegenerate = true;
                            }
                            return false;
                        }
                    });
                    if (!shouldDegenerate) {
                        return false;
                    }
                    // Got a "function" expression/statement,
                    // convert it into an async or generator function
                    if (output === 'async') {
                        path.node.async = true;
                    }
                    else if (output === 'generator') {
                        path.node.generator = true;
                    }
                    // Add function name to `names` array
                    if (!checkName(path.node.id.name, names)) {
                        names.push(path.node.id.name);
                    }
                }
                this.traverse(path);
            }
        });
    } while (lastNamesLength !== names.length);
    // Second pass is for adding `await`/`yield` statements to any function
    // invocations that match the given `names` array.
    ast_types_1.visit(ast, {
        visitCallExpression(path) {
            if (checkNames(path.node, names)) {
                // A "function invocation" expression,
                // we need to inject a `AwaitExpression`/`YieldExpression`
                const delegate = false;
                const { name, parent: { node: pNode } } = path;
                let expr;
                if (output === 'async') {
                    expr = ast_types_1.builders.awaitExpression(path.node, delegate);
                }
                else if (output === 'generator') {
                    expr = ast_types_1.builders.yieldExpression(path.node, delegate);
                }
                else {
                    throw new Error('Only "async" and "generator" are allowd `output` values');
                }
                if (ast_types_1.namedTypes.CallExpression.check(pNode)) {
                    pNode.arguments[name] = expr;
                }
                else {
                    pNode[name] = expr;
                }
            }
            this.traverse(path);
        }
    });
    return escodegen_1.generate(ast);
}
(function (degenerator) {
    degenerator.supportsAsync = supports_async_1.default;
    function compile(code, returnName, names, options = {}) {
        const output = supports_async_1.default ? 'async' : 'generator';
        const compiled = degenerator(code, names, Object.assign(Object.assign({}, options), { output }));
        const fn = vm_1.runInNewContext(`${compiled};${returnName}`, options.sandbox, options);
        if (typeof fn !== 'function') {
            throw new Error(`Expected a "function" to be returned for \`${returnName}\`, but got "${typeof fn}"`);
        }
        if (isAsyncFunction(fn)) {
            return fn;
        }
        else {
            const rtn = generator_to_promise_1.default(fn);
            Object.defineProperty(rtn, 'toString', {
                value: fn.toString.bind(fn),
                enumerable: false
            });
            return rtn;
        }
    }
    degenerator.compile = compile;
})(degenerator || (degenerator = {}));
function isAsyncFunction(fn) {
    return typeof fn === 'function' && fn.constructor.name === 'AsyncFunction';
}
/**
 * Returns `true` if `node` has a matching name to one of the entries in the
 * `names` array.
 *
 * @param {types.Node} node
 * @param {Array} names Array of function names to return true for
 * @return {Boolean}
 * @api private
 */
function checkNames({ callee }, names) {
    let name;
    if (ast_types_1.namedTypes.Identifier.check(callee)) {
        name = callee.name;
    }
    else if (ast_types_1.namedTypes.MemberExpression.check(callee)) {
        if (ast_types_1.namedTypes.Identifier.check(callee.object) &&
            ast_types_1.namedTypes.Identifier.check(callee.property)) {
            name = `${callee.object.name}.${callee.property.name}`;
        }
        else {
            return false;
        }
    }
    else if (ast_types_1.namedTypes.FunctionExpression.check(callee)) {
        if (callee.id) {
            name = callee.id.name;
        }
        else {
            return false;
        }
    }
    else {
        throw new Error(`Don't know how to get name for: ${callee.type}`);
    }
    return checkName(name, names);
}
function checkName(name, names) {
    // now that we have the `name`, check if any entries match in the `names` array
    for (let i = 0; i < names.length; i++) {
        const n = names[i];
        if (util_1.isRegExp(n)) {
            if (n.test(name)) {
                return true;
            }
        }
        else if (name === n) {
            return true;
        }
    }
    return false;
}
module.exports = degenerator;
//# sourceMappingURL=index.js.map