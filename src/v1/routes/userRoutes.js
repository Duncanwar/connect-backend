import { Router } from "express";
import tokenAuthentication from "../middleware/tokenAuthentication.js";
import Post from "../models/post.js";
import User from "../models/User.js";

const router = Router();
// import admin from "../middleware/admin.middleware";
// import userController from "../controllers/userController";

// const { checkPassword, checkEmail } = admin;
// const { deleteUser } = userController;

router.get("/user/:id", tokenAuthentication, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, post) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, post });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/follow", tokenAuthentication, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "Follow not found" });
      }
      findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", tokenAuthentication, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "Follow not found" });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/updatepic", tokenAuthentication, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { photo: req.body.pic },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic cannot be posted" });
      } else {
        res.json(result);
        console.log(result);
      }
    }
  );
});

router.post("/search-users", (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  User.find({ name: { $regex: userPattern } })
    .select("_id email name")
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get(
  "/allUsers",
  //  requireLogin,
  (req, res) => {
    User.find()
      .then((user) => {
        console.log(user);
        res.json({ user });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

//router.delete('/user', [checkPassword,checkEmail,requireLogin], deleteUser)

export default router;
