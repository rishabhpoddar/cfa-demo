let ThirdPartyPasswordless = require('supertokens-node/recipe/thirdpartypasswordless');
let Session = require('supertokens-node/recipe/session')

function getBackendConfig() {
    return {
        framework: "awsLambda",
        supertokens: {
            connectionURI: "TODO",
            apiKey: "TODO",
        },
        appInfo: {
            appName: "cfa-demo",
            apiDomain: "https://7l37va4thk.execute-api.ap-south-1.amazonaws.com",
            websiteDomain: "http://localhost:3000",
            apiBasePath: "/auth",
            websiteBasePath: "/auth",
            apiGatewayPath: "/dev"
        },
        recipeList: [
            ThirdPartyPasswordless.init({
                flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
                contactMethod: "EMAIL_OR_PHONE",
                providers: [{
                    config: {
                        thirdPartyId: "google",
                        clients: [{
                            clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                            clientSecret: "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"
                        }]
                    }
                }],
            }),
            Session.init(),
        ],
        isInServerlessEnv: true,
    }
}

module.exports.getBackendConfig = getBackendConfig;