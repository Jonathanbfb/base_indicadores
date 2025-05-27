import React from "react";
import Comercial from "./Comercial";
import { Typography } from "@mui/material";
import Administracao from "./Administracao";

const Geral: React.FC = () => {
  return (
    <div>
      <Typography
        variant="h4"
        gutterBottom
        marginTop="20px"
        style={{ textAlign: "center" }}
      >
        VISÃO GERAL
      </Typography>

      <Comercial setorId={5} />

      <Administracao setorId={4} />

    </div>
  );
};

export default Geral;
