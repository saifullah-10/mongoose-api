import express from "express";
import { getUsers, deleteUserById } from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("from controller");
  try {
    const { id } = req.params;
    const deleteUser = await deleteUserById(id);

    return res.status(200).json({ deleteUser });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};
