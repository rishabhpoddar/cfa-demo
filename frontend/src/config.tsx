import ThirdPartyPasswordless, {
    Google,
    Github,
    Apple,
    Twitter,
} from "supertokens-auth-react/recipe/thirdpartypasswordless";
import { ThirdPartyPasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/thirdpartypasswordless/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";

export function getApiDomain() {
    return "https://7l37va4thk.execute-api.ap-south-1.amazonaws.com"
}

export function getWebsiteDomain() {
    const websitePort = process.env.REACT_APP_WEBSITE_PORT || 3000;
    const websiteUrl = process.env.REACT_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
        apiBasePath: "/dev/auth",
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        ThirdPartyPasswordless.init({
            signInUpFeature: {
                thirdPartyProviderAndEmailOrPhoneFormStyle: `[data-supertokens~=thirdPartyPasswordlessDivider] {
                    display: none;
                }`,
                providers: [Google.init()],
            },
            contactMethod: "EMAIL_OR_PHONE",
        }),
        Session.init({
            tokenTransferMethod: "header",
            override: {
                functions: (oI) => {
                    return {
                        ...oI,
                        shouldDoInterceptionBasedOnUrl: (toCheckUrl, apiDomain) => {
                            if (toCheckUrl.startsWith(apiDomain) || toCheckUrl.startsWith("http://localhost:8000")) {
                                return true;
                            }
                            return false;
                        }
                    }
                }
            }
        }),
    ],
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartypasswordless/introduction",
};

export const PreBuiltUIList = [ThirdPartyPasswordlessPreBuiltUI];
