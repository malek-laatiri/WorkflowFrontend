import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import axios from 'axios';
import {FormGroup} from "react-bootstrap";
import Select from 'react-select';
import {checkEmptyObject, createNotification} from "./Common";
import {NotificationContainer} from "react-notifications";


let options = [];
let Statusoptions = [];
let Priorityoptions = [];
let Activityoptions = [];


class UserStory extends Component {
    state = {
        userstories: [],
        allusers: [],
        hist: [],

        statusList: [],
        priorityList: [],
        activityList: [],
        UserStoriesoptions: [],
        newUserStoryModal: false,
        editUserStoryModal: false,
        newUserStoryData: {
            subject: '',
            content: '',
            estimatedTime: '',
            dueDate: '',
            tags: '',
            priority: '',
            status: '',
            backlog: '',
            asignedTo: '',
            activity: ''
        },
        editUserStoryData: {
            subject: '',
            content: '',
            estimatedTime: '',
            dueDate: '',
            tags: '',
            priority: '',
            status: '',
            backlog: '',
            asignedTo: '',
            activity: ''

        },
        selectedOptionStatus: null,
        selectedOptionPriority: null,
        selectedOption: null,
        selectedOptionActivity: null,
        newHistoryData: {
            userstory: '',
            status: '',
        }


    }


    componentWillMount() {
        axios.get(`http://localhost:8000/secured/UserStory/userStoryListPrime/` + localStorage.getItem('backlogid'))
            .then(response => {
                this.setState({
                    UserStoriesoptions: response.data.data
                })
            })
        ;

        axios.get(`http://localhost:8000/secured/priority/priorityList`)
            .then(response => {
                this.setState({
                    priorityList: response.data
                })
            })
        ;
        axios.get(`http://localhost:8000/secured/status/StatusList/` + localStorage.getItem('projectid'))
            .then(response => {
                this.setState({
                    statusList: response.data
                })
            })
        ;
        axios.get(`http://localhost:8000/secured/activity/activities`)
            .then(response => {
                this.setState({
                    activityList: response.data
                })
            })
        ;
        axios.get(`http://localhost:8000/secured/project/projectTeam/` + localStorage.getItem('projectid'))
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
        this.state.newUserStoryData.asignedTo = selectedOption.value;


    };
    changeStatus = selectedOptionStatus => {
        this.setState({selectedOptionStatus}, () => console.log(`Option selected:`, this.state.selectedOptionStatus));
        this.state.newUserStoryData.status = selectedOptionStatus.value;
    }
    changePriority = selectedOptionPriority => {
        this.setState({selectedOptionPriority}, () => console.log(`Option selected:`, this.state.selectedOptionPriority));
        console.log(this.state);
        this.state.newUserStoryData.priority = selectedOptionPriority.value;


    }
    changeActivity = selectedOptionActivity => {
        this.setState({selectedOptionActivity}, () => console.log(`Option selected:`, this.state.selectedOptionActivity));
        this.state.newUserStoryData.activity = selectedOptionActivity.value;
    }


    handleChangeUpdate = selectedOption => {
        this.setState(
            {selectedOption},
            () => console.log(`Option selected:`, this.state.selectedOption)
        );
        this.state.editUserStoryData.asignedTo = selectedOption.value;


    };
    changeStatusUpdate = selectedOptionStatus => {
        this.setState({selectedOptionStatus}, () => console.log(`Option selected:`, this.state.selectedOptionStatus));
        this.state.editUserStoryData.status = selectedOptionStatus.value;
    }
    changePriorityUpdate = selectedOptionPriority => {
        this.setState({selectedOptionPriority}, () => console.log(`Option selected:`, this.state.selectedOptionPriority));
        this.state.editUserStoryData.priority = selectedOptionPriority.value;


    }
    changeActivityUpdate = selectedOptionActivity => {
        this.setState({selectedOptionActivity}, () => console.log(`Option selected:`, this.state.selectedOptionActivity));
        this.state.editUserStoryData.activity = selectedOptionActivity.value;
    }


    chargingSelect() {
        if (this.state.allusers.length > 0 && options.length === 0) {
            this.state.allusers.map((e, i) =>
                [
                    options.push({label: `${e.username + "=>" + e.roles}`, value: `${e.id}`})
                ]
            );
        }
        if (Priorityoptions.length === 0) {
            this.state.priorityList.map((e, i) =>
                [
                    Priorityoptions.push({label: `${e.name}`, value: `${e.id}`})
                ]
            );
            this.state.statusList.map((e, i) =>
                [
                    Statusoptions.push({label: `${e.name}`, value: `${e.id}`})
                ]
            );
            this.state.activityList.map((e, i) =>
                [
                    Activityoptions.push({label: `${e.name}`, value: `${e.id}`})
                ]
            );
        }
    }

