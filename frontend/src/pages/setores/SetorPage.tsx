// src/pages/SetorPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import api from "../../services/api"; // ajuste o caminho, se necessário

// Mesmas helpers que você já tinha:
const MES_KEYS = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez"
];

const decimalParaHoraMin = (decimalHoras: number): string => {
    const horasInteiras = Math.floor(decimalHoras);
    const minutos = Math.round((decimalHoras - horasInteiras) * 60);
    return `${horasInteiras}h:${minutos}min`;
};

const hhmmParaDecimal = (hhmm: string): number => {
    const [hStr, mStr] = hhmm.split(":");
    const h = Number(hStr);
    const m = Number(mStr);
    return isNaN(h) || isNaN(m) ? 0 : h + m / 60;
};

const decimalParaHhmm = (decimal: number): string => {
    const horas = Math.floor(decimal);
    const minutos = Math.round((decimal - horas) * 60);
    return `${horas}h:${minutos}min`;
};

const hhmmParaFormato = (hhmm: string): string => {
    const [hStr, mStr] = hhmm.split(":");
    const h = Number(hStr);
    const m = Number(mStr);
    return isNaN(h) || isNaN(m) ? "-" : `${h}h:${m}min`;
};

interface SetorInfo {
    id: number;
    nome: string;
    slug: string;
    // adicione outros campos, se precisar
}

export default function SetorPage() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>(); // pega “design”, “marketing”, etc.

    // Estado para armazenar nome e id do setor (vindo do backend)
    const [setorInfo, setSetorInfo] = useState<SetorInfo | null>(null);
    const [loadingSetor, setLoadingSetor] = useState(true);

    // Estados originais para dados da tabela
    const [selectedYear, setSelectedYear] = useState("2025");
    const [rows, setRows] = useState<any[]>([]);
    const [loadingRows, setLoadingRows] = useState(false);

    const token = localStorage.getItem("token");

    // 1) Primeiro, fazemos fetch do “/setores/:slug” para obter { id, nome, slug }
    useEffect(() => {
        if (!slug) return;

        setLoadingSetor(true);
        api
            .get(`/setores/${slug}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                setSetorInfo(res.data.setoresSlug as SetorInfo);
            })
            .catch((err) => {
                console.error("Erro ao carregar dados do setor:", err);
                setSetorInfo(null);
            })
            .finally(() => {
                setLoadingSetor(false);
            });
    }, [slug]);

    // 2) Depois que soubermos o id do setor, fazemos o fetch dos indicadores (mesmo que estava no Design)
    useEffect(() => {
        // Se ainda está carregando info do setor, ou não há setorInfo → não faz nada
        if (loadingSetor || !setorInfo) return;

        const fetchIndicadores = async () => {
            setLoadingRows(true);
            try {
                // 2.1) Resumo de jornadas (meses) para este setor
                const resumoRes = await api.get(
                    `/jornadas/retornar-resumo/${setorInfo.id}?ano=${selectedYear}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const resumoData = resumoRes.data;

                // Cria as linhas fixas “Profissionais” e “Horas”
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

                if (resumoData.resumoPorMes.length > 0) {
                    linhaProfissionais.indicadores = resumoData.resumoPorMes[0].indicadorProfissionais;
                    linhaHoras.indicadores = resumoData.resumoPorMes[0].indicadorHoras;
                }

                let somaProfissionaisTotal = 0;
                let somaHorasTotalDecimal = 0;

                resumoData.resumoPorMes.forEach((item: any) => {
                    const idx = item.mes - 1;
                    if (idx >= 0 && idx < 12) {
                        // Colaborares
                        linhaProfissionais[MES_KEYS[idx]] = item.colaboradores;
                        somaProfissionaisTotal += Number(item.colaboradores) || 0;

                        // Horas
                        linhaHoras[MES_KEYS[idx]] = hhmmParaFormato(item.horasTrabalhadas);
                        somaHorasTotalDecimal += hhmmParaDecimal(item.horasTrabalhadas);
                    }
                });

                // 2.2) Valores por instituição para demais indicadores
                const valoresRes = await api.get(
                    `itens/valor/${setorInfo.id}/?ano=${selectedYear}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const indicadoresFromApi = valoresRes.data.indicadores;

                // 2.3) Monta as outras linhas (uma por indicador)
                const outrasRows = indicadoresFromApi.map((indicador: any) => {
                    const linhaBase: any = {
                        indicadores: indicador.nome,
                        jan: "-", fev: "-", mar: "-", abr: "-", mai: "-", jun: "-",
                        jul: "-", ago: "-", set: "-", out: "-", nov: "-", dez: "-",
                        acumulado: { fieam: "-", sesi: "-", senai: "-", iel: "-", "total geral": "-" }
                    };

                    indicador.valores.forEach((v: any) => {
                        if (v.instituicao_id === 1) {
                            const mesIndex = v.mes - 1;
                            if (mesIndex >= 0 && mesIndex < 12) {
                                linhaBase[MES_KEYS[mesIndex]] = v.valor;
                            }
                        }
                    });

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

                // 2.4) Soma atividades por mês
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

                const somaAtividadesTotal = somaPorMes.reduce((a, b) => a + b, 0);

                const linhaSomaAtividades: any = {
                    indicadores: "Total de ações executadas no mês",
                    jan: somaPorMes[0] || "-", fev: somaPorMes[1] || "-", mar: somaPorMes[2] || "-", abr: somaPorMes[3] || "-",
                    mai: somaPorMes[4] || "-", jun: somaPorMes[5] || "-",
                    jul: somaPorMes[6] || "-", ago: somaPorMes[7] || "-", set: somaPorMes[8] || "-",
                    out: somaPorMes[9] || "-", nov: somaPorMes[10] || "-", dez: somaPorMes[11] || "-",
                    acumulado: { fieam: "-", sesi: "-", senai: "-", iel: "-", "total geral": "-" }
                };

                // 2.5) Calcula média de horas por mês
                const horasPorMesDecimal: number[] = MES_KEYS.map((_, idx) => {
                    const entry = resumoData.resumoPorMes.find((r: any) => r.mes === idx + 1);
                    if (!entry) return 0;
                    return hhmmParaDecimal(entry.horasTrabalhadas);
                });

                const mediaPorMes: string[] = somaPorMes.map((soma, idx) => {
                    const horasDec = horasPorMesDecimal[idx];
                    if (horasDec <= 0 || soma <= 0) return "-";
                    const mediaDecimal = horasDec / soma;
                    return decimalParaHoraMin(mediaDecimal);
                });

                // 2.6) Totais acumulados
                const totalHorasAcumuladasDecimal = somaHorasTotalDecimal;
                const totalAcoesAcumuladas = somaAtividadesTotal;
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

                linhaMediaHoras.acumulado.fieam = tempoMedioHhmmAcumulado;
                linhaMediaHoras.acumulado["total geral"] = tempoMedioHhmmAcumulado;

                // 2.7) Junta tudo em um array final
                const todasRows: any[] = [
                    linhaProfissionais,
                    linhaHoras,
                    linhaSomaAtividades,
                    linhaMediaHoras,
                    ...outrasRows,
                ];

                // 2.8) Ajusta acumulados fixos:
                // Profissionais:
                todasRows[0].acumulado.fieam =
                    somaProfissionaisTotal > 0 ? somaProfissionaisTotal : "-";
                todasRows[0].acumulado["total geral"] =
                    somaProfissionaisTotal > 0 ? somaProfissionaisTotal : "-";

                // Horas:
                const totalHorasAcumuladasHhmm =
                    totalHorasAcumuladasDecimal > 0
                        ? decimalParaHhmm(totalHorasAcumuladasDecimal)
                        : "-";
                todasRows[1].acumulado.fieam = totalHorasAcumuladasHhmm;
                todasRows[1].acumulado["total geral"] = totalHorasAcumuladasHhmm;

                // Soma Atividades:
                todasRows[2].acumulado.fieam =
                    totalAcoesAcumuladas > 0 ? totalAcoesAcumuladas : "-";
                todasRows[2].acumulado["total geral"] =
                    totalAcoesAcumuladas > 0 ? totalAcoesAcumuladas : "-";

                // Média Horas:
                todasRows[3].acumulado.fieam = tempoMedioHhmmAcumulado;
                todasRows[3].acumulado["total geral"] = tempoMedioHhmmAcumulado;

                setRows(todasRows);
            } catch (err) {
                console.error("Erro ao buscar indicadores:", err);
                setRows([]);
            } finally {
                setLoadingRows(false);
            }
        };

        fetchIndicadores();
    }, [selectedYear, loadingSetor, setorInfo]);

    // 3) Função para trocar de ano
    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setSelectedYear(newValue);
    };

    // 4) Função de imprimir
    const handlePrint = () => {
        window.print();
    };

    // 5) Se ainda não achou o setor → mensagem
    if (loadingSetor) {
        return <Typography>Carregando dados do setor…</Typography>;
    }
    if (!setorInfo) {
        return <Typography>Setor “{slug}” não encontrado.</Typography>;
    }

    // 6) Renderiza o layout exatamente como “Design”, mas usando setorInfo.nome
    const hoje = new Date();
    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Setor: {setorInfo.nome}
                </Typography>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Tooltip title="Voltar para o menu principal">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/menu")}
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
                            {loadingRows ? (
                                <TableRow>
                                    <TableCell colSpan={1 + 12 + 5} align="center" style={{ padding: "16px" }}>
                                        Carregando…
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
                                        {MES_KEYS.map((key) => (
                                            <TableCell align="center" key={key}>
                                                {row[key] !== undefined ? row[key] : "-"}
                                            </TableCell>
                                        ))}
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
}
