import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';
import dayjs from 'dayjs';
import api from '../services/api';

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const JornadaColaboradores = () => {
  const [ano, setAno] = useState(dayjs().year());
  const [mes, setMes] = useState(dayjs().month() + 1);
  const [dados, setDados] = useState([]);
  const [feriados, setFeriados] = useState([]);
  const [notificacao, setNotificacao] = useState({ open: false, tipo: 'success', mensagem: '' });
  const [setores, setSetores] = useState([]);
  const [setoresCarregados, setSetoresCarregados] = useState(false);
  const [setorSelecionado, setSetorSelecionado] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [novoValor, setNovoValor] = useState('');
  const [motivo, setMotivo] = useState('');
  const token = localStorage.getItem('token');
  const diasNoMes = dayjs(`${ano}-${String(mes).padStart(2, '0')}-01`).daysInMonth();

  // 1) Busca todos os setores cadastrados
  const fetchSetores = async () => {
    try {
      const response = await api.get('/setores', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSetores(response.data);
      if (response.data.length > 0) {
        setSetorSelecionado(response.data[0].nome);
      }
      setSetoresCarregados(true);
    } catch (error) {
      console.error('Erro ao buscar setores:', error);
      setNotificacao({
        open: true,
        tipo: 'error',
        mensagem: 'Erro ao carregar setores.'
      });
    }
  };

  // 2) Monta as jornadas no frontend combinando dados fictícios com dados do backend
  const fetchDados = async () => {
    try {
      // 2.1) Buscar usuários
      const uRes = await api.get('/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usuarios = uRes.data;

      // 2.2) Buscar feriados do ano
      const fRes = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`).then(r => r.json());
      const feriadosMes = fRes.filter(f => dayjs(f.date).month() + 1 === mes);
      setFeriados(feriadosMes);

      // 2.3) Buscar jornadas já existentes do backend (no formato { jornada: [...] })
      const jRes = await api.get('/jornadas/retornar-jornadas', {
        headers: { Authorization: `Bearer ${token}` },
        params: { mes, ano }
      });
      const jornadasBackend = jRes.data.jornada || [];
      // cada item tem { id, dia, mes, ano, motivo, valor, colaborador:{ id, nome } }

      // 2.4) Para cada usuário, criar array de dias preenchido com valores padrão, depois sobrescrever com backend
      const usuariosComDias = usuarios.map(user => {
        const dias = Array.from({ length: diasNoMes }, (_, idx) => {
          const diaData = dayjs(
            `${ano}-${String(mes).padStart(2, '0')}-${String(idx + 1).padStart(2, '0')}`
          );
          const isWeekend = [0, 6].includes(diaData.day());
          const isFeriado = feriadosMes.some(f => dayjs(f.date).date() === diaData.date());

          let valorPadrao;
          if (isFeriado) {
            valorPadrao = 'FER';
          } else if (isWeekend) {
            valorPadrao = 'FDS';
          } else {
            valorPadrao = user.jornadaTrabalho || '00:00';
          }

          return {
            dia: idx + 1,
            valor: valorPadrao,
            motivo: '',
            id: null
          };
        });

        return {
          id: user.id,
          nome: user.nome,
          setorIds: user.setorIds || [],
          jornadaTrabalho: user.jornadaTrabalho || '00:00',
          dias
        };
      });

      // 2.5) Sobrescrever cada dia com os dados recebidos do backend
      jornadasBackend.forEach(entry => {
        if (entry.ano === ano && entry.mes === mes) {
          const colaboradorId = entry.colaborador.id;
          const diaIndex = entry.dia - 1;
          const usuarioObj = usuariosComDias.find(u => u.id === colaboradorId);
          if (usuarioObj && usuarioObj.dias[diaIndex]) {
            usuarioObj.dias[diaIndex] = {
              dia: entry.dia,
              valor: entry.valor,
              motivo: entry.motivo || '',
              id: entry.id
            };
          }
        }
      });

      // 2.6) Mapear setores por id → nome
      const setorMap = {};
      setores.forEach(setor => {
        setorMap[setor.id] = setor.nome;
      });

      // 2.7) Agrupar usuários por setor
      const dadosPorSetor = {};
      usuariosComDias.forEach(userObj => {
        const setorPrincipalId =
          Array.isArray(userObj.setorIds) && userObj.setorIds.length > 0
            ? userObj.setorIds[0]
            : null;
        const nomeSetor =
          setorPrincipalId && setorMap[setorPrincipalId]
            ? setorMap[setorPrincipalId]
            : 'Outros';

        if (!dadosPorSetor[nomeSetor]) {
          dadosPorSetor[nomeSetor] = [];
        }
        dadosPorSetor[nomeSetor].push({
          ...userObj,
          setorId: setorPrincipalId || 0
        });
      });

      // 2.8) Montar estado final
      const arr = Object.entries(dadosPorSetor).map(([setor, colaboradores]) => ({
        setor,
        colaboradores
      }));
      setDados(arr);

      // 2.9) Ajustar setorSelecionado se necessário
      if (Object.keys(dadosPorSetor).length > 0) {
        if (!arr.find(item => item.setor === setorSelecionado)) {
          setSetorSelecionado(arr[0].setor);
        }
      } else {
        setSetorSelecionado('');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setNotificacao({
        open: true,
        tipo: 'error',
        mensagem: 'Erro ao carregar dados.'
      });
    }
  };

  // 3) Ao montar o componente, buscar setores
  useEffect(() => {
    fetchSetores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 4) Quando setores carregados ou mês/ano mudarem, refazer dados
  useEffect(() => {
    if (setoresCarregados) {
      fetchDados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mes, ano, setoresCarregados]);

  // 5) Converter "HH:mm" em horas decimais
  const parseHoras = valor => {
    const [h, m] = valor.split(':').map(Number);
    return isNaN(h) ? 0 : h + (m || 0) / 60;
  };

  // 6) Abre modal ao clicar numa célula
  const abrirModal = (colaborador, idxDia) => {
    const diaObj = colaborador.dias[idxDia];
    setDiaSelecionado({
      colaboradorId: colaborador.id,
      setorId: colaborador.setorId,
      diaIndex: idxDia,
      dia: idxDia + 1,
      valor: diaObj.valor,
      motivo: diaObj.motivo,
      id: diaObj.id
    });
    setNovoValor(diaObj.valor);
    setMotivo(diaObj.motivo || '');
    setModalAberto(true);
  };

  // 7) Salva alterações apenas no estado local
  const salvarLocalmente = () => {
    if (!diaSelecionado) return;
    const { colaboradorId, diaIndex, dia } = diaSelecionado;

    setDados(prevDados => {
      return prevDados.map(setorItem => {
        if (setorItem.setor === setorSelecionado) {
          const novosColabs = setorItem.colaboradores.map(col => {
            if (col.id === colaboradorId) {
              const novosDias = [...col.dias];
              novosDias[diaIndex] = {
                dia,
                valor: novoValor,
                motivo,
                id: diaSelecionado.id // mantém o id se existir (se for edição), ou null
              };
              return { ...col, dias: novosDias };
            }
            return col;
          });
          return { ...setorItem, colaboradores: novosColabs };
        }
        return setorItem;
      });
    });

    setModalAberto(false);
    setNotificacao({ open: true, tipo: 'success', mensagem: 'Valor atualizado localmente.' });
  };

  // 8) Envia ao backend apenas o setor selecionado, mesclando itens criados e atualizados
  const cadastrarJornadas = async () => {
    try {
      const setorObj = dados.find(item => item.setor === setorSelecionado);
      if (!setorObj || setorObj.colaboradores.length === 0) {
        setNotificacao({ open: true, tipo: 'warning', mensagem: 'Nenhum colaborador neste setor.' });
        return;
      }

      // Prepara payload combinando createMany e updateMany se necessário
      const toCreate = []; // novos registros (id === null)
      const toUpdate = []; // registros existentes com id

      setorObj.colaboradores.forEach(col => {
        col.dias.forEach(d => {
          if (d.id) {
            // existe no banco → atualizar
            toUpdate.push({
              id: d.id,
              motivo: d.motivo,
              valor: d.valor
            });
          } else {
            // não existe → criar
            toCreate.push({
              colaboradorId: col.id,
              setorId: col.setorId,
              ano,
              mes,
              dia: d.dia,
              valor: d.valor,
              motivo: d.motivo || ''
            });
          }
        });
      });

      // 8.1) Executar atualizações existentes (PUT) em loop
      for (let upd of toUpdate) {
        await api.put(
          `/jornadas/editar-jornada/${upd.id}`,
          { valor: upd.valor, motivo: upd.motivo },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // 8.2) Criar novos (se houver)
      if (toCreate.length > 0) {
        await api.post(
          '/jornadas/criar-jornada',
          toCreate,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setNotificacao({ open: true, tipo: 'success', mensagem: 'Jornadas sincronizadas com sucesso!' });
      // Após sucesso, recarrega para garantir estado atualizado
      fetchDados();
    } catch (error) {
      const backendMsg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Erro ao cadastrar jornadas.';
      setNotificacao({
        open: true,
        tipo: 'error',
        mensagem: backendMsg
      });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Jornada de Trabalho por Colaborador
      </Typography>

      {/* Controles de Mês, Ano, Setor */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <FormControl size="small">
          <InputLabel>Mês</InputLabel>
          <Select
            value={mes}
            onChange={e => setMes(e.target.value)}
            label="Mês"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {dayjs().month(i).format('MMMM')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Ano</InputLabel>
          <Select
            value={ano}
            onChange={e => setAno(e.target.value)}
            label="Ano"
          >
            {[2023, 2024, 2025, 2026].map(y => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Setor</InputLabel>
          <Select
            value={setorSelecionado}
            onChange={e => setSetorSelecionado(e.target.value)}
            label="Setor"
          >
            {setores
              .filter(setor => setor.nome != "Setor Padrão")
              .map(setor => (
                <MenuItem key={setor.id} value={setor.nome}>
                  {setor.nome}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      {/* Tabela de Jornadas por Colaborador */}
      {dados
        .filter(d => d.setor === setorSelecionado && d.setor != "Setor Padrão")
        .map(({ setor, colaboradores }) => (
          <Box key={setor} mb={4}>
            <Typography variant="h6">Setor: {setor}</Typography>
            <Paper sx={{ mt: 1 }}>
              <Box
                sx={{
                  display: 'block',
                  maxHeight: 300,
                  overflowY: 'hidden',
                  '&:hover': {
                    overflowY: 'auto',
                    overflowX: 'auto'
                  }
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 150 }}>Colaborador</TableCell>
                      {Array.from({ length: diasNoMes }).map((_, i) => {
                        const data = dayjs(
                          `${ano}-${String(mes).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
                        );
                        const isWeekend = [0, 6].includes(data.day());
                        const isFeriado = feriados.some(f => dayjs(f.date).date() === data.date());
                        return (
                          <TableCell
                            key={i}
                            align="center"
                            sx={{
                              minWidth: 60,
                              backgroundColor: isFeriado
                                ? '#f8d7da'
                                : isWeekend
                                  ? '#e0e0e0'
                                  : 'inherit'
                            }}
                          >
                            {i + 1}
                            <br />
                            <Typography variant="caption">
                              {diasSemana[data.day()]}
                            </Typography>
                          </TableCell>
                        );
                      })}
                      <TableCell align="center" sx={{ minWidth: 80 }}>
                        Total (h)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {colaboradores.map(col => {
                      const total = col.dias.reduce((sum, d) => {
                        if (d.valor && /\d{2}:\d{2}/.test(d.valor)) {
                          return sum + parseHoras(d.valor);
                        }
                        return sum;
                      }, 0);

                      return (
                        <TableRow key={col.id}>
                          <TableCell sx={{ minWidth: 150 }}>{col.nome}</TableCell>
                          {col.dias.map((d, idx) => {
                            const data = dayjs(
                              `${ano}-${String(mes).padStart(2, '0')}-${String(idx + 1).padStart(2, '0')}`
                            );
                            const isWeekend = [0, 6].includes(data.day());
                            const isFeriado = feriados.some(f => dayjs(f.date).date() === data.date());
                            return (
                              <TableCell
                                key={idx}
                                align="center"
                                sx={{
                                  cursor: 'pointer',
                                  minWidth: 60,
                                  backgroundColor: isFeriado
                                    ? '#f8d7da'
                                    : isWeekend
                                      ? '#e0e0e0'
                                      : 'inherit'
                                }}
                                onClick={() => abrirModal(col, idx)}
                              >
                                {d.valor}
                              </TableCell>
                            );
                          })}
                          <TableCell align="center">
                            <b>{total.toFixed(2)}</b>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Box>
        ))}

      {/* Modal para editar cada célula, salvando apenas localmente */}
      <Dialog open={modalAberto} onClose={() => setModalAberto(false)} fullWidth>
        <DialogTitle>Editar jornada</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Novo valor (HH:mm / FER / FDS)"
            value={novoValor}
            onChange={e => setNovoValor(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Motivo"
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalAberto(false)}>Cancelar</Button>
          <Button
            onClick={salvarLocalmente}
            variant="contained"
            color="primary"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Botão para sincronizar jornadas (createMany + updateMany apenas para setor selecionado) */}
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={cadastrarJornadas}
        >
          Cadastrar Jornada
        </Button>
      </Box>

      {/* Notificação Snackbar */}
      <Snackbar
        open={notificacao.open}
        autoHideDuration={5000}
        onClose={() => setNotificacao({ ...notificacao, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotificacao({ ...notificacao, open: false })}
          severity={notificacao.tipo}
          variant="filled"
        >
          {notificacao.mensagem}
        </Alert>
      </Snackbar>

      {/* Botão para recarregar dados */}
      <Box mt={2}>
        <Button variant="outlined" onClick={fetchDados}>
          Atualizar
        </Button>
      </Box>
    </Box>
  );
};

export default JornadaColaboradores;
