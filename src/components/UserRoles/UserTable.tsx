import { useEffect, useState } from "react";
import DropDown, { IOption } from "../Inputs/DropDown";
import Table from "../Table/Table";
import { CircularProgress } from "@mui/material";
import { IUserData } from "../../interfaces/authService.interface";
import authService from "../../services/auth.service";
import { Role } from "../../schemas/auth/out/roles.schema";


interface IUser extends IUserData {
    loading?: boolean;
}

const tableHeaders: Record<keyof IUserData, string> = {
    id: "ID",
    name: "Nome",
    email: "E-mail",
    nusp: "NUSP",
    created_at: "Data de Criação",
    active_sessions: "Sessões Ativas",
    role: "Função",
    roleId: "Função ID"
}

interface UserTableProps {
    roles: Role[];
};

function UserTable({ roles }: UserTableProps) {
    const [users, setUsers] = useState<IUser[]>([]);
    const [roleOptions, setRoleOptions] = useState<IOption[]>([]);

    const fetchUsers = async () => {
        const _users = await authService.listUsers();
        if (_users) {
            setUsers(_users.map(el => ({
                ...el,
                created_at: el.created_at.toLocaleDateString("pt-BR"),
                nusp: el.nusp ?? '-'
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

        try {
            await authService.changeRole(user.id, roleId);
            setUsers(users.map(u => u.id === user.id ? { ...u, role: roleId, loading: false } : u));
        } catch (error) {
            console.error("Erro ao atualizar função do usuário:", error);
            setUsers(users.map(u => u.id === user.id ? { ...u, loading: false } : u));
        }
    }


    return (
        <div className="flex flex-col overflow-x-auto w-fit max-w-full bg-white rounded-2xl shadow p-3 py-6">
            <p className="text-2xl font-bold mb-4 ml-2">Usuários</p>
            <Table
                tableHeaders={Object.values(tableHeaders)}
                tableData={users.map((row) => (Object.keys(tableHeaders) as (keyof IUser)[]).map((field, j) => (
                    field !== 'role' ? <div key={j} className="text-center py-4">
                        {String(row[field])}
                    </div> :
                        (row.loading ? (
                            <CircularProgress className="text-slate-600 m-auto" key={j} />
                        ) : (
                            <DropDown
                                key={j}
                                className="text-center w-32 h-10 m-auto"
                                value={{ label: row.role, id: row.role }}
                                options={roleOptions}
                                onChange={(opt) => { }}
                                searchable={false}
                                clearable={false}
                            />
                        ))
                )))}
            />
        </div>
    )
}

export default UserTable;