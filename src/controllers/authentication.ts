import { createUser, getUserByEmail } from "../db/users";
import express from "express";
import { random } from "../helpers/index";
import { authentication } from "../helpers/index";

// login controllers
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email password is required" });
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const expectedHash = authentication(user.authentication.salt, password);
    const userPassword = user.authentication.password;

    if (expectedHash !== userPassword) {
      return res.status(400).json({ message: "Email or password mismatch" });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("ts-auth", user.authentication.sessionToken, {
      domain: "localhost",
    });

    return res.status(200).send(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Invalid email or password" });
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ message: "email password username is required" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "email already exists" });
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
