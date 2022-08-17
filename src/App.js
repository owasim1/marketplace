import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";
import I1 from "./assets/images/1.png"
import I2 from "./assets/images/2.png"
import I3 from "./assets/images/3.png"
import I4 from "./assets/images/4.png"
import I5 from "./assets/images/5.png"

const contractAddress = "0xcEA2c487A62c2421dab44433362cb1796c9B5e48";

function App() {

  const [account, setAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  // state for whether app is minting or not.
  const [isMinting, setIsMinting] = useState(false);


  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect(() => {
    function initNFTContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress,contractABI.abi,signer));
    }
    initNFTContract();
  }, [account]);


  async function connectWallet() {
    window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts) => {
          setAccount(accounts[0]);
        })
        .catch((error) => {
          alert("Something went wrong");
        });
  }


  const data = [
    {
      url: I1,
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/1.png')",
    },
    {
      url: I2,
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/2.png')",
    },
    {
      url: I3,
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/3.png')",
    },
    {
      url: I4,
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/4.png')",
    },
    {
      url: I5,
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/5.png')",
    },
  ];

  async function withdrawMoney(){
    try {

      const response = await NFTContract.withdrawMoney();
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }

  }

  async function handleMint(tokenURI) {
    setIsMinting(true);
    try {
      const options = {value: ethers.utils.parseEther("0.01")};
      const response = await NFTContract.mintNFT(tokenURI, options);
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }
    finally {
      setIsMinting(false);
    }
  }

  if (account === null) {
    return (
        <>
          <div className="container">
            <br/>
            <h1> 🔮 metaschool</h1>
            <h2>NFT Marketplace</h2>
            <p>Buy an NFT from our marketplace.</p>

            {isWalletInstalled ? (
                <button onClick={connectWallet}>Connect Wallet</button>
            ) : (
                <p>Install Metamask wallet</p>
            )}
          </div>
        </>
    );
  }

  return (
      <>
        <div className="container">
          <br/>
          <h1> 🔮 metaschool</h1>

          <h2>NFT Marketplace</h2>
          {data.map((item, index) => (
              <div className="imgDiv">
                <img
                    src={item.url}
                    key={index}
                    alt="images"
                    width={250}
                    height={250}
                />
                <button isLoading={isMinting}
                        onClick={() => {
                          eval(item.param);
                        }}
                >
                  Mint - 0.01 eth
                </button>
              </div>
          ))}
          <button
              onClick={() => {
                withdrawMoney();
              }}
          >
            Withdraw Money from Contract
          </button>

        </div>

      </>
  );
}

export default App;