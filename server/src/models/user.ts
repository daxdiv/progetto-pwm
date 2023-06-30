import bcrpyt from "bcrypt";
import mongoose from "mongoose";

type User = {
  username: string;
  email: string;
  password: string;
  preferredGenres: string[];
  description: string;
  savedPlaylists: mongoose.Schema.Types.ObjectId[];
  comparePassword: (password: string) => Promise<boolean>;
};

const userSchema = new mongoose.Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferredGenres: {
    type: [String],
    default: [],
  },
  description: String,
  savedPlaylists: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Playlist",
    default: [],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrpyt.genSalt(10);
    const hashedPassword = await bcrpyt.hash(this.password, salt);

    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrpyt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
