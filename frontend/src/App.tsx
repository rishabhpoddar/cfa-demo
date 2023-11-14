import React from "react";
import "./App.css";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { SessionAuth } from 'supertokens-auth-react/recipe/session';
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import { PreBuiltUIList, SuperTokensConfig } from "./config";
import { ThirdpartyPasswordlessComponentsOverrideProvider } from "supertokens-auth-react/recipe/thirdpartypasswordless";
import Session from "supertokens-auth-react/recipe/session";
import ThirdPartyPasswordless from "supertokens-auth-react/recipe/thirdpartypasswordless";


SuperTokens.init(SuperTokensConfig);

function App() {
    return (
        <SuperTokensWrapper>
            <ThirdpartyPasswordlessComponentsOverrideProvider
                components={{
                    ThirdPartySignInAndUpProvidersForm_Override: ({ DefaultComponent, ...props }) => {
                        return null;
                    }
                }}>
                <div className="App app-container">
                    <Router>
                        <div className="fill">
                            <Routes>
                                {/* This shows the login UI on "/auth" route */}
                                {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"), PreBuiltUIList)}

                                <Route
                                    path="/"
                                    element={
                                        /* This protects the "/" route so that it shows
                                    <Home /> only if the user is logged in.
                                    Else it redirects the user to "/auth" */
                                        <SessionGuardWithAutoRedirectionToGoogle>
                                            <Home />
                                        </SessionGuardWithAutoRedirectionToGoogle>
                                    }
                                />
                            </Routes>
                        </div>
                    </Router>
                </div>
            </ThirdpartyPasswordlessComponentsOverrideProvider>
        </SuperTokensWrapper>
    );
}

export default App;


function SessionGuardWithAutoRedirectionToGoogle(props: React.PropsWithChildren<{}>) {
    let [errorHappened, setErrorHappened] = React.useState(false);
    let sessionContext = Session.useSessionContext()

    React.useEffect(() => {
        setErrorHappened(false)
        if (sessionContext.loading || sessionContext.doesSessionExist) {
            return
        }
        let componentUnmounted = false;
        ThirdPartyPasswordless.getThirdPartyAuthorisationURLWithQueryParamsAndSetState({
            thirdPartyId: "google",
            frontendRedirectURI: "http://localhost:3000/auth/callback/google"
        }).then(authUrl => {
            if (componentUnmounted) {
                return
            }
            window.location.assign(authUrl);
        }).catch(err => {
            if (componentUnmounted) {
                return
            }
            console.log(err)
            setErrorHappened(true)
        })

        return () => {
            componentUnmounted = true;
        }
    }, [sessionContext])

    if (sessionContext.loading) {
        return null;
    }

    if (sessionContext.doesSessionExist) {
        return (<SessionAuth>{props.children}</SessionAuth>);
    }

    if (errorHappened) {
        return (<div style={{
            height: "100%",
            width: "100%",
        }}>Something went wrong. Please reload the page...</div>);
    }

    // show a spinner
    return (<div style={{
        height: "100%",
        width: "100%",
    }}>Redirecting to Google to login...</div>);
}