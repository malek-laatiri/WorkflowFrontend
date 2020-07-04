import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import axios from 'axios';
import {FormGroup} from "react-bootstrap";
import Select from "react-select";
import {createNotification} from "./Common";

let options = [];

class StatusDemo extends Component {
    state = {
        status: [],
        newstatusModal: false,
        roles: [],
        editstatusModal: false,
        newstatusData: {
            name: '',
            role: '',
            project: localStorage.getItem('projectid')
        },
        editstatusData: {
            id:'',
            name: '',
            role: '',
            project: localStorage.getItem('projectid')
        }
    }


    componentWillMount() {

        axios.get(`http://localhost:8000/secured/status/StatusListSecond/` + localStorage.getItem('projectid'))
            .then(response => {
                this.setState({
                    status: response.data.data
                })
            })
        ;
        axios.get(`http://localhost:8000/secured/users/AllRoles`)
            .then(response => {
                if (options.length === 0) {
                    for (var item in response.data.data) {
                        options.push({label: `${item}`, value: `${item}`})

                    }
                }

                this.setState({
                    roles: response.data
                })
            })
        ;
    }

    toggleNewBookModal() {
        this.setState({
            newstatusModal: !this.state.newstatusModal
        })
    }

    handleChange = selectedOption => {
        this.setState(
            {selectedOption},
            () => console.log(`Option selected:`, this.state.selectedOption)
        );

        this.state.newstatusData.role = selectedOption.value;

    };
    handleChangeUpdate = selectedOption => {
        this.setState(
            {selectedOption},
            () => console.log(`Option selected:`, this.state.selectedOption)
        );

        this.state.editstatusData.role = selectedOption.value;

    };

    toggleEditBookModal() {
        this.setState({
            editstatusModal: !this.state.editstatusModal
        })
    }

    addPriority() {
        console.log(this.state.newstatusData);
        axios.post('http://localhost:8000/secured/status/statusCreate', this.state.newstatusData).then(
            (response) => {
                let {status} = this.state;
                status.push(response.data);
                this.setState({
                    status, newstatusModal: false, newstatusData: {
                        name: ''
                    }
                });
                axios.get(`http://localhost:8000/secured/status/StatusListSecond/`+localStorage.getItem('projectid'))
                    .then(response => {
                        this.setState({
                            status: response.data.data
                        })
                    })
                ;

            }
        );

    }

    updateProperty() {
        this.state.editstatusData.project=localStorage.getItem('projectid')
        axios.patch('http://localhost:8000/secured/status/statusUpdate/' + this.state.editstatusData.id, this.state.editstatusData).then(
            (response) => {
                let {status} = this.state;
                status.push(response.data);
                this.setState({
                    status, editstatusModal: false, editstatusData: {
                        id:'',
                        name: '',
                        role: '',
                        project: localStorage.getItem('projectid')


                    }
                });
                axios.get(`http://localhost:8000/secured/status/StatusListSecond/`+localStorage.getItem('projectid'))
                    .then(response => {
                        this.setState({
                            status: response.data.data
                        })
                    })
                ;

            }
        );
    }

    editProperty(id,name,role) {
        console.log(this.state.editstatusData)
        this.setState({
            editstatusData: {id,name,role}, editstatusModal: !this.state.editstatusModal
        });

    }

    deleteProperty(id) {


        var r = window.confirm("Are you sure!");
        if (r == true) {
            axios.delete('http://localhost:8000/secured/status/StatusDelete/' + id).then((response) => {
                    createNotification('info', 'done')
                axios.get(`http://localhost:8000/secured/status/StatusListSecond/`+localStorage.getItem('projectid'))
                    .then(response => {
                        this.setState({
                            status: response.data.data
                        })
                    })
                ;

                }
            )
        } else {
            createNotification('error', 'cancellation')

        }
    }

    render() {
        let status = this.state.status.map((book) => {
            return (
                <tr key={book.id}>
                    <td>{book.name}</td>
                    <td>{book.role}</td>

                    <td>
                        <Button color="success" className="mr-2"
                                onClick={this.editProperty.bind(this,book.id,book.name,book.role)}>Edit</Button>
                        <Button color="danger" onClick={this.deleteProperty.bind(this, book.id)}>Delete</Button>
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
                                                    onClick={this.toggleNewBookModal.bind(this)}>add
                                                Status </Button>
                                            {/*POST*/}
                                            <Modal isOpen={this.state.newstatusModal}
                                                   toggle={this.toggleNewBookModal.bind(this)}>
                                                <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>add new
                                                    status</ModalHeader>
                                                <ModalBody>
                                                    <FormGroup className="mb-3">
                                                        <label htmlFor="name">name</label>
                                                        <Input id="name" placeholder="with a placeholder"
                                                               value={this.state.newstatusData.name}
                                                               onChange={(e) => {
                                                                   let {newstatusData} = this.state;
                                                                   newstatusData.name = e.target.value;
                                                                   this.setState({newstatusData});

                                                               }}/>
                                                        <label htmlFor="Team">Available Roles</label>

                                                        <Select
                                                            value={this.state.selectedOption}
                                                            onChange={this.handleChange}
                                                            options={options}
                                                            isSearchable
                                                        />
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

                                            <Modal isOpen={this.state.editstatusModal}
                                                   toggle={this.toggleEditBookModal.bind(this)}>
                                                <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edit a
                                                    property</ModalHeader>
                                                <ModalBody>
                                                    <FormGroup className="mb-3">
                                                        <label htmlFor="name">name</label>
                                                        <Input id="name"
                                                               value={this.state.editstatusData.name}
                                                               onChange={(e) => {
                                                                   let {editstatusData} = this.state;
                                                                   editstatusData.name = e.target.value;
                                                                   this.setState({editstatusData});

                                                               }}/>
                                                        <label htmlFor="Team">Available Roles</label>

                                                        <Select
                                                            value={this.state.selectedOption}
                                                            onChange={this.handleChangeUpdate}
                                                            options={options}
                                                            isSearchable
                                                        />
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
                                                {status}
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


export default StatusDemo;
