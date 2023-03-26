import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button, Form } from 'react-bootstrap'
import {  tradingWalletInfo } from '../actions/tradingBotActions';
import Loader from './Loader'

function SecTradingAccount() {

  // Save api and secret key 
  const [apiKey, setApiKey] = useState('NwZlCXwJ0fPAgM19NWmDfN8B5YfmZxkV287AFk6WWnYYyiP6kODFnNwL5pCn1YFj');
  const [secretKey, setSecretKey] = useState('E8KeI6V3uIE2taqhq0f0bVtPgubHTW6YvyiEewA1r2oBJBkYTkYW7Xb3dw1NDoiQ');
  const [submitKey, setSubmitKey] = useState(false); 

  // Get wallet info
  const walletInfo = useSelector(state => state.walletInfo);
  const { loadingWallet, wallet } = walletInfo;
  const dispatch = useDispatch();


  const handleSubmitKeys = () => {
    setSubmitKey(true)
    dispatch(tradingWalletInfo(apiKey,secretKey))
  }

  /*** SECTIONS ***/ 
  // ApiSecretKey 
  const secApiSecretKey = () => {
    return (
      <Form>
        <h4 className='text-white my-2 py-2'>Binance keys setting</h4>
        <Form.Group controlId="apiSecretKey">   
          <Row>
          <p className='text-white my-2'>Enter your Binance Api and Secret Keys to load wallet data: </p>            
            <Col className='p-2' lg={5} md={5} sm={12} xs={12}>
              <Form.Control                
                className='rounded'
                as="input" 
                rows={5} 
                placeholder="ApiKey" 
                value={apiKey} 
                onChange={e => setApiKey(e.target.value)}
              />
            </Col>

            <Col className='p-2' lg={5} md={5} sm={12} xs={12}>
              <Form.Control                
                className='rounded'
                as="input" 
                rows={5} 
                placeholder="SecretKey" 
                value={secretKey} 
                onChange={e => setSecretKey(e.target.value)}
              />
            </Col>
            
            <Col className='p-2' lg={2} md={2} sm={12} xs={12}>
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  className="float-end rounded"                                            
                  onClick={handleSubmitKeys}
                  >
                  Submit
                </Button>    
              </div>
            </Col>
            
          </Row>                              
        </Form.Group>            
      </Form>
    );
  }
  //Wallet Info
  const secWalletInfo = () => {
    return (
      <>
        <h4 className='text-white my-2 py-2'>Account Info</h4>
        {
          loadingWallet ? <Loader /> :    
          wallet["balances"].map((balance,index) => (
            <Col key={index} lg={4} md={4} sm={6} xs={6}>
              <p>{balance.asset}: {balance.free}</p>
            </Col>
          ))
        }
      </>
    );
  }
  
  return (
     <div>
        <Row className='py-2'>
          { submitKey ? secWalletInfo() : secApiSecretKey()}        
        </Row>
    </div>
  )
}

export default SecTradingAccount
