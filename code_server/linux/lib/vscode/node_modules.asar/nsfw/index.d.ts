declare module 'nsfw' {

    export = NsfwFunction;

    /** Returns a Promise that resolves to the created NSFW Object.
    * @param {watchPath} watchPath - the path that nsfw should watchPath
    * @param {eventCallback} eventCallback - callback that will be fired when NSFW has change events
    * @param {options} options - options
    */
    function NsfwFunction(watchPath: string, eventCallback: (events: Array<NsfwFunction.FileChangeEvent>) => void, options?: Partial<NsfwFunction.Options>): Promise<NsfwFunction.NSFW>;
    namespace NsfwFunction {

        export const actions: typeof ActionType;

        export interface NSFW {
            /** Returns a Promise that resolves after NSFW has paused listening to events. */
            pause: () => Promise<void>;
            /** Returns a Promise that resolves after NSFW has resumed listening to events. */
            resume: () => Promise<void>;
            /** Returns a Promise that resolves when the NSFW object has started watching the path. */
            start: () => Promise<void>;
            /** Returns a Promise that resolves when NSFW object has halted. */
            stop: () => Promise<void>;
        }

        export const enum ActionType {
            CREATED = 0,
            DELETED = 1,
            MODIFIED = 2,
            RENAMED = 3
        }

        export type CreatedFileEvent = GenericFileEvent<ActionType.CREATED>;
        export type DeletedFileEvent = GenericFileEvent<ActionType.DELETED>;
        export type ModifiedFileEvent = GenericFileEvent<ActionType.MODIFIED>;
        export type FileChangeEvent = CreatedFileEvent | DeletedFileEvent | ModifiedFileEvent | RenamedFileEvent;

        export interface RenamedFileEvent {
            /** the type of event that occurred */
            action: ActionType.RENAMED;
            /** the directory before a rename */
            directory: string;
            /**  the name of the file before a rename*/
            oldFile: string;
            /** the new location of the file(only useful on linux) */
            newDirectory: string;
            /** the name of the file after a rename */
            newFile: string;
        }

        export interface GenericFileEvent<T extends ActionType> {
            /** the type of event that occurred */
            action: T;
            /** the location the event took place */
            directory: string;
            /** the name of the file that was changed(Not available for rename events) */
            file: string;
        }

        interface Options {
            /** time in milliseconds to debounce the event callback */
            debounceMS?: number;
            /** callback to fire in the case of errors */
            errorCallback?: (err: any) => void
        }
    }

}
