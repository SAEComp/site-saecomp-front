import Checkmark from "../Inputs/Checkmark";
import TextInput from "../Inputs/TextInput";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Table from "../Table/Table";
import { IPermission } from "../../pages/UsersRoles";
import { Role } from "../../schemas/auth/out/roles.schema";


interface PermissionTableProps {
    selectedRole: number | null;
    permissions: IPermission[];
    setPermissions: React.Dispatch<React.SetStateAction<IPermission[]>>;
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

function PermissionTable({ selectedRole, permissions, setPermissions, setRoles }: PermissionTableProps) {

    const addPermission = () => {
        const newPermission: IPermission = {
            id: Math.min(0, ...permissions.map(p => p.id)) - 1,
            name: '',
            description: '',
            activeInRole: undefined,
        };
        setPermissions(curr => [...curr, newPermission]);
    }

    const deletePermission = (permission: IPermission) => {
        setPermissions(curr => curr.filter(p => p.id !== permission.id));
        setRoles(curr => curr.map(role => ({
            ...role,
            permissions: role.permissions.filter(p => p !== permission.id)
        })));
    }

    const changeRolePermission = (permission: IPermission, active: boolean) => {
        setPermissions(curr => curr.map(p => p.id === permission.id ? { ...p, activeInRole: active } : p));
        setRoles(curr => curr.map(role => ({
            ...role,
            permissions: role.id === selectedRole ? 
                 active ? [...role.permissions, permission.id] : role.permissions.filter(p => p !== permission.id) :
                role.permissions
        })));
    }


    return (
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
                    tableHeaders={['Nome', 'Descrição', 'Atribuido', '']}
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
                                    onChange={(active) => changeRolePermission(perm, active)}
                                />
                            )
                        ,
                        (
                            <div
                                className={`hover:text-red-500 transition-colors duration-700 ease-in-out w-16 cursor-pointer`}
                                onClick={() => deletePermission(perm)}
                            >
                                <DeleteOutlineIcon />
                            </div>
                        )
                    ])}
                />
                <div className="w-full flex justify-center items-center mt-2 flex-grow">
                    <div
                        className="bg-black rounded-lg flex justify-center items-center p-2 cursor-pointer group aspect-square"
                        title="Adicionar nova permissão"
                        onClick={addPermission}
                    >
                        <AddIcon className="text-white group-hover:scale-110 group-active:scale-95 duration-200 transition-transform ease-in-out h-6 w-6" />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PermissionTable;