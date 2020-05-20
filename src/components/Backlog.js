import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import axios from 'axios';
import {FormGroup} from "react-bootstrap";
import {Link} from "react-router-dom";

let options = [];


class Backlog extends Component {
    state = {
        backlogs: [],
        newBacklogModal: false,
        editBacklogModal: false,
        newBacklogData: {
            title: '',
            rank: '',
            estimatedTime: '',
            sprint: '',
            startdate:'',
            project: ''
        },
        editBacklogData: {
            title: '',
            rank: '',
            estimatedTime: '',
            sprint: '',
            project: ''

        },
        selectedOption: null

    }


    componentWillMount() {
        axios.get(`http://localhost:8000/secured/Backlog/BacklogList/` +localStorage.getItem('projectid'))
            .then(response => {
                this.setState({
                    backlogs: response.data
                })
            }).then(console.log(this.state))
        ;
    }


    toggleNewBookModal() {
        console.log("click");
        this.setState({
            newBacklogModal: !this.state.newBacklogModal
        })
    }

    toggleEditBookModal() {
        this.setState({
            editBacklogModal: !this.state.editBacklogModal
        })
        // this.state.newBookModal=true;

    }


    addPriority() {
        console.log(this.state.newBacklogData);
        this.state.newBacklogData.project = localStorage.getItem('projectid');
        console.log(this.state.newBacklogData.project);
        let {newBacklogData} = this.state;
        //newProjectData.Team = this.state.selectedOption;
        this.setState({newBacklogData});
        axios.post('http://localhost:8000/secured/Backlog/backlogCreate', this.state.newBacklogData).then(
            (response) => {
                let {backlogs} = this.state;
                backlogs.push(response.data);
                this.setState({
                    backlogs, newBacklogModal: false, newBacklogData: {
                        title: '',
                        rank: '',
                        estimatedTime: '',
                        startdate:'',
                        sprint: '',
                        project: ''
                    }
                });

            }
        );

    }

    updateProperty() {
        axios.patch('http://localhost:8000/secured/Backlog/backlogUpdate/' + this.state.editBacklogData.id, this.state.editBacklogData).then(
            (response) => {
                let {backlogs} = this.state;
                backlogs.push(response.data);
                this.setState({
                    backlogs, newBacklogModal: false, newBacklogData: {
                        title: '',
                        rank: '',
                        estimatedTime: '',
                        startdate:'',
                        sprint: '',
                        project: ''
                    }
                });
                console.log(response.data);

            }
        );
    }

    editProperty(id, title, estimatedTime, sprint, rank, project) {
        this.setState({
            editBacklogData: {id, title, estimatedTime, sprint, rank, project},
            editBacklogModal: !this.state.editBacklogModal
        });
    }

    deleteProperty(id) {
        axios.delete('http://localhost:8000/secured/Backlog/BacklogDelete/' + id).then((response) => {
                window.location.reload();
            }
        )
    }

    routeChange(id) {
        let path = `/admin/UserStory/userStoryList/` + id;
        this.props.history.push(path);
        localStorage.setItem('backlogid', id);

        console.log(path);
        console.log(this.props.history);

    }

