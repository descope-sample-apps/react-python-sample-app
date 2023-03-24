import "./App.css";
import { useDescope, useSession, useUser } from "@descope/react-sdk";
import { SignUpOrInFlow, getSessionToken } from "@descope/react-sdk";
import { useState } from "react";

function App() {
  const { isAuthenticated, isSessionLoading } = useSession();
  const [protected_data, setProtectData] = useState("");
  const [protected_data_fetched, setProtectDataState] = useState(false);
  // user: user object with all the user details such as email, name etc.
  // isUserLoading: boolean - Use this for showing loading screens while objects are being loaded
  const { user, isUserLoading } = useUser();

  // logout - call logout to logout the user (deletes all session state)
  const { logout } = useDescope();
  const sessionToken = getSessionToken();
  const fetch_private = () => {
    if (isAuthenticated && !isSessionLoading && !isUserLoading) {
      fetch("http://localhost:8080/protected", {
        method: "GET",
        headers: {
          Authorization: "Bearer: " + sessionToken,
        },
      }).then((result) => {
        result
          .json()
          .then((obj) => {
            setProtectData(obj.message);
            setProtectDataState(true);
          })
          .catch((err) => {});
      });
    }
  };

  return (
    <div className="App">
      {(isSessionLoading || isUserLoading) && <p>Loading...</p>}

      {isAuthenticated && !isSessionLoading && !isUserLoading && (
        <>
          <p>Hello {user.name}</p>
          <div>My Private Component</div>
          <br/>
          <br/>
          {protected_data_fetched ? protected_data : <button onClick={fetch_private}>Fetch private information</button>}
          <br/><br/>
          <button onClick={logout}>Logout</button>
        </>
      )}

      {!isAuthenticated && (
        <>
          <p>You are not logged in</p>{" "}
          <SignUpOrInFlow
            onSuccess={(e) => console.log(e.detail.user)}
            onError={(e) => console.log("Could not log in!")}
            theme="light" // theme can be "light" or "dark". If empty, Descope will use the light theme.
            //    debug=boolean // options are true or false. Default is false. Shows a debug widget when true
            //    tenant=<tenantId> //You can configure which tenant the signin/signup flow will sign the user into by providing the tenant ID
          />
        </>
      )}
    </div>
  );
}

export default App;
