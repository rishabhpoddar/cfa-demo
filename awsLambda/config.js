let ThirdPartyEmailPassword = require('supertokens-node/recipe/thirdpartyemailpassword');
let EmailVerification = require('supertokens-node/recipe/emailverification');
let Session = require('supertokens-node/recipe/session')

function getBackendConfig() {
    return {
        framework: "awsLambda",
        supertokens: {
            connectionURI: "TODO",
            apiKey: "TODO",
        },
        appInfo: {
            // learn more about this on https://supertokens.com/docs/emailpassword/appinfo
            appName: "qiagen-demo",
            apiDomain: "https://hazk4n47se.execute-api.ap-south-1.amazonaws.com",
            websiteDomain: "http://localhost:3000",
            apiBasePath: "/auth",
            websiteBasePath: "/auth",
            apiGatewayPath: "/dev"
        },
        recipeList: [
            ThirdPartyEmailPassword.init({
                // We have provided you with development keys which you can use for testing.
                // IMPORTANT: Please replace them with your own OAuth keys for production use.
                providers: [{
                    config: {
                        thirdPartyId: "google",
                        clients: [{
                            clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                            clientSecret: "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"
                        }]
                    }
                }],
                override: {
                    functions: (oI) => {
                        return {
                            ...oI,
                            emailPasswordSignIn: async function (input) {
                                if (isEmailBanned(input.email)) {
                                    throw new Error("Banned email")
                                }
                                return oI.emailPasswordSignIn(input);
                            }
                        }
                    },
                    apis: (oI) => {
                        return {
                            ...oI,
                            emailPasswordSignInPOST: async (input) => {
                                let IP = input.options.req.original['requestContext']['identity']['sourceIp']
                                if (IP !== "49.36.115.7") {
                                    return {
                                        status: "GENERAL_ERROR",
                                        message: "You are not allowed to login. Please contact support"
                                    }
                                }
                                try {
                                    return await oI.emailPasswordSignInPOST(input);
                                } catch (err) {
                                    if (err.message === "Banned email") {
                                        return {
                                            status: "GENERAL_ERROR",
                                            message: "You are not allowed to login. Please contact support"
                                        }
                                    }
                                    throw err;
                                }
                            }
                        }
                    }
                }
            }),
            EmailVerification.init({
                mode: "REQUIRED",
            }),
            Session.init(),
        ],
        isInServerlessEnv: true,
    }
}

function isEmailBanned(email) {
    return email === "rishabh+banned@supertokens.com"
}

module.exports.getBackendConfig = getBackendConfig;