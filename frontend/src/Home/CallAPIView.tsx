import axios from "axios";

export default function CallAPIView() {
    async function callAPIClicked() {
        try {
            let response = await axios.get("http://localhost:8000/");
            window.alert("Session Information:\n" + JSON.stringify(response.data, null, 2));
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div onClick={callAPIClicked} className="sessionButton">
            Call API
        </div>
    );
}
