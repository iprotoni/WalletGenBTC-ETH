import * as bip39 from 'bip39';
import * as hdkey from 'hdkey';
import * as createHash from 'create-hash';
import * as bs58check from 'bs58check';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';



export default function HomeV() {

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

  const bitcoinWallet = async () => {
    const mnemonic = bip39.generateMnemonic()
    //const mnemonic = "gentle mutual speak consider mandate kingdom cash explain soul exile cabin squeeze";
    setBtcMnemonic(mnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic); //creates seed buffer
    console.log('Seed: ' + seed);
    console.log('mnemonic: ' + mnemonic);

    const root = hdkey.fromMasterSeed(seed);
    const masterPrivateKey = root.privateKey.toString('hex');
    setBtcPrivateKey(masterPrivateKey);
    console.log('masterPrivateKey: ' + masterPrivateKey);

    const addrnode = root.derive("m/44'/0'/0'/0/0");
    setBtcPublicKey(addrnode._publicKey)
    console.log('addrnodePublicKey: ' + addrnode._publicKey)

    const step1 = addrnode._publicKey;
    const step2 = createHash('sha256').update(step1).digest();
    const step3 = createHash('rmd160').update(step2).digest();

    var step4 = Buffer.allocUnsafe(21);
    step4.writeUInt8(0x00, 0);
    step3.copy(step4, 1); //step4 now holds the extended RIPMD-160 result
    const step9 = bs58check.encode(step4);
    setBtcWallet(step9);
    console.log('Base58Check: ' + step9);
  };

  const ethereumWallet = async () => {
    const ethers = require('ethers')
    const wallet = ethers.Wallet.createRandom()
    setEthWallet(wallet.address);
    setEthMnemonic(wallet.mnemonic.phrase);
    setEthPrivateKey(wallet.privateKey);
    setEthPublicKey(wallet.publicKey);
    console.log('address:', wallet.address)
    console.log('mnemonic:', wallet.mnemonic.phrase)
    console.log('privateKey:', wallet.privateKey)
    console.log('publicKey:', wallet.publicKey)
  }
  return (
    <section>
      <div className='flex flex-col gap-y-3 mx-10'>
        <h1 className='text-center font-bold text-2xl my-10'>Wallet Address Generator (BTC & ETH)</h1>
        <button onClick={bitcoinWallet} className=" px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
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
          <span className='text-lg font-semibold'>Mnemonic:</span>
          <CopyToClipboard text={btcMnemonic}
            onCopy={() => { setCopied(true) }}>
            <span className='w-full break-words cursor-pointer'>{btcMnemonic}</span>
          </CopyToClipboard>
        </div>
        <div className='flex flex-col gap-y-3 justify-start items-start'>
          <span className='text-lg font-semibold'>PrivateKey:</span>
          <CopyToClipboard text={btcPrivateKey}
            onCopy={() => { setCopied(true) }}>
            <span className='w-full break-words cursor-pointer'>{btcPrivateKey}</span>
          </CopyToClipboard>
        </div>
        <div className='flex flex-col gap-y-3 justify-start items-start'>
          <span className='text-lg font-semibold'>PulicKey:</span>
          <CopyToClipboard text={btcPublicKey}
            onCopy={() => { setCopied(true) }}>
            <span className='w-full break-words cursor-pointer'>{btcPublicKey}</span>
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
    </section>
  )
}