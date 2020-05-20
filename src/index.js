import React from "react";
import ReactDOM from "react-dom";
import {createBrowserHistory} from "history";
import {Redirect, Route, Router, Switch} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.1.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "layouts/Admin.jsx";
import Login from "./components/login";
import {getToken, getUser} from "./components/Common";

import MainPage from "./Developer/MainPage";

const hist = createBrowserHistory();
const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        fakeAuth.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        fakeAuth.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};

function PrivateRoute({children, ...rest}) {
    return (
        <Route
            {...rest}
            render={({location}) =>getUser()!= null?(
                getToken() && getUser().roles.includes("ROLE_TEAM_LEADER")  ? (
                    <Route path="/admin" render={props => <AdminLayout {...props} />}/>
                ) : getToken() && getUser().roles.includes("ROLE_DEVELOPER") || getUser().roles.includes("ROLE_CLIENT") || getUser().roles.includes("ROLE_TESTER") ? (
                    <Redirect
                        to={{
                            pathname: "/developer",
                            state: {from: location}
                        }}
                        component={MainPage}
                    />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: location}
                        }}
                        component={Login}
                    />
                )):(
                <Redirect
                    to={{
                        pathname: "/login",
                        state: {from: location}
                    }}
                    component={Login}
                />
            )

            }
        />
    );
}

ReactDOM.render(
    <Router history={hist}>
        <Switch>
            <Route path='/login' component={Login}/>
            <Route exact path="/developer" component={MainPage}  />
            <PrivateRoute path="/admin" render={props => <AdminLayout {...props} />}/>
            <Redirect to="/admin/dashboard"/>

        </Switch>
    </Router>,
    document.getElementById("root")
);
