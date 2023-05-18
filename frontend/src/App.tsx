import './styles/global.css';
import Logo from './components/logo';

function App() {
  return (
    <div className='w-full max-w-screen-lg bg-stone-800 mx-auto h-full p-4'>
      <header className='w-full flex items-center justify-between border-b border-b-stone-700 pb-4'>
        <Logo height={64} />
        <div className='flex gap-2 items-center'>
          <p className='text-2xl h-full'>Vágner Lenon</p>
          <button className='text-2xl h-full text-blue-500'>( Sair )</button>
        </div>
      </header>
      <div className='w-full bg-stone-800 pt-4 flex gap-2'>
        <label htmlFor='nascimento' className='flex flex-col gap-1'>
          <strong className='font-medium ml-2'>Data de Nascimento</strong>
          <div className='flex p-1 bg-stone-700 rounded-lg h-10 border border-transparent focus-within:border-blue-500'>
            <input
              type='date'
              id='nascimento'
              className='w-full h-full bg-transparent outline-none p-2'
            />
          </div>
        </label>
        <label htmlFor='cidade' className='w-full flex-1 flex flex-col gap-1'>
          <strong className='font-medium ml-2'>Cidade onde mora</strong>
          <div className='flex p-1 bg-stone-700 rounded-lg h-10 border border-transparent focus-within:border-blue-500'>
            <input
              placeholder='Cidade onde mora ou gostaria (dos estados Unidos)'
              type='text'
              id='cidade'
              className='w-full h-full bg-transparent outline-none p-2'
            />
          </div>
        </label>
      </div>
    </div>
  );
}

export default App;
