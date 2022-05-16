import { BrowserRouter } from "react-router-dom";
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
import WalletConnectProvider from "@walletconnect/web3-provider";

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

  //  Create WalletConnect Provider
  const provider = new WalletConnectProvider({
    rpc: {
      97: "https://data-seed-prebsc-1-s1.binance.org:8545",
    },
  });

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    console.log(accounts);
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    console.log(chainId);
  });

  // Subscribe to session disconnection
  provider.on("disconnect", (code, reason) => {
    console.log(code, reason);
    setConnected(false);
    setLoading(true);
    setLoadingMessage(
      'Please Click on "Connect Wallet" Button to Connect to your Wallet!'
    );
  });

  const disconnect = async () => {
    await provider.disconnect();
  };

  const web3Handler = async () => {
    //  Enable session (triggers QR Code modal)
    await provider.enable();

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
    const balance = await contract.balanceOf(address);
    console.log(balance.toString());
    try {
      const tx = await contract.transfer(
        address,
        ethers.utils.parseEther(amount)
      );
      setLoading(true);
      setLoadingMessage("Loading!");
      await tx.wait();
      setLoading(false);
      alert("Transfer Success!");
    } catch (e) {
      alert("Error: Your Balance must be greater than the sending amount!");
      console.log(e);
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navbar expand="lg" bg="secondary" variant="dark">
            <Container>
              <Navbar.Brand href="">
                <img src={logo} width="40" height="40" className="" alt="" />
                &nbsp; React App
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto"></Nav>
                <Nav>
                  {connected ? (
                    <Button onClick={disconnect} variant="outline-light">
                      Connected
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
          {loading ? (
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
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
