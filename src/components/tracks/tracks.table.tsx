import { useEffect, useState } from "react";
import { Table, Button, notification, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';


export interface ITracks {
    _id: string,
    title: string,
    description: string,
    category: string,
    imgUrl: string,
    trackUrl: string,
    countLike: number,
    countPlay: number,
}


const TracksTable = () => {

    const [listTracks, setListTracks] = useState([])

    const access_token = localStorage.getItem("access_token") as string

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 2,
        pages: 0,
        total: 0
    })

    useEffect(() => {
        getData()
    }, [meta.current, meta.pageSize])

    const getData = async () => {

        const res1 = await fetch(
            `http://localhost:8000/api/v1/tracks?current=${meta.current}&pageSize=${meta.pageSize}`,
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
        setListTracks(d.data.result)
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total
        })
    }

    const columns: ColumnsType<ITracks> = [
        {
            title: 'STT',
            dataIndex: "_id",
            render: (value, item, index) => {
                return (
                    <>
                        {(meta.current - 1) * meta.pageSize + index + 1}
                    </>
                )
            }
        },
        {
            title: 'Title',
            dataIndex: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Category',
            dataIndex: 'category',
        },
        {
            title: 'Track Url',
            dataIndex: 'trackUrl',
        },
        {
            title: 'Uploader',
            dataIndex: ['uploader', 'name'],
        },
        {
            title: 'Actions',
            render: (_, record) => {

                return (
                    <div>
                        <Popconfirm
                            title="Delete the track"
                            description={`Are you sure to delete this track = ${record.title}?`}
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

    const handleOnChangePagination = (page: number, pageSize: number) => {
        // console.log(">>> check page, pageSize: ", page, "|", pageSize)
        setMeta({
            current: page,
            pageSize: pageSize,
            pages: meta.pages,
            total: meta.total
        })
    }

    const confirm = async (track: ITracks) => {
        const res1 = await fetch(
            `http://localhost:8000/api/v1/tracks/${track._id}`,
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
                message: "Xóa track thành công",
            })
            await getData();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: JSON.stringify(result.message)
            })
        }
    };

    return (
        <div>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <h2>Table Tracks</h2>
            </div>

            <Table
                columns={columns}
                dataSource={listTracks}
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
        </div>
    )
}

export default TracksTable;