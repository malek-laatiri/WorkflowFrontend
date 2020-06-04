import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import listPlugin from '@fullcalendar/list';

import 'assets/scss/main.scss';
import axios from "axios";
import {getUser} from "../components/Common";
import Loader from "react-loader-spinner";

export default class Calendar extends React.Component {
    state = {
        currentprojects: [],
        events: []
    }
    colorPalette = ["#004c6d", "#255e7e", "#3d708f", "#5383a1", "#6996b3", "#7faac6", "#94bed9", "#abd2ec", "#c1e7ff"]

    handleDateClick = (arg) => { // bind with an arrow function
        console.log(arg)
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/secured/project/currentProjectsByUser/` + getUser().id)
            .then(response => {
                let currentprojects = response.data;
                this.setState({
                    currentprojects
                })
            })
        ;

    }

    func() {
        let arr = []
        this.state.currentprojects.map((project) => {
            let dataStartEndPrototype = {
                title: project.name,
                start: project.start_date,
                end: project.due_date,
                color: this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)],
                textColor: "white",
                extendedProps: {
                    text: ''
                },
                description: ''
            }
            arr.push(dataStartEndPrototype)
            project.backlog.map((backlog) => {
                    let dataStartEndPrototype = {
                        title: backlog.title,
                        date: backlog.startdate,
                        color: this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)],
                        textColor: 'white',
                        extendedProps: {
                            text: ''
                        },
                        description: ''
                    }
                    arr.push(dataStartEndPrototype)
                    backlog.user_stories.map((userStory) => {
                        if (userStory.asigned_to.username == (getUser().username)) {
                            let dataStartEndPrototypex = {
                                title: userStory.subject,
                                date: userStory.due_date,
                                color: "#B03A2E",
                                textColor: 'white',
                                extendedProps: {
                                    text: ''
                                },
                                description: ''
                            }
                            arr.push(dataStartEndPrototypex)
                        }


                    })
                }
            )

        })
        return arr
    }

    render() {
        console.log(this.func())
        return (
            <>
                {this.func() ?
                    <FullCalendar defaultView="dayGridMonth"
                                  plugins={[dayGridPlugin, interactionPlugin,listPlugin]}
                                  weekends={true}
                                  selectable={true}
                                  selectHelper={true}
                                  header={{
                                      left: 'prevYear prev today next nextYear  ',
                                      center: 'title',
                                      right: 'dayGridMonth,listWeek'
                                  }}
                                  businessHours={{
                                      dow: [1, 2, 3, 4, 5], // Monday - Friday
                                      start: '07:30', // business days' starting hour
                                      end: '17:00', // business days' ending time
                                  }}
                                  dateClick={this.handleDateClick}
                                  eventClick={function (info) {
                                      console.log(info.event.extendedProps);
                                      // {description: "Lecture", department: "BioChemistry"}
                                  }}
                                  events={this.func()}/>
                    :
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                        <Loader
                            type="Bars"
                            color="#00BFFF"
                            height={100}
                            width={100}

                        />
                    </div>}
            </>

        )
    }

}