    toggleNewBookModal() {
        this.setState({
            newUserStoryModal: !this.state.newUserStoryModal
        })

        if (this.state.allusers.length > 0 && options.length === 0) {
            this.state.allusers.map((e, i) =>
                [
                    options.push({label: `${e.username + "=>" + e.roles}`, value: `${e.id}`})
                ]
            );
        }
        if (Priorityoptions.length === 0) {
            this.state.priorityList.map((e, i) =>
                [
                    Priorityoptions.push({label: `${e.name}`, value: `${e.id}`})
                ]
            );
            this.state.statusList.map((e, i) =>
                [
                    Statusoptions.push({label: `${e.name}`, value: `${e.id}`})
                ]
            );
            this.state.activityList.map((e, i) =>
                [
                    Activityoptions.push({label: `${e.name}`, value: `${e.id}`})
                ]
            );
        }


    }

    toggleEditBookModal() {
        this.setState({
            editUserStoryModal: !this.state.editUserStoryModal
        })
        this.chargingSelect();

    }


    addPriority() {
        this.state.newUserStoryData.backlog = localStorage.getItem('backlogid');
        let {newUserStoryData} = this.state;
        this.setState({newUserStoryData});


        if (checkEmptyObject(this.state.newUserStoryData)) {
            axios.post('http://localhost:8000/secured/UserStory/UserStoryCreate', this.state.newUserStoryData).then(
                (response) => {
                    let {userstories} = this.state;
                    userstories.push(response.data);

                    this.setState({
                        userstories, newUserStoryModal: false, newUserStoryData: {
                            subject: '',
                            content: '',
                            estimatedTime: '',
                            dueDate: '',
                            tags: '',
                            priority: '',
                            status: '',
                            backlog: '',
                            asignedTo: '',
                            activity: ''

                        }
                    });
                    createNotification('success', 'New User Story Added 😀')
                    axios.get(`http://localhost:8000/secured/UserStory/userStoryListPrime/` + localStorage.getItem('backlogid'))
                        .then(response => {
                            this.setState({
                                UserStoriesoptions: response.data
                            })
                        })
                    ;

                }
            );

        }


    }

    updateProperty() {
        axios.patch('http://localhost:8000/secured/UserStory/UerStoryUpdate/' + this.state.editUserStoryData.id, this.state.editUserStoryData).then(
            (response) => {
                let {userstories} = this.state;
                userstories.push(response.data);

                let {newHistoryData} = this.state;
                newHistoryData.status = this.state.editUserStoryData.status;
                newHistoryData.userstory = localStorage.getItem('userstoryid');
                this.setState({newHistoryData});
                axios.post('http://localhost:8000/secured/history/historyCreate', this.state.newHistoryData).then(
                    (response) => {
                        let {hist} = this.state;
                        hist.push(response.data);
                    }
                );

                this.setState({
                    userstories, editUserStoryModal: false, editUserStoryData: {
                        subject: '',
                        content: '',
                        estimatedTime: '',
                        dueDate: '',
                        tags: '',
                        priority: '',
                        status: '',
                        backlog: '',
                        asignedTo: '',
                        activity: ''

                    }
                });


            }
        );

    }

    editProperty(id, subject, content, estimatedTime, dueDate, tags, priority, status, backlog, asignedTo, activity) {
        localStorage.setItem('userstoryid', id);
        this.setState({
            editUserStoryData: {
                id,
                subject,
                content,
                estimatedTime,
                dueDate,
                tags,
                priority,
                status,
                backlog,
                asignedTo,
                activity
            }, editUserStoryModal: !this.state.editUserStoryModal
        });
    }

    deleteProperty(id) {

        var r = window.confirm("are you sure!");
        if (r == true) {
            axios.delete('http://localhost:8000/secured/UserStory/userStoryDelete/' + id).then((response) => {
                    createNotification('info', 'User Story deleted')
                    axios.get(`http://localhost:8000/secured/UserStory/userStoryListPrime/` + localStorage.getItem('backlogid'))
                        .then(response => {
                            this.setState({
                                UserStoriesoptions: response.data
                            })
                        })
                    ;

                }
            )

        } else {
            createNotification('error', 'cancellation')

        }
    }

