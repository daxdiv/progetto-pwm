import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  tracks: [
    {
      name: {
        type: String,
        required: true,
      },
      artist: [
        {
          type: String,
          required: true,
        },
      ],
      releaseDate: {
        type: Date,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
    },
  ],
  isPublic: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Playlist", playlistSchema);
