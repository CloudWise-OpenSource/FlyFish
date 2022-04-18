const idRegex = /^[a-z0-9-]{1,32}$/;
const nameRegex = /^[a-z0-9-]{1,32}$/;
const valueRegex = /^[a-zA-Z0-9/+.-]+$/;
const b64Regex = /^([a-zA-Z0-9/+.-]+|)$/;
const decimalRegex = /^((-)?[1-9]\d*|0)$/;
const versionRegex = /^v=(\d+)$/;

function objToKeyVal(obj) {
  return objectKeys(obj)
    .map(k => [k, obj[k]].join('='))
    .join(',');
}

function keyValtoObj(str) {
  const obj = {};
  str.split(',').forEach(ps => {
    const pss = ps.split('=');
    if (pss.length < 2) {
      throw new TypeError(`params must be in the format name=value`);
    }

    obj[pss.shift()] = pss.join('=');
  });
  return obj;
}

function objectKeys(object) {
  /* istanbul ignore next */
  return Object.keys(object);
}

function objectValues(object) {
  /* istanbul ignore next */
  if (typeof Object.values === 'function') return Object.values(object);
  /* istanbul ignore next */
  return objectKeys(object).map(k => object[k]);
}

/**
 * Generates a PHC string using the data provided.
 * @param  {Object} opts Object that holds the data needed to generate the PHC
 * string.
 * @param  {string} opts.id Symbolic name for the function.
 * @param  {Number} [opts.version] The version of the function.
 * @param  {Object} [opts.params] Parameters of the function.
 * @param  {Buffer} [opts.salt] The salt as a binary buffer.
 * @param  {Buffer} [opts.hash] The hash as a binary buffer.
 * @return {string} The hash string adhering to the PHC format.
 */
function serialize(opts) {
  const fields = [''];

  if (typeof opts !== 'object' || opts === null) {
    throw new TypeError('opts must be an object');
  }

  // Identifier Validation
  if (typeof opts.id !== 'string') {
    throw new TypeError('id must be a string');
  }

  if (!idRegex.test(opts.id)) {
    throw new TypeError(`id must satisfy ${idRegex}`);
  }

  fields.push(opts.id);

  if (typeof opts.version !== 'undefined') {
    if (
      typeof opts.version !== 'number' ||
      opts.version < 0 ||
      !Number.isInteger(opts.version)
    ) {
      throw new TypeError('version must be a positive integer number');
    }

    fields.push(`v=${opts.version}`);
  }

  // Parameters Validation
  if (typeof opts.params !== 'undefined') {
    if (typeof opts.params !== 'object' || opts.params === null) {
      throw new TypeError('params must be an object');
    }

    const pk = objectKeys(opts.params);
    if (!pk.every(p => nameRegex.test(p))) {
      throw new TypeError(`params names must satisfy ${nameRegex}`);
    }

    // Convert Numbers into Numeric Strings and Buffers into B64 encoded strings.
    pk.forEach(k => {
      if (typeof opts.params[k] === 'number') {
        opts.params[k] = opts.params[k].toString();
      } else if (Buffer.isBuffer(opts.params[k])) {
        opts.params[k] = opts.params[k].toString('base64').split('=')[0];
      }
    });
    const pv = objectValues(opts.params);
    if (!pv.every(v => typeof v === 'string')) {
      throw new TypeError('params values must be strings');
    }

    if (!pv.every(v => valueRegex.test(v))) {
      throw new TypeError(`params values must satisfy ${valueRegex}`);
    }

    const strpar = objToKeyVal(opts.params);
    fields.push(strpar);
  }

  if (typeof opts.salt !== 'undefined') {
    // Salt Validation
    if (!Buffer.isBuffer(opts.salt)) {
      throw new TypeError('salt must be a Buffer');
    }

    fields.push(opts.salt.toString('base64').split('=')[0]);

    if (typeof opts.hash !== 'undefined') {
      // Hash Validation
      if (!Buffer.isBuffer(opts.hash)) {
        throw new TypeError('hash must be a Buffer');
      }

      fields.push(opts.hash.toString('base64').split('=')[0]);
    }
  }

  // Create the PHC formatted string
  const phcstr = fields.join('$');

  return phcstr;
}

/**
 * Parses data from a PHC string.
 * @param  {string} phcstr A PHC string to parse.
 * @return {Object} The object containing the data parsed from the PHC string.
 */
function deserialize(phcstr) {
  if (typeof phcstr !== 'string' || phcstr === '') {
    throw new TypeError('pchstr must be a non-empty string');
  }

  if (phcstr[0] !== '$') {
    throw new TypeError('pchstr must contain a $ as first char');
  }

  const fields = phcstr.split('$');
  // Remove first empty $
  fields.shift();

  // Parse Fields
  let maxf = 5;
  if (!versionRegex.test(fields[1])) maxf--;
  if (fields.length > maxf) {
    throw new TypeError(
      `pchstr contains too many fileds: ${fields.length}/${maxf}`
    );
  }

  // Parse Identifier
  const id = fields.shift();
  if (!idRegex.test(id)) {
    throw new TypeError(`id must satisfy ${idRegex}`);
  }

  let version;
  // Parse Version
  if (versionRegex.test(fields[0])) {
    version = parseInt(fields.shift().match(versionRegex)[1], 10);
  }

  let hash;
  let salt;
  if (b64Regex.test(fields[fields.length - 1])) {
    if (fields.length > 1 && b64Regex.test(fields[fields.length - 2])) {
      // Parse Hash
      hash = Buffer.from(fields.pop(), 'base64');
      // Parse Salt
      salt = Buffer.from(fields.pop(), 'base64');
    } else {
      // Parse Salt
      salt = Buffer.from(fields.pop(), 'base64');
    }
  }

  // Parse Parameters
  let params;
  if (fields.length > 0) {
    const parstr = fields.pop();
    params = keyValtoObj(parstr);
    if (!objectKeys(params).every(p => nameRegex.test(p))) {
      throw new TypeError(`params names must satisfy ${nameRegex}`);
    }

    const pv = objectValues(params);
    if (!pv.every(v => valueRegex.test(v))) {
      throw new TypeError(`params values must satisfy ${valueRegex}`);
    }

    const pk = objectKeys(params);
    // Convert Decimal Strings into Numbers
    pk.forEach(k => {
      params[k] = decimalRegex.test(params[k])
        ? parseInt(params[k], 10)
        : params[k];
    });
  }

  if (fields.length > 0) {
    throw new TypeError(`pchstr contains unrecognized fileds: ${fields}`);
  }

  // Build the output object
  const phcobj = {id};
  if (version) phcobj.version = version;
  if (params) phcobj.params = params;
  if (salt) phcobj.salt = salt;
  if (hash) phcobj.hash = hash;

  return phcobj;
}

module.exports = {
  serialize,
  deserialize
};
