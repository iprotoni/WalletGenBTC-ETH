import * as bip39 from 'bip39';
import * as hdkey from 'hdkey';
import * as createHash from 'create-hash';
import * as bs58check from 'bs58check';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CSVLink } from 'react-csv'
import { GridLoader } from 'react-spinners'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CryptoAccount = require("send-crypto");

const btcFileName = "BTCWallets";
const ethFileName = "ETHWallets";

export default function Home() {


  const [loading, setLoading] = useState(false)
  const [btcWallet, setBtcWallet] = useState();
  const [btcPrivateKey, setBtcPrivateKey] = useState();
  const [btcPublicKey, setBtcPublicKey] = useState();
  const [btcMnemonic, setBtcMnemonic] = useState();

  const [ethWallet, setEthWallet] = useState();
  const [ethPrivateKey, setEthPrivateKey] = useState();
  const [ethPublicKey, setEthPublicKey] = useState();
  const [ethMnemonic, setEthMnemonic] = useState();

  const [value, setValue] = useState();
  const [copied, setCopied] = useState(false);

  const [btcAmount, setBtcAmount] = useState(1);
  const [ethAmount, setEthAmount] = useState(1);

  const [btcCsvData, setBtcCsvData] = useState([]);
  const [ethCsvData, setEthCsvData] = useState([]);

  const bitcoinWallet = async () => {
    try {
      setLoading(true)
      const privateKey = CryptoAccount.newPrivateKey();
      const account = new CryptoAccount(privateKey);
      setBtcPrivateKey(privateKey);
      console.log('privateKey: ' + privateKey);
      const walletAddress = await account.address("BTC");
      setBtcWallet(walletAddress);
      console.log('wallet: ' + walletAddress);
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log('Error: ', err)
      toast.error(err, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      })
    }

  };

  const ethereumWallet = async () => {
    try {
      setLoading(true)
      const ethers = require('ethers')
      const wallet = ethers.Wallet.createRandom()
      setEthWallet(wallet.address);
      setEthMnemonic(wallet.mnemonic.phrase);
      setEthPrivateKey(wallet.privateKey);
      setEthPublicKey(wallet.publicKey);
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log('Error: ', err)
      toast.error(err, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      })
    }

  }

  const exportFile = (data, fileName) => {
    const textDoc = document.createElement('a');

    const file = new Blob([data], { type: 'text/csv' });
    textDoc.href = URL.createObjectURL(file);
    textDoc.target = '_blank';
    textDoc.download = fileName;
    textDoc.click();
  }

  const btcExport = async () => {
    try {
      setLoading(true)
      var btcWalletList = [];
      const headers = ['Wallet, PrivateKey'];
      for (let i = 0; i < btcAmount; i++) {
        const privateKey = CryptoAccount.newPrivateKey();
        const account = new CryptoAccount(privateKey);
        console.log('privateKey: ' + privateKey);
        const walletAddress = await account.address("BTC");

        btcWalletList.push([walletAddress, privateKey].join(','));
      }
      console.log("====>", btcWalletList);

      // setBtcCsvData(btcWalletList);
      exportFile([...headers, ...btcWalletList].join('\n'), 'btcWallet.csv');
      setLoading(false);

    } catch (err) {
      setLoading(false)
      console.log('Error: ', err)
      toast.error(err, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      })
    }
  }

  const ethExport = () => {
    try {
      setLoading(true);
      var ethWalletList = [];
      const headers = ['Wallet, Mnemonic, PrivateKey, PulicKey'];
      for (let i = 0; i < ethAmount; i++) {
        const ethers = require('ethers')
        const wallet = ethers.Wallet.createRandom()

        ethWalletList.push([wallet.address, wallet.mnemonic.phrase, wallet.privateKey, wallet.publicKey].join(','));
      }
      // setEthCsvData(ethWalletList);
      exportFile([...headers, ...ethWalletList].join('\n'), 'ethWallet.csv');
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log('Error: ', err)
      toast.error(err, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      })
    }

  }

  return (
    <section>
      <>
        <div className='flex flex-col gap-y-3 mx-10'>
          <h1 className='text-center font-bold text-2xl my-10'>Wallet Address Generator (BTC & ETH)</h1>
          <button onClick={bitcoinWallet} className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
            Generate Bitcoin Wallet Address
          </button>
          <div className='flex flex-col gap-y-3 justify-start items-start'>
            <span className='text-lg font-semibold'>Wallet:</span>
            <CopyToClipboard text={btcWallet}
              onCopy={() => { setCopied(true) }}>
              <span className='w-full break-words cursor-pointer'>{btcWallet}</span>
            </CopyToClipboard>
          </div>
          <div className='flex flex-col gap-y-3 justify-start items-start'>
            <span className='text-lg font-semibold'>PrivateKey:</span>
            <CopyToClipboard text={btcPrivateKey}
              onCopy={() => { setCopied(true) }}>
              <span className='w-full break-words cursor-pointer'>{btcPrivateKey}</span>
            </CopyToClipboard>
          </div>
        </div>
        <div className='flex flex-col gap-y-3 mx-10 overflow-visible mt-10'>
          <button onClick={ethereumWallet} className=" px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
            Generate Ethereum Wallet Address
          </button>
          <div className='flex flex-col gap-y-3 justify-start items-start'>
            <span className='text-lg font-semibold'>Wallet:</span>
            <CopyToClipboard text={ethWallet}
              onCopy={() => { setCopied(true) }}>
              <span className='w-full break-words cursor-pointer'>{ethWallet}</span>
            </CopyToClipboard>
          </div>
          <div className='flex flex-col gap-y-3 justify-start items-start'>
            <span className='text-lg font-semibold'>Mnemonic:</span>
            <CopyToClipboard text={ethMnemonic}
              onCopy={() => { setCopied(true) }}>
              <span className='w-full break-words cursor-pointer'>{ethMnemonic}</span>
            </CopyToClipboard>
          </div>
          <div className='flex flex-col gap-y-3 justify-start items-start'>
            <span className='text-lg font-semibold'>PrivateKey:</span>
            <CopyToClipboard text={ethPrivateKey}
              onCopy={() => { setCopied(true) }}>
              <span className='w-full break-words cursor-pointer'>{ethPrivateKey}</span>
            </CopyToClipboard>
          </div>
          <div className='flex flex-col gap-y-3 justify-start items-start'>
            <span className='text-lg font-semibold'>PulicKey:</span>
            <CopyToClipboard text={ethPublicKey}
              onCopy={() => { setCopied(true) }}>
              <span className='w-full break-words cursor-pointer'>{ethPublicKey}</span>
            </CopyToClipboard>
          </div>
        </div>
        <div className='flex flex-wrap xm:flex-col gap-x-3 gap-y-10 mx-10 mt-10 justify-between items-center mb-10'>
          <div className='flex flex-col w-full gap-y-5 gap-x-3 justify-center items-center'>
            <span className='font-bold text-lg'>Bitcoin</span>
            <div className='flex gap-x-3'>
              <input className='px-4 py-1 md:py-2 md:text-lg md:px-5 xm:w-60 w-40 hover:border-black border-2 rounded-lg' placeholder='please input amount' type="number" min={1} max={500} value={btcAmount} onChange={e => { setBtcAmount(e.target.value) }} />
              <button className='px-4 py-1 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-5' onClick={btcExport}>
                Export
              </button>
            </div>
          </div>
          <div className='flex flex-col w-full gap-y-5 gap-x-3 justify-center items-center'>
            <span className='font-bold text-lg'>Ethereum</span>
            <div className='flex gap-x-3'>
              <input className='px-4 py-1 md:py-2 md:text-lg md:px-5 xm:w-60 w-40 hover:border-black border-2 rounded-lg' placeholder='please input amount' type="number" min={1} max={500} value={ethAmount} onChange={e => { setEthAmount(e.target.value) }} />
              <button className='px-4 py-1 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-5' onClick={ethExport}>
                Export
              </button>
            </div>
          </div>
        </div>
      </>
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-[rgba(90,153,153,0.4)]">
          <GridLoader
            // color={color}
            loading={loading}
            // cssOverride={override}
            // size={150}
            aria-label="Loading Spinner"
          />
        </div>
      )}
    </section>
  )
}