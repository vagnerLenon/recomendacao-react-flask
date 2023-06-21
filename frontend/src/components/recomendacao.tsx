interface IRecomendacaoProps {
  className?: string;
  title?: string;
  key?: string;
  image?: string;
  author?: string;
  loading?: boolean;
}

const Recomendacao: React.FC<IRecomendacaoProps> = ({
  title,
  image,
  author,
  key,
  loading = false,
  className = '',
}) => {
  return loading ? (
    <div
      key={key}
      className={`flex flex-col w-full h-[418px] p-2 bg-stone-700 rounded animate-pulse ${className}`}
    >
      {' '}
    </div>
  ) : (
    <div
      key={key}
      className={`flex flex-col w-full h-[418px] p-2 bg-stone-700 rounded ${className}`}
    >
      <p className='flex flex-1 text-sm items-center justify-center text-center'>
        {title}
      </p>
      <div className='flex object-cover aspect-[0.6] overflow-hidden mt-4'>
        <img className='w-full h-full' src={image} alt={title} />
      </div>
      <p className='flex text-sm mt-3 truncate text-ellipsis text-center w-full items-center justify-center'>
        {author}
      </p>
    </div>
  );
};

export default Recomendacao;
