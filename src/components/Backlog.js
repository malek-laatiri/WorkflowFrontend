import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import axios from 'axios';
import {FormGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import {checkEmptyObject, createNotification} from "./Common";
import {NotificationContainer} from "react-notifications";

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
            startdate: '',
            project: ''
        },
        editBacklogData: {
            title: '',
            rank: '',
            estimatedTime: '',
            sprint: '',
            startdate: '',
            project: ''

        },
        selectedOption: null

    }


    componentWillMount() {
        axios.get(`http://localhost:8000/secured/Backlog/BacklogList/` + localStorage.getItem('projectid'))
            .then(response => {
                this.setState({
                    backlogs: response.data.data
                })
            })
        ;
    }


    toggleNewBookModal() {
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
        this.state.newBacklogData.project = localStorage.getItem('projectid');

        let {newBacklogData} = this.state;
        //newProjectData.Team = this.state.selectedOption;
        this.setState({newBacklogData});
        if (checkEmptyObject(this.state.newBacklogData)) {

            axios.post('http://localhost:8000/secured/Backlog/backlogCreate', this.state.newBacklogData).then(
                (response) => {
                    let {backlogs} = this.state;
                    backlogs.push(response.data);
                    this.setState({
                        backlogs, newBacklogModal: false, newBacklogData: {
                            title: '',
                            rank: '',
                            estimatedTime: '',
                            startdate: '',
                            sprint: '',
                            project: ''
                        }
                    });

                }
            );
            createNotification('success', 'New Backlog Added 😀')
            axios.get(`http://localhost:8000/secured/Backlog/BacklogList/` + localStorage.getItem('projectid'))
                .then(response => {
                    this.setState({
                        backlogs: response.data
                    })
                })
            ;
        }


    }

    updateProperty() {
        axios.patch('http://localhost:8000/secured/Backlog/backlogUpdate/' + this.state.editBacklogData.id, this.state.editBacklogData).then(
            (response) => {
                let {backlogs} = this.state;
                backlogs.push(response.data);
                this.setState({
                    backlogs, editBacklogModal: false, editBacklogData: {
                        title: '',
                        rank: '',
                        estimatedTime: '',
                        startdate: '',
                        sprint: '',
                        project: ''
                    }
                });

            }
        );
    }

    editProperty(id, title, estimatedTime, sprint, rank, project, startdate) {
        this.setState({
            editBacklogData: {id, title, estimatedTime, sprint, rank, project, startdate},
            editBacklogModal: !this.state.editBacklogModal
        });
    }

    deleteProperty(id) {

        var r = window.confirm("Are you sure!");
        if (r == true) {
            axios.delete('http://localhost:8000/secured/Backlog/BacklogDelete/' + id).then((response) => {
                    createNotification('info', 'Backlog deleted')
                axios.get(`http://localhost:8000/secured/Backlog/BacklogList/` + localStorage.getItem('projectid'))
                    .then(response => {
                        this.setState({
                            backlogs: response.data
                        })
                    })
                ;
                }
            )


        } else {
            createNotification('error', 'cancellation')

        }
    }

    routeChange(backlog) {
        let path = `/admin/UserStory/userStoryList/` + backlog.id;
        this.props.history.push(path);
        localStorage.setItem('backlogid', backlog.id);
        localStorage.setItem('backlogStartDate', backlog.startdate);
        localStorage.setItem('backlogEstimation', backlog.estimated_time);

    }

    checkDate(dateBacklog, dateStart, dateEnd) {
        if (this.state.backlogs.length > 0) {
            var backlog = this.state.backlogs;
            console.log(backlog)
            var result = new Date(backlog[backlog.length - 1].startdate);
            result.setDate(result.getDate() + parseInt(backlog[backlog.length - 1].estimated_time));
            if (dateBacklog < dateStart || dateBacklog > dateEnd || dateBacklog < result.toISOString()) {
                if (dateBacklog < dateStart || dateBacklog > dateEnd) {
                    createNotification('error', 'Minimum date ' + dateStart + ' and maximum date ' + dateEnd)
                }
                if (dateBacklog < result.toISOString()) {
                    createNotification('error', 'Maximum date ' + result.toISOString().split('T')[0] + ' previous backlog didn"t finished yet')

                }
                return false
            } else return true
        } else {
            if (dateBacklog < dateStart || dateBacklog > dateEnd) {
                if (dateBacklog < dateStart || dateBacklog > dateEnd) {
                    createNotification('error', 'Minimum date ' + dateStart + ' and maximum date ' + dateEnd)
                }

                return false
            } else return true

        }

    }

    render() {
        let projects = this.state.backlogs.map((book) => {
            return (
                <tr key={book.id}>
                    <td>
                        <Button color="primary" className="px-4" onClick={() => this.routeChange(book)}>
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
                <NotificationContainer/>
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
                                                        <Input id="name" placeholder="Title"
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
                                                                   if (this.checkDate(e.target.value, localStorage.getItem('projectStartDate'), localStorage.getItem('projectdataDueDate'))) {
                                                                       let {newBacklogData} = this.state;
                                                                       newBacklogData.startdate = e.target.value;
                                                                       this.setState({newBacklogData});
                                                                   } else {
                                                                       e.target.value = ''
                                                                   }


                                                               }}/>
                                                        <label htmlFor="startDate">Estimated time</label>

                                                        <Input id="startDate" type="number" min="7" max="30"
                                                               value={this.state.newBacklogData.estimatedTime}
                                                               onChange={(e) => {
                                                                   if (e.target.value < 0 || e.target.value > 30) {
                                                                       createNotification('error', 'wrong sprint estimation,Maximum 30 and Minimum 7.')

                                                                   } else {
                                                                       let {newBacklogData} = this.state;
                                                                       newBacklogData.estimatedTime = e.target.value;
                                                                       this.setState({newBacklogData});
                                                                   }

                                                               }}/>
                                                        <label htmlFor="dueDate">sprint</label>

                                                        <Input id="dueDate" type="number"
                                                               value={this.state.newBacklogData.sprint}
                                                               onChange={(e) => {
                                                                   var arr = [];
                                                                   this.state.backlogs.map((element) => {
                                                                       arr.push(element.sprint)
                                                                   })

                                                                   if (arr.includes(parseInt(e.target.value)) || parseInt(e.target.value) > localStorage.getItem("projectdataSprintNum")) {
                                                                       createNotification('error', 'wrong sprint,the sprints ' + arr + ' already taken and maximum sprint ' + localStorage.getItem("projectdataSprintNum"))

                                                                   } else {
                                                                       let {newBacklogData} = this.state;
                                                                       newBacklogData.sprint = e.target.value;
                                                                       this.setState({newBacklogData});
                                                                   }


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
                                                <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edit a Backlog</ModalHeader>
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
                                                        <label htmlFor="startDate">startdate</label>

                                                        <Input id="startDate" type="number"
                                                               value={this.state.editBacklogData.startdate}
                                                               onChange={(e) => {
                                                                   let {editBacklogData} = this.state;
                                                                   editBacklogData.startdate = e.target.value;
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
