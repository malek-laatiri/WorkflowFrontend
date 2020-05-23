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
        isChecked: false

    }

    componentWillMount() {

        axios.get(`http://localhost:8000/secured/project/projectList/` + getUser().id)
            .then(response => {
                this.setState({
                    status: response.data
                })
                this.setState({
                    projects: response.data
                })
                this.setState({
                    userstories: this.updateData()

                })
                // this.setState({
                //     projects: this.changeProjectData()
                //
                // })
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
                this.state.status.map((project) => {
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
                    status: array
                })
            })
    }

    // changeProjectData(){
    //     axios.get(`http://localhost:8000/secured/project/projectList/` + getUser().id)
    //         .then(response => {
    //             this.setState({
    //                 status: response.data
    //             })
    //             var array1 = [];
    //             var countVerified=0;
    //             var countComfirmed=0;
    //             var count=0;
    //             this.state.status.map((project1) => {
    //                 project1.backlog.map((backlog1) => {
    //                     backlog1.user_stories.map((userStory1) => {
    //                         count++;
    //                         if (userStory1.is_verified == 1) {
    //                             countVerified++;
    //                         }
    //                         else if(userStory1.is_comfirmed == 1){
    //                             countComfirmed++;
    //                         }
    //                     })
    //                 })
    //                 project1.verified=countVerified*100/count;
    //                 project1.comfermed=countComfirmed*100/count;
    //                 project1.isChecked=false
    //                 array1.push(project1)
    //             })
    //             return array1
    //         } )
    // }

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
                                        return <div><Grid divided='vertically'><Grid.Row columns={2} spacing={3}>
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
                                        <i className="fa fa-calendar"/> Number of emails sent
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
                                {/*<CardBody>*/}
                                {/*    <div className="stats">*/}
                                {/*        <i className="fas fa-sync-alt"/> {this.state.status.map((proj) => {*/}
                                {/*        return <div>{proj.name}*/}
                                {/*            <Checkbox toggle  onChange={(event) => {*/}
                                {/*                axios.patch('http://localhost:8000/secured/project/ProjectDone/' + proj.id)*/}
                                {/*                this.setState({*/}
                                {/*                    userstories: this.updateData()*/}

                                {/*                })*/}
                                {/*                proj.isChecked=true;*/}

                                {/*            }}*/}
                                {/*            />*/}
                                {/*        </div>*/}
                                {/*    })}*/}
                                {/*    </div>*/}
                                {/*</CardBody>*/}
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
