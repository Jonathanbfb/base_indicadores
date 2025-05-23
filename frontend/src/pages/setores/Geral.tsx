import React from "react";
import Marketing from "./Marketing";
import Comercial from "./Comercial";
import CallCenter from "./CallCenter";
import Design from "./Design";
import { Typography } from "@mui/material";
import Administracao from "./Administracao";
import Mercado from "./Mercado";
import Promocoes from "./Promocoes";
import RedesSociais from "./RedesSociais";

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

      <Marketing setorId={10} />

      <Design setorId={3} />

      <Administracao setorId={4} />

      <Mercado setorId={9} />

      <Promocoes setorId={7} />

      <RedesSociais setorId={11} />
    </div>
  );
};

export default Geral;
