import { verifyJWT } from "../utils/jwt.js";

function auth(req, res, next) {
  const cookie = req.headers.cookie;

  if (!cookie) return res.status(401).send("User not authenticated.");

  // yesle chai cookie ma vayeko token lai extract garxa
  // yesle cookie lai split grxa = paxi ko 2nd part ko value ho exact token
  const authToken = cookie.split("=")[1];

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