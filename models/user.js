import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
import likesPlugin from "mongoose-likes";

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    default: ""
  },
  type: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: true,
    min: 8
  },
  avatar: {
    type: String,
    default: "default.jpg",
  },
  cover: {
    type: String,
    default: "default.jpg",
  },
  nftCount: {
    type: Number,
    default: 0
  }
});

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre("save", function (next) {
  const user = this;
  if (this.isModified("password") || this.isNew) {
    // eslint-disable-next-line consistent-return
    bcrypt.genSalt(10, (saltError, salt) => {
      if (saltError) {
        return next(saltError);
      }
      // eslint-disable-next-line consistent-return
      bcrypt.hash(user.password, salt, (hashError, hash) => {
        if (hashError) {
          return next(hashError);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.plugin(likesPlugin);

export const User = models.User || model("User", UserSchema);
