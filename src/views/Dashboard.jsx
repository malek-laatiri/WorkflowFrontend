import React from "react";
// react plugin used to create charts
import {Line, Pie} from "react-chartjs-2";
// reactstrap components
import {Card, CardBody, CardFooter, CardHeader, CardTitle, Col, ModalBody, Row} from "reactstrap";
// core components
import {dashboardEmailStatisticsChart, dashboardNASDAQChart} from "variables/charts.jsx";
import axios from 'axios';
import {getUser} from "../components/Common";
import {Checkbox, Grid, Item} from "semantic-ui-react";
import Carousel from "react-elastic-carousel";
import 'assets/css/index.css';

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
                    var counting = 0;
                    var countComfirmed = 0;
                    console.log(project)

                    project.backlog.map((backlog) => {

                        backlog.user_stories.map((userStory) => {
                            counting++;
                            if (userStory.is_verified == 1 && userStory.is_comfirmed == 0) {
                                userStory.isChecked = false;
                                array.push(userStory)
                            }
                            if (userStory.is_comfirmed == 0) {
                                countComfirmed++;
                            }
                        })
                    })

                    if (project.done == 0) {
                        project.prog = 100 - countComfirmed * 100 / counting;
                        array1.push(project)
                    }
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
        let box = this.state.projects.map((x) => {
            var allLenght = 0;
            var comfirmedLenght = 0;
            var verifiedLenght = 0;
            x.backlog.map((x1) => {

                x1.user_stories.map((x2) => {
                    allLenght++;
                    if (x2.is_comfirmed){
                        comfirmedLenght++
                    }
                    if (x2.is_verified){
                        verifiedLenght++
                    }
                })
            })
            const dashboardEmailStatisticsChart = {
                data: canvas => {
                    return {
                        labels: ["all", "Comfirmed", "Verified","Non-started"],
                        datasets: [
                            {
                                label: x.name,
                                pointRadius: 0,
                                pointHoverRadius: 0,
                                backgroundColor: ["#004c6d", "#346888", "#5886a5", "#7aa6c2"],
                                borderWidth: 0,
                                data: [allLenght, comfirmedLenght, verifiedLenght, allLenght-verifiedLenght]
                            }
                        ]
                    };
                },
                options: {
                    legend: {
                        display: true
                    },

                    pieceLabel: {
                        render: "percentage",
                        fontColor: ["white"],
                        precision: 2
                    },

                    tooltips: {
                        enabled: true
                    },

                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    display: false
                                },
                                gridLines: {
                                    drawBorder: false,
                                    zeroLineColor: "transparent",
                                    color: "rgba(255,255,255,0.05)"
                                }
                            }
                        ],

                        xAxes: [
                            {
                                barPercentage: 1.6,
                                gridLines: {
                                    drawBorder: true,
                                    color: "rgba(255,255,255,0.1)",
                                    zeroLineColor: "transparent"
                                },
                                ticks: {
                                    display: true
                                }
                            }
                        ]
                    }
                }
            };
            return (<Item>
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h5">Project Statistics</CardTitle>
                            <p className="card-category">{x.name}</p>
                        </CardHeader>
                        <CardBody>
                            <Pie
                                data={dashboardEmailStatisticsChart.data}
                                options={dashboardEmailStatisticsChart.options}
                            />
                        </CardBody>
                        <CardFooter>

                            <hr/>
                            <div className="stats">
                                <i className="fa fa-calendar"/> {x.start_date} - {x.due_date}
                            </div>
                        </CardFooter>
                    </Card>
                </Item>
            )
        })

        return (
            <>
            <div className="content">
                <Row>
                    <Col md="6">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h5">To validate</CardTitle>
                                <p className="card-category">Last Campaign Performance</p>
                            </CardHeader>
                            <CardBody>
                                <div className="stats">
                                    {this.state.status.map((item1) => {
                                        return <div><Grid divided='vertically'>
                                            <Grid.Row columns={2} spacing={3}>
                                                <Grid.Column textAlign="center">
                                                    {item1.subject}
                                                </Grid.Column>
                                                <Grid.Column textAlign="center">

                                                    <Checkbox toggle checked={item1.isChecked}
                                                              onChange={(event) => {
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
                                    <i className="fa fa-calendar"/> Number of userstories {this.state.storiesLength}
                                </div>
                            </CardFooter>
                        </Card>
                    </Col>

                    <Col md="6">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h5">Projects to close</CardTitle>
                                <p className="card-category">Last Campaign Performance</p>
                            </CardHeader>
                            <CardBody>
                                <div className="stats">
                                    {this.state.projects.map((proj) => {
                                        return <div><Grid divided='vertically'>
                                            <Grid.Row columns={3} spacing={3}>
                                                <Grid.Column textAlign="center">
                                                    {proj.name}
                                                </Grid.Column>
                                                <Grid.Column textAlign="center">
                                                    {isNaN(proj.prog) ? 0 : proj.prog}%
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
                                                                this.setState({
                                                                    projectsLength: p.length

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
                                    <i className="fa fa-calendar"/> Number of projects {this.state.projectsLength}
                                </div>
                            </CardFooter>
                        </Card>
                    </Col>
                    {/*###################################*/}
                    <Col md="12">
                        <Carousel itemsToShow={1}>

                            {box}

                    </Carousel>

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
    )
        ;
    }
}

export default Dashboard;
