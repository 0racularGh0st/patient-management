import Spinner from './spinner';
type LoaderProps = {
  width?: string;
  height?: string;
};
export const Loader = ({
  width = 'w-screen', height = 'h-screen',
}: LoaderProps) => {
  return (
    <div className={`${width} ${height} fixed top-0 left-0 z-[999] flex
     items-center justify-center bg-loader-background opacity-0 animate-showLoader`}>
      <Spinner />
    </div>
  );
};

export default Loader;
