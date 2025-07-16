import { Toaster } from 'react-hot-toast';
import { Dialog, FishCaughtDialog, GameMap, SideMenu } from './components';
import { useFishStore } from './stores';

const App = () => {
  const caughtFish = useFishStore((s) => s.caughtFish);
  const setCaughtFish = useFishStore((s) => s.setCaughtFish);

  return (
    <div className='relative w-dvw h-[100vh] flex justify-center items-center'>
      <Toaster containerClassName='z-50' />
      <SideMenu />
      <div className='w-full h-full bg-green-50'>
        <GameMap />
      </div>
      <Dialog
        isOpen={Boolean(caughtFish)}
        setIsOpen={(_) => setCaughtFish(null)}
      >
        {() => (
          <FishCaughtDialog
            caughtFish={caughtFish}
            setIsOpen={() => setCaughtFish(null)}
            isOpen={Boolean(caughtFish)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default App;
