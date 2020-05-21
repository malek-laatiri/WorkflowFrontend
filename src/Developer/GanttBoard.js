import React from "react";
import SideNav from "@trendmicro/react-sidenav";
import Gantt from "./Gantt";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Toolbar from "./Toolbar";
export default class GanttBoard extends React.Component {
    state = {
        projects: [],
        backlog: [],
        currentZoom: 'Days'

    }


    async componentWillMount() {
        let res = await fetch(`http://localhost:8000/secured/Backlog/BacklogList/` + localStorage.getItem('projectid'));
        res = await res.json();
        this.setState({
            backlog: res
        })
    }

    handleZoomChange = (zoom) => {
        this.setState({
            currentZoom: zoom
        });
    }
    functiontry() {
        let JSONdata = {
            data: '', links: ''
        };
        if (this.state.backlog) {
            let arr = [];
            let linksarr = [];
            this.state.backlog.forEach((element) => {
                let JSONitem = {
                    id: element.rank,
                    text: element.title,
                    start_date: element.startdate,
                    duration: element.estimated_time,
                    progress: 0.6,
                };
                arr.push(JSONitem)
            });
            JSONdata.data = arr;
            JSONdata.data.forEach(function (element, index) {
                if (index !== JSONdata.data.length - 1) {
                    let link = {id: element.id, source: element.id, target: JSONdata.data[index + 1].id, type: '0'}
                    linksarr.push(link);
                }

            })
            JSONdata.links = linksarr;
        }
        return JSONdata
    }


    render() {

        return <>
            <SideNav.Toggle/>

                {this.functiontry().data.length ?

                        <div className="gantt-container">
                            <div className="zoom-bar">
                                <Toolbar
                                    zoom={this.state.currentZoom}
                                    onZoomChange={this.handleZoomChange}
                                />
                            <Gantt tasks={this.functiontry()}
                                   zoom={this.state.currentZoom}
                            />

                        </div>
                    </div>
                    :   <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                        <Loader
                            type="Bars"
                            color="#00BFFF"
                            height={100}
                            width={100}
                        />
                    </div>}

        </>

    }
}