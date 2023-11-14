let supertokens = require("supertokens-node");
let { middleware } = require("supertokens-node/framework/awsLambda");
let { getBackendConfig } = require("./config");
let middy = require("@middy/core");
let cors = require("@middy/http-cors");
let Session = require("supertokens-node/recipe/session");

supertokens.init(getBackendConfig());

module.exports.handler = middy(middleware(async (event) => {
    if (event.path === "/auth/session/frommobile") {
        let session = await Session.getSession(event, event);
        let userId = session.getUserId();
        await Session.createNewSession(event, event, "public", supertokens.convertToRecipeUserId(userId), {
            preventRefresh: true
        });
        return {
            body: JSON.stringify({
                msg: "Logged in",
            }),
            statusCode: 200,
        };
    } else {
        return {
            body: JSON.stringify({
                msg: "Unknown route",
            }),
            statusCode: 404,
        };
    }
})).use(cors({
    origin: getBackendConfig().appInfo.websiteDomain,
    credentials: true,
    headers: ["Content-Type", ...supertokens.getAllCORSHeaders()].join(", "),
    methods: "OPTIONS,POST,GET,PUT,DELETE"
})).onError(request => {
    throw request.error;
});