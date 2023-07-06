import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Container, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material';

interface IParametrosBusca {
  ordering?: string
  search?: string
}

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
  const [proximaPagina, setProximaPagina] = useState('')
  const [paginaAnterior, setPaginaAnterior] = useState('')

  const [busca, setBusca] = useState('')
  const [ordenacao, setOrdenacao] = useState('')

  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {

    axios.get<IPaginacao<IRestaurante>>(url, opcoes)
      .then(resposta => {
        setRestaurantes(resposta.data.results)
        setProximaPagina(resposta.data.next)
        setPaginaAnterior(resposta.data.previous)
      })
      .catch(erro => {
        console.log(erro)
      })
  }

  const buscar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const opcoes = {
      params: {

      } as IParametrosBusca
    }
    if (busca) {
      opcoes.params.search = busca
    }
    if (ordenacao) {
      opcoes.params.ordering = ordenacao
    }
    carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes)
  }

  useEffect(() => {
    carregarDados('http://localhost:8000/api/v1/restaurantes/')
  }, [])

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    <Box component='form' onSubmit={buscar} maxWidth={'43rem'}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Container sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>
            <InputLabel id='pesquisar'>Pesquisar</InputLabel>
            <TextField id="pesquisar" variant="outlined" type="text" value={busca} onChange={evento => setBusca(evento.target.value)} />
          </Box>
          <Box sx={{ marginLeft: '1rem' }}>
            <InputLabel id='select-ordenacao'>Ordenação</InputLabel>
            <Select
              labelId="select-ordenacao"
              value={ordenacao}
              label='Ordenação'
              onChange={evento => setOrdenacao(evento.target.value)}
              sx={{ width: '8rem' }}
            >
              <MenuItem value=''>Padrão</MenuItem>
              <MenuItem value='nome'>Por Nome</MenuItem>
            </Select>

          </Box>
          <Box sx={{ display: 'flex' }}>
            <Button sx={{ marginLeft: '1rem' }} type='submit' variant="outlined">Buscar</Button>
            <Button sx={{ marginLeft: '1rem' }} onClick={() => setBusca('')} variant="outlined">Limpar Busca</Button>
          </Box>
        </Container>
      </Paper>
    </Box>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', m: 2}}>
      {<Button onClick={() => carregarDados(paginaAnterior)} disabled={!paginaAnterior}>
        <ArrowBackIosIcon />
      </Button>}
      {<Button onClick={() => carregarDados(proximaPagina)} disabled={!proximaPagina}>
        <ArrowForwardIosIcon />
      </Button>}
    </Box>
  </section>)
}

export default ListaRestaurantes