import { Input, Modal, notification } from "antd";
import { useState } from "react";


interface IProps {
    access_token: string,
    setIsCreateOpenModal: (v: boolean) => void,
    isCreateOpenModal: boolean,
    getData: any
}

const CreateUserModal = (props: IProps) => {

    const { access_token, isCreateOpenModal, setIsCreateOpenModal, getData } = props;

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("")
    const [address, setAddress] = useState("")
    const [role, setRole] = useState("")


    const handleCloseModal = () => {
        setName("");
        setEmail("");
        setPassword("");
        setAge("");
        setGender("");
        setAddress("");
        setRole("");
        setIsCreateOpenModal(false);
    }

    const handleOk = async () => {
        const data = {
            name, email, password, age, gender, address, role
        }
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

    return (
        <Modal title="Add New User"
            open={(isCreateOpenModal)}
            onOk={handleOk}
            onCancel={() => handleCloseModal()}
            maskClosable={false}
        >
            <div>
                <label>Name:</label>
                <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </div>
            <div>
                <label>Email:</label>
                <Input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
            </div>
            <div>
                <label>Password:</label>
                <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            <div>
                <label>Age:</label>
                <Input
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                />
            </div>
            <div>
                <label>Gender:</label>
                <Input
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                />
            </div>
            <div>
                <label>Address:</label>
                <Input
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                />
            </div>
            <div>
                <label>Role:</label>
                <Input
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                />
            </div>

        </Modal>
    )
}

export default CreateUserModal;