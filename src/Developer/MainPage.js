import React, {Component} from 'react';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SideNav, {NavIcon, NavItem, NavText} from '@trendmicro/react-sidenav';
import {BrowserRouter as Router, Route} from "react-router-dom";
import BoardDeveloper from "./BoardDeveloper";
import {getUser, removeUserSession} from "../components/Common";
import PasswordUpdate from "../Developer/PasswordUpdate";
import Row from "react-bootstrap/Row";
import {Col} from "react-bootstrap";
import GanttBoard from "./GanttBoard";
import DevBoard from "./devBoard";
import Statistics from "./Statistics";

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: true
        };
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    onSetSidebarOpen(open) {
        this.setState({sidebarOpen: open});
    }

    render() {
        return (
            <div>
                <Router>
                    <Route render={({location, history}) => (
                        <React.Fragment>
                            <SideNav
                                style={{backgroundColor: "#0747A6"}}
                                onSelect={(selected) => {
                                    const to = '/' + selected;
                                    if (location.pathname !== to) {
                                        history.push(to);
                                    }
                                }}
                            >
                                <SideNav.Toggle expanded={false} disabled={false}/>
                                <SideNav.Nav defaultSelected="project" expanded={false} disabled={false}>
                                    <NavItem eventKey="developer" >
                                        <NavIcon>
                                            <i className="fas fa-project-diagram" style={{fontSize: '1.75em'}}></i>
                                        </NavIcon>
                                        <NavText>
                                            Project
                                        </NavText>
                                    </NavItem>
                                    <NavItem eventKey="userstory">
                                        <NavIcon>
                                            <i className="fas fa-table" style={{fontSize: '1.75em'}}></i>
                                        </NavIcon>
                                        <NavText>
                                            Userstory
                                        </NavText>
                                    </NavItem>
                                    <NavItem eventKey="Progress">
                                        <NavIcon>
                                            <i className="fas fa-tasks" style={{fontSize: '1.75em'}}></i>
                                        </NavIcon>
                                        <NavText>
                                            Progress
                                        </NavText>
                                    </NavItem>


                                    <NavItem eventKey="Statistic">
                                        <NavIcon>
                                            <i className="fas fa-chart-pie" style={{fontSize: '1.75em'}}></i>
                                        </NavIcon>
                                        <NavText>
                                            Statistic
                                        </NavText>
                                    </NavItem>

                                    <NavItem eventKey="user">
                                        <NavIcon>
                                            <i className="far fa-user" style={{fontSize: '1.75em'}}/>
                                        </NavIcon>
                                        <NavText>
                                            {getUser().username}
                                        </NavText>
                                        <NavItem eventKey="changePassword">
                                            <NavText>
                                                Changing password
                                            </NavText>
                                        </NavItem>
                                        <NavItem eventKey="logout" onClick={removeUserSession} >
                                            <NavText >
                                                Logout
                                            </NavText>
                                        </NavItem>
                                    </NavItem>
                                </SideNav.Nav>
                            </SideNav>
                            <main>
                                <Route path="/developer"  exact component={props =><div className="content"><SideNav.Toggle/><Row md="12"><Col><BoardDeveloper/></Col></Row></div>}/>
                                <Route path="/backlog" exact component={props => <div className="content"><SideNav.Toggle/><Row md="12"><Col><BoardDeveloper/></Col></Row></div>}/>
                                <Route path="/userstory" exact component={props => <div className="content"><SideNav.Toggle/><Row md="12"><Col><DevBoard/></Col></Row></div>}/>
                                <Route path="/Progress" exact component={props => <div className="content"><SideNav.Toggle/><Row md="12"><Col><GanttBoard/></Col></Row></div>}/>
                               <Route path="/Statistic" exact component={props => <div className="content"><SideNav.Toggle/><Row md="12"><Col><Statistics/></Col></Row></div>}/>



                                <Route path="/changePassword" exact component={props => <PasswordUpdate/>}/>

                            </main>
                        </React.Fragment>
                    )}
                    />
                </Router>

            </div>

        );
    }
}

export default MainPage;