    checkDate(dateUserStory) {
        var backlog = localStorage.getItem('backlogStartDate');
        var result = new Date(backlog);
        result.setDate(result.getDate() + parseInt(localStorage.getItem('backlogEstimation')));
        if (this.state.newUserStoryData.estimatedTime.length > 0) {
            var estimationtest = new Date(dateUserStory);
            estimationtest.setDate(estimationtest.getDate() + parseInt(this.state.newUserStoryData.estimatedTime));


            if (estimationtest.toISOString() > result.toISOString()) {
                createNotification('error', 'Wrong estimation,Minimum date ' + backlog + ' and maximum date ' + result.toISOString().split('T')[0])
                return false
            }
        }
        if (dateUserStory < backlog || dateUserStory > result.toISOString()) {
            createNotification('error', 'Minimum date ' + backlog + ' and maximum date ' + result.toISOString().split('T')[0])
            return false
        } else return true
    }

    render() {
        let userstories = this.state.UserStoriesoptions.map((book) => {
            return (
                <tr key={book.id}>
                    <td>{book.subject}</td>
                    <td>{book.content}</td>
                    <td>{book.estimated_time}</td>
                    <td>{book.due_date}</td>
                    <td>{book.tags}</td>
                    <td>{book.priority.name}</td>
                    <td>{book.status.name}</td>
                    <td>{book.asigned_to.username}</td>
                    <td>{book.activity.name}</td>


                    <td>
                        <Button color="success" className="mr-2"
                                onClick={this.editProperty.bind(this, book.id, book.subject, book.content, book.estimated_time, book.due_date,
                                    book.tags, book.priority.name, book.status.name, book.asigned_to.username, book.activity.name)}>Edit</Button>
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
                                                UserStory </Button>
                                            {/*POST*/}
                                            <Modal isOpen={this.state.newUserStoryModal}
                                                   toggle={this.toggleNewBookModal.bind(this)}>
                                                <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Add new
                                                    UserStory</ModalHeader>
                                                <ModalBody>
                                                    <FormGroup className="mb-3">
                                                        <label htmlFor="name">subject</label>
                                                        <Input id="name" placeholder="with a placeholder"
                                                               value={this.state.newUserStoryData.subject}

                                                               onChange={(e) => {
                                                                   let {newUserStoryData} = this.state;
                                                                   newUserStoryData.subject = e.target.value;
                                                                   this.setState({newUserStoryData});

                                                               }}/>
                                                        <label htmlFor="startDate">content</label>

                                                        <Input id="startDate"
                                                               value={this.state.newUserStoryData.content}
                                                               onChange={(e) => {
                                                                   let {newUserStoryData} = this.state;
                                                                   newUserStoryData.content = e.target.value;
                                                                   this.setState({newUserStoryData});

                                                               }}/>
                                                        <label htmlFor="dueDate">estimated time</label>

                                                        <Input id="dueDate"
                                                               min="1"
                                                               max={parseInt(localStorage.getItem("backlogEstimation"))}
                                                               value={this.state.newUserStoryData.estimatedTime}
                                                               onChange={(e) => {
                                                                   if (e.target.value > parseInt(localStorage.getItem("backlogEstimation"))) {
                                                                       createNotification('error', 'Maximum estimation ' + localStorage.getItem("backlogEstimation"))
                                                                   } else {
                                                                       let {newUserStoryData} = this.state;
                                                                       newUserStoryData.estimatedTime = e.target.value;
                                                                       this.setState({newUserStoryData});
                                                                   }


                                                               }}/>
                                                        <label htmlFor="dueDate">start date</label>

                                                        <Input id="dueDate"
                                                               type="date"
                                                               value={this.state.newUserStoryData.dueDate}
                                                               onChange={(e) => {
                                                                   if (this.checkDate(e.target.value)) {
                                                                       let {newUserStoryData} = this.state;
                                                                       newUserStoryData.dueDate = e.target.value;
                                                                       this.setState({newUserStoryData});
                                                                   } else {
                                                                       e.target.value = ''
                                                                   }


                                                               }}/>
                                                        <label htmlFor="dueDate">tags</label>

                                                        <Input id="dueDate"
                                                               value={this.state.newUserStoryData.tags}
                                                               onKeyPress={(event) => {
                                                                   if (event.keyCode === 32) {
                                                                       console.log('enter press here! ')
                                                                   }
                                                               }}
                                                               onChange={(e) => {
                                                                   let {newUserStoryData} = this.state;
                                                                   newUserStoryData.tags = e.target.value;
                                                                   this.setState({newUserStoryData});

                                                               }}/>

                                                        <label htmlFor="Team">Project Members</label>

                                                        <Select
                                                            value={this.state.selectedOption}
                                                            onChange={this.handleChange}
                                                            options={options}
                                                            isSearchable
                                                        />
                                                        <label htmlFor="Team">Status</label>

                                                        <Select
                                                            value={this.state.selectedOptionStatus}
                                                            onChange={this.changeStatus}
                                                            options={Statusoptions}
                                                            isSearchable
                                                        />
                                                        <label htmlFor="Team">Priority</label>

                                                        <Select
                                                            value={this.state.selectedOptionPriority}
                                                            onChange={this.changePriority}
                                                            options={Priorityoptions}
                                                            isSearchable
                                                        />
                                                        <label htmlFor="Team">Activity</label>

                                                        <Select
                                                            value={this.state.selectedOptionActivity}
                                                            onChange={this.changeActivity}
                                                            options={Activityoptions}
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

                                            <Modal isOpen={this.state.editUserStoryModal}
                                                   toggle={this.toggleEditBookModal.bind(this)}>
                                                <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edit a
                                                    UserStory</ModalHeader>
                                                <ModalBody>
                                                    <FormGroup className="mb-3">
                                                        <label htmlFor="name">subject</label>
                                                        <Input id="name" placeholder="with a placeholder"
                                                               value={this.state.editUserStoryData.subject}
                                                               onChange={(e) => {
                                                                   let {editUserStoryData} = this.state;
                                                                   editUserStoryData.subject = e.target.value;
                                                                   this.setState({editUserStoryData});

                                                               }}/>
                                                        <label htmlFor="startDate">content</label>

                                                        <Input id="startDate"
                                                               value={this.state.editUserStoryData.content}
                                                               onChange={(e) => {
                                                                   let {editUserStoryData} = this.state;
                                                                   editUserStoryData.content = e.target.value;
                                                                   this.setState({editUserStoryData});

                                                               }}/>
                                                        <label htmlFor="dueDate">estimated time</label>

                                                        <Input id="dueDate"
                                                               value={this.state.editUserStoryData.estimatedTime}
                                                               onChange={(e) => {
                                                                   let {editUserStoryData} = this.state;
                                                                   editUserStoryData.estimatedTime = e.target.value;
                                                                   this.setState({editUserStoryData});

                                                               }}/>
                                                        <label htmlFor="dueDate">due date</label>

                                                        <Input id="dueDate"
                                                               type="date"
                                                               value={this.state.editUserStoryData.dueDate}
                                                               onChange={(e) => {
                                                                   let {editUserStoryData} = this.state;
                                                                   editUserStoryData.dueDate = e.target.value;
                                                                   this.setState({editUserStoryData});

                                                               }}/>
                                                        <label htmlFor="dueDate">tags</label>

                                                        <Input id="dueDate"
                                                               value={this.state.editUserStoryData.tags}
                                                               onChange={(e) => {
                                                                   let {editUserStoryData} = this.state;
                                                                   editUserStoryData.tags = e.target.value;
                                                                   this.setState({editUserStoryData});

                                                               }}/>

                                                        <label htmlFor="Team">Project Members</label>

                                                        <Select
                                                            value={this.state.editUserStoryData.asignedTo}
                                                            onChange={this.handleChangeUpdate}
                                                            options={options}
                                                            isSearchable
                                                        />
                                                        <label htmlFor="Team">Status</label>

                                                        <Select
                                                            value={this.state.editUserStoryData.status.name}
                                                            onChange={this.changeStatusUpdate}
                                                            options={Statusoptions}
                                                            isSearchable
                                                        />
                                                        <label htmlFor="Team">Priority</label>

                                                        <Select
                                                            value={this.state.editUserStoryData.priority.name}
                                                            onChange={this.changePriorityUpdate}
                                                            options={Priorityoptions}
                                                            isSearchable
                                                        />
                                                        <label htmlFor="Team">Activity</label>

                                                        <Select
                                                            value={this.state.editUserStoryData.activity.name}
                                                            onChange={this.changeActivityUpdate}
                                                            options={Activityoptions}
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

                                                    <th>subject</th>
                                                    <th>content</th>
                                                    <th>estimatedTime</th>
                                                    <th>dueDate</th>
                                                    <th>tags</th>
                                                    <th>priority</th>
                                                    <th>status</th>
                                                    <th>asignedTo</th>
                                                    <th>activity</th>
                                                    <th>actions</th>


                                                </tr>
                                                </thead>
                                                <tbody>
                                                {userstories}
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
        )
            ;
    }
}


export default UserStory;
