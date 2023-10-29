import { Input, Modal, notification, Form, Select, InputNumber } from "antd";


interface IProps {
    access_token: string,
    setIsCreateOpenModal: (v: boolean) => void,
    isCreateOpenModal: boolean,
    getData: any
}

const CreateUserModal = (props: IProps) => {

    const { access_token, isCreateOpenModal, setIsCreateOpenModal, getData } = props;

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

    const handleCloseModal = () => {
        form.resetFields();
        setIsCreateOpenModal(false);
    }

    const createNewUser = async (data: any) => {

        const res1 = await fetch(
            "http://localhost:8000/api/v1/users",
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access_token}`
                },
                method: "POST",
                body: JSON.stringify({ ...data }),
            }
        );
        const result = await res1.json();
        return result;
    }

    const onFinish = async (values: any) => {
        // console.log('Success:', values);
        const data = values;
        // console.log(">>>check state:", data)
        const result = await createNewUser(data);
        if (result.data) {
            notification.success({
                message: "Tạo mới user thành công",
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

    return (
        <Modal title="Add New User"
            open={(isCreateOpenModal)}
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
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
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

export default CreateUserModal;