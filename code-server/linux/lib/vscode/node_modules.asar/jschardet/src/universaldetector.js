/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

/**
 * This is a port from the python port, version "2.0.1"
 */

var constants = require('./constants');
var MBCSGroupProber = require('./mbcsgroupprober');
var SBCSGroupProber = require('./sbcsgroupprober');
var Latin1Prober = require('./latin1prober');
var EscCharSetProber = require('./escprober')
var logger = require('./logger');

function UniversalDetector(options) {
    if (!options) options = {};
    if (!options.minimumThreshold)  options.minimumThreshold = 0.20;

    var _state = {
        pureAscii   : 0,
        escAscii    : 1,
        highbyte    : 2
    };
    var self = this;

    function init() {
        self._highBitDetector = /[\x80-\xFF]/;
        self._escDetector = /(\x1B|~\{)/;
        self._mEscCharsetProber = null;
        self._mCharsetProbers = [];
        self.reset();
    }

    this.reset = function() {
        this.result = {"encoding": null, "confidence": 0.0};
        this.results = []
        this.done = false;
        this._mStart = true;
        this._mGotData = false;
        this._mInputState = _state.pureAscii;
        this._mLastChar = "";
        this._mBOM = "";
        if( this._mEscCharsetProber ) {
            this._mEscCharsetProber.reset();
        }
        for( var i = 0, prober; prober = this._mCharsetProbers[i]; i++ ) {
            prober.reset();
        }
    }

    this.feed = function(aBuf) {
        if( this.done ) return;

        var aLen = aBuf.length;
        if( !aLen ) return;

        if( !this._mGotData ) {
            this._mBOM += aBuf;
            // If the data starts with BOM, we know it is UTF
            if( this._mBOM.slice(0,3) == "\xEF\xBB\xBF" ) {
                // EF BB BF  UTF-8 with BOM
                this.result = {"encoding": "UTF-8", "confidence": 1.0};
            } else if( this._mBOM.slice(0,4) == "\xFF\xFE\x00\x00" ) {
                // FF FE 00 00  UTF-32, little-endian BOM
                this.result = {"encoding": "UTF-32LE", "confidence": 1.0};
            } else if( this._mBOM.slice(0,4) == "\x00\x00\xFE\xFF" ) {
                // 00 00 FE FF  UTF-32, big-endian BOM
                this.result = {"encoding": "UTF-32BE", "confidence": 1.0};
            } else if( this._mBOM.slice(0,4) == "\xFE\xFF\x00\x00" ) {
                // FE FF 00 00  UCS-4, unusual octet order BOM (3412)
                this.result = {"encoding": "X-ISO-10646-UCS-4-3412", "confidence": 1.0};
            } else if( this._mBOM.slice(0,4) == "\x00\x00\xFF\xFE" ) {
                // 00 00 FF FE  UCS-4, unusual octet order BOM (2143)
                this.result = {"encoding": "X-ISO-10646-UCS-4-2143", "confidence": 1.0};
            } else if( this._mBOM.slice(0,2) == "\xFF\xFE" ) {
                // FF FE  UTF-16, little endian BOM
                this.result = {"encoding": "UTF-16LE", "confidence": 1.0};
            } else if( this._mBOM.slice(0,2) == "\xFE\xFF" ) {
                // FE FF  UTF-16, big endian BOM
                this.result = {"encoding": "UTF-16BE", "confidence": 1.0};
            }

            if (this.result.confidence > 0) {
                this.results = [this.result];
            }

            // If we got to 4 chars without being able to detect a BOM we
            // stop trying.
            if( this._mBOM.length > 3 ) {
                this._mGotData = true;
            }
        }

        if( this.result.encoding && (this.result.confidence > 0.0) ) {
            this.done = true;
            return;
        }

        if( this._mInputState == _state.pureAscii ) {
            if( this._highBitDetector.test(aBuf) ) {
                this._mInputState = _state.highbyte;
            } else if( this._escDetector.test(this._mLastChar + aBuf) ) {
                this._mInputState = _state.escAscii;
            }
        }

        this._mLastChar = aBuf.slice(-1);

        if( this._mInputState == _state.escAscii ) {
            if( !this._mEscCharsetProber ) {
                this._mEscCharsetProber = new EscCharSetProber();
            }
            if( this._mEscCharsetProber.feed(aBuf) == constants.foundIt ) {
                this.result = {
                    "encoding": this._mEscCharsetProber.getCharsetName(),
                    "confidence": this._mEscCharsetProber.getConfidence()
                };
                this.results = [this.result];
                this.done = true;
            }
        } else if( this._mInputState == _state.highbyte ) {
            if( this._mCharsetProbers.length == 0 ) {
                this._mCharsetProbers = [
                    new MBCSGroupProber(),
                    new SBCSGroupProber(),
                    new Latin1Prober()
                ];
            }
            for( var i = 0, prober; prober = this._mCharsetProbers[i]; i++ ) {
                if( prober.feed(aBuf) == constants.foundIt ) {
                    this.result = {
                        "encoding": prober.getCharsetName(),
                        "confidence": prober.getConfidence()
                    };
                    this.results = [this.result];
                    this.done = true;
                    break;
                }
            }
        }
    }

    this.close = function() {
        if( this.done ) return;
        if( this._mBOM.length === 0 ) {
            logger.log("no data received!\n");
            return;
        }
        this.done = true;

        if( this._mInputState == _state.pureAscii ) {
            logger.log("pure ascii")
            this.result = {"encoding": "ascii", "confidence": 1.0};
            this.results.push(this.result);
            return this.result;
        }

        if( this._mInputState == _state.highbyte ) {
            for( var i = 0, prober; prober = this._mCharsetProbers[i]; i++ ) {
                if( !prober || !prober.getCharsetName()) continue;
                this.results.push({
                    "encoding": prober.getCharsetName(),
                    "confidence": prober.getConfidence()
                });
                logger.log(prober.getCharsetName() + " confidence " + prober.getConfidence());
            }
            this.results.sort(function(a, b) {
                return b.confidence - a.confidence;
            });
            if (this.results.length > 0) {
                var topResult = this.results[0];
                if (topResult.confidence >= options.minimumThreshold) {
                    this.result = topResult;
                    return topResult;
                }
            }
        }

        if( logger.enabled ) {
            logger.log("no probers hit minimum threshhold\n");
            for( var i = 0, prober; prober = this._mCharsetProbers[i]; i++ ) {
                if( !prober ) continue;
                logger.log(prober.getCharsetName() + " confidence = " +
                    prober.getConfidence() + "\n");
            }
        }
    }

    init();
}

module.exports = UniversalDetector;
