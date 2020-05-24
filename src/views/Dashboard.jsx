import React from "react";
// react plugin used to create charts
import {Line, Pie} from "react-chartjs-2";
// reactstrap components
import {Card, CardBody, CardFooter, CardHeader, CardTitle, Col, ModalBody, Row} from "reactstrap";
// core components
import {dashboardEmailStatisticsChart, dashboardNASDAQChart} from "variables/charts.jsx";
import axios from 'axios';
import {getUser} from "../components/Common";
import {Checkbox, Grid} from "semantic-ui-react";

class Dashboard extends React.Component {
    state = {
        status: [],
        userstories: [],
        projects: [],
        isChecked: false,
        storiesLength: 0,
        projectsLength: 0

    }

    componentWillMount() {

        axios.get(`http://localhost:8000/secured/project/projectList/` + getUser().id)
            .then(response => {
                this.setState({
                    status: response.data
                });
                this.setState({
                    projects: response.data
                });
                this.setState({
                    userstories: this.updateData()

                });

                this.setState({
                    projectsLength: this.state.projects.length
                });
                console.log(this.state)

            })
        ;
    }

    updateData() {
        axios.get(`http://localhost:8000/secured/project/projectList/` + getUser().id)
            .then(response => {
                this.setState({
                    status: response.data
                })

                var array = [];
                var array1 = [];
                this.state.status.map((project) => {
                    if (project.done == 0) {
                        array1.push(project)
                    }
                    project.backlog.map((backlog) => {
                        backlog.user_stories.map((userStory) => {
                            console.log(userStory)
                            if (userStory.is_verified == 1 && userStory.is_comfirmed == 0) {
                                userStory.isChecked = false;
                                array.push(userStory)
                            }
                        })
                    })
                })
                this.setState({
                    storiesLength: array.length
                });
                this.setState({
                    status: array
                })
                this.setState({
                    projects: array1
                })
                this.setState({
                    projectsLength: array1.length
                });
            })
    }


    render() {

        return (
            <>
                <div className="content">
                    <Row>
                        <Col md="4">
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h5">To validate</CardTitle>
                                    <p className="card-category">Last Campaign Performance</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="stats">
                                        <i className="fas fa-sync-alt"/> {this.state.status.map((item1) => {
                                        return <div><Grid divided='vertically'>
                                            <Grid.Row columns={2} spacing={3}>
                                                <Grid.Column textAlign="center">
                                                    {item1.subject}
                                                </Grid.Column>
                                                <Grid.Column textAlign="center">

                                                    <Checkbox toggle checked={item1.isChecked} onChange={(event) => {
                                                        axios.patch('http://localhost:8000/secured/UserStory/PutIsComfirmed/' + item1.id, {isComfirmed: 1})
                                                        this.setState({
                                                            userstories: this.updateData()

                                                        })
                                                        item1.isChecked = true;

                                                    }}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                        </div>
                                    })}
                                    </div>
                                </CardBody>
                                <CardFooter>
                                    <div className="legend">
                                        <i className="fa fa-circle text-primary"/> Opened{" "}
                                        <i className="fa fa-circle text-warning"/> Read{" "}
                                        <i className="fa fa-circle text-danger"/> Deleted{" "}
                                        <i className="fa fa-circle text-gray"/> Unopened
                                    </div>
                                    <hr/>
                                    <div className="stats">
                                        <i className="fa fa-calendar"/> Number of emails sent {this.state.storiesLength}
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>

                        <Col md="4">
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h5">Projects to close</CardTitle>
                                    <p className="card-category">Last Campaign Performance</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="stats">
                                        <i className="fas fa-sync-alt"/> {this.state.projects.map((proj) => {
                                        return <div><Grid divided='vertically'>
                                            <Grid.Row columns={2} spacing={3}>
                                                <Grid.Column textAlign="center">
                                                    {proj.name}
                                                </Grid.Column>
                                                <Grid.Column textAlign="center">

                                                    <Checkbox toggle checked={proj.isChecked} onChange={(event) => {
                                                        axios.patch('http://localhost:8000/secured/project/ProjectDone/' + proj.id)
                                                        axios.get(`http://localhost:8000/secured/project/projectList/` + getUser().id)
                                                            .then(response => {
                                                                var p = [];
                                                                response.data.map((val) => {
                                                                    if (val.done == 0) {
                                                                        p.push(val)
                                                                    }
                                                                })
                                                                this.setState({
                                                                    projects: p

                                                                })
                                                            })

                                                        proj.isChecked = true;

                                                    }}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                        </div>
                                    })}
                                    </div>
                                </CardBody>
                                <CardFooter>
                                    <div className="legend">
                                        <i className="fa fa-circle text-primary"/> Opened{" "}
                                        <i className="fa fa-circle text-warning"/> Read{" "}
                                        <i className="fa fa-circle text-danger"/> Deleted{" "}
                                        <i className="fa fa-circle text-gray"/> Unopened
                                    </div>
                                    <hr/>
                                    <div className="stats">
                                        <i className="fa fa-calendar"/> Number of emails
                                        sent {this.state.projectsLength}
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>

                        <Col md="4">
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h5">Email Statistics</CardTitle>
                                    <p className="card-category">Last Campaign Performance</p>
                                </CardHeader>
                                <CardBody>
                                    <Pie
                                        data={dashboardEmailStatisticsChart.data}
                                        options={dashboardEmailStatisticsChart.options}
                                    />
                                </CardBody>
                                <CardFooter>
                                    <div className="legend">
                                        <i className="fa fa-circle text-primary"/> Opened{" "}
                                        <i className="fa fa-circle text-warning"/> Read{" "}
                                        <i className="fa fa-circle text-danger"/> Deleted{" "}
                                        <i className="fa fa-circle text-gray"/> Unopened
                                    </div>
                                    <hr/>
                                    <div className="stats">
                                        <i className="fa fa-calendar"/> Number of emails sent
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>

                        <Col md="8">
                            <Card className="card-chart">
                                <CardHeader>
                                    <CardTitle tag="h5">NASDAQ: AAPL</CardTitle>
                                    <p className="card-category">Line Chart with Points</p>
                                </CardHeader>
                                <CardBody>
                                    <Line
                                        data={dashboardNASDAQChart.data}
                                        options={dashboardNASDAQChart.options}
                                        width={400}
                                        height={100}
                                    />
                                </CardBody>
                                <CardFooter>
                                    <div className="chart-legend">
                                        <i className="fa fa-circle text-info"/> Tesla Model S{" "}
                                        <i className="fa fa-circle text-warning"/> BMW 5 Series
                                    </div>
                                    <hr/>
                                    <div className="card-stats">
                                        <i className="fa fa-check"/> Data information certified
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </div>

            </>
        );
    }
}

export default Dashboard;
