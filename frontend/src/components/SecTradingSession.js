import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button, Form, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'
import { tradingBotData, tradingBotStart } from '../actions/tradingBotActions';
import ChartComponent from './ChartIndex';
import Loader from './Loader'

function SecTradingSession() {

  // Save bot params
  const initDropdowns = {
    "market": {
      "label": "Market",
      "values": ["BTCUSDT", "BTCBUSD", "ETHUSDT", "SOLUSDT"],
      "assetValues": ["BTC", "BTC", "ETH", "SOL"],
      "stableValues": ["USDT", "BUSD", "USDT", "USDT"],
      "selected": ""
    },
    "timeframe": {
      "label": "Timeframe",
      "values": ["1m", "5m", "30m", "1h", "4h", "12h", "1d", "1w"],
      "selected": ""
    }
  }
  const initParams = {
    "rsiBuy": {
      "value": 30,
      "min": 1,
      "max": 100
    },
    "rsiSell": {
      "value": 70,
      "min": 1,
      "max": 100
    },
    "capitalToSell": {
      "value": 0.99,
      "min": 0.001,
      "max": 1
    },
    "minimumGain": {
      "value": 1.01,
      "min": 1,
      "max": 2
    },
    "movingAvgFast": {
      "value": 15,
      "min": 5,
      "max": 100
    },
    "movingAvgSlow": {
      "value": 240,
      "min": 100,
      "max": 500
    }
  }
  const [botDropdown, setBotDropdown] = useState(initDropdowns);
  const [botParams, setBotParams] = useState(initParams);

  const dispatch = useDispatch();
  
  // Get trading chart data
  const [submitParams, setSubmitParams] = useState(false); 

  const botData = useSelector(state => state.botData);
  const { loading, chartData, tradingData, params} = botData;

  // const state = useSelector(state => state);
  const timestamp = Date.now();

  //sleep function to trigger query 
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  /*** Send params to backend ***/
  const handleSubmitParams = async () => {
    const N = 1000
    //set default values
    const asset = botDropdown["market"].selected == '' ?
      "BTC"
    : botDropdown["market"].assetValues[botDropdown["market"].values.indexOf(botDropdown["market"].selected)]
    const stable = botDropdown["market"].selected == '' ?
      "USDT"
    : botDropdown["market"].stableValues[botDropdown["market"].values.indexOf(botDropdown["market"].selected)]
    const timeframe = botDropdown["timeframe"].selected == '' ?
      "1m"
    : botDropdown["timeframe"].selected
    var params = {
      "asset": asset,
      "stable": stable,
      "timeframe": timeframe,
      "rsiBuy": botParams["rsiBuy"].value,
      "rsiSell": botParams["rsiSell"].value,
      "percToSell": botParams["capitalToSell"].value,
      "marginSell": botParams["minimumGain"].value,
      "moveAvgFast": botParams["movingAvgFast"].value,
      "moveAvgSlow": botParams["movingAvgSlow"].value,
      "timestamp": timestamp
    }

    console.log(params)
    dispatch(tradingBotStart(params))
    setSubmitParams(true)
    
    for(let i = 0; i < N; i++ ){
      await sleep(10000)
      dispatch(tradingBotData(timestamp))
    }
  }

  // Dropdown 
  const inputDropdown = (initLabel) => {

    var dropdown = botDropdown[initLabel]
    var label = dropdown["selected"] == '' ?
                  dropdown["label"]
                : dropdown["label"] + ": " + dropdown["selected"] 

    return(      
      <div className="d-grid gap-2">
        <DropdownButton
          as={ButtonGroup}
          id={`dropdown`}
          variant='primary'
          title={label}
        >
          {
           dropdown["values"].map(
              (value, index) => (                
                <Dropdown.Item 
                key={index} 
                eventKey={index} 
                onClick={() => setBotDropdown({
                  ...botDropdown,
                  [initLabel]:{
                    ...dropdown,
                    selected: value
                  }})
                }
              >{value}</Dropdown.Item>                
              )
            )
          }
        </DropdownButton>
      </div>    
    );
  }
  /*** VALIDATION ***/
  // onChange: red text for invalid values
  const handleOnChangeBotParams = (target) => {
    const targetId = target.id
    const targetMax = botParams[targetId].max
    const targetMin = botParams[targetId].min

    const inputValue = target.value
    var newValue

    switch (true){
      case inputValue === '':
        newValue = ''
        target.style.color = ""
        break;
      case inputValue > targetMax:
        newValue = parseFloat(inputValue)
        target.style.color = "red"
        break;
      case inputValue < targetMin:
        newValue = parseFloat(inputValue)
        target.style.color = "red"
        break;
      default:
        newValue = parseFloat(inputValue)
        target.style.color = ""
        break;      
    }

    setBotParams({
      ...botParams, 
      [targetId]: {
        ...botParams[targetId], 
        value: newValue
      }
    })
  }
  // onBlur: black text, min and max for invalid values
  const handleOnBlurBotParams = (target) => {
    const targetId = target.id
    const targetMax = botParams[targetId].max
    const targetMin = botParams[targetId].min

    const inputValue = target.value
    var newValue

    switch (true){
      case ( inputValue == '' || inputValue < targetMin ):
        newValue = parseFloat(targetMin)
        break;
      case inputValue > targetMax :
        newValue = parseFloat(targetMax)
        break;
      default:
        newValue = parseFloat(inputValue)  
        break;      
    }

    setBotParams({
      ...botParams, 
      [targetId]: {
        ...botParams[targetId], 
        value: newValue
      }
    })  
    target.style.color = ""
  }
  /*** SECTIONS ***/ 
  // BotParams 
  const secBotParams = () => {
    return (     
      <Form>
        <h4 className='text-white'>Bot Parameters Setting</h4>
        <Form.Group>
          <Row>
            <Col className='p-2' lg={2} md={2} sm={6} xs={6}>
              {inputDropdown("market")}
            </Col>  
            <Col className='p-2' lg={2} md={2} sm={6} xs={6}>
              {inputDropdown("timeframe")}
            </Col>  
          </Row>   

          <Row>                        
            <Col className='p-2' lg={2} md={2} sm={6} xs={6}>
              <Form.Label>RSI buy signal</Form.Label>
              <Form.Control           
                id='rsiBuy'                   
                className='rounded'
                as="input" 
                type="number" 
                value={botParams.rsiBuy.value} 
                onChange={e => handleOnChangeBotParams(e.target)}
                onBlur={e => handleOnBlurBotParams(e.target)}
              />
            </Col>
            <Col className='p-2' lg={2} md={2} sm={6} xs={6}>
              <Form.Label>RSI sell signal</Form.Label>
              <Form.Control     
                id='rsiSell'           
                className='rounded'
                as="input" 
                type="number"
                value={botParams.rsiSell.value} 
                onChange={e => handleOnChangeBotParams(e.target)}
                onBlur={e => handleOnBlurBotParams(e.target)}
              />
            </Col>

            <Col className='p-2' lg={2} md={2} sm={6} xs={6}>
              <Form.Label>Capital to sell</Form.Label>
              <Form.Control
                id='capitalToSell'                              
                className='rounded'
                as="input" 
                type="number"
                value={botParams.capitalToSell.value} 
                onChange={e => handleOnChangeBotParams(e.target)}
                onBlur={e => handleOnBlurBotParams(e.target)}
              />
            </Col>
            <Col className='p-2' lg={2} md={2} sm={6} xs={6}>
              <Form.Label>Minimun gain</Form.Label>
              <Form.Control      
                id='minimumGain'             
                className='rounded'
                as="input" 
                type="number"
                value={botParams.minimumGain.value} 
                onChange={e => handleOnChangeBotParams(e.target)}
                onBlur={e => handleOnBlurBotParams(e.target)}
              />
            </Col>

            <Col className='p-2' lg={2} md={2} sm={6} xs={6}>
              <Form.Label>Moving Avg fast</Form.Label>
              <Form.Control   
                id='movingAvgFast'                 
                className='rounded'
                as="input" 
                type="number"
                value={botParams.movingAvgFast.value} 
                onChange={e => handleOnChangeBotParams(e.target)}
                onBlur={e => handleOnBlurBotParams(e.target)}
              />
            </Col>
            <Col className='p-2' lg={2} md={2} sm={6} xs={6}>
              <Form.Label>Moving Avg slow</Form.Label>
              <Form.Control    
                id='movingAvgSlow'                
                className='rounded'
                as="input" 
                type="number"            
                value={botParams.movingAvgSlow.value} 
                onChange={e => handleOnChangeBotParams(e.target)}
                onBlur={e => handleOnBlurBotParams(e.target)}
              />
            </Col>
          </Row>       

          <Row>          
            <Col className='p-2' lg={{span: 6, offset: 3}} md={{span: 6, offset: 3}} sm={12} xs={12}>  
              <div className="d-grid gap-2">
                {
                submitParams ? <Loader/> :
                <Button 
                  variant="primary" 
                  className="float-end rounded"                                            
                  onClick={handleSubmitParams}
                  >
                  submit params
                </Button>
                }         
              </div> 
            </Col>           
          </Row>           
        </Form.Group>            
      </Form>
    );
  }
  // TradingData + ChartData  
  const boxChartData = () => {
    const lastIndex = tradingData.length - 1
    const lastTradingData = tradingData[lastIndex]
    const lastChartData = chartData[lastIndex]
    const assetValue = (lastChartData.close * parseFloat(lastTradingData.balanceAsset)).toFixed(2)  

    return (    
      <>
        <Form>
          <Form.Group>      
            <Row className='py-2 align-items-center bg-primary my-2'>             
              <Col className='p-2 align-items-center ' lg={6} md={6} sm={6} xs={6}>
                <p className='text-white text-center m-1'>{lastTradingData.balanceStable} {params.stable}</p>
              </Col>
              <Col className='p-2 align-items-center ' lg={6} md={6} sm={6} xs={6}>
                <p className='text-white text-center m-2'>{lastTradingData.balanceAsset} {params.asset} ({assetValue} {params.stable})</p>
              </Col>              
            </Row>  

            <Row className='py-2 align-items-center bg-primary my-2'>
              <Col className='p-2 align-items-center ' lg={6} md={6} sm={6} xs={6}>
                <p className='text-white text-center m-2'>LAST CLOSE {lastChartData.close} {params.stable}</p>
              </Col>
              <Col className='p-2 align-items-center ' lg={6} md={6} sm={6} xs={6}>
                <p className='text-white text-center m-2'>RSI {lastTradingData.rsiTwo}</p>
              </Col>
            </Row>      

            <Row className='py-2 align-items-center bg-primary my-2'>                    
              <Col className='p-2 align-items-center ' lg={6} md={6} sm={6} xs={6}>
                <p className='text-white text-center m-2'>AVG FAST {lastTradingData.avgFast} {params.stable}</p>
              </Col>
              <Col className='p-2 align-items-center ' lg={6} md={4} sm={6} xs={6}>
                <p className='text-white text-center m-2'>AVG SLOW {lastTradingData.avgSlow} {params.stable}</p>
              </Col>
            </Row>        

            <Row className='py-2 align-items-center bg-primary my-2'>                    
              <Col className='p-2 align-items-center ' lg={6} md={6} sm={6} xs={6}>
                <p className='text-white text-center m-2'>AVG BUY {lastTradingData.avgBuyPrice} {params.stable}</p>
              </Col>
              <Col className='p-2 align-items-center ' lg={6} md={4} sm={6} xs={6}>
                <p className='text-white text-center m-2'>AVG SELL {lastTradingData.avgSellPrice} {params.stable}</p>
              </Col>
            </Row>   

          </Form.Group>            
        </Form>

        <Row className='py-2'>
          <ChartComponent data={chartData}></ChartComponent>        
        </Row>       
      </>
    );
  }
  // BotData 
  const secBotData = () => {
    return (    
      <>
        <h4 className='text-white py-2 my-2'>Trading data live {params.asset + params.stable }</h4>
        {chartData.length > 1 ? boxChartData() : <Loader/>}
      </>     
    );
  }  

  return (
    <div>     
      { submitParams && botData.anyData ? secBotData() : secBotParams() }   
    </div>
  )
}

export default SecTradingSession
