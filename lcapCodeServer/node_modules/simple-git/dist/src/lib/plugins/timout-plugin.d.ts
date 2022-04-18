import { SimpleGitOptions } from '../types';
import { SimpleGitPlugin } from './simple-git-plugin';
export declare function timeoutPlugin({ block }: Exclude<SimpleGitOptions['timeout'], undefined>): SimpleGitPlugin<'spawn.after'> | void;
