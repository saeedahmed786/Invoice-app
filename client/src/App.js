import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import { Signup } from "./pages/Auth/Signup";
import { Dashboard } from "./pages/Dashboard/Dashboard/Dashboard";
import { EditInvoice } from "./pages/Dashboard/EditInvoice/EditInvoice";
import { Invoice } from "./pages/Dashboard/Invoice/Invoice";
import UserRoute from "./UserRoute";

function App() {
  return (
    <div className="App" style={{ overflowX: "hidden" }}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <UserRoute exact path="/" component={Dashboard} />
          <UserRoute exact path="/invoice/update/:id" component={EditInvoice} />
          <UserRoute exact path="/invoice/:id" component={Invoice} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
