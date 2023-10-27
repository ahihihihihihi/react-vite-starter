import { Input, Modal, notification } from "antd";
import { useState } from "react";


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

    const [_id, setId] = useState(dataUpdateOpenModal?._id)
    const [name, setName] = useState(dataUpdateOpenModal?.name)
    const [email, setEmail] = useState(dataUpdateOpenModal?.email)
    // const [password, setPassword] = useState(dataUpdateOpenModal?.password)
    const [age, setAge] = useState(dataUpdateOpenModal?.age)
    const [gender, setGender] = useState(dataUpdateOpenModal?.gender)
    const [address, setAddress] = useState(dataUpdateOpenModal?.address)
    const [role, setRole] = useState(dataUpdateOpenModal?.role)


    const handleCloseModal = () => {
        setId("");
        setName("");
        setEmail("");
        // setPassword("");
        setAge("");
        setGender("");
        setAddress("");
        setRole("");
        setIsUpdateOpenModal(false);
    }

    const handleOk = async () => {
        const data = {
            name, email, _id, age, gender, address, role
        }
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
                    disabled={true}
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

export default UpdateUserModal;