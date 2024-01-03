import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link, redirect, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector, } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'



function EditProductScreen() {

    const params = useParams()
    const ProductId = params.id

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [image, setImage] = useState(false)
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(false)
    const [description, setDescription] = useState(false)
    const [uploading, setUploading] = useState(false)


    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    const productDetails = useSelector(state => state.productDetails)
    const { error, loading, product } = productDetails

    const productUpdate = (state => state.productUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = productUpdate


    useEffect(() => {

        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            navigate('/admin/productList')
        } else {
            if (!product.name || product._id !== Number(ProductId)) {
                dispatch(listProductDetails(ProductId))
            } else {
                setPrice(product.price)
                setImage(product.image)
                setName(product.name)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }
        }
    }, [dispatch, product, ProductId, navigate, successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id: ProductId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }))
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()

        formData.append('image', file)
        formData.append('product_id', ProductId)

        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            const { data } = await axios.post('/api/products/upload/', formData, config)

            setImage(data)
            setUploading(false)

        } catch (error) {
            setUploading(false)
        }
    }

    return (
        <div>
            <Link to='/admin/productlist'>
                Indietro
            </Link>

            <FormContainer>
                <h1>Modifica Prodotto</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <Form onSubmit={submitHandler}>

                            <Form.Group controlId='Name'>
                                <Form.Label>Nome </Form.Label>
                                <Form.Control
                                    type='Name'
                                    placeholder='Enter Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            <br></br>

                            <Form.Group controlId='Brand'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                    type='Brand'
                                    placeholder='Enter Brand'
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            <br></br>

                            <Form.Group controlId='Category'>
                                <Form.Label>Category </Form.Label>
                                <Form.Control
                                    type='Category'
                                    placeholder='Enter Category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            <br></br>

                            <Form.Group controlId='CountInStock'>
                                <Form.Label>CountInStock </Form.Label>
                                <Form.Control
                                    type='CountInStock'
                                    placeholder='Enter CountInStock'
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            <br></br>

                            <Form.Group controlId='Description'>
                                <Form.Label>Description </Form.Label>
                                <Form.Control
                                    type='Description'
                                    placeholder='Enter Description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            <br></br>

                            <Form.Group controlId='price'>
                                <Form.Label>price</Form.Label>
                                <Form.Control
                                    required
                                    type='price'
                                    placeholder='Enter price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            <br></br>

                            <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    required
                                    type='image'
                                    placeholder='Enter Image'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                >
                                </Form.Control>

                                <Form.File
                                    id='image-file'
                                    label='Chose File'
                                    custom
                                    onChange={uploadFileHandler}
                                >
                                </Form.File>
                                {uploading && <Loader />}
                            </Form.Group>
                            <br></br>


                            <Button type='submit' variant='primary'>
                                Modifica
                            </Button>


                        </Form>
                    )}
            </FormContainer>
        </div>

    )
}

export default EditProductScreen
