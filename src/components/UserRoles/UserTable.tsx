import { useEffect, useState } from "react";
import DropDown, { IOption } from "../Inputs/DropDown";
import Table from "../Table/Table";
import { CircularProgress } from "@mui/material";
import { UserList } from "../../schemas/auth/out/user.schema";
import authService from "../../services/auth.service";
import { Role } from "../../schemas/auth/out/roles.schema";
import { CreateUser } from "../../schemas/auth/input/user.schema";
import AddIcon from '@mui/icons-material/Add';
import TextInput from "../Inputs/TextInput";
import { toast } from "sonner";

interface IUser extends UserList {
    loading?: boolean;
}

const tableHeaders: Record<keyof UserList, string> = {
    id: "ID",
    name: "Nome",
    email: "E-mail",
    nusp: "NUSP",
    created_at: "Data de Criação",
    active_sessions: "Sessões Ativas",
    roleId: "Função"
}

interface UserTableProps {
    roles: Role[];
};

function UserTable({ roles }: UserTableProps) {
    const [users, setUsers] = useState<IUser[]>([]);
    const [roleOptions, setRoleOptions] = useState<IOption[]>([]);
    const [createPopup, setCreatePopup] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<CreateUser>({
        nusp: '',
        roleId: -1,
        email: ''
    });

    const fetchUsers = async () => {
        const _users = await authService.listUsers();
        if (_users) {
            setUsers(_users.map(el => ({
                ...el,
                nusp: el.nusp ?? '-',
                name: el.name ?? '-',
            })));
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        setRoleOptions(roles.map(role => ({ label: role.name, id: role.id })));
    }, [roles]);

    const setNewRole = async (user: IUser, roleId: number) => {
        const updatedUser = { ...user, loading: true };
        setUsers(users.map(u => u.id === user.id ? updatedUser : u));

        const result = await authService.changeRole(user.id, roleId);
        if (!result) {
            toast.error('Erro ao atualizar função do usuário');
            setUsers(users.map(u => u.id === user.id ? { ...u, loading: false } : u));
            return;
        }
        setUsers(users.map(u => u.id === user.id ? { ...u, roleId: roleId, loading: false } : u));
        toast.success('Role do usuário atualizada com sucesso!')

    }

    const createUser = async () => {
        if (!newUser) return;
        if (!newUser.nusp?.trim() || newUser.roleId < 0 || !newUser.email?.trim()) {
            toast.error('Preencha todos os campos para criar um usuário');
            return;
        }
        const userId = await authService.createUser(newUser);
        if (userId === null) {
            toast.error('Erro ao criar usuário');
            return;
        }
        toast.success('Usuário criado com sucesso!');
        setCreatePopup(false);
        setNewUser({ nusp: '', roleId: -1, email: '' });
        fetchUsers();
    }

    return (
        <>
            {createPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Criar Usuário</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Número USP</label>
                            <TextInput
                                value={newUser.nusp}
                                onChange={(newValue) => setNewUser({ ...newUser, nusp: newValue })}
                                label="Digite o número USP"
                                className="w-full border border-gray-300 rounded-md p-2 focus:border focus:border-gray-300 h-12"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">E-mail</label>
                            <TextInput
                                value={newUser.email}
                                onChange={(newValue) => setNewUser({ ...newUser, email: newValue })}
                                label="Digite o e-mail"
                                className="w-full border border-gray-300 rounded-md p-2 focus:border focus:border-gray-300 h-12"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Função</label>
                            <DropDown
                                value={roleOptions.find(el => el.id === newUser.roleId) ?? null}
                                options={roleOptions}
                                onChange={(newValue) => setNewUser({ ...newUser, roleId: (newValue?.id ?? -1) as number })}
                                searchable={false}
                                clearable={false}
                                className="w-full border border-gray-300 rounded-md p-2 focus:border focus:border-gray-300 h-12"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setCreatePopup(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={createUser}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                            >
                                Criar Usuário
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col overflow-x-auto w-fit max-w-full bg-white rounded-2xl shadow p-3 py-6">
                <p className="text-2xl font-bold mb-4 ml-2">Usuários</p>
                <Table
                    tableHeaders={Object.values(tableHeaders)}
                    tableData={users.map((user) => (Object.keys(tableHeaders) as (keyof IUser)[]).map((field, j) => (
                        field !== 'roleId' ? <div key={j} className="text-center py-4">
                            {String(user[field])}
                        </div> :
                            (user.loading ? (
                                <CircularProgress className="text-slate-600 m-auto" key={j} />
                            ) : (
                                <DropDown
                                    key={j}
                                    className="text-center w-48 h-10 m-auto"
                                    value={roleOptions.find(el => el.id === user.roleId) ?? null}
                                    options={roleOptions}
                                    onChange={(newValue) => setNewRole(user, newValue?.id as number)}
                                    searchable={false}
                                    clearable={false}
                                />
                            ))
                    )))}
                />
                <div className="w-full flex justify-center items-end mt-2">
                    <div
                        className="bg-black rounded-lg flex justify-center items-center p-2 cursor-pointer h-10 group aspect-square"
                        title="Adicionar nova função"
                        onClick={() => setCreatePopup(true)}
                    >
                        <AddIcon className="text-white group-hover:scale-110 group-active:scale-95 duration-200 transition-transform ease-in-out h-6 w-6" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserTable;