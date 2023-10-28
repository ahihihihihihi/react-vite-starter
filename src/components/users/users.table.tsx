import { useEffect, useState } from "react";
import { Table, Button, notification, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import CreateUserModal from "./create.user.modal";
import UpdateUserModal from "./update.user.modal";


interface IUsers {
    _id: string,
    email: string,
    name: string,
    role: string
}

const UsersTable = () => {

    const [listUsers, setListUsers] = useState([])

    const [isCreateOpenModal, setIsCreateOpenModal] = useState(false);
    const [isUpdateOpenModal, setIsUpdateOpenModal] = useState(false);
    const [dataUpdateOpenModal, setDataUpdateOpenModal] = useState<any>();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 2,
        pages: 0,
        total: 0
    })

    useEffect(() => {
        getData()
    }, [meta.current, meta.pageSize])

    const access_token = localStorage.getItem("access_token") as string

    const getData = async () => {

        const res1 = await fetch(
            `http://localhost:8000/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access_token}`
                },
            }
        );
        const d = await res1.json();
        // console.log(">>> check data 1: ", d.data.result);
        if (!d.data) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: JSON.stringify(d.message)
            })
        }
        setListUsers(d.data.result)
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total
        })
    }

    const confirm = async (user: IUsers) => {
        const res1 = await fetch(
            `http://localhost:8000/api/v1/users/${user._id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access_token}`
                },
                method: "DELETE",
            }
        );
        const result = await res1.json();
        if (result.data) {
            notification.success({
                message: "Xóa user thành công",
            })
            await getData();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: JSON.stringify(result.message)
            })
        }
    };

    const handleOnChangePagination = (page: number, pageSize: number) => {
        // console.log(">>> check page, pageSize: ", page, "|", pageSize)
        setMeta({
            current: page,
            pageSize: pageSize,
            pages: meta.pages,
            total: meta.total
        })
    }


    const columns: ColumnsType<IUsers> = [
        {
            title: 'RowHead',
            key: "index",
            render: (value, item, index) => (meta.current - 1) * meta.pageSize + index + 1
        },
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
        {
            title: 'Actions',
            render: (_, record) => {

                return (
                    <div>
                        <button onClick={() => {
                            // console.log(">>>check record", record);
                            setIsUpdateOpenModal(true);
                            setDataUpdateOpenModal(record);
                        }}>Edit</button>
                        <Popconfirm
                            title="Delete the user"
                            description={`Are you sure to delete this user = ${record.name}?`}
                            onConfirm={() => confirm(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger style={{ marginLeft: 10 }}>Delete</Button>
                        </Popconfirm>
                    </div>
                )
            }
        },
    ]

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
                        onClick={() => setIsCreateOpenModal(true)}
                    >
                        Add New
                    </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={listUsers}
                rowKey={"_id"}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    onChange: (page: number, pageSize: number) => handleOnChangePagination(page, pageSize),
                    showSizeChanger: true
                }}
            />

            {
                isCreateOpenModal &&
                <CreateUserModal
                    setIsCreateOpenModal={setIsCreateOpenModal}
                    isCreateOpenModal={isCreateOpenModal}
                    getData={getData}
                    access_token={access_token}
                />
            }

            {
                isUpdateOpenModal &&
                <UpdateUserModal
                    setIsUpdateOpenModal={setIsUpdateOpenModal}
                    isUpdateOpenModal={isUpdateOpenModal}
                    getData={getData}
                    access_token={access_token}
                    dataUpdateOpenModal={dataUpdateOpenModal}
                />
            }

        </div>
    )
}

export default UsersTable;