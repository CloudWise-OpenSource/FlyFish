/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License.
 *  REQUIREMENT: This definition is dependent on the @types/node definition.
 *  Install with `npm install @types/node --save-dev`
 *--------------------------------------------------------------------------------------------*/

declare module "iconv-lite-umd" {
  // Basic API
  export function decode(
    buffer: Uint8Array,
    encoding: string,
    options?: Options
  ): string;

  export function encode(
    content: string,
    encoding: string,
    options?: Options
  ): Uint8Array;

  export function encodingExists(encoding: string): boolean;

  // Stream API
  // WARNING: Excluded because it is specific to node.
  // export function decodeStream(encoding: string, options?: Options): NodeJS.ReadWriteStream;

  // export function encodeStream(encoding: string, options?: Options): NodeJS.ReadWriteStream;

  // Low-level stream APIs
  export function getEncoder(
    encoding: string,
    options?: Options
  ): EncoderStream;

  export function getDecoder(
    encoding: string,
    options?: Options
  ): DecoderStream;
}

export interface Options {
  stripBOM?: boolean;
  addBOM?: boolean;
  defaultEncoding?: string;
}

export interface EncoderStream {
  write(str: string): Uint8Array;
  end(): Uint8Array | undefined;
}

export interface DecoderStream {
  write(buf: Uint8Array): string;
  end(): string | undefined;
}
