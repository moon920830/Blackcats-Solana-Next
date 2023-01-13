/* eslint-disable indent */
// import/no-unresolved
import nextConnect from "next-connect";
import formidable from "formidable";
import jwt from "jsonwebtoken";
import { saveFile } from "../../../utils/saveFile";
import { User } from "../../../../models/user";
import middleware from "../../../../middlewares";
import auth from "../../../../middlewares/auth";

/**
 * @url /api/user/imgupload
 */
// eslint-disable-next-line consistent-return

const app = nextConnect();
app.use(middleware);
app.use(auth);

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

// eslint-disable-next-line consistent-return
app.post(async (req, res) => {
  console.log("user: ", req.user);
  try {
    const form = new formidable.IncomingForm();
    const u_id = req.user ? req.user._id : null;
    if (!u_id) {
      res.status(501).json({
        message: "Invalid user"
      })
    }
    // eslint-disable-next-line consistent-return
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: "form parse error",
        });
      }
      // await saveFile(files.file);
      if (!files) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }
      const { type } = fields;
      const { avatar } = fields;
      const { cover } = fields;
      let imgUrl = "";
      if (avatar) {
        imgUrl = avatar;
      }
      if (cover) {
        imgUrl = cover;
      }
      console.log("imgUrl: ", imgUrl);
      const filename = await saveFile(files.file, type, imgUrl);
      const user = await User.findOne({ _id: u_id });
      if (!user) {
        return res.status(400).json({
          message: "user not found",
        });
      }
      const setQuery =
        // eslint-disable-next-line no-nested-ternary
        type === "avatar"
          ? { avatar: filename }
          : type === "cover"
            ? { cover: filename }
            : null;

      User.findByIdAndUpdate(
        u_id,
        setQuery,
        { new: true },
        // eslint-disable-next-line consistent-return
        (error, result) => {
          if (error) {
            return res.status(500).json({
              message: "Database Error!",
            });
          }
          const payload = {
            user: {
              _id: result._id,
              email: result.email,
              firstname: result.firstname,
              lastname: result.lastname,
              type: result.type,
              avatar: result.avatar,
              cover: result.cover,
              bio: result.bio,
            },
          };
          jwt.sign(
            payload,
            "jwtSecret",
            { expiresIn: 36000 },
            (err1, jwtToken) => {
              if (err1) throw err1;
              return res.status(200).json({
                token: jwtToken,
              });
            }
          );
        }
      );
    });
  } catch (err) {
    return res.status(422).json({ message: "Something went wrong" });
  }
});

export default app;
