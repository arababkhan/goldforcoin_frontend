import React, { useState, useEffect } from 'react'
import {
  RadioGroup,
  Radio,
  Grid,
  FormControlLabel,
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
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import { MdKeyboardArrowDown } from 'react-icons/md'
import { AiFillDelete, AiOutlineSearch, AiFillCloseCircle } from 'react-icons/ai'
import { getOrders, updateOrder } from '../../services/OrderService'
import { Order, Product } from '../../types/orderType';

export const Orders = () => {
    const [openOrderId, setOpenOrderId] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState<Order[]>([])
    const [selectedOrder, setSelectedOrder] = useState(0)
    const [stateValue, setStateValue] = useState('pending')
    const [isSelectStateModal, setIsSelectStateModal] = useState(false)
    const optionsData = [{value: 'pending', label: 'pending'}, {value: 'processing', label: 'processing'}, {value: 'shipping', label: 'shipping'}, {value: 'delivered', label: 'delivered'}]
    
    const handleSearchInputChange = (event:any) => {
        setSearchQuery(event.target.value);
    };
    const handleState = (id: number) => {
        setSelectedOrder(id)
        setIsSelectStateModal(true)
    }
    const handleOrderState = async () => {
        setOrders(orders.map((order) => order.orderId === selectedOrder ? { ...order, status: stateValue } : order))
        setIsSelectStateModal(false)
        await updateOrder(selectedOrder || 0, stateValue)
    }
    const handleChange = (event:any) => {
        setStateValue(event.target.value);
    }
    const sortedOrders = orders.sort((a, b) => new Date(b.created?b.created:new Date()).getTime() - new Date(a.created?a.created:new Date()).getTime());
    const filteredOrders = sortedOrders.filter((order) => {
      const email = order.email.toLowerCase();
      const phoneNumber = order.phone.toLowerCase();
      const state = order.status.toLowerCase();
      const queries = searchQuery.toLowerCase().split(" ");

      return queries.every((query) => email.includes(query) || phoneNumber.includes(query) || state.includes(query));
    });

    useEffect(() => {
        const getOrdersData = async () => {
            let w_orders = await getOrders()
            setOrders(w_orders)
        } 

        getOrdersData()
    }, [])
    
    return (
      <>
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
                              <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 'bold', backgroundColor: 'transparent', borderLeft: '1px solid white', borderBottom: '1px solid white' }}>Phone Number</TableCell>
                              <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 'bold', backgroundColor: 'transparent', borderLeft: '1px solid white', borderBottom: '1px solid white' }}>Paid Amount</TableCell>
                              <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 'bold', backgroundColor: 'transparent', borderLeft: '1px solid white', borderBottom: '1px solid white' }}>Kind</TableCell>
                              <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 'bold', backgroundColor: 'transparent', borderLeft: '1px solid white', borderBottom: '1px solid white' }}>Shipping State</TableCell>
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
                                          {order.phone}</TableCell>
                                      <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", borderLeft: '1px solid white', borderBottom: '1px solid white' }}>
                                          {order.paid}</TableCell>
                                      <TableCell  align="center" sx={{ color: "rgba(255,255,255,0.8)", borderLeft: '1px solid white', borderBottom: '1px solid white' }}>
                                          {order.prod_kind}</TableCell>
                                      <TableCell align="center" sx={{ color: "rgba(255,255,255,0.8)", borderLeft: '1px solid white', borderBottom: '1px solid white' }}>
                                          {order.status === 'pending' && <Button sx={{color: 'white', backgroundColor: '#e34040', borderRadius: '5px', fontSize: '10px'}} onClick={() => handleState(order.orderId || 0)}>pending</Button>}
                                          {order.status === 'processing' && <Button sx={{color: 'white', backgroundColor: '#0e810d', borderRadius: '5px', fontSize: '10px'}} onClick={() => handleState(order.orderId || 0)}>processing</Button>}
                                          {order.status === 'shipping' && <Button sx={{color: 'white', backgroundColor: '#226AED', borderRadius: '5px', fontSize: '10px'}} onClick={() => handleState(order.orderId || 0)}>shipping</Button>}
                                          {order.status === 'delivered' && <Button sx={{color: 'black', backgroundColor: '#fff', borderRadius: '5px', fontSize: '10px'}} onClick={() => handleState(order.orderId || 0)}>delivered</Button>}
                                      </TableCell>
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
          <Dialog
            open={isSelectStateModal}
            keepMounted
            onClose={() => setIsSelectStateModal(false)}
            aria-describedby="alert-dialog-slide-description"
          >
            {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
            <DialogContent sx={{ width: 300, backgroundColor: '#23173e' }}>
                <RadioGroup
                    aria-label="gold options"
                    value={stateValue}
                    onChange={handleChange}
                    name="radio-buttons-group"
                    className='home-radio-group'
                    sx={{ p: 2}}
                >
                    <Grid container>
                        {optionsData.map((option, index) => (
                        <Grid item xs={6} key={index}>
                            <FormControlLabel sx={{color: 'white'}} value={option.value} control={<Radio sx={{
                                color: 'white', // default color
                                '&.Mui-checked': {
                                color: 'secondary.main', // color when radio is checked
                                },
                            }}/> } label={`${option.label}`} />
                        </Grid>
                        ))}
                    </Grid>
                </RadioGroup>            
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly', backgroundColor: '#23173e' }}>
              <Button variant='contained' endIcon={<AiFillDelete />} color='error' onClick={handleOrderState} sx={{color: 'white', fontFamily: 'Changa'}}>Set</Button>
              <Button variant='contained' color='primary'
                    onClick={() => setIsSelectStateModal(false)} endIcon={<AiFillCloseCircle />} sx={{color: 'white', fontFamily: 'Changa'}}>Close</Button>
            </DialogActions>
          </Dialog>
      </>
    );
}
