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
        const columns2 = [
            {
                name: 'title',
                selector: 'title',
                sortable: true,
            },
            {
                name: 'Start date',
                selector: 'startdate',
                sortable: true,
            }, {
                name: 'sprint',
                selector: 'sprint',
                sortable: true,
            }, {
                name: 'rank',
                selector: 'rank',
                sortable: true,
            }


        ];
        const columns3 = [
            {
                name: 'subject',
                selector: 'subject',
                sortable: true,
            },
            {
                name: 'content',
                selector: 'content',
                sortable: true,
            }, {
                name: 'asigned_to',
                selector: 'asigned_to.username',
                sortable: true,
            }


        ];
        const handleChange = (state) => {
            if (state.selectedRows[0])
            {
                localStorage.setItem('projectid', state.selectedRows[0].id);

            }
            localStorage.removeItem('projectdata')
            localStorage.removeItem('backlogdata')
            console.log('Selected Rows: ', state.selectedRows);
        };
        const expandFunct = () => {
        }
        const ExpanableComponent3 = (props) =>
            <DataTable
                columns={columns3}
                data={props.data.user_stories}
                pagination={true}
                fixedHeader={true}
                keyField="name"
                striped={true}
                highlightOnHover={true}
                persistTableHead={true}
                defaultSortField="name"
                defaultSortAsc={false}
            />;
        const ExpanableComponent = (props) =>
            <DataTable
                columns={columns2}
                data={props.data.backlog}
                pagination={true}
                fixedHeader={true}
                keyField="name"
                striped={true}
                highlightOnHover={true}
                persistTableHead={true}
                defaultSortField="name"
                defaultSortAsc={false}
                overflowY={true}
                expandableRows
                expandableRowsComponent={<ExpanableComponent3/>}

            />;


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
                                    expandableRows
                                    onRowExpandToggled={expandFunct}
                                    expandableRowsComponent={<ExpanableComponent/>}
                                    striped={true}
                                    highlightOnHover={true}
                                    persistTableHead={true}
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