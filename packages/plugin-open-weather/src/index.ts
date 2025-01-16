import { Plugin } from "@venusos/core";
import { getCurrentWeatherAction } from "./actions/getCurrentWeather";

export * as actions from "./actions";

export const openWeatherPlugin: Plugin = {
    name: "openweather",
    description: "OpenWeather plugin for venus",
    actions: [getCurrentWeatherAction],
    evaluators: [],
    providers: [],
};
export default openWeatherPlugin;
