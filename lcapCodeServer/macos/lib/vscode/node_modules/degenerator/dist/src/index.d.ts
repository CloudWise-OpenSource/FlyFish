/// <reference types="node" />
import { Context, RunningScriptOptions } from 'vm';
/**
 * Compiles sync JavaScript code into JavaScript with async Functions.
 *
 * @param {String} code JavaScript string to convert
 * @param {Array} names Array of function names to add `await` operators to
 * @return {String} Converted JavaScript string with async/await injected
 * @api public
 */
declare function degenerator(code: string, _names: degenerator.DegeneratorNames, { output }?: degenerator.DegeneratorOptions): string;
declare namespace degenerator {
    type DegeneratorName = string | RegExp;
    type DegeneratorNames = DegeneratorName[];
    type DegeneratorOutput = 'async' | 'generator';
    interface DegeneratorOptions {
        output?: DegeneratorOutput;
    }
    interface CompileOptions extends DegeneratorOptions, RunningScriptOptions {
        sandbox?: Context;
    }
    const supportsAsync: boolean;
    function compile<T extends Function>(code: string, returnName: string, names: DegeneratorNames, options?: CompileOptions): T;
}
export = degenerator;
