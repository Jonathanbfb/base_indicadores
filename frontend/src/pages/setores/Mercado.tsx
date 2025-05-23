import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import api from "../../services/api";

// Helper para converter número de mês (1–12) em campo de objeto “jan”, “fev” etc
const MES_KEYS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez"
];

const hoje = new Date();

// Converte horas decimais para “Xh:Ymin”
const decimalParaHoraMin = (decimalHoras: number): string => {
  const horasInteiras = Math.floor(decimalHoras);
  const minutos = Math.round((decimalHoras - horasInteiras) * 60);
  return `${horasInteiras}h:${minutos}min`;
};

// Converte string “HH:MM” para decimal
const hhmmParaDecimal = (hhmm: string): number => {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  return isNaN(h) || isNaN(m) ? 0 : h + m / 60;
};

// Converte decimal para “Hh:Mmin”
const decimalParaHhmm = (decimal: number): string => {
  const horas = Math.floor(decimal);
  const minutos = Math.round((decimal - horas) * 60);
  return `${horas}h:${minutos}min`;
};

// Converte string “HH:MM” para “Hh:Mmin”
const hhmmParaFormato = (hhmm: string): string => {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  return isNaN(h) || isNaN(m) ? "-" : `${h}h:${m}min`;
};

interface MercadoProps {
  setorId: number
}

