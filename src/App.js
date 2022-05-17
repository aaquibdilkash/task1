import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ContractAbi from "./contractsData/contract.json";
import ContractAddress from "./contractsData/contract-address.json";
import {
  Spinner,
  Navbar,
  Nav,
  Button,
  Container,
  Row,
  Form,
} from "react-bootstrap";
import logo from "./logo.svg";
import "./App.css";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";
import ABI from "./ABI";

function App() {
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    'Please Click on "Connect Wallet" Button to Connect to your Wallet!'
  );
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState({});
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");
  const [connected, setConnected] = useState(false);

  const providerOptions = {
    binancechainwallet: {
      package: true,
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          97: "https://data-seed-prebsc-1-s1.binance.org:8545",
        },
        chainId: 97,
        network: "binance-testnet",
        infuraId: "ba2878fc58f746b987d139af2c6ffeb9",
      },
    },
    walletlink: {
      package: WalletLink,
      options: {
        appName: "React App",
        infuraId: "765d4237ce7e4d999f706854d5b66fdc",
        rpc: "https://data-seed-prebsc-1-s1.binance.org:8545",
        chainId: 97,
        appLogoUrl: null,
        darkMode: true,
      },
    },
  };

  const web3Modal = new Web3Modal({
    network: "kovan",
    theme: "dark",
    cacheProvider: true,
    providerOptions,
  });

  const disconnect = async () => {
    // await provider.disconnect();
    // localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")
    await web3Modal.clearCachedProvider();
    setLoading(true);
    setConnected(false);
    setLoadingMessage(
      'Please Click on "Connect Wallet" Button to Connect to your Wallet!'
    );
    console.log("disconnected");
  };

  const web3Handler = async () => {
    //  Enable session (triggers QR Code modal)
    const provider = await web3Modal.connect();

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
      console.log(accounts);
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      console.log(chainId);
    });

    // Subscribe to provider connection
    provider.on("connect", (info) => {
      console.log(info);
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", (error) => {
      console.log(error);
      provider.close();
    });

    // Get provider from ethers ;
    const new_provider = new ethers.providers.Web3Provider(provider);

    // Get signer
    const signer = new_provider.getSigner();
    loadContract(signer);
  };

  const loadContract = async (signer) => {
    // Get deployed copy of BUSD contract
    const contract = new ethers.Contract(
      ContractAddress.address,
      ContractAbi.abi,
      signer
    );
    setContract(contract);
    console.log(contract);
    setLoading(false);
    setConnected(true);
  };

  const sendAmount = async () => {

    // const balance = await contract.balanceOf(address);
    // console.log(balance.toString());
    // let privateKey =
    //   "ddcf2748fa7fd02e3fec63ae0b6738c6d2b9ca4e6b115da1984bc22a0713ee1f";
    // let wallet = new ethers.Wallet(privateKey);
    // await wallet.signMessage("Hello World");

    // let mySignature = await signer.signMessage("Some custom message");
    try {
      setLoading(true);
      setLoadingMessage("Please Confirm Transaction!")
      const tx = await contract.transfer(
        address,
        ethers.utils.parseEther(amount)
      );
      setLoading(true);
      setLoadingMessage("Transferring!");
      await tx.wait();
      setLoading(false);
      alert("Transfer Success!");
    } catch (e) {
      alert("Error: Something went wrong!");
      setLoading(false)
      console.log(e);
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navbar expand="lg" bg="secondary" variant="dark">
            <Container>
              <Navbar.Brand as={Link} to="/">
                <img src={logo} width="40" height="40" className="" alt="" />
                &nbsp; React App
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/ABI">
                    ABI
                  </Nav.Link>
                </Nav>
                <Nav>
                  {connected ? (
                    <Button onClick={disconnect} variant="outline-light">
                      Disconnect Wallet
                    </Button>
                  ) : (
                    <Button onClick={web3Handler} variant="outline-light">
                      Connect Wallet
                    </Button>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </>
        <div>
          
            <Routes>
              <Route
                path="/"
                element={
                  loading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "80vh",
                      }}
                    >
                      <Spinner animation="border" style={{ display: "flex" }} />
                      <p className="mx-3 my-0">{loadingMessage}</p>
                    </div>
                  ) : (
                  <div className="container-fluid mt-5">
                    <div className="row">
                      <main
                        role="main"
                        className="col-lg-12 mx-auto"
                        style={{ maxWidth: "1000px" }}
                      >
                        <div className="content mx-auto">
                          <Row className="g-4">
                            <Form.Control
                              placeholder="Enter amount to send"
                              onChange={(e) => setAmount(e.target.value)}
                              size="lg"
                            />
                            <Form.Control
                              placeholder="Enter address of the receiver"
                              onChange={(e) => setAddress(e.target.value)}
                              size="lg"
                            />
                            <div className="d-grid px-0">
                              <Button
                                onClick={() => {
                                  sendAmount();
                                }}
                                variant="primary"
                                size="lg"
                              >
                                Send!
                              </Button>
                            </div>
                          </Row>
                        </div>
                      </main>
                    </div>
                  </div>
                  )
                }
              />
              <Route path="/abi" element={<ABI />} />
            </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
