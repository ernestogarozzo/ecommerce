import React, { useState, useEffect } from 'react'
import { Link, redirect, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector, } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

function RegisterScreen() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    //const redirect = location.search ? location.search.split('=')[1] : '/'
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    const userRegister = useSelector(state => state.userRegister)
    const { error, loading, userInfo } = userRegister


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(register(name, email, password))
    }

    return (
        <div>

        </div>
    )
}

export default RegisterScreen
