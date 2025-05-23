import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import api from '../services/api';
import HistoricoAlteracoes from './setores/components/HistoricoAlteracoes'

const AtualizacaoItem = () => {
  const [setores, setSetores] = useState([]);          // [{ id: 1, nome: 'Comercial' }, …]
  const [allItens, setAllItens] = useState([]);        // todos os itens, sem filtrar
  const [itensFiltrados, setItensFiltrados] = useState([]); // itens que pertencem ao setor selecionado

  const [form, setForm] = useState({
    setorId: '',     // string para manter coerência com TextField select
    itemId: '',      // string para manter coerência com TextField select
    ano: String(new Date().getFullYear()),
    mes: '',
    valorFieam: '',
    valorSesi: '',
    valorSenai: '',
    valorIel: '',
    totalGeral: 0,
    estrategia: 'manter'
  });

  const meses = {
    Janeiro: '1',
    Fevereiro: '2',
    Março: '3',
    Abril: '4',
    Maio: '5',
    Junho: '6',
    Julho: '7',
    Agosto: '8',
    Setembro: '9',
    Outubro: '10',
    Novembro: '11',
    Dezembro: '12',
  };

  const anos = ['2025', '2024', '2023', '2022'];
  const token = localStorage.getItem('token');

  const limparFormulario = () => {
    setForm({
      setorId: '',
      itemId: '',
      mes: '',
      ano: new Date().getFullYear(),
      valorFieam: '',
      valorSesi: '',
      valorSenai: '',
      valorIel: '',
      totalGeral: 0,
      estrategia: 'manter'
    });
    setItensFiltrados([]);
  };

  // 1) Buscar lista de setores e todos os itens ao montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resSetores, resItens] = await Promise.all([
          api.get('/setores', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/itens', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setSetores(resSetores.data);
        setAllItens(resItens.data);
      } catch (err) {
        console.error('Erro ao buscar setores e itens', err);
      }
    };
    fetchData();
  }, [token]);

  // 2) Quando setorId mudar, filtrar os itens localmente
  useEffect(() => {
    if (!form.setorId) {
      setItensFiltrados([]);
      setForm(prev => ({ ...prev, itemId: '' }));
      return;
    }
    const filtrados = allItens.filter(i => Number(i.setor_id) === Number(form.setorId));
    setItensFiltrados(filtrados);
    setForm(prev => ({ ...prev, itemId: '' }));
  }, [form.setorId, allItens]);



  // 3) Recalcula totalGeral sempre que algum valor numérico mudar
  useEffect(() => {
    const fieam = parseFloat(form.valorFieam) || 0;
    const sesi = parseFloat(form.valorSesi) || 0;
    const senai = parseFloat(form.valorSenai) || 0;
    const iel = parseFloat(form.valorIel) || 0;
    setForm(prev => ({ ...prev, totalGeral: fieam + sesi + senai + iel }));
  }, [form.valorFieam, form.valorSesi, form.valorSenai, form.valorIel]);

  // 4) Handler genérico de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        setorId: Number(form.setorId),
        itemId: Number(form.itemId),
        ano: Number(form.ano),
        mes: Number(form.mes),
        valorFieam: parseFloat(form.valorFieam) || 0,
        valorSesi: parseFloat(form.valorSesi) || 0,
        valorSenai: parseFloat(form.valorSenai) || 0,
        valorIel: parseFloat(form.valorIel) || 0,
        totalGeral: form.totalGeral,
        estrategia: form.estrategia
      };
      console.log('Payload enviado:', payload);
      await api.put(`/atualizar-item/${payload.itemId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      limparFormulario();
      alert('Item atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    }
  };

  return (
    <Box p={3}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>Atualização de Item</Typography>
        <Grid container spacing={2}>
          {/* Select de Setor */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Setor"
              name="setorId"
              fullWidth
              value={form.setorId}
              onChange={handleChange}
            >
              <MenuItem value="">Selecione um setor</MenuItem>
              {setores.map(setor => (
                <MenuItem key={setor.id} value={String(setor.id)}>
                  {setor.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Select de Item, filtrado pelo setor selecionado */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Item"
              name="itemId"
              fullWidth
              value={form.itemId}
              onChange={handleChange}
              disabled={!form.setorId}
            >
              <MenuItem value="">Selecione um item</MenuItem>
              {itensFiltrados.map(item => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Select de Ano */}
          <Grid item xs={6} sm={3}>
            <TextField
              select
              label="Ano"
              name="ano"
              fullWidth
              value={form.ano}
              onChange={handleChange}
            >
              <MenuItem value="">Selecione o ano</MenuItem>
              {anos.map(ano => (
                <MenuItem key={ano} value={ano}>
                  {ano}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Select de Mês */}
          <Grid item xs={6} sm={3}>
            <TextField
              select
              label="Mês"
              name="mes"
              fullWidth
              value={form.mes}
              onChange={handleChange}
            >
              <MenuItem value="">Selecione o mês</MenuItem>
              {Object.entries(meses).map(([nomeMes, numeroMes]) => (
                <MenuItem key={numeroMes} value={numeroMes}>
                  {nomeMes}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Campos de valor numérico */}
          <Grid item xs={12} sm={3}>
            <TextField
              label="Valor FIEAM"
              name="valorFieam"
              type="number"
              fullWidth
              value={form.valorFieam}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Valor SESI"
              name="valorSesi"
              type="number"
              fullWidth
              value={form.valorSesi}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Valor SENAI"
              name="valorSenai"
              type="number"
              fullWidth
              value={form.valorSenai}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Valor IEL"
              name="valorIel"
              type="number"
              fullWidth
              value={form.valorIel}
              onChange={handleChange}
            />
          </Grid>

          {/* Campo de Total (somente leitura) */}
          <Grid item xs={12} sm={3}>
            <TextField
              label="Total Geral"
              name="totalGeral"
              type="number"
              fullWidth
              value={form.totalGeral}
              disabled
            />
          </Grid>

          {/* Rádio de estratégia */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Estratégia de Atualização
            </Typography>
            <RadioGroup
              row
              name="estrategia"
              value={form.estrategia}
              onChange={handleChange}
            >
              <FormControlLabel
                value="somar"
                control={<Radio />}
                label="Somar com valor existente"
              />
              <FormControlLabel
                value="media"
                control={<Radio />}
                label="Média com valor existente"
              />
              <FormControlLabel
                value="manter"
                control={<Radio />}
                label="Manter o último valor"
              />
            </RadioGroup>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.setorId || !form.itemId}
          >
            Atualizar Indicador
          </Button>
        </Box>
      </Paper>
      <Paper sx={{ p: 4, marginTop: '25px' }}>
      <HistoricoAlteracoes />
      </Paper>
    </Box>

    
  );
};

export default AtualizacaoItem;
