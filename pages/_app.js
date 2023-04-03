import '../styles/globals.css'

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// your custom app
//Toast container should be rendered on each page
function MyApp({ Component, pageProps }) {
  return (<>
  <Component {...pageProps} />
  <ToastContainer />
  </>)
}

export default MyApp
