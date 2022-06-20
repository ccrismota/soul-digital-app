const functions = require("firebase-functions");

const admin = require("firebase-admin");

admin.initializeApp();

// import {api} from "./api"
const { api } = require("./api");

//setUp das functions (cloud)
exports.api = functions.https.onRequest(api);

