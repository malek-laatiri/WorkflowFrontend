import React, {Component} from 'react';
import axios from 'axios';
import {Doughnut, Line, Radar} from "react-chartjs-2";
import Loader from "react-loader-spinner";
import {Grid, Image} from "semantic-ui-react";


class Statistics extends Component {
    state = {
        labels: [],
        activity : [],
        activities: [],
        stat: {
            isComfirmed: '',
            isVerified: '',
            totalNum: '',
            isLate: '',
            overFifty: ''
        }
    }

     calulPercent(x, all) {
        return Math.round((x / all) * 100);
    }

    componentWillMount() {

        let isComfirmed = 0;
        let isVerified = 0;
        let totalNum = 0;
        let isLate = 0;
        let overFifty = 0;
        let i = 0;
        let activity = [];
        axios.get(`http://localhost:8000/secured/activity/activities`)
            .then(response => {
                let activities = [];
                response.data.data.map((element) => {
                    activity.push(0);
                    activities.push(element.name)
                })
                this.setState(
                    {
                        activities
                    }
                )
                console.log(this.state.activities)
            })


        axios.get(`http://localhost:8000/secured/project/ProjectStatistics/` + localStorage.getItem('projectid'))
            .then(response => {
                this.setState({
                    labels: response.data.data
                })
                response.data.data.map((element) => {
                    element.user_stories.map((e) => {
                        totalNum++;
                        console.log(e);
                        if (e.is_comfirmed) {
                            isComfirmed++;
                            activity[this.state.activities.indexOf(e.activity.name)] += 1
                        }
                        if (e.is_verified) {
                            isVerified++;
                        }
                        if (e.progress > 50) {
                            overFifty++
                        }
                        if (new Date() > new Date(e.due_date)) {
                            isLate++
                        }
                    })
                })
                let stat = {
                    isComfirmed: isComfirmed,
                    isVerified: isVerified,
                    totalNum: totalNum,
                    isLate: isLate,
                    overFifty: overFifty
                }
                this.setState({stat})
                activity.forEach(function(part, index) {
                    this[index] = Math.round((this[index] / totalNum) * 100);
                }, activity);
                this.setState({activity})

                console.log(activity)
            });


    }

    func() {
        let dataIsComfirmed = {
            datasets: [{
                data: [this.calulPercent(this.state.stat.isComfirmed, this.state.stat.totalNum), 100 - this.calulPercent(this.state.stat.isComfirmed, this.state.stat.totalNum)],
                backgroundColor: ['#003f5c', '#ffa600', '#58508d']
            }],
            labels: [
                'Comfirmed',
                'Total',
            ]
        };
        let dataisVerified = {
            datasets: [{

                data: [this.calulPercent(this.state.stat.isVerified, this.state.stat.totalNum), 100 - this.calulPercent(this.state.stat.isVerified, this.state.stat.totalNum)],
                backgroundColor: ['#003f5c', '#58508d', '#58508d', '#bc5090', '#58508d']
            }],
            labels: [
                'Verified',
                'Totam',
            ]
        };
        let dataisLate = {
            datasets: [{

                data: [this.state.stat.isLate, this.state.stat.totalNum],
                backgroundColor: ['#003f5c', '#bc5090', '#58508d', '#bc5090', '#58508d']
            }],
            labels: [
                'Done',
                'All Userstories'
            ]
        };
        let dataRader = {
            datasets: [{
                label: 'Project Progress',
                data: this.state.activity,
                Color: ['#003f5c'],
                borderCapStyle: ['#ffa600'],
                borderColor: ['#B03A2E'],
                pointBackgroundColor: ['#003f5c', '#ffa600', '#B03A2E', '#58508d', '#bc5090','#ff7c43','#a05195', '#d45087', '#f95d6a'],
                pointBorderColor: ['#bc5090'],
                borderWidth: "2px"
            }],
            labels: this.state.activities
        };

        return {dataIsComfirmed, dataisLate, dataisVerified, dataRader}
    }


    render() {

        return (
            this.func().dataRader ?
                <div>
                    <Grid columns={3} divided className="centered">
                        <Grid.Row>
                            <Grid.Column>
                                <Doughnut data={this.func().dataIsComfirmed}
                                          options={{
                                              responsive: true,
                                              title: {
                                                  display: true,
                                                  text: 'Comfirmed UserStories %'
                                              },
                                              maintainAspectRatio: true,
                                          }}

                                /> </Grid.Column>
                            <Grid.Column>
                                <Doughnut data={this.func().dataisVerified} options={{
                                    responsive: true,
                                    title: {
                                        display: true,
                                        text: 'Verified UserStories %'
                                    },
                                    maintainAspectRatio: true,
                                }}/> </Grid.Column>
                            <Grid.Column>
                                <Doughnut data={this.func().dataisLate} options={{
                                    responsive: true,
                                    title: {
                                        display: true,
                                        text: 'Late UserStories'
                                    },
                                    maintainAspectRatio: true,
                                }}/> </Grid.Column>
                        </Grid.Row>

                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Radar data={this.func().dataRader} options={{
                                    responsive: true,
                                    title: {
                                        display: true,
                                        text: 'Late UserStories'
                                    },
                                    maintainAspectRatio: true,
                                }}/> </Grid.Column>
                            <Grid.Column>
                                <Line data={this.func().dataRader} options={{
                                    responsive: true,
                                    title: {
                                        display: true,
                                        text: 'Late UserStories'
                                    },
                                    maintainAspectRatio: true,
                                }}/> </Grid.Column>

                        </Grid.Row>
                    </Grid>


                </div> :
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <Loader
                        type="Bars"
                        color="#00BFFF"
                        height={100}
                        width={100}

                    />
                </div>
        );
    }
}


export default Statistics;
