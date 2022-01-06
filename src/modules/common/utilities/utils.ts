
/**
 * Return a unique identifier with the given `len`.
 *
 * @param {Number} length
 * @return {String}
 * @api private
 */
const getUid = function(length:number) {
  let uid = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;

  for (let i = 0; i < length; ++i) {
    uid += chars[getRandomInt(0, charsLength - 1)];
  }

  return uid;
};

/**
 * Return a random int, used by `utils.getUid()`.
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */
function getRandomInt(min:number, max:number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isExpired(initialDate:Date, expiresInSeconds:Date):boolean {
  const diff = (new Date(expiresInSeconds)).getTime() - initialDate.getTime();
  return diff<=0;
}

export default {
  getUid,
  getRandomInt,
  isExpired
}

