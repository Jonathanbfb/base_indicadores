const prisma = require('../prisma/client');

const atualizarValoresItem = async (req, res) => {
  try {
    const { itemId, setorId, ano, mes, valorFieam, valorSesi, valorSenai, valorIel, totalGeral, estrategia } = req.body;

    const historicoExistente = await prisma.historico.findFirst({
      where: {
        itemId: Number(itemId),
        setorId: Number(setorId),
        ano: Number(ano),
        mes: mes
      }
    });

    let novoHistorico;

    if (historicoExistente) {
      let novosValores = {
        valorFieam: Number(valorFieam),
        valorSesi: Number(valorSesi),
        valorSenai: Number(valorSenai),
        valorIel: Number(valorIel),
        totalGeral: Number(totalGeral),
      };

      if (estrategia === 'somar') {
        novosValores = {
          valorFieam: historicoExistente.valorFieam + Number(valorFieam),
          valorSesi: historicoExistente.valorSesi + Number(valorSesi),
          valorSenai: historicoExistente.valorSenai + Number(valorSenai),
          valorIel: historicoExistente.valorIel + Number(valorIel),
          totalGeral: historicoExistente.totalGeral + Number(totalGeral)
        };
      } else if (estrategia === 'media') {
        novosValores = {
          valorFieam: (historicoExistente.valorFieam + Number(valorFieam)) / 2,
          valorSesi: (historicoExistente.valorSesi + Number(valorSesi)) / 2,
          valorSenai: (historicoExistente.valorSenai + Number(valorSenai)) / 2,
          valorIel: (historicoExistente.valorIel + Number(valorIel)) / 2,
          totalGeral: (historicoExistente.totalGeral + Number(totalGeral)) / 2
        };
      }

      novoHistorico = await prisma.historico.update({
        where: { id: historicoExistente.id },
        data: {
          ...novosValores,
          dataAlteracao: new Date()
        }
      });

    } else {
      novoHistorico = await prisma.historico.create({
        data: {
          itemId: Number(itemId),
          setorId: Number(setorId),
          ano: Number(ano),
          mes: mes,
          valorFieam: Number(valorFieam),
          valorSesi: Number(valorSesi),
          valorSenai: Number(valorSenai),
          valorIel: Number(valorIel),
          totalGeral: Number(totalGeral),
          usuarioId: req.usuario.id,
        }
      });
    }

    // atualizar o valor para a instituição FIEAM
    await prisma.valor_item.updateMany({
      where: {
        item_id: itemId,
        mes: Number(mes),
        instituicao_id: 1
      },
      data: {
        valor: Number(valorFieam)
      }
    })

    // atualizar o valor para a instituição SESI
    await prisma.valor_item.updateMany({
      where: {
        item_id: itemId,
        mes: Number(mes),
        instituicao_id: 2
      },
      data: {
        valor: Number(valorSesi)
      }
    })

    // atualizar o valor para a instituição SENAI
    await prisma.valor_item.updateMany({
      where: {
        item_id: itemId,
        mes: Number(mes),
        instituicao_id: 3
      },
      data: {
        valor: Number(valorSenai)
      }
    })

    // atualizar o valor para a instituição IEL
    await prisma.valor_item.updateMany({
      where: {
        item_id: itemId,
        mes: Number(mes),
        instituicao_id: 4
      },
      data: {
        valor: Number(valorIel)
      }
    })

    res.status(200).json({ message: 'Histórico atualizado com sucesso.', historico: novoHistorico });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ error: 'Erro ao atualizar valores do item.' });
  }
};

const cadastrarItem = async (req, res) => {
  try {
    const { nome, detalhes, setorId, ano, instituicoes, atividade } = req.body;

    // 1. Cadastrar item
    const novoItem = await prisma.item.create({
      data: {
        nome,
        detalhes,
        setor_id: setorId,
        ano,
        atividade,
      },
    });

    // 2. Cadastrar instituições se não existirem
    const instituicoesSalvas = [];
    for (const nomeInst of instituicoes) {
      const inst = await prisma.instituicao.upsert({
        where: { nome: nomeInst },
        update: {},
        create: { nome: nomeInst },
      });
      instituicoesSalvas.push(inst);
    }

    // 3. Cadastrar os 12 meses para cada instituição com valor 0
    const registrosValorItem = [];
    for (const inst of instituicoesSalvas) {
      for (let mes = 1; mes <= 12; mes++) {
        registrosValorItem.push({
          item_id: novoItem.id,
          instituicao_id: inst.id,
          mes,
          valor: 0,
        });
      }
    }

    await prisma.valor_item.createMany({
      data: registrosValorItem,
    });

    res.status(201).json({ message: 'Item e valores cadastrados com sucesso.' });
  } catch (error) {
    console.error('Erro ao cadastrar item:', error);
    res.status(500).json({ error: error.message });
    console.error('Erro ao cadastrar item:', error);

  }
};

const listarItens = async (req, res) => {

  const email = req.email;
  const perfilId = req.perfilId;

  const usuario = await prisma.usuario.findUnique({
    where: {
      email: email
    },
    select: {
      usuarioSetores: {
        select: {
          setorId: true,
        }
      }
    }
  })

  const setorIds = usuario.usuarioSetores.map(user => user.setorId)

  try {

    if (perfilId === 1) {
      const itensAdm = await prisma.item.findMany({
        include: {
          setor: {
            select: { nome: true, id: true }
          },
        },
        orderBy: {
          id: 'desc',
        },
      });

      res.status(200).json(itensAdm)

    } else {
      const itens = await prisma.item.findMany({
        where: {
          setor_id: {
            in: setorIds
          }
        },
        include: {
          setor: {
            select: { nome: true, id: true }
          },
        },
        orderBy: {
          id: 'desc',
        },
      });

      res.status(200).json(itens);
    }

  } catch (error) {
    console.error('Erro ao listar itens:', error);
    res.status(500).json({ error: 'Erro ao listar itens.' });
  }
};

const listarValorItens = async (req, res) => {
  const { id } = req.params;
  const { ano } = req.query;

  const indicadores = await prisma.item.findMany({
    where: {
      setor_id: Number(id),
      ano: Number(ano)
    },
    select: {
      nome: true,
      ano: true,
      setor_id: true,
      atividade: true,
      valores: {
        where: {
          valor: {
            not: 0
          }
        },
        select: {
          instituicao_id: true,
          mes: true,
          valor: true
        }
      }
    }
  })

  res.json({ indicadores })
}

const buscarItemPorId = async (req, res) => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!item) return res.status(404).json({ error: 'Item não encontrado.' });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar item.' });
  }
};

const atualizarItem = async (req, res) => {
  try {
    const { nome, detalhes, setorId, ano } = req.body;

    await prisma.item.update({
      where: { id: parseInt(req.params.id) },
      data: { nome, detalhes, setor_id: setorId, ano },
    });

    res.json({ message: 'Item atualizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar item.' });
  }
};

const excluirItem = async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);

    await prisma.valor_item.deleteMany({
      where: { item_id: itemId },
    });

    await prisma.item.delete({
      where: { id: itemId },
    });

    res.json({ message: 'Item e valores excluídos com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir item:', error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  cadastrarItem,
  listarItens,
  buscarItemPorId,
  atualizarItem,
  excluirItem,
  listarValorItens,
  atualizarValoresItem
};
