import { Plugin } from "@venusos/core";
import { sgxAttestationProvider } from "../providers/sgxAttestationProvider";

export const sgxPlugin: Plugin = {
    name: "sgx",
    description: "Intel SGX plugin for venus, providing SGX attestation",
    actions: [],
    providers: [sgxAttestationProvider],
    evaluators: [],
    services: [],
    clients: [],
};
