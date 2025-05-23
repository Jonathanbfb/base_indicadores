import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import api from '../../../services/api';

const HistoricoAlteracoes = () => {
  const [historico, setHistorico] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const res = await api.get('/historico', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistorico(res.data.historicos);
        console.log(res.data.historicos);
      } catch (err) {
        console.error('Erro ao buscar histórico', err);
      }
    };
    fetchHistorico();
  }, [token]);

  return (
    <Box p={3}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>
          Histórico de Alterações
        </Typography>

        {/* Aqui colocamos a Table dentro de um TableContainer com altura fixa */}
        <TableContainer
          sx={{
            maxHeight: 400,   // Altura máxima em pixels (ajuste conforme desejar)
            overflow: 'auto'  // A barra de rolagem aparecerá apenas quando necessário
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Usuário</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Setor</TableCell>
                <TableCell>Ano</TableCell>
                <TableCell>Mês</TableCell>
                <TableCell>FIEAM</TableCell>
                <TableCell>SESI</TableCell>
                <TableCell>SENAI</TableCell>
                <TableCell>IEL</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Data da Alteração</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historico.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{h.usuario.nome}</TableCell>
                  <TableCell>{h.item.nome}</TableCell>
                  <TableCell>{h.setor.nome}</TableCell>
                  <TableCell>{h.ano}</TableCell>
                  <TableCell>{h.mes}</TableCell>
                  <TableCell>{h.valorFieam}</TableCell>
                  <TableCell>{h.valorSesi}</TableCell>
                  <TableCell>{h.valorSenai}</TableCell>
                  <TableCell>{h.valorIel}</TableCell>
                  <TableCell>{h.totalGeral}</TableCell>
                  <TableCell>
                    {new Date(h.dataAlteracao).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default HistoricoAlteracoes;
