import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
const CallCenter: React.FC = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("2025");
  const data2024 = 
  [
    {
      "indicadores": "Qtd. profissionais ativos no mês",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 10,"dez": 10,
      "acumulado": { "fieam": 20, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Qtd. de horas trabalhadas no setor",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 1600,"dez": 1360,
      "acumulado": { "fieam": 2960, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Total de ações executadas no mês",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-","dez": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Tempo médio por ação executada",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-","dez": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-" }
    }, 
    {
      "indicadores": "Atendimentos receptivos Telefone",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 2.563, "dez": 991,
      "acumulado": { "fieam": 3.554, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Atendimentos receptivos WhatsApp",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 14.250, "dez": 12.579,
      "acumulado": { "fieam": 26.829, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Atendimentos receptivos Instagram",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 728, "dez": 657,
      "acumulado": { "fieam": 1.385, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Atendimentos receptivos Facebook",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 95, "dez": 68,
      "acumulado": { "fieam": 163, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Atendimentos receptivos E-mail",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 22, "dez": 41,
      "acumulado": { "fieam": 63, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Atendimentos ativos Telefone",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 170, "dez": 0,
      "acumulado": { "fieam": 170, "sesi": "-", "senai": "-", "iel": "-" }
    },
    {
      "indicadores": "Propostas geradas - Qtd",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": 1828, "dez": 1856,
      "acumulado": { "fieam": "-", "sesi": 3.400, "senai": 283, "iel": 1 }
    },
    {
      "indicadores": "Propostas geradas - R$",
      "jan": "-", "fev": "-", "mar": "-", "abr": "-", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "R$ 3.738.588", "dez":  "R$ 892.825",
      "acumulado": { "fieam": "-", "sesi": " R$ 4.272.169", "senai": "R$ 275.844", "iel": "R$ 83.400" }
    }
  ]
  const data2025 = [
    
    {
      "indicadores": "Qtd. profissionais ativos no mês",
      "jan": 11, "fev": 10, "mar": "10", "abr": "10", "mai": "10", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"10" }
    },
    {
      "indicadores": "Qtd. de horas trabalhadas no setor",
      "jan": "1.936", "fev": "1.156", "mar": "1.428", "abr": "1.178", "mai": "680", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"6.378" }
    },
    {
      "indicadores": "Total de ações executadas no mês",
      "jan": "30.045", "fev": "25.945", "mar": "26.177", "abr": "21.653", "mai": "9.824", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"113.644" }
    },
   
    {
      "indicadores": "Tempo médio por ação executada",
      "jan": "4 min", "fev": "3 min", "mar": "3 min", "abr": "3 min", "mai": "3 min", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-",
      "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"3 min" }
    }, 
      {
        "indicadores": "Atendimentos receptivos Telefone",
        "jan": "2.548", "fev": "2.959", "mar": "1.356", "abr": "1.226", "mai": "850", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
        "acumulado": { "fieam": "360", "sesi": "7.105", "senai": "1.337", "iel": "137","total geral":"8.939" }
      },
      {
        "indicadores": "Atendimentos receptivos WhatsApp",
        "jan": "22.241", "fev": "17.985", "mar": "18.203", "abr": "15.013", "mai": "7.130", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
        "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"80.572" }
      },
      {
        "indicadores": "Atendimentos receptivos Instagram",
        "jan": 341, "fev": "2", "mar": "673", "abr": "580", "mai": "337", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
        "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"1.933" }
      },
      {
        "indicadores": "Atendimentos receptivos Facebook",
        "jan": 47, "fev": "2", "mar": "54", "abr": "64", "mai": "27", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
        "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"194" }
      },
      {
        "indicadores": "Atendimentos receptivos E-mail",
        "jan": 96, "fev": "2.907", "mar": "1.848", "abr": "2.093", "mai": "1.170", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
        "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"8.114" }
      },
      {
        "indicadores": "Atendimentos ativos Telefone",
        "jan": 1.144, "fev": 823, "mar": "744", "abr": "875", "mai": "310", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
        "acumulado": { "fieam": "-", "sesi": "-", "senai": "-", "iel": "-","total geral":"3.896" }
      },
      {
        "indicadores": "Propostas geradas - Qtd",
        "jan": "3.628", "fev": "1.267", "mar": "3.299", "abr": "1.802", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
        "acumulado": { "fieam": "2.383", "sesi": "6.385", "senai": "1.137", "iel": "91","total geral":"9.996" }
      },
      {
        "indicadores": "Propostas geradas - R$",
        "jan": "R$ 3.473.534", "fev": "R$ 1.087.296", "mar": "R$ 553.135", "abr": "R$ 227.958", "mai": "-", "jun": "-", "jul": "-", "ago": "-", "set": "-", "out": "-", "nov": "-", "dez": "-",
        "acumulado": { "fieam": "-", "sesi": " R$ 4.254.589", "senai": " R$ 1.419.014", "iel": " R$ 55.450","total geral":" R$ 5.729.055" }
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

  const handlePrint = () => {
    window.print();
  };

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
                Setor: Contact Center
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
        {["fieam", "sesi", "senai", "iel", "total geral"].map((key) => (
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
      <h4>Atualizado até 20/05/2025 às 8h</h4>
    </div>
  );
};
export default CallCenter;
