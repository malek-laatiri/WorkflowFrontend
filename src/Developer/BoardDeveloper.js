import React from 'react'
import axios from "axios";
import {getUser} from "../components/Common";
import DataTable from "react-data-table-component";
import Card from '@material-ui/core/Card';
import {CardContent, CardHeader, Grid} from "@material-ui/core";

const style = {
    paper: {padding: 20, marginTop: 10, marginBottom: 10}
}
export default class BoardDeveloper extends React.Component {
    state = {
        projects: [],
        currentprojects: [],

        status: [],
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

        axios.get(`http://localhost:8000/secured/project/projectsByUser/` + getUser().id)
            .then(response => {
                let projects = response.data;

                this.setState({
                    projects
                })
            })
        ;
    }

    render() {
        const columns = [
            {
                name: 'Project name',
                selector: 'name',
                sortable: true,
            },
            {
                name: 'Start date',
                selector: 'start_date',
                sortable: true,
            }, {
                name: 'Due date',
                selector: 'due_date',
                sortable: true,
            }, {
                name: 'Team Leader',
                selector: 'created_by.username',
                sortable: true,
            }
            , {
                name: 'Done',
                selector: 'done',
                sortable: true,
                accessor: d => d.visible.toString()

            }

        ];
        const handleChange = (state) => {
            localStorage.setItem('projectid', state.selectedRows[0].id);

            console.log('Selected Rows: ', state.selectedRows);
        };
        console.log(this.state.projects);
        return <div>
            <Grid container style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Grid item style={style.paper} md="6">
                    <Card>
                        <CardHeader title="Current Projects">
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={columns}
                                data={this.state.currentprojects}
                                selectableRows
                                onSelectedRowsChange={handleChange}
                                selectableRowsHighlight
                                paginationRowsPerPageOptions
                                //theme="solarized"
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item style={style.paper} md="6">
                    <Card>
                        <CardHeader title="All Projects">
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={columns}
                                data={this.state.projects}
                                //theme="solarized"
                            />
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

        </div>
    }
}