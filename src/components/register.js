import React from "react";
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row} from "reactstrap";
import axios from "axios";
import Select from "react-select";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

let options = [];

class Register extends React.Component {
    state = {
        isGoing: true,
        checkPrivilege: true,
        checkedPrivilege: false,
        Users: [],
        roles: [],
        newUserModal: false,
        emailerror: '',
        usernameerror: '',
        roleerror: '',
        newUserData: {
            username: '',
            email: '',
            roles: '',
            privilege: ''
        },
        selectedOption: null

    }
    createNotification = (type, msg) => {
        switch (type) {
            case 'info':
                NotificationManager.info('Info message');
                break;
            case 'success':
                NotificationManager.success(msg, 'Success');
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

    componentWillMount() {

        axios.get(`http://localhost:8000/secured/users/AllRoles`)
            .then(response => {
                console.log(response.data);
                if (options.length === 0) {
                    for (var item in response.data) {
                        console.log(response.data[item])
                        options.push({label: `${item}`, value: `${item}`})

                    }
                }

                this.setState({
                    roles: response.data
                })
            })
        ;

    }

    handleChange = selectedOption => {
        this.setState(
            {selectedOption},
            () => console.log(`Option selected:`, this.state.selectedOption)
        );

        this.state.newUserData.roles = selectedOption;
        console.log(this.state.newUserData.roles);
        if (this.state.newUserData.roles.value === "ROLE_CLIENT") {
            this.state.checkPrivilege = false;
            this.state.checkedPrivilege = null;

        } else {
            this.state.checkPrivilege = true;
            this.state.checkedPrivilege = false;

        }


    };

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    validateUsername(username) {
        var nameRegex = /^[a-zA-Z\-]+$/;
        return nameRegex.test(username);
    }

    validate = () => {
        let emailerror = "";
        let usernameerror = "";
        let roleerror = "";
        if (!this.validateEmail(this.state.newUserData.email)) {
            emailerror = 'invalid email';
        }
        if (!this.validateUsername(this.state.newUserData.username)) {
            usernameerror = 'invalid username';
        }
        if (this.state.newUserData.roles === "") {
            roleerror = "empty role"
        }
        if (emailerror || usernameerror || roleerror) {
            this.state.emailerror = emailerror;
            this.state.usernameerror = usernameerror;
            this.createNotification('error', emailerror + " " + usernameerror + " " + roleerror);

            return false
        }
        return true
    }

    addPriority() {
        const isValid = this.validate();
        console.log(this.state.newUserData);
        if (isValid) {
            axios.post('http://localhost:8000/register', this.state.newUserData).then(
                (response) => {
                    let {books} = this.state;
                    //books.push(response.data);
                    this.setState({
                        books, newUserModal: false, newUserData: {
                            username: '',
                            email: '',
                            roles: '',
                            privilege: ''
                        }
                    });
                    this.createNotification('success', 'New user added')
                }
            ).catch(error => {
                this.createNotification('error', 'Email already exists');
            });
        }


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
                                    <CardTitle tag="h5">Add New User</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <Row>
                                            <Col className="pr-1" md="3">
                                                <FormGroup>
                                                    <label>Username</label>
                                                    <Input
                                                        required
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
                                            <Col className="px-1" md="3">
                                                <FormGroup>
                                                    <label htmlFor="exampleInputEmail1">
                                                        Email address
                                                    </label>
                                                    <Input placeholder="Email" type="email"
                                                           value={this.state.newUserData.email}
                                                           onChange={(e) => {
                                                               let {newUserData} = this.state;
                                                               newUserData.email = e.target.value;
                                                               this.setState({newUserData});

                                                           }}
                                                    />

                                                </FormGroup>
                                            </Col>
                                            <Col className="px-1" md="3">
                                                <FormGroup>
                                                    <label htmlFor="Team">Available Roles</label>

                                                    <Select
                                                        value={this.state.selectedOption}
                                                        onChange={this.handleChange}
                                                        options={options}
                                                        isSearchable
                                                    />


                                                </FormGroup>
                                            </Col>
                                            <Col className="px-1" md="3">
                                                <FormGroup>
                                                    <Row>
                                                        <Col><label htmlFor="exampleInputEmail1">
                                                            privilege
                                                        </label></Col>
                                                        <Col> <Input type="checkbox"
                                                                     value={this.state.newUserData.privilege}
                                                                     checked={this.state.checkedPrivilege}
                                                                     disabled={this.state.checkPrivilege}
                                                                     onChange={(e) => {
                                                                         const target = e.target;
                                                                         const value = target.type === 'checkbox' ? target.checked : target.value;
                                                                         const name = target.name;
                                                                         this.state.newUserData.privilege = value;

                                                                     }}
                                                        /></Col>
                                                    </Row>


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
                                                    Add New Account
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

export default Register;
