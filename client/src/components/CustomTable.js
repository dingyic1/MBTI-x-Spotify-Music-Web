import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import "../styles/stylesheet.css";

export default function CustomTable({
  route,
  columns,
  defaultPageSize,
  rowsPerPageOptions,
}) {
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1); // 1 indexed
  const [pageSize, setPageSize] = useState(defaultPageSize ?? 10);

  // Now notice the dependency array contains route, page, pageSize, since we
  // need to re-fetch the data if any of these values change
  useEffect(() => {
    fetch(`${route}?page=${page}&page_size=${pageSize}`)
      .then((res) => res.json())
      .then((resJson) => setData(resJson));
  }, [route, page, pageSize]);

  const handleChangePage = (e, newPage) => {
    // Can always go to previous page (TablePagination prevents negative pages)
    // but only fetch next page if we haven't reached the end (currently have full page of data)
    if (newPage < page || data.length === pageSize) {
      // Note that we set newPage + 1 since we store as 1 indexed but the default pagination gives newPage as 0 indexed
      setPage(newPage + 1);
    }
  };

  const handleChangePageSize = (e) => {
    const newPageSize = e.target.value;
    setPageSize(newPageSize);
    setPage(1);
  };

  const defaultRenderCell = (col, row) => {
    return <div>{row[col.field]}</div>;
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.headerName}
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  fontFamily: "Sigmar",
                }}
              >
                {col.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell
                  key={col.headerName}
                  sx={{ fontSize: "16px", fontFamily: "Sigmar" }}
                >
                  {col.renderCell
                    ? col.renderCell(row)
                    : defaultRenderCell(col, row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions ?? [5, 10, 25]}
          count={-1}
          rowsPerPage={pageSize}
          page={page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangePageSize}
        />
      </Table>
    </TableContainer>
  );
}
