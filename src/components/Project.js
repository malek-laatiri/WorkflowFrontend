import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import axios from 'axios';
import {FormGroup} from "react-bootstrap";
import Select from 'react-select';
import {checkEmptyObject, createNotification, getUser} from "./Common";
import {NotificationContainer} from "react-notifications";


let options = [];
let optionsUpdate = [];


class Project extends Component {
    state = {
        projects: [],
        allusers: [],
        newProjectModal: false,
        editProjectModal: false,
        newBacklogModal: false,
        newProjectData: {
            name: '',
            startDate: '',
            dueDate: '',
            createdBy: '',
            sprintNum: '',
            Team: []
        },
        editProjectData: {
            name: '',
            startDate: '',
            dueDate: '',
            sprintNum: '',
            done: '',
            createdBy: '',
            Team: []

        },
        selectedOption: null,
        selectedOptionUpdate: null


    }

    componentWillMount() {

        axios.get(`http://localhost:8000/secured/project/projectListPrime/` + getUser().id)
            .then(response => {
                this.setState({
                    projects: response.data.data
                })
            })
        ;
        axios.get(`http://localhost:8000/secured/users/usersList`)
            .then(response => {
                this.setState({
                    allusers: response.data
                })
            })
        ;

    }

    handleChange = selectedOption => {
        this.setState(
            {selectedOption},
            () => console.log(`Option selected:`, this.state.selectedOption)
        );


    };

    handleChangeUpdate = selectedOptionUpdate => {
        this.setState(
            {selectedOptionUpdate},
            () => console.log(`Option selected:`, this.state.selectedOptionUpdate)
        );


    };

    toggleNewBookModal() {
        this.setState({
            newProjectModal: !this.state.newProjectModal
        })
        if (this.state.allusers.length > 0 && options.length === 0) {
            return this.state.allusers.map((e, i) =>
                [
                    options.push({label: `${e.username}`, value: `${e.id}`})
                ]
            );
        }
        // this.state.newBookModal=true;

    }

    toggleEditBookModal() {
        this.setState({
            editProjectModal: !this.state.editProjectModal
        })
        if (this.state.editProjectData.Team.length > 0 && optionsUpdate.length === 0) {
            return this.state.editProjectData.Team.map((e, i) =>
                [
                    optionsUpdate.push({label: `${e.username}`, value: `${e.id}`})
                ]
            );
        }
        console.log(optionsUpdate)

    }

    toggleNewBacklogModal() {
        this.setState({
            editProjectModal: !this.state.editProjectModal
        })
        // this.state.newBookModal=true;

    }


    addPriority() {

        this.state.newProjectData.createdBy = getUser().id;
        let {newProjectData} = this.state;
        this.setState({newProjectData});
        if (checkEmptyObject(this.state.newProjectData)) {
            this.state.selectedOption.forEach(element => this.state.newProjectData.Team.push(element.value));
            axios.post('http://localhost:8000/secured/project/projectCreate', this.state.newProjectData).then(
                (response) => {
                    let {projects} = this.state;
                    projects.push(response.data);

                    this.setState({
                        projects, newProjectModal: false, newProjectData: {
                            name: '',
                            startDate: '',
                            dueDate: '',
                            sprintNum: '',
                            createdBy: '',
                            Team: []

                        }
                    });

                }
            );
            axios.get(`http://localhost:8000/secured/project/projectListPrime/` + getUser().id)
                .then(response => {
                    this.setState({
                        projects: response.data.data
                    })
                })
            ;
        }


    }

    updateProperty() {
        this.state.editProjectData.createdBy = getUser().id;
        this.state.editProjectData.Team = [];

        this.state.selectedOptionUpdate.forEach(element => this.state.editProjectData.Team.push(element.value));
        axios.patch('http://localhost:8000/secured/project/ProjectUpdate/' + this.state.editProjectData.id, this.state.editProjectData).then(
            (response) => {

                console.log(this.state.editProjectData)
                let {projects} = this.state;
                projects.push(response.data);
                this.setState({
                    projects, editProjectModal: false, editProjectData: {
                        name: '',
                        startDate: '',
                        dueDate: '',
                        createdBy: '',
                        done: '',
                        sprintNum: '',
                        Team: []
                    }
                });
                axios.get(`http://localhost:8000/secured/project/projectListPrime/` + getUser().id)
                    .then(response => {
                        this.setState({
                            projects: response.data.data
                        })
                    })
                ;

            }
        );
    }

