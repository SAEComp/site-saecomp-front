import { Role } from "../../schemas/auth/out/roles.schema";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import TextInput from "../Inputs/TextInput";

interface RoleTableProps {
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
    selectedRole: number | null;
    roleSelect: (role: Role) => void;
};

function RoleTable({ roles, setRoles, selectedRole, roleSelect }: RoleTableProps) {

    const addRole = () => {
        const newRole: Role = {
            id: Math.min(0, ...roles.map(r => r.id)) - 1,
            name: '',
            permissions: [],
        };
        setRoles(curr => [...curr, newRole]);
    }

    const deleteRole = (role: Role) => {
        setRoles(curr => curr.filter(r => r.id !== role.id));
    }

    return (
        <div className="flex flex-col bg-white rounded-2xl shadow p-3 py-6">
            <div className="flex justify-between">
                <p className="text-2xl font-bold mb-4 ml-2">Funções</p>
            </div>
            <div className="flex flex-col gap-3">
                {roles.map((role, index) => (
                    <div
                        key={index}
                        className={`relative flex items-center justify-center bg-green-600 text-white rounded-md px-16 py-1 font-semibold cursor-pointer
                                    transition-all duration-200 ease-in-out h-12 md:h-8
                                    ${selectedRole == role.id ? 'scale-x-[1.03] max-md:shadow-inner max-md:bg-green-700 md:translate-x-8 md:rounded-e-none' : 'hover:scale-x-[1.02] md:hover:translate-x-2'}
                                `}
                        onClick={() => roleSelect(role)}
                    >
                        <div
                            className={`absolute left-2 hover:text-red-500 transition-colors duration-700 ease-in-out ${selectedRole == role.id ? 'block' : 'hidden'}`}
                            onClick={() => deleteRole(role)}
                        >
                            <DeleteOutlineIcon />
                        </div>
                        {role.id < 0 ? (
                            <TextInput
                                label="Nome da função"
                                value={role.name}
                                onChange={(newValue) => {
                                    setRoles(curr => curr.map(r => r.id === role.id ? { ...r, name: newValue } : r));
                                }}
                                onClick={e => e.stopPropagation()}
                                className="text-center font-bold text-white placeholder-slate-200 bg-transparent"
                            />
                        ) : (
                            <span className="text-center text-white select-none font-inter">{role.name}</span>
                        )}
                    </div>
                ))}
            </div>
            <div className="w-full flex justify-center items-end mt-2 flex-grow">
                <div
                    className="bg-black rounded-lg flex justify-center items-center p-2 cursor-pointer group aspect-square"
                    title="Adicionar nova função"
                    onClick={addRole}
                >
                    <AddIcon className="text-white group-hover:scale-110 group-active:scale-95 duration-200 transition-transform ease-in-out h-6 w-6" />
                </div>
            </div>
        </div>
    )
}

export default RoleTable;