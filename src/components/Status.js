import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import axios from 'axios';
import {FormGroup} from "react-bootstrap";
import Select from "react-select";
let options = [];

class StatusDemo extends Component {
    state = {
        status: [],
        newstatusModal: false,
        roles: [],
        editstatusModal: false,
        newstatusData: {
            name: '',
            role:'',
            project:localStorage.getItem('projectid')
        },
        editstatusData: {
            name: ''

        }
    }


    componentWillMount() {

        axios.get(`http://localhost:8000/secured/status/StatusList/`+localStorage.getItem('projectid'))
            .then(response => {
                this.setState({
                    status: response.data
                })
            }).then(console.log(this.state))
        ;
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
console.log(this.state)

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
                window.location.reload();

            }
        );

    }

    updateProperty() {
        axios.patch('http://localhost:8000/secured/status/statusUpdate/' + this.state.editstatusData.id, this.state.editstatusData).then(
            (response) => {
                let {status} = this.state;
                status.push(response.data);
                this.setState({
                    status, editstatusModal: false, editstatusData: {
                        name: '',

                    }
                });
                console.log(response.data);
                window.location.reload();

            }
        );
    }

    editProperty(id, name) {
        this.setState({
            editstatusData: {id, name}, editstatusModal: !this.state.editstatusModal
        });

    }

    deleteProperty(id) {
        axios.delete('http://localhost:8000/secured/status/StatusDelete/' + id).then((response) => {
                window.location.reload();

            }
        )
    }

    render() {
        let status = this.state.status.map((book) => {
            return (
                <tr key={book.id}>
                    <td>{book.name}</td>
                    <td>
                        <Button color="success" className="mr-2"
                                onClick={this.editProperty.bind(this, book.id, book.name)}>Edit</Button>
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
