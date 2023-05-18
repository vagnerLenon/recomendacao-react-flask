import { useCallback, useContext } from 'react';
import Logo from '../components/logo';

import { AuthContext } from '../hooks/authContext';

const Home: React.FC = () => {
  const { haveUser, user, login, logOut, updateData } = useContext(AuthContext);

  const handleLogin = useCallback(() => {
    const nome = document.getElementById('nome') as HTMLInputElement;
    if (nome && nome.value) {
      login(nome.value);
    } else {
      alert('Digite seu nome para continuar');
    }
    nome.value = '';
  }, [login]);

  const handleSave = useCallback(() => {
    const nascimento = document.getElementById(
      'nascimento'
    ) as HTMLInputElement;
    const cidade = document.getElementById('cidade') as HTMLInputElement;

    updateData({
      cidade: cidade.value,
      nascimento: nascimento?.value || null,
      livros: null,
    });
  }, [updateData]);

  return (
    <>
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
          <label htmlFor='nome' className='flex flex-col gap-1 mt-4'>
            <div className='flex p-1 bg-stone-200 border border-transparent rounded-lg h-10 focus-within:border-fuchsia-500'>
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
                logOut();
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
              <div className='flex p-1 bg-stone-700 rounded-lg h-10 border border-transparent focus-within:border-fuchsia-500'>
                <input
                  type='date'
                  id='nascimento'
                  className='w-full h-full bg-transparent outline-none p-2'
                />
              </div>
            </label>
            <label
              htmlFor='cidade'
              className='w-full flex-1 flex flex-col gap-1'
            >
              <strong className='font-medium ml-2'>Cidade onde mora</strong>
              <div className='flex p-1 bg-stone-700 rounded-lg h-10 border border-transparent focus-within:border-fuchsia-500'>
                <input
                  placeholder='Cidade onde mora ou gostaria (dos estados Unidos)'
                  type='text'
                  id='cidade'
                  className='w-full h-full bg-transparent outline-none p-2'
                />
              </div>
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
              htmlFor='livros'
              className='w-full flex-1 flex flex-col gap-1'
            >
              <strong className='font-medium ml-2'>Livros preferidos</strong>
              <div className='flex p-1 bg-stone-700 rounded-lg h-10 border border-transparent focus-within:border-fuchsia-500'>
                <input
                  placeholder='Insira seus livros preferidos'
                  type='text'
                  id='livros'
                  className='w-full h-full bg-transparent outline-none p-2'
                />
              </div>
            </label>
            <button
              type='button'
              className='mt-auto w-28 justify-center px-8 py-2 flex h-10 self-end items-center bg-fuchsia-700 text-white rounded-lg'
              onClick={() => {
                //TODO implementar um auto-complete com os livros da base
              }}
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
