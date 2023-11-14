import ThirdPartyEmailPassword, {
    Google,
    Github,
    Apple,
    Twitter,
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { ThirdPartyEmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/thirdpartyemailpassword/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";
import EmailVerification from "supertokens-auth-react/recipe/emailverification"
import { EmailVerificationPreBuiltUI } from "supertokens-auth-react/recipe/emailverification/prebuiltui";

export function getApiDomain() {
    return "https://hazk4n47se.execute-api.ap-south-1.amazonaws.com"
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
        ThirdPartyEmailPassword.init({
            signInAndUpFeature: {
                providers: [Github.init(), Google.init(), Apple.init(), Twitter.init()],
            },
        }),
        EmailVerification.init({
            mode: "REQUIRED"
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
    docsLink: "https://supertokens.com/docs/thirdpartyemailpassword/introduction",
};

export const PreBuiltUIList = [ThirdPartyEmailPasswordPreBuiltUI, EmailVerificationPreBuiltUI];

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    return props.children;
};
