import React from 'react'
import Board from 'react-trello'
import axios from "axios";
import {getUser, ntc} from "../components/Common";
import {NotificationContainer, NotificationManager} from "react-notifications";
import 'react-notifications/lib/notifications.css';
import {Input, Modal, ModalBody, ModalHeader} from "reactstrap";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import {FormGroup} from "react-bootstrap";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import Select from "react-select";
import ProgressBar from "react-bootstrap/ProgressBar";
import {Grid} from "semantic-ui-react";
import moment from "moment";
import FixedPlugin from "../components/FixedPlugin/FixedPlugin";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import {Checkbox} from 'semantic-ui-react'

let options = [];

export default class DevBoard extends React.Component {
    state = {
        status: [],
        labels: [],
        newProjectModal: false,
        userStroyShow: [],
        i: [''],
        newCommentData: {
            content: '',
            written_by: ''
        },
        selectedOption: null,
        selectedFile: null,
        isChecked: false,
        JSONData:''

    };

    async componentWillMount() {
        let res = await fetch('http://localhost:8000/secured/status/StatusList/' + localStorage.getItem('projectid'));
        res = await res.json();
        this.setState({
            status: res
        })
        let res1 = await fetch(`http://localhost:8000/secured/label/labelsList/` + localStorage.getItem('projectid'));
        res1 = await res1.json();
        this.setState({
            labels: res1
        })

        axios.get(`http://localhost:8000/secured/label/labelsList/` + localStorage.getItem('projectid'))
            .then(response => {
                if (options.length === 0) {

                    response.data.map((item) => {
                        options.push({label: item.name, value: item.id, color: item.color})
                    })
                }
            })
        ;
        this.setState({
            JSONData:this.functiontry()
        })
        console.log(this.state.JSONData)
    }

    colorStyles = {
        option: (styles, {data}) => {
            return {
                ...styles,
                backgroundColor: data.color,
            };
        },
    };

    toggleNewBookModal() {
        this.setState({
            newProjectModal: !this.state.newProjectModal
        })

    }

    functiontry() {
        var draggablex = 1;
        const {status} = this.state;
        let JSONData = {
            lanes: []
        };
        if (status && status.length) {
            status.forEach(e => {
                let stories = [];
                e.user_stories.map((element) => {
                    draggablex = 1;

                    if (getUser().roles.includes("ROLE_CLIENT")) {
                        if (getUser().privilege == 0) {
                            draggablex = 0;

                        }
                    } else if (JSON.stringify(getUser()) != JSON.stringify(element.asigned_to)) {
                        draggablex = 0;
                    }
                    stories.push({

                        id: element.id,
                        title: element.subject,
                        description: element.content,
                        label: element.estimated_time,
                        draggable: draggablex,
                        editable: true,
                    })
                })
                JSONData.lanes.push({
                    id: e.id,
                    title: e.name,
                    label: stories.length.toString(),
                    cards: stories
                });
            });
        }

        return JSONData
    }

    createNotification = (type, msg) => {
        switch (type) {
            case 'info':
                NotificationManager.info('Info message', msg);
                break;
            case 'success':
                NotificationManager.success('Success message', msg);
                break;
            case 'warning':
                NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
                break;
            case 'error':
                NotificationManager.error(msg, 'Error!', 5000, () => {
                });
                break;

        }
        ;
    };
    handleChange = (event, newValue) => {
        axios.patch('http://localhost:8000/secured/UserStory/PutProgress/' + this.state.userStroyShow.id, {"progress": newValue}).then(response => {
            this.createNotification('info', "you Have Changed the UserStory Progress")
        }).then(
            axios.post("http://localhost:8000/secured/ProgressHistory/ProgressHistoryCreate", {
                "value": newValue,
                "Userstory": this.state.userStroyShow.id
            })
        )

    };

    handleChange1 = selectedOption => {
        this.setState(
            {selectedOption},
            () => console.log(`Option selected:`, this.state.selectedOption)
        );
        console.log(this.state.userStroyShow);
        axios.patch('http://localhost:8000/secured/UserStory/UerStoryLabel/' + this.state.userStroyShow.id, {"label": selectedOption.value}).then(response => {
            this.createNotification('info', "you Have Asigned a Label To UserStory")
        })
    };
    onFileChange = event => {

        // Update the state
        this.setState({selectedFile: event.target.files[0]});

    };
    onFileUpload = () => {
        const formData = new FormData();
        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        console.log(formData);

        let file = {
            'imageName': this.state.selectedFile.name,
            'imageSize': this.state.selectedFile.size,
            'imageFile': this.state.selectedFile,
            'imageType': this.state.selectedFile.type

        }
        axios.post("http://localhost:8000/secured/files/uploadFile", file);
    };

