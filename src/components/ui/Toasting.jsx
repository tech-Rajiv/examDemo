import toast, { Toaster } from 'react-hot-toast';

const notify = () => toast('Here is your toast.');

const Toasting = () => {
  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
      <Toaster />
    </div>
  );
};


export default Toasting