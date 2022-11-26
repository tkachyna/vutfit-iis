import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom"
import { useQuery } from 'react-query'
import AuthContext from '../context/AuthContext';
import AccessTimeFilledOutlinedIcon from '@mui/icons-material/AccessTimeFilledOutlined';
import Comment from '../components/Comment';
import { Select, MenuItem, Divider, TextField }from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AddIcon from '@mui/icons-material/Add';
import CommentIcon from '@mui/icons-material/Comment';
import TopicIcon from '@mui/icons-material/Topic';
import GroupIcon from '@mui/icons-material/Group';

const ServiceRequestPage = () => {
    const navigate = useNavigate();
    const navigate2 = useNavigate();
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const id = query.get('id');

    let [formData, setFormData] = useState({
		esttime: 0,
		realtime: 0,
  	})
    let {authTokens, user} = useContext(AuthContext)  
    let [request, setRequest] = useState([])
    let [requestState, setRequestState] = useState("")
    let [requestComment, setRequestComments] = useState([])

    useEffect( () => {
        getRequest()
        
    }, [])

    function handleChange3(event) {
		const {name, value,} = event.target
		setFormData(prevFormData => {
			return {
				...prevFormData,
				[name]: value
			}
		})
	}

    function handleChange(event) {
		const {value} = event.target
		updateRequestState(value)
    }


    let getrequestComments = async() => {  
        let response = await fetch(`api/getRequestComments?id=${id}`, {
          method: 'GET',
          headers:{
              'Content-Type':'application/json',
              'Authorization':'Bearer ' + String(authTokens.access)
          }
      })

      let data = await response.json()

      if (response.status == 200) {
          setRequestComments(data)
      }
    }
    
    let getRequest = async() => {
        let response = await fetch(`api/getRequest?id=${id}`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        
        let data = await response.json()

        if(response.status == 200) {
            setRequest(data)
            setRequestState(data.state)

            getrequestComments()
            setFormData(prevFormData => {
				return {
					esttime: data.estimated_time,
					realtime: data.real_time
				}
            })
        }
    }

    let updateTicketState = async() => {
      let response = await fetch(`api/editTicket`, {
          method: 'POST',
          headers:{
              'Content-Type':'application/json',
              'Authorization':'Bearer ' + String(authTokens.access)
          },
          body: JSON.stringify({
            author_id: user.user_id,
            id: request.ticket_id,
            state: '3'
          })
      })
    }


    let updateRequestState = async(value) => {
      let response = await fetch(`api/editRequest`, {
          method: 'POST',
          headers:{
              'Content-Type':'application/json',
              'Authorization':'Bearer ' + String(authTokens.access)
          },
          body: JSON.stringify({
            author_id: user.user_id,
            id: request.id,
            state: value
          }) 
      })
      
      let data = await response.json()

      if(response.status == 200) {
          if (value == "3") {
            updateTicketState()
          }
          setRequestState(data.state)
      }
  }

	let updateEstTime = async(value) => {
		let response = await fetch(`api/editRequest`, {
			method: 'POST',
			headers:{
				'Content-Type':'application/json',
				'Authorization':'Bearer ' + String(authTokens.access)
			},
			body: JSON.stringify({
				author_id: user.user_id,
				id: request.id,
				estimated_time: formData.esttime
			})
		})
		
	}

	let updateRealTime = async(value) => {
		let response = await fetch(`api/editRequest`, {
			method: 'POST',
			headers:{
				'Content-Type':'application/json',
				'Authorization':'Bearer ' + String(authTokens.access)
			},
			body: JSON.stringify({
				author_id: user.user_id,
				id: request.id,
				real_time: formData.realtime
			})
	})
	}

	const comments = requestComment.map(item => {
		return (
			<Comment
				key={item.id}
				item={item}
			/>
		)
	})

	let keyPress2 = (e) => {
		if(e.key == 'Enter'){
			updateEstTime()

		}
	}

	let keyPress1 = (e) => {
		if(e.key == 'Enter'){
			updateRealTime()
		}
	}

	function formatDate(string){
		var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
		return new Date(string).toLocaleDateString([],options);
	}
   
    return (
      <div>
        <h2 style={{marginLeft: 16, marginTop: 16}} >Servisní požadavek</h2>
        <div className='ticketinfopage--wrapper'>
            <div className='ticketinfopage--icons-text'>
                <TopicIcon className='ticketinfopage--icons'/>
                <span>Tiket</span>
            </div>
            <Divider style={{width: 370}}  sx={{ borderBottomWidth: 2, color: "black" }}/>
            <br/>
            <span className='light-text'> {request.ticket_id}</span>
            <br/>

            <div className='ticketinfopage--icons-text'>
            <GroupIcon className='ticketinfopage--icons'/>
            <span>Servisní pracovníci</span>
            </div>
            <Divider style={{width: 370}}  sx={{ borderBottomWidth: 2, color: "black" }}/>
            <br/>
            <span className='light-text'> {request.t_id}</span>
            <br/>


            <div className='ticketinfopage--icons-text'>
            <AccessAlarmIcon className='ticketinfopage--icons'/>
            <span>Stav</span>
            </div>
            <Divider style={{width: 370}}  sx={{ borderBottomWidth: 2, color: "black" }}/>
            <br/>
            <Select
              labelId="state"
              id="state"
              value={requestState}
              label="state"
              onChange={handleChange}
            >
              <MenuItem value={'1'}>Podáno</MenuItem>
              <MenuItem value={'2'}>V řešení</MenuItem>
              <MenuItem value={'3'}>Dokončeno</MenuItem>
            </Select>
            
            <br/>
            <div className='ticketinfopage--icons-text'>
            <CommentIcon className='ticketinfopage--icons'/>
            <span className='light-text' >Popis</span>
            </div>
            <Divider style={{width: 370}}  sx={{ borderBottomWidth: 2, color: "black" }}/>
            <br/>
            <span className='light-text'> {request.description}</span>
            <br/>
            <div className='ticketinfopage--icons-text'>
            <AccessTimeFilledOutlinedIcon className='ticketinfopage--icons'/>
            <span>Nahlášeno dne</span>
            </div>
            <Divider style={{width: 370}}  sx={{ borderBottomWidth: 2, color: "black" }}/>
            <br/>
            {formatDate(String(request.creation_date_time))}
            <br/>
            <div className='ticketinfopage--icons-text'>
            <AccessTimeFilledOutlinedIcon className='ticketinfopage--icons'/>
            <span>{"Očekávaný čas opravy  (v hodinách)"}</span>
            </div>
            <Divider style={{width: 370}}  sx={{ borderBottomWidth: 2, color: "black" }}/>
            <br/>
            <TextField required
            id="servicerequest-est" variant="outlined" onChange={handleChange3}  value={formData.esttime} onKeyDown={keyPress2} sx={{width: 100}}
            type="text" name="esttime"/> 
            <br/>

            <div className='ticketinfopage--icons-text'>
            <AccessTimeFilledOutlinedIcon className='ticketinfopage--icons'/>
            <span>{"Reálný čas opravy (v hodinách)"}</span>
            </div>
            <Divider style={{width: 370}}  sx={{ borderBottomWidth: 2, color: "black" }}/>
            <br/>
    
            <TextField required
            id="servicerequest-real" variant="outlined" onChange={handleChange3} value={formData.realtime} onKeyDown={keyPress1} sx={{width: 100}}
            type="text" name="realtime"/> 
            <div className='ticketinfopage--icons-text'>
            <MessageIcon className='ticketinfopage--icons'/>
            <span>Komentáře</span>
            <AddIcon className='ticketinfopage--icons-2' onClick={() => navigate2(`/createreqcomment?request_id=${id}`)}/>
            </div>
            <Divider style={{width: 370}}  sx={{ borderBottomWidth: 2, color: "black" }}/>
            <br/>
            {comments}   
            <br/>

        </div>
        
      </div>
    )
  }

export default ServiceRequestPage