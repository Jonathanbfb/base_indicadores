import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {  Paper,  Button,  Typography,  Table,  TableBody,  TableCell,  TableContainer,  TableHead,  TableRow,  Tabs,  Tab,  Box,  Tooltip,} from "@mui/material";

const Administracao: React.FC = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("2025");

  const handlePrint = () => {
    window.print();
  };

  const data2024 = 
  [
    {
      "indicadores": "Qtd. profissionais ativos no mês",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 5,"dez": 5,
      "acumulado": { "fieam": 5, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Qtd. de horas trabalhadas no setor",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 760,"dez": 646,
      "acumulado": { "fieam":1.406, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Total de ações executadas no mês",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 230,"dez": 362,
      "acumulado": { "fieam": 592, "sesi": "-", "senai": "-", "iel": "-" }
    },
   
    {
      "indicadores": "Tempo médio por ação executada",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "3h10min","dez": "1h46min",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-" }
    }, 

    {
      "indicadores": "Número de demandas de ajustes de ponto",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 20, "dez": 62,
      "acumulado": { "fieam": 82, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Apontamentos consolidados (% de conclusão)",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 16, "dez": 16,
      "acumulado": { "fieam": 32, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Número de medições",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 15, "dez": 15,
      "acumulado": { "fieam": 30, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Número de conferencia de notas fiscais",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 30, "dez": 32,
      "acumulado": { "fieam": 62, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Número de cadastros CRM/Genesis",
      "jan": 283, "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 111, "dez": 172,
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Número de contratos renovados",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "12", "dez": "-",
      "acumulado": { "fieam": 12, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Número de adesões",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 26, "dez": 65,
      "acumulado": { "fieam": "-", "sesi": 65, "senai": 3, "iel": 23 }
    }]
  const data2025 = [
    
    {
      "indicadores": "Qtd. profissionais ativos no mês",
      "jan": 6, "fev": 5, "mar": "5", "abr": "5", "mai": "4", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"5" }
    },
    {
      "indicadores": "Qtd. de horas trabalhadas no setor",
      "jan": "1.012", "fev": "874", "mar": "798", "abr": "760", "mai": "480", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"3.924" }
    },
    {
      "indicadores": "Total de ações executadas no mês",
      "jan": "1.603", "fev": "443", "mar": "798", "abr": "893", "mai": "622", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"4.359" }
    },
   
    {
      "indicadores": "Tempo médio por ação executada",
      "jan": "31min", "fev": "39min", "mar": "1h19min", "abr": "51min", "mai": "51min", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"50min" }
    }, 
    {
      "indicadores": "Número de demandas de ajustes de ponto",
      "jan": "149", "fev": "81", "mar": "78", "abr": "174", "mai": "97", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"579" }
    },
    {
      "indicadores": "Apontamentos consolidados (% de conclusão)",
      "jan": "11", "fev": "11", "mar": "11", "abr": "11", "mai": "7", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"51" }
    },
    {
      "indicadores": "Número de medições",
      "jan": "33", "fev": "34", "mar": "30", "abr": "32", "mai": "15", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
      "acumulado": { "fieam": 11, "sesi": 84, "senai": 40, "iel": 9,"total geral":"144" }
    },
    {
      "indicadores": "Número de conferencia de notas fiscais",
      "jan": "17", "fev": "19", "mar": "15", "abr": "17", "mai": "16", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
      "acumulado": { "fieam": "32", "sesi": "29", "senai": "19", "iel": "4","total geral":"84" }
    },
    {
      "indicadores": "Número de cadastros CRM/Genesis",
      "jan": "1.329", "fev": "237", "mar": "411", "abr": "589", "mai": "417", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"2.983" }
    },
    {
      "indicadores": "Número de contratos renovados",
      "jan": "38", "fev": "26", "mar": "13", "abr": "13", "mai": "18", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"108" }
    },
    {
      "indicadores": "Número de adesões",
      "jan": 26, "fev": "35", "mar": "48", "abr": "57", "mai": "52", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
      "acumulado": { "fieam": "-", "sesi": "103", "senai": "36", "iel": "79","total geral":"218" }
    }
  ]
    
  const categorizeIndicator = (indicator: string): string => {
    const pagoIndicators = [
      "Número de anúncios",
      "Alcance total",
      "Impressões (ADS)",
      "Cliques no anúncio",
      "CTR (Click-Through Rate)",
      "CPC (Custo por Clique)",
      "COM (Custo por Mil Impressões)",
      "Conversões",
      "Taxa de conversão (%)",
      "CPA (Custo por Aquisição)",
    ];
  
    const emailIndicators = [
      
     "Qtd de E-mails enviados",
      "Taxa de abertura de e-mail",
      
    ];
   const siteIndicators = ["Site - Visitantes únicos"];
  
    if (pagoIndicators.includes(indicator)) return "Pago";
    if (emailIndicators.includes(indicator)) return "Email";
    if (siteIndicators.includes(indicator)) return "Site";
  
    return "";
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedYear(newValue);
  };
  const data = selectedYear === "2024" ? data2024 : data2025;
  const groupedData = data.reduce((acc, row) => {
    const category = categorizeIndicator(row.indicadores);
    if (!acc[category]) acc[category] = [];
    acc[category].push(row);
    return acc;
  }, {});

  return (
    
    <div style={{ padding: "20px" }}>
     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h4" gutterBottom>
                Setor: Administrativo
              </Typography>
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
          <Tab value="2024" label="2024" />
          <Tab value="2025" label="2025" />
        </Tabs>
      </Box>
      <Paper sx={{ marginTop: "20px" }}>
        <TableContainer>
          <Table>
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
        >{row.indicadores}</TableCell>
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
      <h4>Atualizado até 20/05/2025 às 15h</h4>
    </div>
  );
};
export default Administracao;