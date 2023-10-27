import { useEffect, useState } from "react";
import { Table, Button, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';


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
                return (<a href={value}>{record.email}</a>)
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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <h2>Table Users</h2>
                <div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showModal}
                    >
                        Add New
                    </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={listUsers}
                rowKey={"_id"}
            />

            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>

        </div>
    )
}

export default UsersTable;