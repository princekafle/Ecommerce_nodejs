import jwt from 'jsonwebtoken';

function createJWT(data) {
  // yesle chai data use garera jwt token create garxa
  return jwt.sign(data, process.env.JWT_SECRET,{
    expiresIn: 86400, // 1day expire date
  });
}

async function verifyJWT(authToken) {
  return await new Promise((resolve, reject) => {
    jwt.verify(authToken, process.env.JWT_SECRET, (error, data) => {
      if (error) return reject(error);

      resolve(data);
      // If the token is valid, it resolves the decoded data (payload).that is users details 
    });
  });
}

export { createJWT, verifyJWT };