    render() {

        let userStoryModal = this.state.i.map((i) => {

            return (

                <Modal isOpen={this.state.newProjectModal}
                       toggle={this.toggleNewBookModal.bind(this)}>
                    <ModalHeader
                        toggle={this.toggleNewBookModal.bind(this)}>
                        <div className='rows'>
                            <div className='row'>
                                {this.state.userStroyShow.subject}
                            </div>
                            <div className='row'>
                                {this.state.userStroyShow.label ?
                                    <Tooltip title={this.state.userStroyShow.label.name}>
                                        <p style={{
                                            backgroundColor: this.state.userStroyShow.label.color,
                                            fontSize: 12
                                        }} className="numberCircle"></p>
                                    </Tooltip> :
                                    <div></div>}
                            </div>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid divided='vertically'>
                            {getUser().roles.includes("ROLE_CLIENT") ?
                                <>
                                    <Grid.Row columns={2} spacing={3}>
                                        <Grid.Column textAlign="center">
                                            Put Label:
                                        </Grid.Column>
                                        <Grid.Column spacing={3}>
                                            <Select
                                                value={this.state.selectedOption}
                                                onChange={this.handleChange1}
                                                options={options}
                                                isSearchable
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </>
                                :
                                <>
                                </>
                            }
                            <Grid.Row columns={2}>
                                <Grid.Column textAlign="center">
                                    Subject:
                                </Grid.Column>
                                <Grid.Column>
                                    {this.state.userStroyShow.subject}
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column textAlign="center">
                                    Content:
                                </Grid.Column>
                                <Grid.Column spacing={3}>
                                    {this.state.userStroyShow.content}
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column textAlign="center">
                                    Priority:
                                </Grid.Column>
                                <Grid.Column>
                                    {this.state.userStroyShow.priority ? this.state.userStroyShow.priority.name :
                                        <div>loading</div>}
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column textAlign="center">
                                    Estimated Time:
                                </Grid.Column>
                                <Grid.Column>
                                    {this.state.userStroyShow.estimated_time}
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column textAlign="center">
                                    Activity:
                                </Grid.Column>
                                <Grid.Column>
                                    {this.state.userStroyShow.activity ? this.state.userStroyShow.activity.name :
                                        <div>loading</div>}
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column textAlign="center">
                                    History:
                                </Grid.Column>
                                <Grid.Column>
                                    {this.state.userStroyShow.histories ?
                                        this.state.userStroyShow.histories.map(home =>
                                            <div>{moment(home.modified_at, "YYYYMMDD").fromNow()
                                            } {home.status.name}</div>
                                        )
                                        : <div>loading</div>}
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={2}>

                                {JSON.stringify(getUser()) != JSON.stringify(this.state.userStroyShow.asigned_to) || getUser().roles.includes("ROLE_CLIENT") && getUser().privilege == 0 ?
                                    <>
                                        <Grid.Column textAlign="center">
                                            Current Progress
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Typography id="discrete-slider-always" gutterBottom>
                                                {this.state.userStroyShow.progress}%
                                            </Typography>
                                            <ProgressBar animated now={this.state.userStroyShow.progress}/>
                                        </Grid.Column>
                                    </>
                                    :
                                    <>

                                        <Grid.Column textAlign="center">

                                            <Typography id="discrete-slider-always" gutterBottom>
                                                Change Progress </Typography>
                                        </Grid.Column>

                                        <Grid.Column>

                                            <Slider
                                                defaultValue={this.state.userStroyShow.progress}
                                                aria-labelledby="discrete-slider-always"
                                                step={10}
                                                marks={true}
                                                valueLabelDisplay="on"
                                                onChange={this.handleChange}


                                            />
                                        </Grid.Column>
                                    </>
                                }


                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column textAlign="center">
                                    Comments:
                                </Grid.Column>
                                <Grid.Column spacing={3}>
                                    {this.state.userStroyShow.comments ?
                                        this.state.userStroyShow.comments.map(home =>
                                            <div>{home.written_by.username} {moment(home.written_at, "YYYYMMDD").fromNow()}<br/> {home.content}</div>)
                                        : <div>There's no comments</div>}
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column textAlign="center">
                                    add Comment
                                </Grid.Column>
                                <Grid.Column spacing={3}>
                                    <FormGroup className="mb-3">
                                        <Input ref="comment" placeholder="hit enter to send a comment"
                                               onKeyDown={(e) => {
                                                   if (e.key === 'Enter') {
                                                       if (e.target.value.length > 0) {
                                                           axios.post('http://localhost:8000/secured/comments/newComment/' + this.state.userStroyShow.id, {
                                                               content: e.target.value,
                                                               writtenBy: getUser().id
                                                           }).then(response => {
                                                               this.createNotification('info', "you Have Comment Has Been Added.")
                                                           })
                                                           this.setState({
                                                               newProjectModal: !this.state.newProjectModal
                                                           })
                                                       } else {
                                                           this.createNotification('error', "Can't Be Empty")

                                                       }
                                                   }

                                               }

                                               }
                                               value={this.state.newCommentData.name}
                                               onChange={(e) => {
                                                   let {newCommentData} = this.state;
                                                   newCommentData.content = e.target.value;
                                                   this.setState({newCommentData});

                                               }}/>

                                    </FormGroup>
                                    <input type="file" onChange={this.onFileChange}/>
                                    <button onClick={this.onFileUpload}>
                                        Upload!
                                    </button>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column textAlign="center">
                                    Assigned to:
                                </Grid.Column>
                                <Grid.Column>
                                    {this.state.userStroyShow.asigned_to ?
                                        <Grid.Column>
                                            <Grid.Row columns={2}>
                                                <Avatar>{this.state.userStroyShow.asigned_to.username.charAt(0)}</Avatar>
                                                {this.state.userStroyShow.asigned_to.username}
                                            </Grid.Row>


                                        </Grid.Column>
                                        : <div>loading</div>
                                    }
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column textAlign="center">
                                    Due date:
                                </Grid.Column>
                                <Grid.Column>
                                    {this.state.userStroyShow.due_date}
                                </Grid.Column>
                            </Grid.Row>


                            {getUser().roles.includes("ROLE_TESTER") ?
                                <>

                                    <Grid.Row columns={2}>
                                        <Grid.Column textAlign="center">
                                            Validation
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Checkbox toggle onChange={(event) => {
                                                this.state.userStroyShow.is_verified = !this.state.userStroyShow.is_verified;
                                                axios.patch('http://localhost:8000/secured/UserStory/putIsVerified/' + this.state.userStroyShow.id, {"isVerified": this.state.userStroyShow.is_verified}).then(response => {
                                                    this.createNotification('info', "This userstory is verified !")
                                                })
                                                this.setState({
                                                    newProjectModal: !this.state.newProjectModal
                                                })
                                            }}
                                                      checked={this.state.userStroyShow.is_verified}/>
                                        </Grid.Column>
                                    </Grid.Row>
                                </>
                                :
                                <>
                                </>
                            }

                        </Grid>


                    </ModalBody>
                </Modal>
            )
        })
        return <>
            <NotificationContainer/>


            <FixedPlugin/>


            {this.state.JSONData ?
                <Board data={this.state.JSONData} laneDraggable cardDraggable collapsibleLanes draggable
                       onCardClick={(cardId, metadata, laneId) => {
                           axios.get('http://localhost:8000/secured/UserStory/userStoryShow/' + cardId)
                               .then(response => {
                                   this.setState({
                                       userStroyShow: response.data
                                   });
                                   this.setState({
                                       newProjectModal: !this.state.newProjectModal
                                   })
                               })
                           ;
                       }
                       }
                       handleDragEnd={(cardId, sourceLaneId, targetLaneId, position, cardDetails) => {

                           axios.patch('http://localhost:8000/secured/UserStory/switchStoryStatus/' + cardId + '/' + targetLaneId).then(
                               (response) => {
                                   this.createNotification('success', "you Have Changed the UserStory Status")
                               }
                           ).then(axios.post('http://localhost:8000/secured/history/historyCreate', {

                               "status": targetLaneId,
                               "userstory": cardId
                           })).then(axios.get('http://localhost:8000/secured/status/RoleByStatus/' + targetLaneId))

                       }

                       }
                       hideCardDeleteIcon/>
                :
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <Loader
                        type="Bars"
                        color="#00BFFF"
                        height={100}
                        width={100}

                    />
                </div>}
            {userStoryModal}


        </>
    }
}