const Mercado: React.FC<MercadoProps> = ({setorId: propSetorId}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setorId: stateSetorId = null } = (location.state || {}) as { setorId?: number | null };
  const setorId = propSetorId ?? stateSetorId;
  const [selectedYear, setSelectedYear] = useState("2025");
  const [rows, setRows] = useState([]); // vetor de objetos já formatados para a tabela
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedYear(newValue);
  };

  useEffect(() => {
    const fetchIndicadores = async () => {
      setLoading(true);
      try {
        // 1) Chama o endpoint de resumo de jornadas para todos os meses do ano
        const resumoRes = await api.get(
          `/jornadas/retornar-resumo/${setorId}?ano=${selectedYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const resumoData = resumoRes.data;

        // 2) Prepara as duas linhas fixas: profissionais e horas, preenchendo conforme `resumoPorMes`
        const linhaProfissionais: any = {
          indicadores: "",
          jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-",
          jul: "-", ago: "-", set: "-", out: "-", nov: "-", dez: "-",
          acumulado: { fieam: "-", sesi: "-", senai: "-", iel: "-", "total geral": "-" }
        };
        const linhaHoras: any = {
          indicadores: "",
          jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-",
          jul: "-", ago: "-", set: "-", out: "-", nov: "-", dez: "-",
          acumulado: { fieam: "-", sesi: "-", senai: "-", iel: "-", "total geral": "-" }
        };

        // Popula nome de indicadores padrão (assume que todos os objetos em resumoPorMes têm os mesmos indicadores)
        if (resumoData.resumoPorMes.length > 0) {
          linhaProfissionais.indicadores = resumoData.resumoPorMes[0].indicadorProfissionais;
          linhaHoras.indicadores = resumoData.resumoPorMes[0].indicadorHoras;
        }

        // Variáveis para acumular
        let somaProfissionaisTotal = 0;
        let somaHorasTotalDecimal = 0;

        // Para cada mês do resumoPorMes, preenche o campo daquele mês e acumula
        resumoData.resumoPorMes.forEach((item: any) => {
          const idx = item.mes - 1;
          if (idx >= 0 && idx < 12) {
            // Profissionais
            linhaProfissionais[MES_KEYS[idx]] = item.colaboradores;
            somaProfissionaisTotal += Number(item.colaboradores) || 0;

            // Horas
            linhaHoras[MES_KEYS[idx]] = hhmmParaFormato(item.horasTrabalhadas);
            somaHorasTotalDecimal += hhmmParaDecimal(item.horasTrabalhadas);
          }
        });

        // 3) Chama o endpoint de valores por instituição para os demais indicadores
        const valoresRes = await api.get(`itens/valor/${setorId}/?ano=${selectedYear}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const indicadoresFromApi = valoresRes.data.indicadores;

        // 4) Mapeia cada indicador retornado para o formato “Row”
        const outrasRows = indicadoresFromApi.map((indicador: any) => {
          const linhaBase: any = {
            indicadores: indicador.nome,
            jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-",
            jul: "-", ago: "-", set: "-", out: "-", nov: "-", dez: "-",
            acumulado: { fieam: "-", sesi: "-", senai: "-", iel: "-", "total geral": "-" }
          };

          // Preenche o valor de FIEAM (instituicao_id = 1) em cada mês
          indicador.valores.forEach((v: any) => {
            if (v.instituicao_id === 1) {
              const mesIndex = v.mes - 1;
              if (mesIndex >= 0 && mesIndex < 12) {
                linhaBase[MES_KEYS[mesIndex]] = v.valor;
              }
            }
          });

          // Soma valores por instituição para acumulado
          const somaPorInstituicao = (instId: number) => {
            return indicador.valores
              .filter((v: any) => v.instituicao_id === instId)
              .reduce((acc: number, cur: any) => {
                const numero = Number(cur.valor.toString().replace(/\D/g, ""));
                return acc + (isNaN(numero) ? 0 : numero);
              }, 0);
          };

          const somaFieam = somaPorInstituicao(1);
          const somaSesi = somaPorInstituicao(2);
          const somaSenai = somaPorInstituicao(3);
          const somaIel = somaPorInstituicao(4);
          const somaTotal = somaFieam + somaSesi + somaSenai + somaIel;

          linhaBase.acumulado.fieam = somaFieam > 0 ? somaFieam : "-";
          linhaBase.acumulado.sesi = somaSesi > 0 ? somaSesi : "-";
          linhaBase.acumulado.senai = somaSenai > 0 ? somaSenai : "-";
          linhaBase.acumulado.iel = somaIel > 0 ? somaIel : "-";
          linhaBase.acumulado["total geral"] = somaTotal > 0 ? somaTotal : "-";

          return { ...linhaBase, atividade: indicador.atividade };
        });

        // 5) Para cada mês, soma valores de atividades apenas naquele mês
        const somaPorMes: number[] = MES_KEYS.map((_, idx) => {
          return outrasRows.reduce((acc: number, row: any) => {
            if (!row.atividade) return acc;
            const val = row[MES_KEYS[idx]];
            if (val !== "-" && val !== undefined) {
              const numero = Number(val.toString().replace(/\D/g, ""));
              if (!isNaN(numero)) return acc + numero;
            }
            return acc;
          }, 0);
        });

        // Acumula somaAtividadesTotal
        const somaAtividadesTotal = somaPorMes.reduce((a, b) => a + b, 0);

        const linhaSomaAtividades: any = {
          indicadores: "Total de ações executadas no mês",
          jan: somaPorMes[0] || "-", fev: somaPorMes[1] || "-", mar: somaPorMes[2] || "-", abr: somaPorMes[3] || "-",
          mai: somaPorMes[4] || "-", jun: somaPorMes[5] || "-",
          jul: somaPorMes[6] || "-", ago: somaPorMes[7] || "-", set: somaPorMes[8] || "-",
          out: somaPorMes[9] || "-", nov: somaPorMes[10] || "-", dez: somaPorMes[11] || "-",
          acumulado: { fieam: "-", sesi: "-", senai: "-", iel: "-", "total geral": "-" }
        };

        // 6) Para cada mês, calcula média de horas: horasPorMesDecimal[mês] ÷ somaPorMes[mês]
        const horasPorMesDecimal: number[] = MES_KEYS.map((_, idx) => {
          const entry = resumoData.resumoPorMes.find((r: any) => r.mes === idx + 1);
          if (!entry) return 0;
          return hhmmParaDecimal(entry.horasTrabalhadas);
        });

        const mediaPorMes: string[] = somaPorMes.map((soma, idx) => {
          const horasDec = horasPorMesDecimal[idx];
          if (horasDec <= 0 || soma <= 0) return "-";
          // invertido para (horas ÷ ações), conforme correção
          const mediaDecimal = horasDec / soma;
          return decimalParaHoraMin(mediaDecimal);
        });

        // 7) Prepara “Total de horas acumuladas” e “Total de ações acumuladas”
        const totalHorasAcumuladasDecimal = somaHorasTotalDecimal;
        const totalAcoesAcumuladas = somaAtividadesTotal;

        // 8) Calcula “Tempo médio por ação” acumulado: totalHorasAcumuladas ÷ totalAcoesAcumuladas
        const tempoMedioDecimalAcumulado =
          totalAcoesAcumuladas > 0
            ? totalHorasAcumuladasDecimal / totalAcoesAcumuladas
            : 0;
        const tempoMedioHhmmAcumulado =
          tempoMedioDecimalAcumulado > 0
            ? decimalParaHhmm(tempoMedioDecimalAcumulado)
            : "-";

        const linhaMediaHoras: any = {
          indicadores: "Tempo médio por ação executada",
          jan: mediaPorMes[0], fev: mediaPorMes[1], mar: mediaPorMes[2], abr: mediaPorMes[3],
          mai: mediaPorMes[4], jun: mediaPorMes[5],
          jul: mediaPorMes[6], ago: mediaPorMes[7], set: mediaPorMes[8],
          out: mediaPorMes[9], nov: mediaPorMes[10], dez: mediaPorMes[11],
          acumulado: { fieam: "-", sesi: "-", senai: "-", iel: "-", "total geral": "-" }
        };
        // Aqui acumulado recebe totalHorasAcumuladas ÷ totalAcoesAcumuladas
        linhaMediaHoras.acumulado.fieam = tempoMedioHhmmAcumulado;
        linhaMediaHoras.acumulado["total geral"] = tempoMedioHhmmAcumulado;

        // 9) Prepara lista com os 4 indicadores fixos (profissionais, horas, soma atividades, média horas) e os demais
        const todasRows: any[] = [
          linhaProfissionais,
          linhaHoras,
          linhaSomaAtividades,
          linhaMediaHoras,
          ...outrasRows,
        ];

        // 10) Atualiza acumulados para os 4 primeiros indicadores com seus cálculos
        // Profissionais: somaProfissionaisTotal
        todasRows[0].acumulado.fieam =
          somaProfissionaisTotal > 0 ? somaProfissionaisTotal : "-";
        todasRows[0].acumulado["total geral"] =
          somaProfissionaisTotal > 0 ? somaProfissionaisTotal : "-";

        // Horas: totalHorasAcumuladasDecimal convertido para “Hh:Mmin”
        const totalHorasAcumuladasHhmm =
          totalHorasAcumuladasDecimal > 0
            ? decimalParaHhmm(totalHorasAcumuladasDecimal)
            : "-";
        todasRows[1].acumulado.fieam = totalHorasAcumuladasHhmm;
        todasRows[1].acumulado["total geral"] = totalHorasAcumuladasHhmm;

        // Soma Atividades: totalAcoesAcumuladas
        todasRows[2].acumulado.fieam =
          totalAcoesAcumuladas > 0 ? totalAcoesAcumuladas : "-";
        todasRows[2].acumulado["total geral"] =
          totalAcoesAcumuladas > 0 ? totalAcoesAcumuladas : "-";

        // Média Horas: já ajustado acima
        todasRows[3].acumulado.fieam = tempoMedioHhmmAcumulado;
        todasRows[3].acumulado["total geral"] = tempoMedioHhmmAcumulado;

        setRows(todasRows);
      } catch (err) {
        console.error("Erro ao buscar indicadores:", err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicadores();
  }, [selectedYear]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" gutterBottom>
          Setor: Mercado
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
          <Tab value="2026" label="2026" />
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
                {["FIEAM", "SESI", "SENAI", "IEL", "TOTAL - MÉDIA"].map((name, index) => (
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={1 + 12 + 5} align="center" style={{ padding: "16px" }}>
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={1 + 12 + 5} align="center" style={{ padding: "16px" }}>
                    Nenhum dado para {selectedYear}.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, rowIndex) => (
                  <TableRow
                    key={`row-${rowIndex}`}
                    sx={{
                      "& .MuiTableCell-root": {
                        padding: "4px 6px",
                        lineHeight: "1",
                      },
                      height: "50px",
                      backgroundColor: rowIndex % 2 === 0 ? "#F5F5F5" : "#FFFFFF",
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
                      {row.indicadores}
                    </TableCell>

                    {/* Renderiza apenas valor de FIEAM na coluna de meses */}
                    {MES_KEYS.map((key) => (
                      <TableCell align="center" key={key}>
                        {row[key] !== undefined ? row[key] : "-"}
                      </TableCell>
                    ))}

                    {/* Renderiza as 5 colunas de Acumulado */}
                    {["fieam", "sesi", "senai", "iel", "total geral"].map((key) => (
                      <TableCell align="center" key={key}>
                        {row.acumulado && row.acumulado[key] !== undefined
                          ? row.acumulado[key]
                          : "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <h4>
        Atualizado até {hoje.getDate().toString().padStart(2, "0")}/
        {(hoje.getMonth() + 1).toString().padStart(2, "0")}/
        {hoje.getFullYear()} às {hoje.getHours()}h
      </h4>
    </div>
  );
};

export default Mercado;
