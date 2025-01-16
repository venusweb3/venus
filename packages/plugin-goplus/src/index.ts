import { Plugin } from "@venusos/core";
import GoplusSecurityService from "./services/GoplusSecurityService";

export * from "./services/GoplusSecurityService";


export const goplusPlugin: Plugin = {
  name: "goplus",
  description:
    "goplus Plugin for venus - Enables on-chain security checks",
  actions: [],
  evaluators: [],
  providers: [],
  services: [new GoplusSecurityService()],
};

export default goplusPlugin;