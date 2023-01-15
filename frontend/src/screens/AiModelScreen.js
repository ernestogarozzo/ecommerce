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
  const { loading, image , id} = imageData;

  const [inputText, setInputText] = useState('');
  const [submit, setSubmit] = useState(false); 
  const [idRequest, setIdRequest] = useState(0); 

  
  const handleClick = () => {

    if (inputText.length > 5) {      
      setSubmit(true)
      setIdRequest(idRequest + 1)
      dispatch(modelImage(inputText, idRequest))    
    }
    else {console.log(inputText.length)}
    
  }

  /* Image */
  const ImageDiplay = () => {
    return (
      submit ? 
        loading ? <Loader /> 
          : <Image src={`data:image/jpeg;base64,${image["encoded_image"]}`} className='rounded' fluid/> 
      : <div></div>
    );
  }


  return (
    <div>
      <h1 className='text-white text-center my-2'> Stable Diffusion Model</h1>
      <Row className='py-2'>
        <Col sm={12} md={6} lg={{span: 4, offset: 2}} xl={{span: 4, offset: 2}}>
          <Form>
            <Form.Group controlId="formBasicEmail">   
              <Form.Control                
                className='rounded'
                as="textarea" 
                rows={5} 
                placeholder="Enter the input text..." 
                value={inputText} 
                onChange={e => setInputText(e.target.value)}
              />
              <Button variant="primary" className="float-end my-3 rounded" onClick={handleClick}>
                Submit
              </Button>                    
            </Form.Group>            
          </Form>
        </Col> 

        <Col sm={12} md={6} lg={4} xl={4}>
          { ImageDiplay() }
        </Col> 
      </Row>
    </div>
  )
}

export default AiModelScreen
