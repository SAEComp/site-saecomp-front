import authService from "../../services/auth.service";
import { IUserData } from "../../interfaces/authService.interface";
import { useEffect, useState } from "react";
import DropDown from "../../components/Inputs/DropDown";
import CircularProgress from '@mui/material/CircularProgress';

interface IUser extends IUserData {
    loading?: boolean;
}

const UsersRoles = () => {
    const [tableData, setTableData] = useState<IUser[]>([]);
    const tableHeaders: Record<keyof IUserData, string> = {
        id: "ID",
        name: "Nome",
        email: "E-mail",
        nusp: "NUSP",
        created_at: "Data de Criação",
        active_sessions: "Sessões Ativas",
        role: "Função"
    }

    useEffect(() => {
        authService.listUsers().then((result) => {
            console.log(result)
            if (result) setTableData(result.map(el => ({
                ...el,
                created_at: new Date(el.created_at).toLocaleDateString("pt-BR"),
                nusp: el.nusp ?? '-'
            })));
            console.log(result)
        })
    }, []);

    const changeRole = async (userId: number, newRole: 'admin' | 'user') => {
        setTableData(prevData =>
            prevData.map(user =>
                user.id === userId ? { ...user, loading: true } : user
            )
        );
        const result = await authService.changeRole(userId, newRole);
        setTableData(prevData =>
            prevData.map(user =>
                user.id === userId ? { ...user, loading: false, role: result ? newRole : user.role } : user
            )
        );
    }

    return (
        <div className="flex flex-col flex-grow items-center justify-center bg-slate-100 w-screen p-5">
            <div className="flex w-fit md:w-full bg-white rounded-2xl shadow p-3 py-6">
                <div className="w-full">
                    <div className="grid grid-cols-7">
                        {Object.values(tableHeaders).map((header, i) => (
                            <div key={i} className="font-bold text-gray-700 text-center py-2">
                                {header}
                            </div>
                        ))}
                    </div>

                    <div className="h-[2px] w-full bg-black rounded my-1" />

                    {tableData.map((row, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-7 even:bg-slate-100 odd:bg-white hover:bg-slate-200 transition-colors duration-200 rounded my-1"
                        >
                            {(Object.keys(tableHeaders) as (keyof IUser)[]).map((field, j) => (
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
                                            onChange={(opt) => changeRole(row.id, opt?.label as 'admin' | 'user')}
                                            searchable={false}
                                            clearable={false}
                                        />
                                    ))
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}
export default UsersRoles;