import PropTypes from 'prop-types'
import React, { Component, useState, useEffect, useContext } from 'react'
import Button from '@mui/material/Button';
import AuthContext from '../context/AuthContext'
import { List } from '@mui/material';

const ListOfTasksPage = () => {

  let {authTokens, logoutUser, user} = useContext(AuthContext)


  return (
    <div>
    Henlo tech
    </div>
  )

}

export default ListOfTasksPage 