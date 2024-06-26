import { OAuth2Client, TokenPayload } from "google-auth-library";
import { NextFunction, Request, Response } from "express";
import User from "./models/User";
import UserInterface from "../shared/User";

// create a new OAuth client used to verify google sign-in

const CLIENT_ID = "692003849253-cs1pp74i51tf8r4psv73qve0lgbhljb4.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const verify = (token: string) => {
  return client
    .verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })
    .then((ticket) => ticket.getPayload());
};

const getOrCreateUser = (user: TokenPayload) => {
  return User.findOne({ googleid: user.sub }).then(
    (existingUser: UserInterface | null | undefined) => {
      if (existingUser !== null && existingUser !== undefined) return existingUser;
      const newUser = new User({
        name: user.name,
        googleid: user.sub,
      });
      return newUser.save();
    }
  );
};

const login = (req: Request, res: Response) => {
  verify(req.body.token)
    .then((user) => {
      if (user === undefined) return;
      return getOrCreateUser(user);
    })
    .then((user) => {
      if (user === null || user === undefined) {
        throw new Error("Unable to retrieve user.");
      }
      req.session.user = user;
      res.send(user);
    })
    .catch((err) => {
      console.log(`Failed to login: ${err}`);
      res.status(401).send({ err });
    });
};

const logout = (req: Request, res: Response) => {
  req.session.user = undefined;
  res.send({});
};

const populateCurrentUser = (req: Request, _res: Response, next: NextFunction) => {
  req.user = req.session.user;
  next();
};

// We use any because
const ensureLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).send({ err: "Not logged in." });
  }
  next();
};

export default {
  ensureLoggedIn,
  populateCurrentUser,
  login,
  logout,
};
