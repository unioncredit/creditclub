import { Buffer } from "buffer";

window.global = window.global ?? window;
global.Buffer = global.Buffer ?? Buffer;
window.process = window.process ?? { env: {} }; // Minimal process polyfill

export {};
