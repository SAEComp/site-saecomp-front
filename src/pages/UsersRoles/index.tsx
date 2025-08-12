import authService from "../../services/auth.service";
import { useEffect, useState, useRef } from "react";
import { Role } from "../../schemas/auth/out/roles.schema";
import { Permission } from "../../schemas/auth/out/permissions.schema";
import UserTable from "../../components/UserRoles/UserTable";
import PermissionTable from "../../components/UserRoles/PermissionTable";
import RoleTable from "../../components/UserRoles/RoleTable";
import SaveIcon from '@mui/icons-material/Save';
import { toast } from "sonner";

export interface IPermission extends Permission {
    activeInRole?: boolean;
}

const UsersRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const originalRoles = useRef<Role[]>([]);
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const originalPermissions = useRef<IPermission[]>([]);
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    const [popupDiffs, setPopupDiffs] = useState<ReturnType<typeof checkDiffs> | null>(null);


    const fetchAll = async () => {
        const [_roles, _permissions] = await Promise.all([
            authService.listRoles(),
            authService.listPermissions()
        ]);
        if (_roles) {
            setRoles(_roles);
            originalRoles.current = _roles;
        }
        if (_permissions) {
            setPermissions(_permissions);
            originalPermissions.current = _permissions;
        }
    }

    useEffect(() => {
        fetchAll();
    }, []);

    const checkDiffs = () => {
        const diffs: string[] = [];
        const editedRoles: Role[] = [];
        const createdRoles: Role[] = [];
        const deletedRoles: number[] = [];
        const editedPermissions: IPermission[] = [];
        const createdPermissions: IPermission[] = [];
        const deletedPermissions: number[] = [];
        let showError = false;

        roles.forEach(role => {
            if (role.name.trim() === '') {
                toast.error(`Função não pode ter nome vazio.`);
                showError = true;
            }
            const originalRole = originalRoles.current.find(r => r.id === role.id);
            if (!originalRole) {
                diffs.push(`Função ${role.name} foi adicionada.`);
                createdRoles.push(role);
            } else {
                role.permissions.forEach(permId => {
                    const originalRolePerm = originalRoles.current.find(r => r.id === role.id)?.permissions.find(p => p === permId);
                    if (!originalRolePerm) {
                        const permName = permissions.find(p => p.id === permId)?.name || 'Desconhecida';
                        diffs.push(`Permissão ${permName} foi adicionada à função ${role.name}.`);
                        if (!editedRoles.some(r => r.id === role.id)) {
                            editedRoles.push(role);
                        }
                    }
                });
                originalRole.permissions.forEach(permId => {
                    if (!role.permissions.some(p => p === permId)) {
                        const permName = originalPermissions.current.find(p => p.id === permId)?.name || 'Desconhecida';
                        diffs.push(`Permissão ${permName} foi removida da função ${role.name}.`);
                        if (!editedRoles.some(r => r.id === role.id)) {
                            editedRoles.push(role);
                        }
                    }
                });
            }
        });
        originalRoles.current.forEach(originalRole => {
            if (!roles.some(r => r.id === originalRole.id)) {
                diffs.push(`Função ${originalRole.name} foi removida.`);
                deletedRoles.push(originalRole.id);
            }
        });

        permissions.forEach(perm => {
            if (perm.name.trim() === '') {
                toast.error(`Permissão não pode ter nome vazio.`);
                showError = true;
            }
            const originalPerm = originalPermissions.current.find(p => p.id === perm.id);
            if (!originalPerm) {
                diffs.push(`Permissão ${perm.name} foi adicionada.`);
                createdPermissions.push(perm);
            } else {
                if (originalPerm.name !== perm.name) {
                    diffs.push(`Permissão ${originalPerm.name} teve o nome alterado para ${perm.name}.`);
                    if (!editedPermissions.some(p => p.id === perm.id)) {
                        editedPermissions.push(perm);
                    }
                }
                if (originalPerm.description !== perm.description) {
                    diffs.push(`Permissão ${perm.name} teve a descrição alterada.`);
                    if (!editedPermissions.some(p => p.id === perm.id)) {
                        editedPermissions.push(perm);
                    }
                }
            }
        });
        originalPermissions.current.forEach(originalPerm => {
            if (!permissions.some(p => p.id === originalPerm.id)) {
                diffs.push(`Permissão ${originalPerm.name} foi removida.`);
                deletedPermissions.push(originalPerm.id);
            }
        });

        if (showError) return null;

        return {
            diffs,
            editedRoles,
            createdRoles,
            deletedRoles,
            editedPermissions,
            createdPermissions,
            deletedPermissions
        };
    }

    const loadPopup = () => {
        const diffs = checkDiffs();
        if (diffs === null) return;
        if (diffs.diffs.length === 0) {
            toast.info('Nenhuma alteração detectada.');
            return;
        }
        setPopupDiffs(diffs);
    }

    const saveAll = async () => {
        if (popupDiffs === null) return;
        const permCreationPromises = popupDiffs.createdPermissions.map(p =>
            authService.addPermissions({
                name: p.name,
                description: p.description
            })
        );
        const permEditPromises = popupDiffs.editedPermissions.map(p =>
            authService.editPermissions(p)
        );
        const permDeletionPromises = popupDiffs.deletedPermissions.map(id =>
            authService.removePermissions(id)
        );
        const permResolved = await Promise.all([
            ...permCreationPromises,
            ...permEditPromises,
            ...permDeletionPromises
        ]);
        const roleCreationPromises = popupDiffs.createdRoles.map(r =>
            authService.addRole(r.name)
        );
        const roleCResolved = await Promise.all(roleCreationPromises);
        const roleEditPromises = popupDiffs.editedRoles.map(r =>
            authService.editRole({
                id: r.id,
                name: r.name,
                permissionsId: r.permissions.filter((p): p is number => p !== null)
            })
        );
        const roleDeletionPromises = popupDiffs.deletedRoles.map(id =>
            authService.deleteRole(id)
        );
        const roleResolved = await Promise.all([
            ...roleEditPromises,
            ...roleDeletionPromises
        ]);
        if (permResolved.some(el => !el) || roleResolved.some(el => !el) || roleCResolved.some(el => !el)) {
            toast.error('Erro ao salvar alterações. Verifique os dados e tente novamente.');
            return;
        }
        toast.success('Alterações salvas com sucesso!');
        setPopupDiffs(null);
        await fetchAll();
        if (selectedRole !== null) {
            const selected = roles.find(r => r.id === selectedRole);
            if (selected) {
                setPermissions(curr => curr.map(perm => ({
                    ...perm,
                    activeInRole: selected ? selected.permissions.some(p => p === perm.id) : undefined
                })));
            }
            else {
                setSelectedRole(null);
            }
        }
    }

    const roleSelect = (selected: Role) => {
        setPermissions(curr => curr.map(perm => ({
            ...perm,
            activeInRole: selected && selectedRole !== selected.id ? selected.permissions.some(p => p === perm.id) : undefined
        })));
        if (selectedRole === selected.id) setSelectedRole(null);
        else setSelectedRole(selected.id);
    }


    return (
        <>
            {popupDiffs !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-5 shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Confirmação de Alterações</h2>
                        <p className="mb-4">As seguintes alterações serão aplicadas:</p>
                        <ul className="list-disc pl-5 mb-4">
                            {popupDiffs.diffs.map((diff, index) => (
                                <li key={index}>{diff}</li>
                            ))}
                        </ul>
                        <div className="flex justify-end gap-3">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={() => setPopupDiffs(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={saveAll}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-5 flex-grow items-center justify-center bg-slate-100 w-screen p-5">
                <div className="grid grid-cols-[auto_auto] gap-5">
                    <RoleTable
                        roles={roles}
                        setRoles={setRoles}
                        selectedRole={selectedRole}
                        roleSelect={roleSelect}
                    />
                    <PermissionTable
                        selectedRole={selectedRole}
                        permissions={permissions}
                        setPermissions={setPermissions}
                        setRoles={setRoles}
                    />

                    <div
                        className="bg-white rounded-2xl shadow p-3 py-6 flex col-span-2 justify-center"
                    >
                        <div
                            className="bg-black rounded-lg flex justify-center items-center p-2 cursor-pointer group aspect-square h-10"
                            title="Salvar"
                            onClick={() => loadPopup()}
                        >
                            <SaveIcon className="text-white group-hover:scale-110 group-active:scale-95 duration-200 transition-transform ease-in-out h-6 w-6" />
                        </div>
                    </div>
                </div>
                <UserTable
                    roles={roles}
                />
            </div>
        </>
    );
}
export default UsersRoles;