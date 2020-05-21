import React, {Component} from "react";

import {Input, ModalBody} from "reactstrap";
import {FormGroup} from "react-bootstrap";
import InputColor from "react-input-color";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import {createNotification, getUser} from "../Common";

class FixedPlugin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: [],
            reload: false,
            classes: "dropdown show",
            newProjectData: {
                name: '',
                color: '',

            }
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.state.classes === "dropdown") {
            this.setState({classes: "dropdown show"});
        } else {
            this.setState({classes: "dropdown"});
        }
    }

    componentDidMount() {

        axios.get(`http://localhost:8000/secured/label/labelsList/` + localStorage.getItem('projectid'))
            .then(response => {
                this.setState({
                    labels: response.data
                })
            })
        ;


    }


    render() {
        let colors = this.state.labels.map((element) => {
            return (
                <Tooltip title={element.name}>
                         <span
                             className={
                                 this.props.activeColor === "primary"
                                     ? "badge filter badge-primary active"
                                     : "badge filter badge-primary"
                             }
                             data-color="primary"
                             style={{backgroundColor: element.color}}

                         />
                </Tooltip>

            )
        })
        return (
            <div className="fixed-plugin">
                <div className={this.state.classes}>
                    <div onClick={this.handleClick}>
                        <i className="fa fa-cog fa-2x"/>
                    </div>
                    <ul className="dropdown-menu show">
                        <li className="header-title"> LABEL COLORS</li>
                        <li className="adjustments-line">
                            <div className="badge-colors text-center">
                                {colors}
                            </div>
                        </li>

                        {getUser().roles.includes("ROLE_CLIENT") ?
                            <>
                                <li className="adjustments-line">
                                    <div className="flex">
                                        <Input id="name" placeholder="label name"
                                               className="labelInput"
                                               value={this.state.newProjectData.name}
                                               onChange={(e) => {
                                                   let {newProjectData} = this.state;
                                                   newProjectData.name = e.target.value;
                                                   this.setState({newProjectData});
                                               }}/>
                                        <InputColor
                                            className="labelColor"
                                            initialHexColor="#5e72e4"
                                            onChange={(e) => {
                                                let {newProjectData} = this.state;
                                                newProjectData.color = e.hex;
                                                this.setState({newProjectData});
                                            }}
                                            placement="right"
                                        />
                                    </div>
                                </li>

                                <li className="adjustments-line">
                                    <div className="centerButtonFixedPlugin">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            disabled={!this.state.newProjectData.name || !this.state.newProjectData.color}
                                            onClick={(e) => {
                                                let {newProjectData} = this.state;
                                                axios.post('http://localhost:8000/secured/label/labelCreate', {
                                                    color: newProjectData.color,
                                                    name: newProjectData.name,
                                                    project: localStorage.getItem("projectid")
                                                })
                                                this.state.newProjectData.name='';
                                                createNotification('success', newProjectData.name + ',new label added to the Project')
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </div>

                                </li>
                            </>
                            :
                            <>
                            </>
                        }

                    </ul>
                </div>
            </div>
        );
    }
}

export default FixedPlugin;
