import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DashboardLayout from "../components/dashboard-layout";
import TextField from "@material-ui/core/TextField";
import styles from "../styles/Hello.module.scss";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}))(TableCell);

export default function Admin({ list, title, description }) {
  const columns = [];
  const colNames = [];
  const indices = [...Array(list.length).keys()];
  console.log(indices);
  for (let key in list[0]) {
    colNames.push(key);
    if (key === "id") key = "ID";
    let newKey = key[0].toUpperCase() + key.slice(1);
    newKey = newKey.replace(/_/g, " ");
    columns.push(newKey);
  }
  return (
    <DashboardLayout title={title}>
      <main className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.subtitle}>
          <Paper variant="outlined" className={styles.count}>
            Returned a total of {list.length} {description}
          </Paper>
          <TextField id="record-search" label="Search" type="search" />
        </div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((column) => {
                  if (column === "ID")
                    return (
                      <StyledTableCell align="left">{column}</StyledTableCell>
                    );
                  else
                    return (
                      <StyledTableCell align="right">{column}</StyledTableCell>
                    );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((row) => (
                <TableRow key={row.id}>
                  {colNames.map((column) => {
                    if (column === "id")
                      return (
                        <TableCell align="left" component="th" scope="row">
                          {list.findIndex((item) => item.id === row.id) + 1}
                        </TableCell>
                      );
                    else
                      return <TableCell align="right">{row[column]}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </DashboardLayout>
  );
}
