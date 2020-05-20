import React from "react";
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row} from "reactstrap";
import axios from "axios";
import * as jwt_decode from 'jwt-decode';
import {getToken} from "./Common";
import {NotificationContainer, NotificationManager} from "react-notifications";
import 'react-notifications/lib/notifications.css';
class Login extends React.Component {

    state = {
        Users: [],
        newUserModal: false,

        newUserData: {
            username: '',
            password: '',
            email: ''
        },
        redirect: false,
        decoded: '',
        decodedHeader: ''
    }


    getUser = () => {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        else return null;
    }

    getToken = () => {
        return localStorage.getItem('token') || null;
    }

    removeUserSession = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

// set the token and user from the session storage
    setUserSession = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    }
    setTokenSession = (token) => {
        localStorage.setItem('token', token);
    }

    createNotification = (type,msg) => {
        switch (type) {
            case 'info':
                NotificationManager.info('Info message');
                break;
            case 'success':
                NotificationManager.success('Success message', 'Title here');
                break;
            case 'warning':
                NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
                break;
            case 'error':
                console.log(msg)
                NotificationManager.error(msg.message, 'Error!', 5000, () => {
                });
                break;

        };
    };


    addPriority() {

            axios.post('http://localhost:8000/api/login_check', this.state.newUserData).then(
                (response) => {
                    this.state.decoded = jwt_decode(response.data.token);
                    this.state.decodedHeader = jwt_decode(response.data.token, {header: true});
                    this.setTokenSession(response.data.token);

                }).catch(error=>{
                    this.createNotification('error',error.response.data)
                }
            ).then( axios.get('http://localhost:8000/secured/users/userShow/' + this.state.decoded.username).then(
                (response) => {
                    let {users} = this.state;
                    //  users.push(response.data);
                    this.setState({
                        users, newUserModal: false, newUserData: {
                            username: '',
                            password: '',
                            email: ''
                        }
                    });
                    this.setUserSession(response.data);

                    console.log(response.data);
                    this.props.history.push('/admin/dashboard');
                    console.log(getToken);


                }
            ))



    }


    render() {

        return (
            <>
                <div className="content">
                    <Row>
                        <Col md="2">
                        </Col>
                        <Col md="8">
                            <Card className="card-user">
                                <CardHeader>
                                    <CardTitle tag="h5">Login Profile</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <Row>
                                            <Col className="pr-1" md="5">
                                                <FormGroup>
                                                    <label>Username</label>
                                                    <Input
                                                        value={this.state.newUserData.username}
                                                        onChange={(e) => {
                                                            let {newUserData} = this.state;
                                                            newUserData.username = e.target.value;
                                                            this.setState({newUserData});

                                                        }}
                                                        placeholder="Username"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col className="pl-1" md="4">
                                                <FormGroup>
                                                    <label htmlFor="password">
                                                        Password
                                                    </label>
                                                    <Input placeholder="Password" type="password"
                                                           value={this.state.newUserData.password}
                                                           onChange={(e) => {
                                                               let {newUserData} = this.state;
                                                               newUserData.password = e.target.value;
                                                               this.setState({newUserData});

                                                           }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>


                                        <Row>
                                            <div className="update ml-auto mr-auto">
                                                <Button
                                                    className="btn-round"
                                                    color="primary"
                                                    onClick={this.addPriority.bind(this)}
                                                >
                                                    Login
                                                </Button>
                                            </div>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="2">
                        </Col>
                    </Row>
                </div>
                <NotificationContainer/>

            </>
        );
    }
}

export default Login;
