import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import axios from 'axios';
import {FormGroup} from "react-bootstrap";

class Activity extends Component {
    state = {
        activities: [],
        newActivityModal: false,
        editActivityModal: false,

        newActivityData: {
            name: '',

        },
        editActivityData: {
            id: '',
            name: ''

        }
    }


    componentWillMount() {

        axios.get(`http://localhost:8000/secured/activity/activities`)
            .then(response => {
                this.setState({
                    activities: response.data
                })
            }).then(console.log(this.state))
        ;

    }

    toggleNewBookModal() {
        this.setState({
            newActivityModal: !this.state.newActivityModal
        })
        // this.state.newBookModal=true;

    }

    toggleEditBookModal() {
        this.setState({
            editActivityModal: !this.state.editActivityModal
        })
        // this.state.newBookModal=true;

    }

    addPriority() {
        console.log(this.state.newActivityData);
        axios.post('http://localhost:8000/secured/activity/activityCreate', this.state.newActivityData).then(
            (response) => {
                let {activities} = this.state;
                activities.push(response.data);
                this.setState({
                    activities, newActivityModal: false, newActivityData: {
                        name: ''
                    }
                });
                console.log(response.data);
                window.location.reload();

            }
        );

    }

    updateProperty() {
        axios.patch('http://localhost:8000/secured/activity/activityUpdate/' + this.state.editActivityData.id, this.state.editActivityData).then(
            (response) => {
                let {activities} = this.state;
                activities.push(response.data);
                console.log(activities);
                this.setState({
                    activities, editActivityModal: false, editActivityData: {
                        name: ''
                    }
                });
                console.log(response.data);

            }
        );
    }

    editProperty(id, name) {
        console.log(id);
        console.log(name);
        this.setState({
            editActivityData: {id, name}, editActivityModal: !this.state.editActivityModal
        });
    }

    deleteProperty(id) {
        axios.delete('http://localhost:8000/secured/Activity/activityDelete/' + id).then((response) => {

            }
        )
    }

    render() {
        let activities = this.state.activities.map((book) => {
            return (
                <tr key={book.id}>
                    <td>{book.name}</td>

                    <td>
                        <Button color="success" className="mr-2"
                                onClick={this.editProperty.bind(this, book.id, book.name)}>Edit</Button>
                        <Button color="danger" className="mr-2"
                                onClick={this.deleteProperty.bind(this, book.id)}>Delete</Button>
                    </td>
                </tr>
            )
        });
        return (

            <>
                <div className="content">
                    <Row>
                        <Col md="12">
                            <Card>

                                <CardBody>
                                    <Button color="primary" class="my-3" onClick={this.toggleNewBookModal.bind(this)}>add
                                        Activity </Button>
                                    {/*POST*/}
                                    <Modal isOpen={this.state.newActivityModal}
                                           toggle={this.toggleNewBookModal.bind(this)}>
                                        <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>add new activity</ModalHeader>
                                        <ModalBody>
                                            <FormGroup className="mb-3">
                                                <label htmlFor="name">name</label>
                                                <Input id="name" placeholder="with a placeholder"
                                                       value={this.state.newActivityData.name}
                                                       onChange={(e) => {
                                                           let {newActivityData} = this.state;
                                                           newActivityData.name = e.target.value;
                                                           this.setState({newActivityData});

                                                       }}/>
                                            </FormGroup>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="primary" onClick={this.addPriority.bind(this)}>Do
                                                Something</Button>{' '}
                                            <Button color="secondary"
                                                    onClick={this.toggleNewBookModal.bind(this)}>Cancel</Button>
                                        </ModalFooter>
                                    </Modal>


                                    {/*update*/}

                                    <Modal isOpen={this.state.editActivityModal}
                                           toggle={this.toggleEditBookModal.bind(this)}>
                                        <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edit a
                                            project</ModalHeader>
                                        <ModalBody>
                                            <FormGroup className="mb-3">
                                                <label htmlFor="name">name</label>
                                                <Input id="name"
                                                       value={this.state.editActivityData.name}
                                                       onChange={(e) => {
                                                           let {editActivityData} = this.state;
                                                           editActivityData.name = e.target.value;
                                                           this.setState({editActivityData});
                                                       }}/>

                                            </FormGroup>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="primary" onClick={this.updateProperty.bind(this)}>Do
                                                Something</Button>{' '}
                                            <Button color="secondary"
                                                    onClick={this.toggleEditBookModal.bind(this)}>Cancel</Button>
                                        </ModalFooter>
                                    </Modal>


                                    <Table>
                                        <thead>
                                        <tr>

                                            <th>name</th>

                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {activities}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>


        );
    }
}


export default Activity;
