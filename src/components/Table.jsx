export default function Table({
  columns = [],
  data = [],
  loading = false,
  error = null,
  emptyMessage = "No data found",
  renderRow, // callback: (item) => <tr>...</tr>
}) {
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto bg-white shadow rounded-xl">
      <table className="w-full table-auto text-xs sm:text-sm md:text-base">
        <thead className="bg-indigo-100 text-indigo-700 font-semibold rounded-t-xl">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-2 sm:px-4 py-2 ${col.align || "text-left"}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data?.map((item, idx) => renderRow(item, idx))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 odd:bg-white even:bg-gray-100"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
