import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import axios from 'axios';
import {FormGroup} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Property extends Component {
    state = {
        books: [],
        newBookModal: false,
        editBookModal: false,

        newPriorityData: {
            name: ''
        },
        editPriorityData: {
            name: ''
        }
    }


    componentWillMount() {

        axios.get(`http://localhost:8000/secured/priority/priorityList`)
            .then(response => {
                this.setState({
                    books: response.data
                })
            }).then(console.log(this.state))
        ;
    }

    toggleNewBookModal() {
        this.setState({
            newBookModal: !this.state.newBookModal
        })
        // this.state.newBookModal=true;

    }

    toggleEditBookModal() {
        this.setState({
            editBookModal: !this.state.editBookModal
        })
        // this.state.newBookModal=true;

    }

    addPriority() {
        axios.post('http://localhost:8000/secured/priority/priorityCreate', this.state.newPriorityData).then(
            (response) => {
                let {books} = this.state;
                books.push(response.data);
                this.setState({
                    books, newBookModal: false, newPriorityData: {
                        name: ''
                    }
                });
                console.log(response.data);
                window.location.reload();

            }
        );

    }

    updateProperty() {
        axios.patch('http://localhost:8000/secured/priority/priorityUpdate/' + this.state.editPriorityData.id, this.state.editPriorityData).then(
            (response) => {
                let {books} = this.state;
                books.push(response.data);
                this.setState({
                    books, editBookModal: false, editPriorityData: {
                        name: ''
                    }
                });
                console.log(response.data);
                window.location.reload();

            }
        );
    }

    editProperty(id, name) {
        console.log(id);
        console.log(name);
        this.setState({
            editPriorityData: {id, name}, editBookModal: !this.state.editBookModal
        });
    }

    deleteProperty(id) {
        axios.delete('http://localhost:8000/secured/priority/priorityDelete/' + id).then((response) => {
                window.location.reload();

            }
        )
    }

    render() {
        let books = this.state.books.map((book) => {
            return (
                <tr key={book.id}>
                    <td>{book.name}</td>
                    <td>
                        <Button color="success" className="mr-2"
                                onClick={this.editProperty.bind(this, book.id, book.name)}><i
                            className="fas fa-edit"></i></Button>
                        <Button color="danger" onClick={this.deleteProperty.bind(this, book.id)}><i
                            className="fas fa-trash"></i></Button>
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

                                    <div className="content">
                                        <div className="card-header">
                                            <Button color="primary" class="my-3"
                                                    onClick={this.toggleNewBookModal.bind(this)}> <i className="far fa-plus-square"></i>

                                            </Button>
                                            {/*POST*/}
                                            <Modal isOpen={this.state.newBookModal}
                                                   toggle={this.toggleNewBookModal.bind(this)}>
                                                <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>add new
                                                    priority</ModalHeader>
                                                <ModalBody>
                                                    <FormGroup className="mb-3">
                                                        <label htmlFor="name">name</label>
                                                        <Input id="name" placeholder="with a placeholder"
                                                               value={this.state.newPriorityData.name}
                                                               onChange={(e) => {
                                                                   let {newPriorityData} = this.state;
                                                                   newPriorityData.name = e.target.value;
                                                                   this.setState({newPriorityData});

                                                               }}/>
                                                    </FormGroup>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="primary" onClick={this.addPriority.bind(this)}><i
                                                        className="fas fa-check-square"></i></Button>
                                                    <Button color="warning"
                                                            onClick={this.toggleNewBookModal.bind(this)}><i
                                                        className="far fa-window-close"></i></Button>
                                                </ModalFooter>
                                            </Modal>


                                            {/*update*/}

                                            <Modal isOpen={this.state.editBookModal}
                                                   toggle={this.toggleEditBookModal.bind(this)}>
                                                <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edit a
                                                    property</ModalHeader>
                                                <ModalBody>
                                                    <FormGroup className="mb-3">
                                                        <label htmlFor="name">name</label>
                                                        <Input id="name" placeholder="with a placeholder"
                                                               value={this.state.editPriorityData.name}
                                                               onChange={(e) => {
                                                                   let {editPriorityData} = this.state;
                                                                   editPriorityData.name = e.target.value;
                                                                   this.setState({editPriorityData});

                                                               }}/>
                                                    </FormGroup>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="primary" onClick={this.updateProperty.bind(this)}>
                                                        <i className="fas fa-check-square"></i></Button>{' '}
                                                    <Button color="secondary"
                                                            onClick={this.toggleEditBookModal.bind(this)}><i
                                                        className="far fa-window-close"></i></Button>
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
                                                {books}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}


export default Property;
