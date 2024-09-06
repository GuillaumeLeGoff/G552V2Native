import express from "express";
import authRouter from "../components/auth/auth.route";
import buttonRouter from "../components/button/button.route";
import folderRouter from "../components/folder/folder.route";
import globalSettingRouter from "../components/global-settings/global-setting.route";
import macroRouter from "../components/macro/macro.route";
import mediaRouter from "../components/media/media.route";
import modeRouter from "../components/mode/mode.route";
import playlistRouter from "../components/playlist/playlist.route";
import playlistMediaRouter from "../components/playlist-media/playlist-media.route";
import scoringRouter from "../components/scoring/scoring.route";
import userRouter from "../components/user/user.route";
import path from "path";

const app = express();

app.use("/auth", authRouter);
app.use("/button", buttonRouter);
app.use("/folder", folderRouter);
app.use("/global-setting", globalSettingRouter);
app.use("/macro", macroRouter);
app.use("/media", mediaRouter);
app.use("/mode", modeRouter);
app.use("/playlist", playlistRouter);
app.use("/playlist-media", playlistMediaRouter);
app.use("/scoring", scoringRouter);
app.use("/user", userRouter);
app.use("/uploads", express.static(path.resolve(__dirname, "../../uploads")));

export default app;
