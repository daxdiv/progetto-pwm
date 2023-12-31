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
      artists: [
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
  genres: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}).index({ userId: 1, title: 1 }, { unique: true });

export default mongoose.model("Playlist", playlistSchema);
