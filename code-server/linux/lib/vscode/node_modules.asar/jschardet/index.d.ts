export interface IDetectedMap {
    encoding: string,
    confidence: number
}
export function detect(buffer: Buffer | string, options?: { minimumThreshold: number }): IDetectedMap;

export function enableDebug(): void;
