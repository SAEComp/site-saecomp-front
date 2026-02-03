
interface TableProps {
    tableHeaders: string[];
    tableData: (string | JSX.Element)[][];
}

function Table({ tableHeaders, tableData }: TableProps) {
    return (
        <div className="overflow-x-scroll max-w-screen">
            <div className="w-full">
                <table className="table-auto border-collapse">
                    <thead>
                        <tr>
                            {tableHeaders.map(h => (
                                <th
                                    key={h}
                                    className="px-4 py-2 text-center font-bold text-gray-700 border-b select-none"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {tableData.map((row, i) => (
                            <tr
                                key={i}
                                className="even:bg-slate-100 odd:bg-white hover:bg-slate-200 transition-colors"
                            >
                                {row.map((field, j) => (
                                    <td key={j} className="px-4 py-3 text-center">
                                        {field}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


export default Table;