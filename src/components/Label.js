import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import axios from 'axios';
import {FormGroup} from "react-bootstrap";
import InputColor from "react-input-color";


class labelx extends Component {
    state = {

        newProjectModal: false,
        labels: [],
        newProjectData: {
            name: '',
            color: '',

        },
        selectedOption: null

    }


    componentWillMount() {

        axios.get(`http://localhost:8000/secured/label/labelsList/`+localStorage.getItem('projectid'))
            .then(response => {
                this.setState({
                    labels: response.data
                })
            }).then(console.log(this.state))
        ;


    }


    toggleNewBookModal() {
        this.setState({
            newProjectModal: !this.state.newProjectModal
        })

    }


    addPriority() {
        console.log(this.state.newProjectData);
        let {newProjectData} = this.state;
        //newProjectData.Team = this.state.selectedOption;
        this.setState({newProjectData});
        axios.post('http://localhost:8000/secured/label/labelCreate', this.state.newProjectData).then(
            (response) => {
                let {projects} = this.state;
                projects.push(response.data);
                this.setState({
                    projects, newProjectModal: false, newProjectData: {
                        name: '',
                        color: ''
                    }
                });


            }
        );

    }


    deleteProperty(id) {
        axios.delete('http://localhost:8000/secured/label/labelDelete/' + id).then((response) => {
                window.location.reload();

            }
        )
    }

    render() {
        let projects = this.state.labels.map((book) => {
            return (
                <tr key={book.id}>
                    <td>{book.name}
                    </td>
                    <td style={{backgroundColor: book.color}}>{book.color}</td>
                    <td>
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
                                                label </Button>
                                            {/*POST*/}
                                            <Modal isOpen={this.state.newProjectModal}
                                                   toggle={this.toggleNewBookModal.bind(this)}>
                                                <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>add new
                                                    project</ModalHeader>
                                                <ModalBody>
                                                    <FormGroup className="mb-3">
                                                        <label htmlFor="name">name</label>
                                                        <Input id="name" placeholder="with a placeholder"
                                                               value={this.state.newProjectData.name}
                                                               onChange={(e) => {
                                                                   let {newProjectData} = this.state;
                                                                   newProjectData.name = e.target.value;
                                                                   this.setState({newProjectData});

                                                               }}/>
                                                               <Row>

                                                                   <Col>
                                                                       <InputColor
                                                                           initialHexColor="#5e72e4"
                                                                           onChange={(e) => {
                                                                               let {newProjectData} = this.state;
                                                                               newProjectData.color = e.hex;
                                                                               this.setState({newProjectData});
                                                                           }}
                                                                           placement="right"
                                                                       />
                                                                   </Col>
                                                               </Row>


                                                    </FormGroup>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="primary" onClick={this.addPriority.bind(this)}>Do
                                                        Something</Button>{' '}
                                                    <Button color="secondary"
                                                            onClick={this.toggleNewBookModal.bind(this)}>Cancel</Button>
                                                </ModalFooter>
                                            </Modal>


                                            <Table>
                                                <thead>
                                                <tr>

                                                    <th>name</th>
                                                    <th>color</th>
                                                    <th>Actions</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {projects}
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


export default labelx;
