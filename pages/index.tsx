import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ContractInterface, ethers } from 'ethers'
import Web3Modal from 'web3modal'
import CodeCoin from '../utils/CodeCoin'
import { useState } from 'react'
import { Transition } from '@headlessui/react'

interface HomeProps {
  contractName: string;
contractSymbol: string;
contractAirdrops: number;
maxAirdropAddresses: number;
}

const Home: NextPage<HomeProps> = (props: HomeProps) => {

  const {contractName, contractSymbol, contractAirdrops, maxAirdropAddresses} = props

  const [airdropLoading, setAirdropLoading] = useState(false)
  const [notifications, setNotifications] = useState([])

  console.log(props)
  const CodeCoinContractAddress = CodeCoin.address
  const CodeCoinContractABI = CodeCoin.abi

  const connectFunc = async () => {
    const providerOptions = {
      /* See Provider Options Section */
    }

    const web3Modal = new Web3Modal({
      network: 'mainnet', // optional
      cacheProvider: true, // optional
      providerOptions, // required
    })
    try {
      const instance = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(instance)
      const signer = provider.getSigner()

      const CodeCoinContract = new ethers.Contract(
        CodeCoinContractAddress,
        CodeCoinContractABI,
        signer
      )
      

      await CodeCoinContract.mintAirdrop()
      // return CodeCoinContract

    } catch (error) {
      console.log(error)
    }

  }
  const formSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setAirdropLoading(true)
    
    await connectFunc()
    setAirdropLoading(false)


  }
  return (
    <div className="flex flex-col justify-center min-h-screen pb-2 text-white bg-black">
      <Head>
        <title>CodeCoin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="fixed top-0 z-10 w-full p-4 px-5 sm:px-20">
        <h1 className="text-xl font-bold">{contractName}</h1>
      </header>
      <main className="flex flex-col justify-center flex-1 w-full ">
      <Transition
        show={true}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 z-20 p-4 bg-green-300 rounded notification right-7">

        </div>
        </Transition>
        <div className="absolute bg-purple-500 circle -bottom-32 -left-32 h-72 w-72 opacity-70 blur-3xl"></div>
        <section className="relative flex flex-col items-center justify-center h-screen px-20 overflow-hidden text-center">
          <div className="absolute bg-blue-500 circle -top-32 -right-32 h-72 w-72 opacity-70 blur-3xl"></div>
          <h2 className="text-6xl sm:text-8xl">
            Crypto for <span className="text-blue-600">developers</span>
          </h2>
          <p></p>
          <button
            
            className="relative flex items-center justify-center gap-4 p-3 px-8 mt-3 transition-all duration-200 bg-black border border-white rounded border-width-2 top-20 hover:bg-white hover:text-black"
          >
            Get airdrop
          </button>
        </section>
        
        <section className="flex w-full gap-2 my-20 text-xl text-center">
          <div className="flex flex-col items-center justify-center flex-1 p-5 border-r border-white">
            <h4 className="font-bold">Total Supply:</h4>
            <p>120</p>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 p-5 border-r border-white">
            <h4 className="font-bold">Token Symbol </h4>
            <p>{contractSymbol}</p>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 p-5">
            <h4 className="font-bold">Airdrop slots left</h4>
            <p>{maxAirdropAddresses-contractAirdrops}</p>
          </div>
        </section>
        <section className="flex flex-col items-center justify-between w-full px-20 pb-20 ">
          <h3 className="mb-10 text-4xl text-center">Recieve your airdrop</h3>
          <form className="flex flex-col w-full gap-3 md:w-2/4 " action="">
            <label className="w-full" htmlFor="">
              <p className="text-sm text-gray-300">
                Follow <a href="">@princecodes247</a> on twitter
              </p>
              <input
                className="w-full p-3 mt-2 bg-black border border-white rounded border-width-2"
                type="text"
                placeholder="Enter your twitter handle"
              />
            </label>
            {/* <label className="w-full" htmlFor="">
              <p className="text-sm text-gray-300">
                Drop your ETH contract address
              </p>
              <input
                className="w-full p-3 mt-2 bg-black border border-white rounded border-width-2"
                type="text"
                placeholder="0x0000000"
              />
            </label> */}

            <button
            onClick={formSubmit}
            className="flex items-center justify-center gap-4 p-3 mt-3 transition-all duration-200 bg-black border border-white rounded border-width-2 hover:bg-white hover:text-black">

              <div className={`w-4 h-4 border border-white rounded-full animate-duration-3000 animate-spin border-x-0 ${!airdropLoading ? "hidden" : ""}`}></div>
              Get airdrop
            </button>
          </form>
        </section>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://www"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built by{' '}
          <span className="text-purple-500 underline underline-offset-2">
            PrinceCodes247
          </span>
        </a>
      </footer>
    </div>
  )
}

// GET PROPS FOR SERVER SIDE RENDERING
export async function getServerSideProps(context: any) {
  // get todo data from API
  let AlchemyApiKey = process.env.ALCHEMY_API_KEY

  // Use the mainnet
  const network = 'rinkeby'

  // Specify your own API keys
  // Each is optional, and if you omit it the default
  // API key for that service will be used.
  const provider = ethers.getDefaultProvider(network, {
    alchemy: AlchemyApiKey,
  })
  // const signer = provider.
  const CodeCoinContract = new ethers.Contract(
    CodeCoin.address,
    CodeCoin.abi,
    provider
  )


  try {
    const [contractName, contractSymbol, contractAirdrops, maxAirdropAddresses] =
    await Promise.all([
      CodeCoinContract.name(),
      CodeCoinContract.symbol(),
      CodeCoinContract.numAirdropsDone(),
      CodeCoinContract.maxAirdropAddresses(),
      
    ])
  // return props
  return {
    props: {
      contractName,
      contractSymbol,
      contractAirdrops,
      maxAirdropAddresses
    },
  }
  } catch (error) {
    console.log(error)
  }
  return {
    props: {}
  }
}

export default Home
