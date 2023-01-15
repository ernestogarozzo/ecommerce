import React, { useEffect, useState } from 'react'
import {useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Form, ListGroupItem } from 'react-bootstrap'

import Loader from '../components/Loader'
import { modelImage } from '../actions/productActions'


function AiModelScreen() {  

  const params = useParams();
  const dispatch = useDispatch();

  const imageData = useSelector(state => state.imageData);
  const [inputText, setInputText] = useState('');
  const [displayImg, setDisplayImg] = useState(false);
  const { loading, image } = imageData;

  
  const handleClick = () => {
    console.log(imageData)
    
    if (inputText.length > 5) {
      console.log(inputText)
      
      setDisplayImg(true)
      dispatch(modelImage(inputText))   
    }
    else {console.log(inputText.length)}
    
  }


  return (
    <div>
      <h1 className='text-white'> Stable Diffusion Model</h1>

      <Col >
        <Row className='m-2'>        
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
   
              <Form.Control 
                className="m-2" 
                as="textarea" 
                rows={5} 
                placeholder="Enter the input text..." 
                value={inputText} 
                onChange={e => setInputText(e.target.value)}
              />
  
              <Button variant="primary" className="float-end m-2" onClick={handleClick}>
                Submit
              </Button>         
           
            </Form.Group>            
          </Form>
        </Row>

        <Row className='m-2'>
          { 
            displayImg ? 
                loading ? <Loader /> 
                  : <img src={`data:image/jpeg;base64,${image["encoded_image"]}`} /> 
              : <div></div>
          }
        </Row> 
      </Col>    
    </div>
  )
}

export default AiModelScreen
