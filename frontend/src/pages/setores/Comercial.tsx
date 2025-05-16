import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import InfoIcon from "@mui/icons-material/Info";


const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

import {
  Paper,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Box,
  Tooltip,
} from "@mui/material";
import PowerBIModalComercial from "./modalBI/PowerBIModal";

const Comercial: React.FC = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("2025");

  const indicadoresInfo: Record<string, string> = {
    "Qtd. profissionais ativos no mês": "São todas as 9 Consultoras e Coordenadora Adriana Dabela",
    "Qtd. horas de trabalhadas no setor": "O cálculo é realizado pelo valor da jornada de trabalho multiplicado pelo dia útil do mês",
    "Total de ações executadas no mês": "É o somatório de todas as atividades realizadas incluindo (Nº de Visitas, Propostas e Pedidos)",
    "Tempo médio por ação executada": "O valor da média de ações executadas é o total de horas trabalhadas dividido pelo total de ações executadas",
    "Nº de visitas realizadas": "São contabilizadas todas as visitas cadastradas no sistema CRM chamado de Compromisso",
    "Propostas geradas - Qtd": "São contabilizadas todas as propostas geradas no sistema CRM com status Ganha, Rascunho, Fechado. *E estão em constante atualização devido negociação",
    "Propostas geradas - R$": "São somados os valores das propostas geradas no sistema CRM com status Ganha, Rascunho, Fechado. *E estão em constante atualização devido negociação",
    "Propostas Ativa - Qtd": "São somados os valores das propostas geradas no sistema CRM com status Ganha e Ativa",
    "Propostas Ativa - R$": "São somados os valores das propostas geradas no sistema CRM com status Ganha e Ativa",
    "Propostas Ganha - Qtd": "É a contagem de todos os “status” que foram realizados no período do mês vigente",
    "Propostas Ganha - R$": "É a soma de todos os “status” que foram realizados no período do mês vigente",
    "Pedidos faturados - Qtd": "É a contagem dos “status” [FATURADO e GANHA]  que foram realizados no período do mês vigente",
    "Pedidos faturados - R$": "É a soma dos “status” [FATURADO e GANHA]  que foram realizados no período do mês vigente",
    
  };
  const data2024 = 
