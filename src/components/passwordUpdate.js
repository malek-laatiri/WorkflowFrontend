import React from "react";
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Row} from "reactstrap";
import axios from "axios";
import {getUser} from "./Common";

let options = [];

class passwordUpdate extends React.Component {
    state = {
        Users: [],
        roles: [],
        newUserModal: false,

        newUserData: {
            password: '',

        },
        selectedOption: null

    }


    addPriority() {
        console.log(this.state.newUserData);
console.log(getUser().id);
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
        );

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
                                            <Col className="update ml-auto mr-auto" md="5">
                                                <FormGroup>
                                                    <label>new password</label>
                                                    <Input
                                                        value={this.state.newUserData.password}
                                                        onChange={(e) => {
                                                            let {newUserData} = this.state;
                                                            newUserData.password = e.target.value;
                                                            this.setState({newUserData});
                                                        }}
                                                        placeholder="password"
                                                        type="password"
                                                    />
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
            </>
        );
    }
}

export default passwordUpdate;
