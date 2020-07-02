import React from "react";
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row} from "reactstrap";
import axios from "axios";
import {getUser} from "../components/Common";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {ProgressBar} from "react-bootstrap";

let options = [];

class PasswordUpdate extends React.Component {
    state = {
        Users: [],
        roles: [],
        passwordError: '',
        newUserModal: false,

        newUserData: {
            password: '',

        },
        selectedOption: null,
        progress:'',
        progressStrength:'',
        progressVariant:''

    }
    createNotification = (type, msg) => {
        switch (type) {
            case 'info':
                NotificationManager.info('Info message');
                break;
            case 'success':
                NotificationManager.success(msg, 'Title here');
                break;
            case 'warning':
                NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
                break;
            case 'error':
                console.log("error")
                NotificationManager.error(msg, 'Error!', 5000, () => {
                });
                break;

        }
        ;
    };

    validatePassword(password) {
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        return re.test(password);
    }

    validatePasswordScore(password) {
        var score = 0;
        var OneLowerCase = /[a-z]/;     // should contain at least one lower case
        var UpperCase = /[A-Z]/;   // should contain at least one upper case
        var length = /[^0-9a-zA-Z]/; // should contain at least 8 from the mentioned characters

        password.length>8?score+=25:score+=0;
        OneLowerCase.test(password) ? score+=25 : score += 0
        UpperCase.test(password) ? score+=25 : score += 0
        length.test(password) ? score+=25 : score += 0
        return score;
    }
    createPasswordLabel = (result) => {
        switch (result) {
            case 25:
                return 'Weak';
            case 25:
                return 'Weak';
            case 50:
                return 'Fair';
            case 75:
                return 'Good';
            case 100:
                return 'Strong';
            default:
                return 'Weak';
        }
    }
    createPasswordVariant = (result) => {
        switch (result) {
            case 25:
                return 'danger';
            case 25:
                return 'danger';
            case 50:
                return 'warning';
            case 75:
                return 'info';
            case 100:
                return 'success';
            default:
                return 'danger';
        }
    }

    validate = () => {
        let passwordError = "";

        if (this.state.newUserData.password === "") {
            passwordError = "empty"
        }
        if (!this.validatePassword(this.state.newUserData.password)) {
            passwordError = "invalid password,should contain at least one digit ,at least one lower case , at least one upper case  ,at least 8 from the mentioned characters";
        }
        if (passwordError) {
            this.state.passwordError = passwordError;
            this.createNotification('error', passwordError);

            return false
        }
        return true
    }

    addPriority() {
        const isValid = this.validate();
        if (isValid) {
            axios.patch('http://localhost:8000/secured/users/UserUpdate/' + parseInt(getUser().id), this.state.newUserData).then(
                (response) => {
                    let {books} = this.state;
                    //books.push(response.data);
                    this.setState({
                        books, newUserModal: false, newUserData: {
                            password: '',
                        }
                    });

                }
            ).then(this.createNotification('success', 'password changed')
            );
        }


    }

    render() {
        return (
            <>
                <div className="content" id="outer-container">
                    <Row>
                        <Col md="2">
                        </Col>
                        <Col md="8">
                            <Card className="card-user">
                                <CardHeader>
                                    <CardTitle tag="h5">Change Password</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <Row>
                                            <Col className="update ml-auto mr-auto" md="6">
                                                <FormGroup>
                                                    <label>new password</label>
                                                    <Input
                                                        value={this.state.newUserData.password}
                                                        onChange={(e) => {
                                                            let {newUserData} = this.state;
                                                            newUserData.password = e.target.value;
                                                            this.state.progress=this.validatePasswordScore(e.target.value);
                                                            this.state.progressStrength=this.createPasswordLabel(this.state.progress);
                                                            this.state.progressVariant=this.createPasswordVariant(this.state.progress)
                                                            this.setState({newUserData});
                                                        }}
                                                        placeholder="password"
                                                        type="password"
                                                    />
                                                    <ProgressBar
                                                        now={this.state.progress}
                                                        variant={this.state.progressVariant}
                                                    />
                                                    <strong>{this.state.progressStrength}</strong>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <div className="update ml-auto mr-auto">
                                                <Button className="btn-round" color="primary"
                                                        onClick={this.addPriority.bind(this)}>
                                                    Change Password
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

export default PasswordUpdate;
