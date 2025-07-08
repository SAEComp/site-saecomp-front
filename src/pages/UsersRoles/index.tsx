import authService from "../../services/auth.service";
import { IUserData } from "../../interfaces/authService.interface";
import { useEffect, useState, useRef } from "react";
import DropDown from "../../components/Inputs/DropDown";
import CircularProgress from '@mui/material/CircularProgress';
import Table from "../../components/Table/Table";
import { Role } from "../../schemas/auth/out/roles.schema";
import { Permission } from "../../schemas/auth/out/permissions.schema";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Checkmark from "../../components/Inputs/Checkmark";
import TextInput from "../../components/Inputs/TextInput";

interface IUser extends IUserData {
    loading?: boolean;
}

interface IPermission extends Permission {
    activeInRole?: boolean;
}

const UsersRoles = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const originalRoles = useRef<Role[]>([]);
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const originalPermissions = useRef<IPermission[]>([]);
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
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

    const fetchAll = async () => {
        const [_users, _roles, _permissions] = await Promise.all([
            authService.listUsers(),
            authService.listRoles(),
            authService.listPermissions()
        ]);
        if (_users) {
            setUsers(_users.map(el => ({
                ...el,
                created_at: el.created_at.toLocaleDateString("pt-BR"),
                nusp: el.nusp ?? '-'
            })));
        }
        if (_roles) {
            setRoles(_roles);
            originalRoles.current = _roles;
        }
        if (_permissions) {
            setPermissions(_permissions);
            originalPermissions.current = _permissions;
        }
        console.log(_roles, _permissions);
    }

    useEffect(() => {
        fetchAll();
    }, []);

    const checkDiffs = (): string[] => {
        const diffs: string[] = [];
        roles.forEach(role => {
            const originalRole = originalRoles.current.find(r => r.id === role.id);
            if (!originalRole) {
                diffs.push(`Função ${role.name} foi adicionada.`);
            } else {
                role.permissions.forEach(perm => {
                    const originalPerm = originalRole.permissions.find(p => p.id === perm.id);
                    if (!originalPerm) {
                        diffs.push(`Permissão ${perm.name} foi adicionada à função ${role.name}.`);
                    }
                });
                originalRole.permissions.forEach(perm => {
                    if (!role.permissions.some(p => p.id === perm.id)) {
                        diffs.push(`Permissão ${perm.name} foi removida da função ${role.name}.`);
                    }
                });
            }
        });
        originalRoles.current.forEach(originalRole => {
            if (!roles.some(r => r.id === originalRole.id)) {
                diffs.push(`Função ${originalRole.name} foi removida.`);
            }
        });

        permissions.forEach(perm => {
            const originalPerm = originalPermissions.current.find(p => p.id === perm.id);
            if (!originalPerm) {
                diffs.push(`Permissão ${perm.name} foi adicionada.`);
            } else {
                if (originalPerm.name !== perm.name) {
                    diffs.push(`Permissão ${originalPerm.name} teve o nome alterado para ${perm.name}.`);
                }
                if (originalPerm.description !== perm.description) {
                    diffs.push(`Permissão ${perm.name} teve a descrição alterada.`);
                }
            }
        });
        originalPermissions.current.forEach(originalPerm => {
            if (!permissions.some(p => p.id === originalPerm.id)) {
                diffs.push(`Permissão ${originalPerm.name} foi removida.`);
            }
        });

        return diffs;
    }

    const roleSelect = (selected: Role) => {
        setPermissions(curr => curr.map(perm => ({
            ...perm,
            activeInRole: selected && selectedRole !== selected.id ? selected.permissions.some(p => p.id === perm.id) : undefined
        })));
        if (selectedRole === selected.id) setSelectedRole(null);
        else setSelectedRole(selected.id);
    }

    // const changeRole = async (userId: number, newRole: string) => {
    //     setTableData(prevData =>
    //         prevData.map(user =>
    //             user.id === userId ? { ...user, loading: true } : user
    //         )
    //     );
    //     const result = await authService.changeRole(userId, newRole);
    //     setTableData(prevData =>
    //         prevData.map(user =>
    //             user.id === userId ? { ...user, loading: false, role: result ? newRole : user.role } : user
    //         )
    //     );
    // }

    return (
        <div className="flex flex-col gap-5 flex-grow items-center justify-center bg-slate-100 w-screen p-5">
            <div className="flex gap-5">
                <div className="flex flex-col w-fit max-w-full bg-white rounded-2xl shadow p-3 py-6">
                    <p className="text-2xl font-bold mb-4 ml-2">Funções</p>
                    <div className="flex flex-col gap-3">
                        {roles.map((role, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center justify-center bg-green-600 text-white rounded-md px-16 py-1 font-semibold cursor-pointer
                                    transition-all duration-200 ease-in-out 
                                    ${selectedRole == role.id ? 'translate-x-8 rounded-e-none' : 'hover:translate-x-2'}
                                `}
                                onClick={() => roleSelect(role)}
                            >
                                <div className={`absolute left-2 hover:text-red-500 transition-colors duration-700 ease-in-out ${selectedRole == role.id ? 'block' : 'hidden'}`}>
                                    <DeleteOutlineIcon />
                                </div>
                                {role.name}
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex justify-center items-center mt-auto">
                        <div
                            className="bg-black rounded-lg flex justify-center items-center p-2 cursor-pointer group aspect-square"
                            title="Adicionar nova função"
                        >
                            <AddIcon className="text-white group-hover:scale-110 group-active:scale-95 duration-200 transition-transform ease-in-out h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div
                    className={`flex justify-center items-center p-1 shadow
                        ${selectedRole === null ? 'bg-white' : 'bg-[conic-gradient(from_0.75turn_at_50%_50%,_theme(colors.green.600),_90deg,_theme(colors.transparent),_270deg,_theme(colors.green.600))]'}
                         rounded-2xl`}
                >
                    <div className={`flex flex-col w-fit max-w-full bg-white rounded-2xl p-1 py-5 h-full

                    `}
                    >
                        <p className="text-2xl font-bold mb-4 ml-2">Permissões</p>
                        <Table
                            tableHeaders={['Nome', 'Descrição', 'Atribuido']}
                            tableData={permissions.map((perm) => [
                                (
                                    <TextInput
                                        key={perm.id}
                                        label='Nome'
                                        value={perm.name}
                                        onChange={(newValue) => {
                                            setPermissions(curr => curr.map(p => p.id === perm.id ? { ...p, name: newValue } : p));
                                        }}
                                        className="text-center shadow"
                                    />
                                ),
                                (
                                    <TextInput
                                        key={perm.id + '-desc'}
                                        label='Descrição'
                                        value={perm.description ?? ''}
                                        multiline
                                        rows={2}
                                        onChange={(newValue) => {
                                            setPermissions(curr => curr.map(p => p.id === perm.id ? { ...p, description: newValue } : p));
                                        }}
                                        className="shadow"
                                    />
                                ),
                                perm.activeInRole === undefined ? '' :
                                    (
                                        <Checkmark
                                            checked={perm.activeInRole}
                                        />
                                    )
                            ])}
                        />
                        <div className="w-full flex justify-center items-center mt-auto">
                            <div
                                className="bg-black rounded-lg flex justify-center items-center p-2 cursor-pointer group aspect-square"
                                title="Adicionar nova permissão"
                            >
                                <AddIcon className="text-white group-hover:scale-110 group-active:scale-95 duration-200 transition-transform ease-in-out h-6 w-6" />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
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
                                    options={['admin', 'user'].map(role => ({ label: role, id: role }))}
                                    onChange={(opt) => { }}
                                    searchable={false}
                                    clearable={false}
                                />
                            ))
                    )))}
                />
            </div>
        </div>

    );
}
export default UsersRoles;