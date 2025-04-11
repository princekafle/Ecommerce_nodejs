import { verifyJWT } from "../utils/jwt.js";

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  let authToken;
// we authheader chai frontend ma token check garna ra cookie chai backend ma token check garna ko lagi 
  if (authHeader && authHeader.startsWith("Bearer ")) {
    authToken = authHeader.split(" ")[1];
  } else {
    const cookie = req.headers.cookie;

    if (!cookie) return res.status(401).send("User not authenticated.");

    authToken = cookie.split("=")[1];
  }

  verifyJWT(authToken)
  // if token valid xa vane decoded data((payload of the JWT i.e user ko details, jun chai jwt token verified vaisakepaxi ko user ko data ho ) lai req.user ma store garxa
    .then((data) => {
      req.user = data;
      next();
    })
    .catch(() => {
      res.status(400).send("Invalid token");
    });
}

export default auth;