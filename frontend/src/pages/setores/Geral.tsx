import React from "react";
import Comercial from "./Comercial";
import CallCenter from "./CallCenter";
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

      <CallCenter setorId={2} />

      <Administracao setorId={4} />

    </div>
  );
};

export default Geral;
