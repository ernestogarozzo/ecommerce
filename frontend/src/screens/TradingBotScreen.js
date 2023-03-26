import { useSelector } from 'react-redux'
import { Row, Button } from 'react-bootstrap'
import SecTradingAccount from '../components/SecTradingAccount'
import SecTradingSession from '../components/SecTradingSession';


function TradingBotScreen() {  

  const storeState = useSelector(state => state);
  

  const printStoreState = () => {
    console.log("store state:")
    console.log(storeState)    
  }  
  
  // Hide tradingParams before wallet data
  const isWalletEmpty = () => {
    const wallet = storeState.walletInfo.wallet
    return Object.keys(wallet).length === 0
  } 

  return (
     <div>
        <Row className='py-2'>
          <SecTradingAccount></SecTradingAccount>   
        </Row>

        <Row className='py-2'>
          {isWalletEmpty() ? <div></div> : <SecTradingSession></SecTradingSession>}               
        </Row>

        <Row className='py-5'>
          <Button 
            variant="primary" 
            className="float-end rounded"                                            
            onClick={printStoreState}
          >
            print state
          </Button>                         
        </Row>       
    </div>
  )
}

export default TradingBotScreen

