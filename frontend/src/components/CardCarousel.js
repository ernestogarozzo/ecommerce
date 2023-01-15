import React, { useEffect } from 'react';
import ProductCard from './ProductCard';
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Row, Col} from 'react-bootstrap'
import { listProducts } from '../actions/productActions'
import { useDispatch, useSelector } from 'react-redux'

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

function CardCarousel({section}) {

  const dispatch = useDispatch()
  const productList = useSelector(state => state.productList)
  const { error, loading, products } = productList

  useEffect(() => {
    dispatch(listProducts())

  }, [])

  const Message = (error) => {
    return (
      <Message variant='danger'>{error}</Message>
    );
  }

  /* TODO: filtro per categoria */
  const CardCarousel = (products) => {
    const responsive = {
      superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2
      }
    };
    return (
      <Carousel itemClass='c-carousel-item' responsive={responsive} >
       {products.map((product) => (        
          <ProductCard key={product._id} product={product} />                            
        ))} 
      </Carousel>
    );
  }

  return (
    <div className="c-card-carousel" style={{backgroundColor: section.color}}>
      <h1 className='text-white'>{section.title}</h1>
      {
        loading ? 
          <Loader/> : error ?  
            Message(error) : CardCarousel(products)
      }
    </div>  
  );
}

export default CardCarousel;

   
 