    editProperty(id, name, startDate, dueDate, done, createdBy, sprintNum,Team) {
        this.setState({
            editProjectData: {id, name, startDate, dueDate, sprintNum, done, createdBy,Team},
            editProjectModal: !this.state.editProjectModal
        });
        console.log(this.state.editProjectData)
    }

    deleteProperty(id) {

        var r = window.confirm("are you sure!");
        if (r == true) {
            axios.delete('http://localhost:8000/secured/project/projectDelete/' + id).then((response) => {
                    createNotification('info', 'Project deleted')
                    axios.get(`http://localhost:8000/secured/project/projectListPrime/` + getUser().id)
                        .then(response => {
                            this.setState({
                                projects: response.data.data
                            })
                        })
                    ;

                }
            )

        } else {
            createNotification('error', 'cancellation')

        }
    }

    routeChange(project) {
        localStorage.setItem('projectid', project.id);
        let path = `Backlog/BacklogList/` + project.id;
        localStorage.setItem('projectStartDate', project.start_date);
        localStorage.setItem('projectdataDueDate', project.due_date);
        localStorage.setItem('projectdataSprintNum', project.sprint_num);


        localStorage.removeItem('backlogid')
        this.props.history.push(path);

    }

    render() {

        let projects = this.state.projects.map((book) => {
            return (
                <tr key={book.id}>
                    <td>
                        <Button color="primary" className="px-4" onClick={() => this.routeChange(book)}>
                            {book.name}
                        </Button>
                    </td>
                    <td>{book.start_date}</td>
                    <td>{book.due_date}</td>
                    <td>{book.sprint_num}</td>

                    <td>
                        <Button color="success" className="mr-2"
                                onClick={this.editProperty.bind(this, book.id, book.name, book.start_date, book.due_date, book.done, getUser().id, book.sprint_num,book.team)}>Edit</Button>
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
                                                Project </Button>
                                            {/*POST*/}
                                            <Modal isOpen={this.state.newProjectModal}
                                                   toggle={this.toggleNewBookModal.bind(this)}>
                                                <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>add new
                                                    project</ModalHeader>
                                                <ModalBody>
                                                    <FormGroup className="mb-3">
                                                        <label htmlFor="name">Project Name</label>
                                                        <Input id="name" placeholder="with a placeholder"
                                                               value={this.state.newProjectData.name}
                                                               onChange={(e) => {
                                                                   let {newProjectData} = this.state;
                                                                   newProjectData.name = e.target.value;
                                                                   this.setState({newProjectData});

                                                               }}/>
                                                        <label htmlFor="name">Number Of Sprints</label>
                                                        <Input id="sprintNum" placeholder="with a placeholder"
                                                               type="number" min="0"
                                                               value={this.state.newProjectData.sprintNum}
                                                               onChange={(e) => {
                                                                   let {newProjectData} = this.state;
                                                                   newProjectData.sprintNum = e.target.value;
                                                                   this.setState({newProjectData});

                                                               }}/>
                                                        <label htmlFor="startDate">Start Date</label>

                                                        <Input id="startDate" type="date"
                                                               value={this.state.newProjectData.startDate}
                                                               onChange={(e) => {

                                                                   if (new Date(e.target.value).toISOString().split('T')[0] >= (new Date().toISOString().split('T')[0])) {
                                                                       let {newProjectData} = this.state;
                                                                       newProjectData.startDate = e.target.value;
                                                                       this.setState({newProjectData});
                                                                   } else {
                                                                       createNotification('error', 'Wrong Date')
                                                                       e.target.value = ''


                                                                   }
                                                                   if (this.state.newProjectData.dueDate.length > 0) {
                                                                       if (new Date(e.target.value).toISOString().split('T')[0] > (new Date(this.state.newProjectData.dueDate).toISOString().split('T')[0])) {
                                                                           this.state.newProjectData.startDate = ''
                                                                           createNotification('error', 'Wrong Date')

                                                                       } else {
                                                                           let {newProjectData} = this.state;
                                                                           newProjectData.startDate = e.target.value;
                                                                           this.setState({newProjectData});
                                                                       }
                                                                   }

                                                               }}/>
                                                        <label htmlFor="dueDate">Due Date</label>

                                                        <Input id="dueDate" type="date"
                                                               value={this.state.newProjectData.dueDate}
                                                               onChange={(e) => {
                                                                   if (e.target.value < new Date().toISOString() || e.target.value < this.state.newProjectData.startDate) {
                                                                       createNotification('error', 'Wrong Date')
                                                                       e.target.value = ''
                                                                   } else {
                                                                       let {newProjectData} = this.state;
                                                                       newProjectData.dueDate = e.target.value;
                                                                       this.setState({newProjectData});

                                                                   }
                                                               }}/>
                                                        <label htmlFor="Team">Project Members <i aria-hidden="true" className="users icon"></i></label>

                                                        <Select
                                                            value={this.state.selectedOption}
                                                            onChange={this.handleChange}
                                                            options={options}
                                                            isSearchable
                                                            isMulti
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

                                            <Modal isOpen={this.state.editProjectModal}
                                                   toggle={this.toggleEditBookModal.bind(this)}>
                                                <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edit a
                                                    Project</ModalHeader>
                                                <ModalBody>
                                                    <FormGroup className="mb-3">
                                                        <label htmlFor="name">name</label>
                                                        <Input id="name" placeholder="with a placeholder"
                                                               value={this.state.editProjectData.name}
                                                               onChange={(e) => {
                                                                   let {editProjectData} = this.state;
                                                                   editProjectData.name = e.target.value;
                                                                   this.setState({editProjectData});

                                                               }}/>
                                                        <label htmlFor="start_date">start date</label>

                                                        <Input id="start_date" type="date"
                                                               placeholder="with a placeholder"
                                                               value={this.state.editProjectData.startDate}
                                                               onChange={(e) => {
                                                                   let {editProjectData} = this.state;
                                                                   editProjectData.startDate = e.target.value;
                                                                   this.setState({editProjectData});

                                                               }}/>
                                                        <label htmlFor="due_date">due date</label>

                                                        <Input id="due_date" type="date"
                                                               placeholder="with a placeholder"
                                                               value={this.state.editProjectData.dueDate}
                                                               onChange={(e) => {
                                                                   let {editProjectData} = this.state;
                                                                   editProjectData.dueDate = e.target.value;
                                                                   this.setState({editProjectData});

                                                               }}/>
                                                        <label htmlFor="name">Number Of Sprints</label>
                                                        <Input id="sprintNum"
                                                               type="number" min="0"
                                                               value={this.state.editProjectData.sprintNum}
                                                               onChange={(e) => {
                                                                   let {editProjectData} = this.state;
                                                                   editProjectData.sprintNum = e.target.value;
                                                                   this.setState({editProjectData});

                                                               }}/>
                                                        <label htmlFor="due_date">Done</label>

                                                        <Input id="due_date" type="checkbox"
                                                               placeholder="with a placeholder"
                                                               onChange={(e) => {
                                                                   let {editProjectData} = this.state;
                                                                   editProjectData.done = e.target.value;
                                                                   this.setState({editProjectData});

                                                               }}/>
                                                        <label htmlFor="Team">Project Members <i aria-hidden="true" className="users icon"></i></label>

                                                        <Select
                                                            onChange={this.handleChangeUpdate}
                                                            options={options}
                                                            isSearchable
                                                            isMulti
                                                            defaultValue={optionsUpdate}

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

                                                    <th>Name</th>
                                                    <th>Start Date</th>
                                                    <th>DUe Date</th>
                                                    <th>Sprint number</th>

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


export default Project;
