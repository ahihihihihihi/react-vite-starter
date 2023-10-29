import { Input, Modal, notification, Form, Select, InputNumber } from "antd";
import { useEffect } from 'react'

interface IProps {
    access_token: string,
    setIsUpdateOpenModal: (v: boolean) => void,
    isUpdateOpenModal: boolean,
    getData: any,
    dataUpdateOpenModal: any
}

const UpdateUserModal = (props: IProps) => {

    const { access_token, isUpdateOpenModal, dataUpdateOpenModal, setIsUpdateOpenModal, getData } = props;
    // console.log(">>>check props", props);

    const [form] = Form.useForm();

    const optionsGender = [
        { value: 'MALE', label: 'male' },
        { value: 'FEMALE', label: 'Female' },
        { value: 'OTHER', label: 'other' },
    ];

    const optionsRole = [
        { value: 'USER', label: 'user' },
        { value: 'ADMIN', label: 'admin' },
    ];

    useEffect(() => {
        if (dataUpdateOpenModal) {
            form.setFieldsValue({
                name: dataUpdateOpenModal.name,
                email: dataUpdateOpenModal.email,
                age: dataUpdateOpenModal.age,
                address: dataUpdateOpenModal.address,
                gender: dataUpdateOpenModal.gender,
                role: dataUpdateOpenModal.role,
            })
        }
    }, [])

    const handleCloseModal = () => {
        form.resetFields();
        setIsUpdateOpenModal(false);
    }

    const onFinish = async (values: any) => {
        // console.log('Success:', values);
        const data = values;
        data._id = dataUpdateOpenModal._id;
        // console.log(">>>check state:", data)
        const result = await updateUser(data);
        if (result.data) {
            notification.success({
                message: "Update user thành công",
            })
            await getData();
            handleCloseModal();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: JSON.stringify(result.message)
            })
        }
    };

    const updateUser = async (data: any) => {

        const res1 = await fetch(
            "http://localhost:8000/api/v1/users",
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access_token}`
                },
                method: "PATCH",
                body: JSON.stringify(data),
            }
        );
        const result = await res1.json();
        return result;
    }

    return (
        <Modal title="Edit A User"
            open={(isUpdateOpenModal)}
            onOk={() => form.submit()}
            onCancel={() => handleCloseModal()}
            maskClosable={false}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Password"
                    name="password"
                    rules={[{ required: dataUpdateOpenModal ? false : true, message: 'Please input your password!' }]}
                >
                    <Input.Password
                        disabled={dataUpdateOpenModal ? true : false}
                    />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Age"
                    name="age"
                    rules={[{ required: true, message: 'Please input your age!' }]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                    />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please input your address!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Gender"
                    name="gender"
                    rules={[{ required: true }]}
                >
                    <Select
                        placeholder="Select an option and change input text above"
                        allowClear
                        options={optionsGender}
                    >
                    </Select>
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Role"
                    name="role"
                    rules={[{ required: true }]}
                >
                    <Select
                        placeholder="Select an option and change input text above"
                        allowClear
                        options={optionsRole}
                    >
                    </Select>
                </Form.Item>
            </Form>

        </Modal>
    )
}

export default UpdateUserModal;