[
{ indicadores: "Qtd. profissionais ativos no mês", jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-", jul: "-", ago: "-", set: "-", out: "-", nov: 10, dez: "9", acumulado: { fieam: "9,5", sesi: "-", senai: "-", iel: "-" } }, 
{ indicadores: "Qtd. horas de trabalhadas no setor", jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-", jul: "-", ago: "-", set: "-", out: "-", nov: "1.600", dez: "1.224", acumulado: { fieam: "2.824", sesi: "-", senai: "-", iel: "-" } }, 
{ indicadores: "Total de ações executadas no mês", jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-", jul: "-", ago: "-", set: "-", out: "-", nov: "560", dez: "591", acumulado: { fieam: "1.151", sesi: "-", senai: "-", iel: "-" } }, 
{ indicadores: "Tempo médio por ação executada", jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-", jul: "-", ago: "-", set: "-", out: "-", nov: "2h51min", dez: "2h03min", acumulado: { fieam: "2h27min", sesi: "-", senai: "-", iel: "-" } }, 
{ indicadores: "Nº de visitas realizadas", jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-", jul: "-", ago: "-", set: "-", out: "-", nov: 40, dez: 20, acumulado: { fieam: 60, sesi: "-", senai: "-", iel: "-" } }, 
{ indicadores: "Propostas Geradas - Qtd", jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-", jul: "-", ago: "-", set: "-", out: "-", nov: 144, dez: 128, acumulado: { fieam: "-", sesi: 168, senai: 62, iel: 42 } }, 
{ indicadores: "Propostas Geradas - R$", jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-", jul: "-", ago: "-", set: "-", out: "-", nov: "R$ 1.651.434", dez: "R$ 1.370.626", acumulado: { fieam: "-", sesi: "R$ 2.069.092", senai: "R$ 833.128", iel: "R$ 119.840" } }, 
{ indicadores: "Propostas Ativa - Qtd", jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-", jul: "-", ago: "-", set: "-", out: "-", nov: 18, dez: 10, acumulado: { fieam: "-", sesi: 8, senai: 20, iel: "-" } }, 
{ indicadores: "Propostas Ativa - R$", jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-", jul: "-", ago: "-", set: "-", out: "-", nov: " R$ 54.039", dez: " R$ 203.059", acumulado: { fieam: "-", sesi: "R$ 17.065", senai: "R$ 240.034", iel: "-" } }, 
//{ indicadores: "Propostas Ganha - Qtd", jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-", jul: "-", ago: "-", set: "-", out: "-", nov: 373, dez: 440, acumulado: { fieam: "-", sesi: 748, senai: 65, iel: "-" } }, 
//{ indicadores: "Propostas Ganha - R$", jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-", jul: "-", ago: "-", set: "-", out: "-", nov: "R$ 1.347.214", dez: " R$ 1.220.266", acumulado: { fieam: "-", sesi: "R$ 1.985.745", senai: "R$ 581.734", iel: "-" } }, 
{ indicadores: "Pedidos Faturados - Qtd", jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-", jul: "-", ago: "-", set: "-", out: "-", nov: 350, dez: 396, acumulado: { fieam: "-", sesi: 695, senai: 51, iel: "-" } }, 
{ indicadores: "Pedidos Faturados - R$", jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-", jul: "-", ago: "-", set: "-", out: "-", nov: "R$ 1.119.479", dez: "R$ 1.017.566", acumulado: { fieam: "-", sesi: "R$ 1.854.887", senai: "R$ 282.158", iel: "-" } } ];
  

const data2025 = 
[
  { "indicadores": "Qtd. profissionais ativos no mês", "jan": "10", "fev": "8", "mar": "9", "abr": "10", "mai": "10", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-", 
    "acumulado": { "fieam": "9", "sesi": "-", "senai": "-", "iel": "-", "total geral": "9" } }, 

  { "indicadores": "Qtd. horas de trabalhadas no setor", "jan": "1.760", "fev": "1.360", "mar": "1.512", "abr": "1.520", "mai": "800", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-", 
    "acumulado": { "fieam": "6.952", "sesi": "-", "senai": "-", "iel": "-", "total geral": "6.952" } }, 

  { "indicadores": "Total de ações executadas no mês", "jan": "557", "fev": "920", "mar": "887", "abr": "1283", "mai": "659", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-", 
    "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-", "total geral": "4306" } }, 

  { "indicadores": "Tempo médio por ação executada", "jan": "3h09min", "fev": "1h28min", "mar": "1h42min", "abr": "1h11min", "mai": "1h13min", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-", 
    "acumulado": { "fieam": "1h45min", "sesi": "-", "senai": "-", "iel": "-", "total geral": "1h45min" } },

  { "indicadores": "Nº de visitas realizadas", "jan": "166", "fev": "130", "mar": "156", "abr": "206", "mai": "29", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-", 
    "acumulado": { "fieam": "687", "sesi": "-", "senai": "-", "iel": "-", "total geral": "687" } }, 

  { "indicadores": "Propostas geradas - Qtd", "jan": "200", "fev": "258", "mar": "282", "abr": "357", "mai": "157", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-", 
    "acumulado": { "fieam": "-", "sesi": "778", "senai": "251", "iel": "225", "total geral": "1254" } }, 

  { "indicadores": "Propostas geradas - R$", "jan": "R$ 880.464,79", "fev": "R$ 1.268.131,54", "mar": "R$ 1.796.558,82", "abr": "R$ 2.688.213,76", "mai": "R$ 1.023.457,01", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-", 
    "acumulado": { "fieam": "R$ 4.221.248,98", "sesi": "R$ 2.570.622,04", "senai": "R$ 864.954,90", "iel": "-", "total geral": "R$ 7.656.825,92" } }, 

  { "indicadores": "Propostas Ativa - Qtd", "jan": "59", "fev": "78", "mar": "93", "abr": "115", "mai": "73", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-", 
    "acumulado": { "fieam": "287", "sesi": "29", "senai": "102", "iel": "-", "total geral": "418" } },

  { "indicadores": "Propostas Ativa - R$", "jan": "R$ 949.914,89", "fev": "R$ 258.085,76", "mar": "R$ 151.332,85", "abr": "R$ 470.469,32", "mai": "R$ 273.370,19", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-", 
    "acumulado": { "fieam": "R$ 1.798.353,35", "sesi": "R$ 129.694,16", "senai": "R$ 175.125,50", "iel": "-", "total geral": "R$ 2.103.173,01" } }, 

  { "indicadores": "Propostas Ganha - Qtd", "jan": "14", "fev": "47", "mar": "40", "abr": "156", "mai": "58", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-", 
    "acumulado": { "fieam": "236", "sesi": "78", "senai": "1", "iel": "-", "total geral": "315" } },

  { "indicadores": "Propostas Ganha - R$", "jan": "R$ 65.541,87", "fev": "R$ 363.526,10", "mar": "R$ 194.845,35", "abr": "R$ 660.042,35", "mai": "R$ 213.532,67", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-", 
    "acumulado": { "fieam": "R$ 1.117.068,46", "sesi": "R$ 377.315,88", "senai": "R$ 3.104,00", "iel": "-", "total geral": "R$ 1.497.488,34" } },

  { "indicadores": "Pedidos faturados - Qtd", "jan": "118", "fev": "407", "mar": "316", "abr": "449", "mai": "342", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-", 
    "acumulado": { "fieam": "1.519", "sesi": "113", "senai": "-", "iel": "-", "total geral": "1.632" } },

  { "indicadores": "Pedidos faturados - R$", "jan": "R$ 953.033,88", "fev": "R$ 2.498.959,81", "mar": "R$ 1.104.218,49", "abr": "R$ 1.888.223,85", "mai": "R$ 1.457.979,83", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-", 
    "acumulado": { "fieam": "R$ 6.283.735", "sesi": "R$ 1.618.681,12", "senai": "-", "iel": "-", "total geral": "R$ 7.902.415,86" } }
]
      
    const categorizeIndicator = (indicator: string): string => {
    const pagoIndicators = [
      "Qtd. profissionais ativos no mês",
    ];
  
    const emailIndicators = [
     "Pedidos faturados - R$",
    ];
   const siteIndicators = ["Site - Visitantes únicos"];
  
    if (pagoIndicators.includes(indicator)) return "RH";
    if (emailIndicators.includes(indicator)) return "PJ";
    if (siteIndicators.includes(indicator)) return "Site";
  
    return ".";
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedYear(newValue);
  };
  const handlePrint = () => {
    window.print();
  };
  const data = selectedYear === "2025" ? data2025 : data2024;
  const groupedData = data.reduce((acc, row) => {
    const category = categorizeIndicator(row.indicadores);
    if (!acc[category]) acc[category] = [];
    acc[category].push(row);
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" }}>
      
      <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <BootstrapTooltip title="Setor Comercial - Supervisionado pela Coordenadora Adriana Dabela ">
                  <Typography variant="h4" gutterBottom>
                Setor: Comercial
              </Typography>
              </BootstrapTooltip>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Tooltip title="Voltar para o menu principal">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/indicadores")}
                    style={{ marginBottom: "20px" }}
                  >
                    Voltar
                  </Button>
                </Tooltip>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={handlePrint}
                  style={{ marginBottom: "20px", marginLeft: "10px" }}
                >
                  Imprimir
                </Button>
                <PowerBIModalComercial></PowerBIModalComercial>
              </div>
            </div>
          </div>
       <Box sx={{ width: "100%", marginBottom: "20px" }}>
        <Tabs
          value={selectedYear}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="Tabs de anos"
        >
          <Tab value="2025" label="2025" />
          
          <Tab value="2024" label="2024" />

        </Tabs>
      </Box>
      <Paper sx={{ marginTop: "20px", overflowX: "auto" }}>
      <TableContainer sx={{ minWidth: "900px", width: "100%" }}>
      <Table size="small" sx={{ width: "max-content", minWidth: "100%" }}>
          <TableHead>
  <TableRow>

    <TableCell
      rowSpan={2}
      style={{
        fontWeight: "bold",
        backgroundColor: "#ADD8E6",
        padding: "2px",
        textAlign: "center",
        minWidth: "180px",
        maxWidth: "180px",
        width: "180px",
      
      }}
    >
      Indicadores
    </TableCell>
    {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map(
      (month, index) => (
        <TableCell
          key={index}
          rowSpan={2}
          align="center"
          style={{
            fontWeight: "bold",
            backgroundColor: "#ADD8E6",
            padding: "8px",
            minWidth: "60px",
          }}
        >
          {month}
        </TableCell>
      )
    )}
    <TableCell
      colSpan={5}
      align="center"
      style={{
        fontWeight: "bold",
        backgroundColor: "#4682B4",
        color: "white",
        padding: "8px",
      }}
    >
      Acumulado
    </TableCell>
  </TableRow>
  <TableRow>
    {["FIEAM", "SESI", "SENAI", "IEL","TOTAL - MÉDIA"].map((name, index) => (
      <TableCell
        key={`acumulado-${index}`}
        align="center"
        style={{
          fontWeight: "bold",
          backgroundColor: "#4682B4",
          color: "white",
          padding: "8px",
        }}
      >
        {name}
      </TableCell>
    ))}
  </TableRow>
</TableHead>

<TableBody>
  {Object.entries(groupedData).map(([category, rows]) => (
    rows.map((row, rowIndex) => (
      
      <TableRow
        key={`${category}-${rowIndex}`}
        sx={{
          "& .MuiTableCell-root": {
            padding: "4px 6px",
            lineHeight: "1",
          },
          height: "50px",
          backgroundColor: rowIndex % 2 === 0 ? "#F5F5F5" : "#FFFFFF", // Alterna entre duas cores
        }}
      >
        
        <TableCell
        style={{
          fontWeight: "bold",
          verticalAlign: "middle",
          textAlign: "left", 
          minWidth: "180px",
          maxWidth: "180px",
          width: "180px",
          padding: "2px",
        }}
        >
             <BootstrapTooltip title={indicadoresInfo[row.indicadores] || "Sem descrição disponível"} arrow>
             <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                {row.indicadores}
                </div>
              </BootstrapTooltip>
            
        
        </TableCell>
        {["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"].map((month) => (
          <TableCell align="center" key={month}>
            {typeof row[month] === "object"
              ? Object.entries(row[month])
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", ")
              : row[month] !== undefined
              ? row[month]
              : "-"}
          </TableCell>
        ))}
        {["fieam", "sesi", "senai", "iel","total geral"].map((key) => (
          <TableCell align="center" key={key}>
            {row.acumulado && row.acumulado[key] !== undefined ? row.acumulado[key] : "-"}
          </TableCell>
        ))}
      </TableRow>
    ))
  ))}
</TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <h4>Atualizado até 16/05/2025 às 15h</h4>
    </div>
  );
};
export default Comercial;
