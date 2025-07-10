import { Typography } from "@mui/material";
import useTitle from "../../../hooks/useTitle";

function Error403() {
  useTitle("Error 403");

  return <Typography variant="h1">403 Forbidden</Typography>;
}

export default Error403;
