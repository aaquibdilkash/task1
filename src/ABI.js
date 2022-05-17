import { useState } from "react";
import { Row, Form, Button, Card, ListGroup } from "react-bootstrap";
import axios from "axios";
const BSC_API_KEY = "TBVGHHX5NVZR7JP97KZXAHRJQ9ZG6RICYR";
const ETH_API_KEY = "XD2C5TBXNAI1ADJNMTJXWKASFV8PQTHVXQ";

const ABI = () => {
  const [address, setAddress] = useState(
    "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359"
  );
  const [abi, setAbi] = useState("");
  const [chain, setChain] = useState("Ethereum");

  const getAbi = async () => {
    let endPoint;

    if (chain == "Ethereum") {
      endPoint = `http://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETH_API_KEY}`;
    } else if (chain == "BSC") {
      endPoint = `http://api.bscscan.com/api?module=contract&action=getabi&address=${address}&apikey=${BSC_API_KEY}`;
    } else if (chain == "BSC Testnet") {
      endPoint = `https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=${address}`;
    } else if (chain == "Ropsten") {
      endPoint = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${address}`;
    } else if (chain == "Rinkeby") {
      endPoint = `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${address}`;
    } else if (chain == "Kovan") {
      endPoint = `https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=${address}`;
    }

    const res = await axios.get(endPoint);

    setAbi(res.data.result);
  };

  return (
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
                value={address}
                placeholder="Contract Address"
                onChange={(e) => setAddress(e.target.value)}
                size="lg"
                required
              />
              <Form.Select
                onChange={(e) => {
                  const val = e.target.value;
                  setChain(val);
                }}
                size="lg"
              >
                <option>Ethereum</option>
                <option>Kovan</option>
                <option>Rinkeby</option>
                <option>Ropsten</option>
                <option>BSC</option>
                <option>BSC Testnet</option>
              </Form.Select>
              <div className="d-grid px-0">
                <Button onClick={getAbi} variant="primary" size="lg">
                  Get ABI
                </Button>
              </div>
              <Form.Control placeholder="Contract ABI" value={abi} size="lg" as="textarea" rows="15"/>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ABI;
