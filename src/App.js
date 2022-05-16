import {
  BrowserRouter,
} from "react-router-dom";
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import ContractAbi from './contractsData/contract.json'
import ContractAddress from './contractsData/contract-address.json'
import { Spinner, Navbar, Nav, Button, Container, Row, Form } from 'react-bootstrap'
import logo from './logo.svg'
import './App.css';

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState({})
  const [amount, setAmount] = useState(0)
  const [address, setAddress] = useState("")

  const web3Handler = async () => {
    let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])

    // Setup event listeners for metamask
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    })
    window.ethereum.on('accountsChanged', async () => {
      setLoading(true)
      web3Handler()
    })
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Get signer
    const signer = provider.getSigner()
    loadContract(signer)
  }
  const loadContract = async (signer) => {

    // Get deployed copy of Decentratwitter contract
    const contract = new ethers.Contract(ContractAddress.address, ContractAbi.abi, signer)
    setContract(contract)
    console.log(contract)
    setLoading(false)
  }

  const sendAmount = async () => {
    const balance = await contract.balanceOf(address)
    console.log(balance.toString())
    try {
      const tx = await contract.transfer(address, ethers.utils.parseEther(amount))
      await tx.wait()
      alert("Transfer Success!")
    } catch(e) {
      alert("Error: Your Balance must be greater than the sending amount!")
    }

  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navbar expand="lg" bg="secondary" variant="dark">
            <Container>
              <Navbar.Brand href="http://www.dappuniversity.com/bootcamp">
                <img src={logo} width="40" height="40" className="" alt="" />
                &nbsp; React App
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  {/* <Nav.Link as={Link} to="/">Home</Nav.Link> */}
                  {/* <Nav.Link as={Link} to="/profile">Profile</Nav.Link> */}
                </Nav>
                <Nav>
                  {account ? (
                    <Nav.Link
                      href={`https://etherscan.io/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button nav-button btn-sm mx-4">
                      <Button variant="outline-light">
                        {account.slice(0, 5) + '...' + account.slice(38, 42)}
                      </Button>

                    </Nav.Link>
                  ) : (
                    <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <div className="container-fluid mt-5">
              <div className="row">
                    <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
                        <div className="content mx-auto">
                            <Row className="g-4">
                                <Form.Control placeholder="Enter amount to send" onChange={(e) => setAmount(e.target.value)} size="lg" />
                                <Form.Control placeholder="Enter address of the receiver" onChange={(e) => setAddress(e.target.value)} size="lg" />
                                <div className="d-grid px-0">
                                    <Button onClick={() => {sendAmount()}} variant="primary" size="lg">
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