import { Plugin } from "@venusos/core";
import sendGif from "./actions/sendGif";

export const giphyPlugin: Plugin = {
    name: "giphy",
    description: "Giphy Plugin for venus to send GIFs in responses",
    actions: [
        sendGif
    ],
    evaluators: [],
    providers: [],
};

export default giphyPlugin;
