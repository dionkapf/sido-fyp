import { createTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    
    primary: {
      main: "#ff6f00",
      light: "#ffa040",
      dark: "#c43e00",
    },
    secondary: {
      main: "#006699",
      light:"#4e94ca",
      dark: "#003c6b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
