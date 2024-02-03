import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Typography,
  Container,
  InputAdornment,
  TextField,
  Button,
} from '@mui/material';
import { MdKeyboardArrowDown } from 'react-icons/md'
import { AiOutlineSearch } from 'react-icons/ai'
import { getMyOrders } from '../services/OrderService'
import { Order, Product } from '../types/orderType';
import { DefaultPageTemplate } from './template/DefaultPageTemplate'

export default function OrderPage () {
    const [openOrderId, setOpenOrderId] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState<Order[]>([])

    const handleSearchInputChange = (event:any) => {
        setSearchQuery(event.target.value);
    };
    const sortedOrders = orders.sort((a, b) => new Date(b.created?b.created:new Date()).getTime() - new Date(a.created?a.created:new Date()).getTime());
    const filteredOrders = sortedOrders.filter((order) => {
      const email = order.email.toLowerCase();
      const full_name = order.full_name.toLowerCase();
      const state = order.status.toLowerCase();
      const queries = searchQuery.toLowerCase().split(" ");

      return queries.every((query) => email.includes(query) || full_name.includes(query) || state.includes(query));
    });

    useEffect(() => {
        const getOrdersData = async () => {
            let w_orders = await getMyOrders()
            setOrders(w_orders)
        } 

        getOrdersData()
    }, [])
    
    return (
      <>      
        <DefaultPageTemplate fullWidth marginMax> 
          <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 5, marginTop: 5 }}>
              <TextField
                  id="search"
                  type="search"
                  label="Search Orders"
                  onChange={handleSearchInputChange}
                  className="placeholder-animation"
                  sx={{ width: { xs: 350, sm: 500, md: 800 }, 
                      '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                          borderColor: 'white', // normal state
                          },
                          '&:hover fieldset': {
                          borderColor: 'rgb(239,38,206)', // hover state
                          },
                          '&.Mui-focused fieldset': {
                          borderColor: 'rgb(239,38,206)', // focus state
                          },
                      },
                      '& label.Mui-focused': {
                          color: 'white', // Color of the label when the TextField is focused
                          fontFamily: 'Changa'
                      },
                      '& label': {
                          color: 'white', // Color of the label in the default state
                          fontFamily: 'Changa'
                      },
                      '& .MuiInputBase-input': {
                          color: 'white !important', // Change 'green' to your desired text color
                          fontFamily: 'Changa'
                      }, 
                  }}
                  InputProps={{
                      endAdornment: (
                          <InputAdornment position="end" sx={{ cursor: 'pointer', color: 'white' }}>
                              <AiOutlineSearch />
                          </InputAdornment>
                      ),
                  }}
              />
          </Container>
          <Paper
              style={{
                  overflow: "auto",
                  maxHeight: "500px",
                  border: '0px solid !important', display:'flex', justifyContent:'center', backgroundColor: 'transparent'
              }}
          >
              <TableContainer sx={{ maxHeight: '500px', backgroundColor: 'transparent', border: '1px solid white' }}>
                  <Table stickyHeader aria-label="sticky table" sx={{backgroundColor: 'transparent'}}>
                      <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'transparent' }}>
                          <TableRow>
                              <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 'bold', backgroundColor: 'transparent', borderLeft: '1px solid white', borderBottom: '1px solid white' }}/>
                              <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 'bold', backgroundColor: 'transparent', borderLeft: '1px solid white', borderBottom: '1px solid white' }}>Email</TableCell>
                              <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 'bold', backgroundColor: 'transparent', borderLeft: '1px solid white', borderBottom: '1px solid white' }}>Full Name</TableCell>
                              <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 'bold', backgroundColor: 'transparent', borderLeft: '1px solid white', borderBottom: '1px solid white' }}>Paid Amount</TableCell>
                              <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 'bold', backgroundColor: 'transparent', borderLeft: '1px solid white', borderBottom: '1px solid white' }}>Kind</TableCell>
                              <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 'bold', backgroundColor: 'transparent', borderLeft: '1px solid white', borderBottom: '1px solid white' }}>Shipping State</TableCell>
                              <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 'bold', backgroundColor: 'transparent', borderLeft: '1px solid white', borderBottom: '1px solid white' }}>Tracking Number</TableCell>
                              <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 'bold', backgroundColor: 'transparent', borderLeft: '1px solid white', borderBottom: '1px solid white' }}>Order Created Date</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {filteredOrders.map((order) => (
                              <React.Fragment key={order.orderId}>
                                  <TableRow sx={{color: 'white'}}>
                                      <TableCell  align="center" sx={{ color: "#fff", borderLeft: '1px solid white', borderBottom: '1px solid white' }}>
                                          <IconButton
                                              aria-label="expand row"
                                              size="small"
                                              onClick={() => setOpenOrderId(openOrderId === order.orderId ? 0 : (order.orderId?order.orderId:0))}
                                              sx={{color: 'white'}}
                                          >
                                              {<MdKeyboardArrowDown />}
                                          </IconButton>
                                      </TableCell>
                                      <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", borderLeft: '1px solid white', borderBottom: '1px solid white' }}>
                                          {order.email}</TableCell>
                                      <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", borderLeft: '1px solid white', borderBottom: '1px solid white' }}>
                                          {order.full_name}</TableCell>
                                      <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", borderLeft: '1px solid white', borderBottom: '1px solid white' }}>
                                          {order.paid}</TableCell>
                                      <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", borderLeft: '1px solid white', borderBottom: '1px solid white' }}>
                                          {order.prod_kind}</TableCell>
                                      <TableCell align="center" sx={{ color: "rgba(255,255,255,0.8)", borderLeft: '1px solid white', borderBottom: '1px solid white' }}>
                                          {order.status === 'pending' && <Button sx={{color: 'white', backgroundColor: '#e34040', borderRadius: '5px', fontSize: '10px'}}>pending</Button>}
                                          {order.status === 'processing' && <Button sx={{color: 'white', backgroundColor: '#0e810d', borderRadius: '5px', fontSize: '10px'}}>processing</Button>}
                                          {order.status === 'shipping' && <Button sx={{color: 'white', backgroundColor: '#226AED', borderRadius: '5px', fontSize: '10px'}}>shipping</Button>}
                                          {order.status === 'delivered' && <Button sx={{color: 'black', backgroundColor: '#fff', borderRadius: '5px', fontSize: '10px'}}>delivered</Button>}
                                      </TableCell>
                                      <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", borderLeft: '1px solid white', borderBottom: '1px solid white' }}>
                                          {order.tracking_number}</TableCell>
                                      <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", borderLeft: '1px solid white', borderBottom: '1px solid white' }}>{
                                          new Date(order.created?order.created:new Date()).toLocaleDateString('en-us', {
                                              weekday: "long", year: "numeric", month: "short", day: "numeric"
                                          }
                                          )
                                      }
                                          {" "}
                                          {new Date(order.created?order.created:new Date()).toLocaleTimeString('en-US')}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                      <TableCell  style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                          <Collapse in={openOrderId === order.orderId} timeout="auto" unmountOnExit>
                                              <div>
                                                <div style={{display:'flex'}}>
                                                  <div>
                                                   <Typography sx={{color: 'rgba(255,255,255,0.8)', fontFamily: 'solid', margin: '10px 20px'}}>{`Address: ${order.address}`}</Typography>
                                                   <Typography sx={{color: 'rgba(255,255,255,0.8)', fontFamily: 'solid', margin: '10px 20px'}}>{`Post Code: ${order.code}`}</Typography>
                                                   <Typography sx={{color: 'rgba(255,255,255,0.8)', fontFamily: 'solid', margin: '10px 20px'}}>{`City: ${order.city}`}</Typography>
                                                  </div>
                                                  <div>
                                                   <Typography sx={{color: 'rgba(255,255,255,0.8)', fontFamily: 'solid', margin: '10px 20px'}}>{`Chain: ${order.chain}`}</Typography>
                                                   <Typography sx={{color: 'rgba(255,255,255,0.8)', fontFamily: 'solid', margin: '10px 20px'}}>{`Coin: ${order.coin}`}</Typography>
                                                  </div>
                                                </div>  
                                                  <Table size="small" aria-label="purchases">
                                                      <TableHead>
                                                          <TableRow>
                                                              <TableCell align="center" sx={{ color: "rgba(255,255,255,0.8)", fontFamily: 'solid', fontWeight: 'bold' }}>Weight</TableCell>
                                                              <TableCell align="center" sx={{ color: "rgba(255,255,255,0.8)", fontFamily: 'solid', fontWeight: 'bold' }}>Price</TableCell>
                                                              <TableCell align="center" sx={{ color: "rgba(255,255,255,0.8)", fontFamily: 'solid', fontWeight: 'bold' }}>Quantity</TableCell>
                                                              <TableCell align="center" sx={{ color: "rgba(255,255,255,0.8)", fontFamily: 'solid', fontWeight: 'bold' }}>Cost</TableCell>
                                                          </TableRow>
                                                      </TableHead>
                                                      <TableBody>
                                                          {order.products.map((product: Product, index: number) => (
                                                              <TableRow key={index}>
                                                                  <TableCell sx={{ color: "rgba(255,255,255,0.8)" }} align="center" >
                                                                      {product.weight}
                                                                  </TableCell>
                                                                  <TableCell sx={{ color: "rgba(255,255,255,0.8)" }} align="center" >
                                                                      {product.price}
                                                                  </TableCell>
                                                                  <TableCell sx={{ color: "rgba(255,255,255,0.8)" }} align="center" >
                                                                      {product.quantity}
                                                                  </TableCell>
                                                                  <TableCell sx={{ color: "rgba(255,255,255,0.8)" }} align="center" >
                                                                      {product.cost}
                                                                  </TableCell>
                                                              </TableRow>
                                                          ))}
                                                           <TableRow key={'shipfee'}>
                                                             <TableCell sx={{ color: "rgba(255,255,255,0.8)" }} align="center" >
                                                                {'Ship Cost'}
                                                             </TableCell>
                                                             <TableCell sx={{ color: "rgba(255,255,255,0.8)" }} align="center" >
                                                             </TableCell>
                                                             <TableCell sx={{ color: "rgba(255,255,255,0.8)" }} align="center" >
                                                             </TableCell>
                                                             <TableCell sx={{ color: "rgba(255,255,255,0.8)" }} align="center" >
                                                                {order.shipfee}
                                                             </TableCell>
                                                            </TableRow>
                                                            <TableRow key={'totalcost'}>
                                                             <TableCell sx={{ color: "rgba(255,255,255,0.8)" }} align="center" >
                                                                {'Total Cost'}
                                                             </TableCell>
                                                             <TableCell sx={{ color: "rgba(255,255,255,0.8)" }} align="center" >
                                                             </TableCell>
                                                             <TableCell sx={{ color: "rgba(255,255,255,0.8)" }} align="center" >
                                                             </TableCell>
                                                             <TableCell sx={{ color: "rgba(255,255,255,0.8)" }} align="center" >
                                                                {order.cost}
                                                             </TableCell>
                                                            </TableRow>
                                                      </TableBody>
                                                  </Table>
                                              </div>
                                          </Collapse>
                                      </TableCell>
                                  </TableRow>
                              </React.Fragment>
                          ))}
                      </TableBody>
                  </Table>
              </TableContainer>
          </Paper>
        </DefaultPageTemplate>
      </>
    );
}
