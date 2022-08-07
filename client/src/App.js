import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import { Signup } from "./pages/Auth/Signup";
import { Dashboard } from "./pages/Dashboard/Dashboard/Dashboard";
import { EditInvoice } from "./pages/Dashboard/EditInvoice/EditInvoice";
import { Invoice } from "./pages/Dashboard/Invoice/Invoice";
import {
  StylesProvider,
  createGenerateClassName
} from '@material-ui/core/styles';

const generateClassName = createGenerateClassName({
  seed: 'app1'
});

function App() {
  return (
    <div className="App" style={{overflowX: "hidden"}}>
      <BrowserRouter>
        <StylesProvider generateClassName={generateClassName}>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/invoice/update/:id" component={EditInvoice} />
            <Route exact path="/invoice/:id" component={Invoice} />
          </Switch>
        </StylesProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
