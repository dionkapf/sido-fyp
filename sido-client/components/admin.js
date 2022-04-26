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
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}))(TableCell);

export default function Admin({ list, title, description, options }) {
  const columns = Object.keys(list[0]);
  const classes = useStyles();
  console.log("columns", columns);
  return (
    <DashboardLayout title={title} sidebarOptions={options}>
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
                  if (column === "S/N")
                    return (
                      <StyledTableCell align="left" key={column}>
                        {column}
                      </StyledTableCell>
                    );
                  else if (column === "Actions")
                    return (
                      <StyledTableCell
                        align="left"
                        key={column}
                      ></StyledTableCell>
                    );
                  else
                    return (
                      <StyledTableCell align="right" key={column}>
                        {column}
                      </StyledTableCell>
                    );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((row) => (
                <TableRow key={row["S/N"]}>
                  {columns.map((column) => {
                    switch (column) {
                      case "S/N":
                        return (
                          <TableCell
                            align="left"
                            component="th"
                            scope="row"
                            key={column}
                          >
                            {row[column]}
                          </TableCell>
                        );
                      case "Phone":
                        const raw_phone = row[column];
                        const phone_number =
                          raw_phone[0] == "0" ? (
                            <a href={`tel:+255${raw_phone.slice(1)}`}>
                              {"+255 " +
                                raw_phone
                                  .slice(1)
                                  .match(/.{1,3}/g)
                                  .join(" ")}
                            </a>
                          ) : (
                            <a href={`tel:${raw_phone}`}>
                              {raw_phone.match(/.{1,3}/g).join(" ")}
                            </a>
                          );

                        return (
                          <TableCell align="right" key={column}>
                            {phone_number}
                          </TableCell>
                        );
                      case "Email":
                        return (
                          <TableCell align="right" key={column}>
                            <a href={`mailto:${row[column]}`}>{row[column]}</a>
                          </TableCell>
                        );
                      case "Actions":
                        const actions = row[column];
                        return (
                          <TableCell
                            align="right"
                            className={classes.root}
                            key={column}
                          >
                            <ButtonGroup
                              variant="text"
                              color="primary"
                              aria-label="text primary button group"
                            >
                              {actions.map((action) => (
                                <Button key={action.name} href={action.url}>
                                  {action.name}
                                </Button>
                              ))}
                            </ButtonGroup>
                          </TableCell>
                        );
                      default:
                        return (
                          <TableCell align="right" key={column}>
                            {row[column]}
                          </TableCell>
                        );
                    }
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
