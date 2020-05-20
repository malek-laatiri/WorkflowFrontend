import React from "react";
// react plugin used to create charts
import {Line, Pie} from "react-chartjs-2";
// reactstrap components
import {Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row} from "reactstrap";
// core components
import {dashboardEmailStatisticsChart, dashboardNASDAQChart} from "variables/charts.jsx";
import axios from 'axios';

class Dashboard extends React.Component {
    state = {
        status: [],
        userstories: []

    }

    componentWillMount() {

        axios.get(`http://localhost:8000/secured/status/StatusList`)
            .then(response => {
                this.setState({
                    status: response.data
                })
            }).then(console.log(this.state))
        ;
        axios.get(`http://localhost:8000/secured/UserStory/userStoryList`)
            .then(response => {
                this.setState({
                    userstories: response.data
                })
            }).then(console.log(this.state))
        ;


    }

    render() {


        let status = this.state.status.map((book) => {
            return (

                <Col lg="3" md="6" sm="6">
                    <Card className="card-stats">
                        <CardBody>
                            <Row>
                                <Col md="4" xs="5">
                                    <div className="icon-big text-center icon-warning">
                                        <i className="nc-icon nc-globe text-warning"/>
                                    </div>
                                </Col>
                                <Col md="8" xs="7">
                                    <div className="numbers">
                                        <p className="card-category">{book.name}</p>
                                        <CardTitle tag="p"></CardTitle>
                                        <p/>
                                    </div>
                                </Col>

                            </Row>
                        </CardBody>
                        <CardFooter>
                            <div className="stats">
                                <i className="fas fa-sync-alt"/> {this.state.userstories.map((item1)=>{
                                return <div draggable>{item1.subject}</div>
                            })}
                            </div>
                        </CardFooter>
                    </Card>


                </Col>


            )
        });


        return (
            <>
                <div className="content">
                    <Row>
                        {status}
                    </Row>

                    <Row>
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
