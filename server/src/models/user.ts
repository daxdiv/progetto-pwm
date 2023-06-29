import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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

export default mongoose.model("User", userSchema);