    render() {
        let projects = this.state.backlogs.map((book) => {
            return (
                <tr key={book.id}>
                    <td>
                        <Button color="primary" className="px-4"
                                onClick={() => this.routeChange(book.id)}
                        >
                            {book.title}
                        </Button>
                    </td>

                    <td>{book.rank}</td>

                    <td>{book.estimated_time}</td>
                    <td>{book.sprint}</td>
                    <td>
                        <Button color="success" className="mr-2"
                                onClick={this.editProperty.bind(this, book.id, book.title, book.estimated_time, book.sprint, book.rank, book.project)}>Edit</Button>
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
                                            </Button>

                                            {/*POST*/}
                                            <Modal isOpen={this.state.newBacklogModal}
                                                   toggle={this.toggleNewBookModal.bind(this)}>
                                                <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>add new
                                                    backlog</ModalHeader>
                                                <ModalBody>
                                                    <FormGroup className="mb-3">
                                                        <label htmlFor="name">title</label>
                                                        <Input id="name" placeholder="with a placeholder"
                                                               value={this.state.newBacklogData.title}
                                                               onChange={(e) => {
                                                                   let {newBacklogData} = this.state;
                                                                   newBacklogData.title = e.target.value;
                                                                   this.setState({newBacklogData});

                                                               }}/>
                                                        <label htmlFor="startDate">Start Date</label>
                                                        <Input id="startDate" type="date"
                                                               value={this.state.newBacklogData.startdate}
                                                               onChange={(e) => {
                                                                   let {newBacklogData} = this.state;
                                                                   newBacklogData.startdate = e.target.value;
                                                                   this.setState({newBacklogData});

                                                               }}/>
                                                        <label htmlFor="startDate">Estimated time</label>

                                                        <Input id="startDate" type="number"
                                                               value={this.state.newBacklogData.estimatedTime}
                                                               onChange={(e) => {
                                                                   let {newBacklogData} = this.state;
                                                                   newBacklogData.estimatedTime = e.target.value;
                                                                   this.setState({newBacklogData});

                                                               }}/>
                                                        <label htmlFor="dueDate">sprint</label>

                                                        <Input id="dueDate" type="number"
                                                               value={this.state.newBacklogData.sprint}
                                                               onChange={(e) => {
                                                                   let {newBacklogData} = this.state;
                                                                   newBacklogData.sprint = e.target.value;
                                                                   this.setState({newBacklogData});

                                                               }}/>
                                                        <label htmlFor="Team">rank</label>

                                                        <Input id="dueDate" type="number"
                                                               value={this.state.newBacklogData.rank}
                                                               onChange={(e) => {
                                                                   let {newBacklogData} = this.state;
                                                                   newBacklogData.rank = e.target.value;
                                                                   this.setState({newBacklogData});

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

                                            <Modal isOpen={this.state.editBacklogModal}
                                                   toggle={this.toggleEditBookModal.bind(this)}>
                                                <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>add new
                                                    property</ModalHeader>
                                                <ModalBody>
                                                    <FormGroup className="mb-3">
                                                        <label htmlFor="name">title</label>
                                                        <Input id="name" placeholder="with a placeholder"
                                                               value={this.state.editBacklogData.title}
                                                               onChange={(e) => {
                                                                   let {editBacklogData} = this.state;
                                                                   editBacklogData.title = e.target.value;
                                                                   this.setState({editBacklogData});

                                                               }}/>
                                                        <label htmlFor="startDate">estimated time</label>

                                                        <Input id="startDate" type="number"
                                                               value={this.state.editBacklogData.estimatedTime}
                                                               onChange={(e) => {
                                                                   let {editBacklogData} = this.state;
                                                                   editBacklogData.estimatedTime = e.target.value;
                                                                   this.setState({editBacklogData});

                                                               }}/>
                                                        <label htmlFor="dueDate">sprint</label>

                                                        <Input id="dueDate" type="number"
                                                               value={this.state.editBacklogData.sprint}
                                                               onChange={(e) => {
                                                                   let {editBacklogData} = this.state;
                                                                   editBacklogData.sprint = e.target.value;
                                                                   this.setState({editBacklogData});

                                                               }}/>
                                                        <label htmlFor="Team">rank</label>

                                                        <Input id="dueDate" type="number"
                                                               value={this.state.editBacklogData.rank}
                                                               onChange={(e) => {
                                                                   let {editBacklogData} = this.state;
                                                                   editBacklogData.rank = e.target.value;
                                                                   this.setState({editBacklogData});

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
                                                    <th>title</th>
                                                    <th>rank</th>
                                                    <th>estimated time</th>
                                                    <th>sprint</th>

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


export default Backlog;
