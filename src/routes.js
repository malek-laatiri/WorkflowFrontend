import Dashboard from "views/Dashboard.jsx";
import Property from "./components/Property";
import Project from "./components/Project";
import Activity from "./components/Activity";
import StatusDemo from "./components/Status";
import Register from "./components/register";
import Backlog from "./components/Backlog";
import UserStory from "./components/userstory";
import passwordUpdate from "./components/passwordUpdate";
import label from "./components/Label";

var routes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: "nc-icon nc-chart-bar-32",
        component: Dashboard,
        layout: "/admin"
    },


    {
        path: "/Project",
        name: "Project",
        icon: "nc-icon nc-bullet-list-67",
        component: Project,
        layout: "/admin"
    },
    {
        path: "/property",
        name: "Property",
        icon: "nc-icon nc-check-2",
        component: Property,
        layout: "/admin"
    }
    ,
    {
        path: "/Activity",
        name: "Activity",
        icon: "nc-icon nc-check-2",
        component: Activity,
        layout: "/admin"
    }
    ,
    {
        path: "/Status",
        name: "Status",
        icon: "nc-icon nc-check-2",
        component: StatusDemo,
        layout: "/admin"
    }

    ,
    {
        path: "/Backlog",
        name: "Backlog",
        icon: "nc-icon nc-check-2",
        component: Backlog,
        layout: "/admin"
    }
    ,
    {
        path: "/UserStory",
        name: "UserStory",
        icon: "nc-icon nc-check-2",
        component: UserStory,
        layout: "/admin"
    }
    ,
    {
        path: "/Register",
        name: "Add new Account",
        icon: "nc-icon nc-single-02",
        component: Register,
        layout: "/admin"
    }
    ,
    {
        path: "/passwordUpdate",
        name: "PasswordUpdate",
        icon: "nc-icon nc-refresh-69",
        component: passwordUpdate,
        layout: "/admin"
    }
    ,
    {
        path: "/label",
        name: "label",
        icon: "nc-icon nc-refresh-69",
        component: label,
        layout: "/admin"
    }
];
export default routes;
