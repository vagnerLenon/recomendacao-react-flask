import { useCallback, useContext, useEffect, useState } from 'react';
import Logo from '../components/logo';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  FaChevronRight,
  FaChevronDown,
  FaSpinner,
  FaTrashAlt,
} from 'react-icons/fa';

import api from '../services/api';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { AuthContext } from '../hooks/authContext';

import Recomendacao from '../components/recomendacao';

import GlobalStyles from '@mui/material/GlobalStyles';

interface IBook {
  AUTHOR: string;
  IMAGE_L: string;
  IMAGE_M: string;
  IMAGE_S: string;
  TITLE: string;
  YEAR_OF_PUBLICATION: number;
}

interface IRecomendationBook {
  loading: boolean;
  title: string;
  data: IBook[] | null;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Home: React.FC = () => {
  const { haveUser, user, login, logOut, updateData } = useContext(AuthContext);
  const [baseLocations, setbaseLocations] = useState<string[]>(['']);
  const [livros, setLivros] = useState<IBook[]>([] as IBook[]);
  const [livrosList, setLivrosList] = useState<string[]>([]);

  const [loadingPopularity, setLoadingPopularity] = useState<boolean>(true);

  const [livroSelecionado, setLivroSelecionado] = useState<string | null>(null);

  const [populares, setPopulares] = useState<IBook[]>([]);
  const [conhecer, setConhecer] = useState<IBook[]>([]);

  const [pais, setPais] = useState<string | null>(null);
  const [nascimento, setNascimento] = useState<string | null>(null);

  const [recomendadosAbertos, setRecomendadosAbertos] = useState<boolean>(true);
  const [conhecaAbertos, setConhecaAbertos] = useState<boolean>(false);

  const [recomendationBooks, setRecomendationBooks] = useState<
    IRecomendationBook[]
  >([]);

  const handleGetPopularity = useCallback(() => {
    setLoadingPopularity(true);
    api
      .post('popularity', { nascimento: nascimento, pais: pais })
      .then(r => {
        if (r.data.success) {
          const { conhecer, popular } = r.data;
          setPopulares(popular);
          setConhecer(conhecer);
        }
        setLoadingPopularity(false);
      })
      .catch(err => {
        setLoadingPopularity(false);
      });
  }, [nascimento, pais]);

  useEffect(() => {
    api.get('paises').then(r => {
      setbaseLocations(r.data);
    });

    api.get('books_list').then(r => {
      setLivros(r.data);
      setLivrosList(r.data.map((d: IBook) => d.TITLE));
    });

    handleGetPopularity();
  }, [handleGetPopularity]);

  const handleLogin = useCallback(() => {
    const nome = document.getElementById('nome') as HTMLInputElement;
    if (nome && nome.value) {
      login(nome.value);
      handleGetPopularity();
    } else {
      alert('Digite seu nome para continuar');
    }
    nome.value = '';
  }, [handleGetPopularity, login]);

  const handleSave = useCallback(() => {
    const nascimento = document.getElementById(
      'nascimento'
    ) as HTMLInputElement;

    setNascimento(nascimento?.value ?? null);

    updateData({
      cidade: pais,
      nascimento: nascimento?.value || null,
      livros: null,
    });

    handleGetPopularity();
  }, [handleGetPopularity, pais, updateData]);

  const handleAddLivroPreferido = useCallback(
    (title: string) => {
      if (
        recomendationBooks.filter(rb => rb.title === title).length === 0 &&
        recomendationBooks.length < 3
      ) {
        api.get(`http://localhost:5000/similaridade?title=${title}`).then(r => {
          if (r.data.success) {
            const { livros } = r.data;
            const rb = [...recomendationBooks];
            rb.push({
              title: title,
              loading: false,
              data: livros,
            });
            setRecomendationBooks(rb);
          }
        });
      }
    },
    [recomendationBooks]
  );

  const handleRemoveLivroPreferido = useCallback(
    (title: string) => {
      if (recomendationBooks !== null) {
        const livrosPref = recomendationBooks.filter(lp => lp.title !== title);
        setRecomendationBooks(livrosPref);
      }
    },
    [recomendationBooks]
  );

  const handleLogout = useCallback(() => {
    logOut();
    setPais(null);
    setPopulares([]);
    setConhecer([]);
    setRecomendationBooks([]);
  }, [logOut]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div
        className={`absolute bg-neutral-100/10 backdrop-blur-sm  w-full h-screen z-50 transition-opacity ${
          haveUser
            ? 'opacity-0 pointer-events-none'
            : 'opacity-1 pointer-events-auto'
        }`}
      >
        <div
          className={`w-96 flex flex-col bg-stone-100 text-stone-900 mx-auto mt-20 p-4 rounded-xl transition-transform ${
            haveUser ? '-translate-y-full' : 'translate-y-0'
          }`}
        >
          <div className='flex flex-col  w-full border-b border-b-stone-300 pb-4'>
            <p className='text-3xl'>Olá! </p>
            <p className='text-2xl'>Para começar diga seu nome</p>
          </div>

          <label htmlFor='nome' className='flex flex-col gap-1 mt-4 h-14'>
            <div className=' h-14 flex p-1 bg-stone-200 border border-transparent rounded-lg focus-within:border-fuchsia-500'>
              <input
                placeholder='Digite seu nome'
                type='text'
                id='nome'
                className='w-full h-full bg-transparent outline-none p-2'
              />
            </div>
          </label>
          <button
            type='button'
            className='px-8 mt-2 py-2 w-full flex h-10 items-center justify-center bg-fuchsia-700 text-white rounded-lg'
            onClick={e => {
              e.preventDefault();
              handleLogin();
            }}
          >
            Começar
          </button>
        </div>
      </div>
      <div className='w-full max-w-screen-lg bg-stone-800 mx-auto h-full p-4'>
        <header className='w-full flex items-center justify-between border-b border-b-stone-700 pb-4'>
          <Logo height={64} primaryColor='#A21CAF' />
          <div className='flex gap-2 items-center'>
            <p className='text-2xl h-full'>{user?.nome}</p>
            <button
              className='text-2xl h-full text-fuchsia-700'
              onClick={() => {
                handleLogout();
              }}
            >
              ( Sair )
            </button>
          </div>
        </header>
        <div className='flex flex-col w-full gap-4'>
          <div className='w-full bg-stone-800 pt-4 flex gap-2'>
            <label htmlFor='nascimento' className='flex flex-col gap-1'>
              <strong className='font-medium ml-2'>Data de Nascimento</strong>
              <div className='flex p-1 bg-stone-700 rounded-lg h-14 border border-transparent focus-within:border-fuchsia-500'>
                <input
                  type='date'
                  id='nascimento'
                  className='w-full h-full bg-transparent outline-none p-2'
                />
              </div>
            </label>
            <label htmlFor='pais' className='w-full flex-1 flex flex-col gap-1'>
              <strong className='font-medium ml-2'>País onde mora</strong>
              <GlobalStyles styles={{ height: 40 }} />

              <Autocomplete
                options={baseLocations}
                renderInput={params => (
                  <TextField
                    {...params}
                    placeholder='Selecione seu país'
                    id='pais'
                  />
                )}
                value={pais}
                onChange={(e: any, v: string | null) => {
                  setPais(v);
                }}
              />
            </label>
            <button
              type='button'
              className='mt-auto w-28 justify-center px-8 py-2 flex h-10 self-end items-center bg-fuchsia-700 text-white rounded-lg'
              onClick={() => {
                handleSave();
              }}
            >
              Salvar
            </button>
          </div>
          <div className='flex w-full gap-2 items-center'>
            <label
              htmlFor='livro'
              className='w-full flex-1 flex flex-col gap-1'
            >
              <strong className='font-medium ml-2'>
                Livro preferido (até 3)
              </strong>
              <GlobalStyles styles={{ height: 40 }} />

              <Autocomplete
                options={livrosList}
                renderInput={params => (
                  <TextField
                    {...params}
                    id='livros'
                    placeholder='Adicione um livro que você goste'
                  />
                )}
                value={livroSelecionado}
                onChange={(e: any, v: string | null) => {
                  setLivroSelecionado(v);
                }}
              />
            </label>
            <button
              type='button'
              className='mt-auto w-28 justify-center px-8 py-2 flex h-10 self-end items-center bg-fuchsia-700 text-white rounded-lg'
              onClick={() => {
                if (livroSelecionado !== null) {
                  handleAddLivroPreferido(livroSelecionado);
                  setLivroSelecionado(null);
                }
                //TODO implementar um auto-complete com os livros da base
              }}
            >
              Adicionar
            </button>
          </div>
        </div>
        <div className='mt-4 flex flex-col'>
          {populares !== null && (
            <div>
              <hr className='border-stone-600 mt-2 mb-4' />
              <div className='flex justify-between'>
                <div className='flex items-center gap-4 text-2xl'>
                  <h2 className=''>Recomendados para você</h2>
                  {loadingPopularity && (
                    <FaSpinner size={16} className='animate-spin' />
                  )}
                </div>
                <button
                  className='text-2xl py-2 px-4 rounded bg-stone-700'
                  onClick={() => {
                    setRecomendadosAbertos(a => !a);
                  }}
                >
                  {recomendadosAbertos ? (
                    <FaChevronDown size={16} color='#ffffff' />
                  ) : (
                    <FaChevronRight size={16} color='#ffffff' />
                  )}
                </button>
              </div>

              {recomendadosAbertos && (
                <div className='grid grid-cols-5 grid-rows-2 gap-2 mt-4'>
                  {!loadingPopularity &&
                    populares.map(p => (
                      <Recomendacao
                        key={p.TITLE}
                        title={p.TITLE}
                        image={p.IMAGE_L}
                        author={p.AUTHOR}
                      />
                    ))}
                  {loadingPopularity && (
                    <>
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {conhecer !== null && (
            <div>
              <hr className='border-stone-600 mt-8 mb-4' />
              <div className='flex justify-between'>
                <div className='flex items-center gap-4 text-2xl'>
                  <h2>Você também poderá gostar de</h2>
                  {loadingPopularity && (
                    <FaSpinner size={16} className='animate-spin' />
                  )}
                </div>
                <button
                  className='text-2xl py-2 px-4 rounded bg-stone-700'
                  onClick={() => {
                    setConhecaAbertos(a => !a);
                  }}
                >
                  {conhecaAbertos ? (
                    <FaChevronDown size={16} color='#ffffff' />
                  ) : (
                    <FaChevronRight size={16} color='#ffffff' />
                  )}
                </button>
              </div>
              {conhecaAbertos && (
                <div className='grid grid-cols-5 grid-rows-2 gap-2 mt-4'>
                  {!loadingPopularity &&
                    conhecer.map(p => (
                      <div
                        key={p.TITLE}
                        className='flex flex-col w-full h-full p-2 bg-stone-700 rounded'
                      >
                        <p className='flex flex-1 text-sm'>{p.TITLE}</p>
                        <div className='flex object-cover aspect-[0.6] overflow-hidden mt-4'>
                          <img
                            className='w-full h-full'
                            src={p.IMAGE_L}
                            alt={p.TITLE}
                          />
                        </div>
                        <p className='flex text-sm mt-3 truncate text-ellipsis'>
                          {p.AUTHOR}
                        </p>
                      </div>
                    ))}
                  {loadingPopularity && (
                    <>
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                      <Recomendacao loading />
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {recomendationBooks.length > 0 && (
            <>
              <hr className='border-stone-600 mt-8' />
              {recomendationBooks?.map(rb => (
                <>
                  <div className='flex justify-between mt-4' key={rb.title}>
                    <h2 className='text-2xl'>
                      Porque você gostou de{' '}
                      <span className='font-semibold italic'>{rb.title}</span>
                    </h2>
                    {!rb.loading ? (
                      <button
                        className='text-2xl py-2 px-4 rounded bg-red-900'
                        onClick={() => {
                          handleRemoveLivroPreferido(rb.title);
                        }}
                      >
                        <FaTrashAlt size={16} color='#ffffff' />
                      </button>
                    ) : (
                      <div className='text-2xl py-2 px-4'>
                        <FaSpinner size={16} className='animate-spin' />
                      </div>
                    )}
                  </div>
                  <div className='grid grid-cols-5 grid-rows-1 gap-2 mt-4'>
                    {rb.data &&
                      rb.data.map(p => (
                        <Recomendacao
                          key={p.TITLE}
                          title={p.TITLE}
                          image={p.IMAGE_L}
                          author={p.AUTHOR}
                        />
                      ))}
                  </div>
                </>
              ))}
            </>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Home;
