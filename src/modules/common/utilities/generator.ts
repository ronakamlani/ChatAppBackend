import bcrypt from 'bcrypt';
import crypto from 'crypto';

/**
 * 
 * @string [Required] : Use to store user passworld or hash string.
 * @return : string or reject.
 */
export const generateHash = function (string:string ) {
    return new Promise((resolve:(hash:string)=>void,reject )=>{

        return bcrypt.genSalt(process.env.bcrypt_rounds, function (err, salt:string) {
            
            if (err) { 
                return reject(err);
            }

            bcrypt.hash(string, salt, function (iErr:unknown|null, hash:string) {
                if (iErr) { 
                    return reject(iErr);
                }

                return resolve(hash);
            });
        });
    });
};

/**
 * 
 * @returns String
 */
export const generateSaltSync = function () {
  return bcrypt.genSaltSync(process.env.bcrypt_rounds);
};

/**
 * 
 * @param password : string 
 * @param salt  : string
 * @returns : string 
 */
 export const generateHashSync = function (password:string, salt:string) {
  return bcrypt.hashSync(password, salt);
};

// cb = function(err, res) {}
// res can be true of false
export const validateHash = function (string:string, hash:string ) {
  
  return new Promise((resolve,reject)=>{
    bcrypt.compare(string, hash, function (err, isMatch) {
      
      if (err) {
        //cb(err,null); 
        return reject(err);
      }

      return resolve(isMatch);
    });
  });
};

export const generateToken = function () {
  return crypto.randomBytes(32).toString('hex');
};

 