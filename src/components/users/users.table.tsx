import { useEffect, useState } from "react";
// import "../../styles/users.css"
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';


interface IUsers {
    _id: string,
    email: string,
    name: string,
    role: string
}

const UsersTable = () => {

    const [listUsers, setListUsers] = useState([])

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        // const res = await fetch(
        //     "http://localhost:8000/api/v1/auth/login",
        //     {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             username: "hoidanit@gmail.com",
        //             password: "123456"
        //         }),
        //     }
        // );
        // const data = await res.json();
        // console.log(">>> check data: ", data);

        const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjUzNzgwY2RlZTlhNWM4Nzk4YzIwMDNjIiwiZW1haWwiOiJob2lkYW5pdEBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIEjhu49pIETDom4gSVQiLCJ0eXBlIjoiU1lTVEVNIiwicm9sZSI6IkFETUlOIiwiZ2VuZGVyIjoiTUFMRSIsImFnZSI6OTYsImlhdCI6MTY5ODMwODIzMSwiZXhwIjoxNzg0NzA4MjMxfQ.ioQU8rVFFYObqusUUifaKc-SfoC_yJljNIesTXgVUNQ"

        const res1 = await fetch(
            "http://localhost:8000/api/v1/users/all",
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access_token}`
                },
            }
        );
        const d = await res1.json();
        // console.log(">>> check data 1: ", d.data.result);
        setListUsers(d.data.result)
    }

    const columns: ColumnsType<IUsers> = [
        {
            title: 'Email',
            dataIndex: 'email',
            render: (value, record) => {
                // console.log(">>>check value, record", value, record)
                return (<a>{record.email}</a>)
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
    ]

    return (
        <div>
            <h2>Table Users</h2>
            <Table
                columns={columns}
                dataSource={listUsers}
                rowKey={"_id"}
            />

            {/* <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listUsers.map((item: IUsers) => {
                            return (
                                <tr key={item._id}>
                                    <td>{item.email}</td>
                                    <td>{item.name}</td>
                                    <td>{item.role}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table> */}
        </div>
    )
}

export default UsersTable;