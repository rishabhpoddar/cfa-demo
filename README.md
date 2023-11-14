# Demo app fro CFA

This app uses:
- AWS lambda with Node for our backend layer
- A PHP backend for the application API layer
- A react frontend.

We have added the thirdparty + passwordless recipe to have sign in with Google and passwordless. Google can be switched to anything else (like Okta) fairly easily. See [this link](https://supertokens.com/docs/thirdpartypasswordless/common-customizations/sign-in-and-up/provider-config#okta).

On top of the default behaviour, we have added the following customizations:
- The `/auth` screen shows only passwordless login.
- If the user visits the home page, and they are not logged in, they are automatically redirected to login with Google.
- If the client is a web browser, then session refreshing is disabled.
- We also have an additional route on the frontend `/mobilewebsession`, which can be used to create a new session from an existing access token. This can be used to open up web views in a mobile app in such a way that the user does not have to re-login into the web view.