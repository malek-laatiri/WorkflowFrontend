import React from 'react'
import axios from "axios";
import {getUser} from "../components/Common";
import DataTable from "react-data-table-component";
import DevBoard from "./devBoard";

export default class BacklogDeveloper extends React.Component {
    state = {
        projects:[],
        status: [],
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/secured/project/projectsByUser/` + getUser().id)
            .then(response => {
                let projects = response.data;

                this.setState({
                    projects
                })
            })
        ;
        axios.get(`http://localhost:8000/secured/status/StatusList`)
            .then(response => {
                this.setState({
                    status: response.data
                })
            })
        ;
    }
    render() {
        const columns = [
            {
                name: 'title',
                selector: 'title',
                sortable: true,
            },
            {
                name: 'sprint',
                selector: 'sprint',
                sortable: true,
            },{
                name: 'Due date',
                selector: 'due_date',
                sortable: true,
            },{
                name: 'rank',
                selector: 'rank',
                sortable: true,
            }

        ];
        return <div>
            <h1>Backlog</h1>
            <DataTable
                columns={columns}
                data={this.props.ProjectId}
                expandableRows
                expandableRowsComponent={<DevBoard />}
                Clicked
            />
        </div>
    }
}