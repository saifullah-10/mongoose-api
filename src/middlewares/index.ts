import express from "express";

import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const identity = get(req, "identity._id") as string;

    if (!identity) {
      return res.status(403);
    }

    if (identity.toString() !== id) {
      return res.status(403).json({ message: "forbidden" });
    }

    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: err.message });
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["ts-auth"];
    if (!sessionToken) {
      return res.status(403).send({ message: "unauthorized" });
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(403);
    }
    merge(req, { identity: existingUser });

    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
