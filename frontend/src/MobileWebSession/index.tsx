import React from 'react';

export default function MobileWebSession() {

    let [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        let componentHasUnmounted = false;
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token === null) {
            setErrorMessage("No token found in URL");
            return;
        }
        fetch("https://7l37va4thk.execute-api.ap-south-1.amazonaws.com/dev/auth/session/frommobile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            }
        }).then(async (res) => {
            if (componentHasUnmounted === true) {
                return
            }
            if (res.status !== 200) {
                setErrorMessage("Failed to create a session");
                return;
            }

            // login successful
            window.location.assign("http://localhost:3000");
        }).catch(err => {
            if (componentHasUnmounted === true) {
                return
            }
            setErrorMessage(err.toString());
        })
        return () => {
            componentHasUnmounted = true;
        }
    }, [])

    if (errorMessage !== "") {
        return (<div style={{
            height: "100%",
            width: "100%",
        }}>{errorMessage}</div>);
    }

    return (<div style={{
        height: "100%",
        width: "100%",
    }}>Loading...</div>);
}
