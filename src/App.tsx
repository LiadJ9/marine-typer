import { GameMap, SideMenu } from './components';

const App = () => {
  return (
    <div className='relative w-dvw h-[100vh] flex justify-center items-center'>
      <SideMenu />
      <div className='w-full h-full bg-green-50'>
        <GameMap />
      </div>
    </div>
  );
};

export default App;
