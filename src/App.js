import React, { useEffect, useState } from 'react';
import './app.css'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';


function App() {

  const nametest = /^[a-zA-Z ]{2,30}$/;
  const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const phone = /^[7-9]{1}[0-9]{9}$/;
  let checkboxcheck = "";

  const [formvalue, setformvalue] = useState({
    name: "",
    address: "",
    email: "",
    mobile: "",
    gender: "",
    city: "Ahmedabad"
  })
  // Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [allData, setallData] = useState([]);
  const [convertedList, setconvertedData] = useState([]);
  const [searchApiData, setSearchApiData] = useState([]);
  const [filterval, setFilterval] = useState('');

  const [userid, setUserid] = useState("");

  const [from, setfrom] = useState(0);


  useEffect(() => {
    getdata();
  }, [])

  const oncliickAdd = () => {
    setfrom(0);
    handleShow();
    setformvalue({ ...formvalue, name: "", address: "", email: "", mobile: "", gender: "", city: "" });
    checkboxcheck.checked = false;
  }

  const onchangeHandle = (e) => {
    setformvalue({ ...formvalue, [e.target.name]: e.target.value });
  }


  function getdata() {
   
    fetch('https://demoadminpanel-7ec47-default-rtdb.firebaseio.com/user.json')
      .then((response) => response.json())
      .then((json) => {
      
       addData(json);
        setSearchApiData(json);
      });
  }

  const addData =(json) =>{
    let cList =[];
    Object.keys(json).map((item, i)=>{
      let obj = {name : json[item].name, address : json[item].address, city : json[item].city,
         email : json[item].email, gender : json[item].gender, mobile : json[item].mobile, id : item}
      cList.push(obj)
    });
    setallData(cList);
    setconvertedData(cList);
  }
  const onresetHandle = (e) => {
    e.preventDefault();
    setformvalue({ ...formvalue, name: "", address: "", email: "", mobile: "", gender: "", city: "", });
  }

  const onsubmitHandle = (e) => {
    e.preventDefault();
    if (formvalue.name == "") {
      document.getElementById("nameerr").innerHTML = "Please insert first name *"
    }
    else if (!nametest.test(formvalue.name)) {
      document.getElementById("nameerr").innerHTML = "Please enter valid first name *"
    }
    else {
      document.getElementById("nameerr").innerHTML = ""
    }
    if (formvalue.address == "") {
      document.getElementById("adderr").innerHTML = "Please insert address *"
    }
    else if (formvalue.address.length > 50) {
      document.getElementById("adderr").innerHTML = "Please insert valid address *"
    }
    else {
      document.getElementById("adderr").innerHTML = ""
    }
    if (formvalue.email == "") {
      document.getElementById("emailerr").innerHTML = "Please insert email *"
    }
    else if (!emailPattern.test(formvalue.email)) {
      document.getElementById("emailerr").innerHTML = "Please insert valid email *"
    }
    else {
      document.getElementById("emailerr").innerHTML = ""
    }
    if (formvalue.mobile == "") {
      document.getElementById("numerr").innerHTML = "Please insert mobile number *"
    }
    else if (!phone.test(formvalue.mobile)) {
      document.getElementById("numerr").innerHTML = "Please insert valid mobile number *"
    }
    else {
      document.getElementById("numerr").innerHTML = ""
    }
    if (formvalue.gender == "") {
      document.getElementById("generr").innerHTML = "Please select any one *"
    }
    else {
      document.getElementById("generr").innerHTML = ""
    }
    checkboxcheck = document.getElementById("chekthisbox")
    if (!checkboxcheck.checked) {
      document.getElementById("chkerr").innerHTML = "Please agree to terms and conditions *"
    }
    else {
      document.getElementById("chkerr").innerHTML = ""
    }
    if (formvalue.name !== '' && formvalue.address !== "" && formvalue.email !== "" && formvalue.mobile !== "" && formvalue.gender !== "" && emailPattern.test(formvalue.email) && phone.test(formvalue.mobile) && checkboxcheck.checked) {
      if (from == 0) {
        postData();
      }
      else {
        updateHandle();
      }
    }

  }

  function postData() {
    fetch('https://demoadminpanel-7ec47-default-rtdb.firebaseio.com/user.json', {
      method: 'POST',
      body: JSON.stringify(formvalue),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        swal({
          title: "Success!",
          text: "You have registered successfully!",
          icon: "success"
        });
        setformvalue({ ...formvalue, name: "", address: "", email: "", mobile: "", gender: "", city: "" });
        checkboxcheck.checked = false;
        handleClose();
        getdata()
      });
  }
  
  const deleteHandle = (id) => {
    console.log("Delete ID"+id)
    fetch(`https://demoadminpanel-7ec47-default-rtdb.firebaseio.com/user/${id}.json`, {
      method: 'DELETE',
    }).then((response) => response.json())
      .then((json) => {
        swal({
          title: "Success!",
          text: "User deleted successfully!",
          icon: "success"
        });
        getdata()
      });
  }

  const editHandle = (id, model) => {
    setUserid(id);
    setformvalue({ ...formvalue, name: model.name, address: model.address, email: model.email, mobile: model.mobile, gender: model.gender, city: model.city });
    setfrom(1);
    handleShow();
  }

  const updateHandle = (e) => {
    fetch(`https://demoadminpanel-7ec47-default-rtdb.firebaseio.com/user/${userid}.json`, {
      method: 'PUT',
      body: JSON.stringify(formvalue),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        swal({
          title: "Success!",
          text: "User Updated successfully!",
          icon: "success"
        });
        setformvalue({ ...formvalue, name: "", address: "", email: "", mobile: "", gender: "", city: "" });
        checkboxcheck.checked = false;
        handleClose();
        getdata()
      });
  }

  const searchFilter = (e) => {
    setFilterval(e.target.value)
    console.log(e.target.value)
    if (e.target.value == '') {
        setconvertedData(allData)
    }
    else {
        const filterResult = convertedList.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
        setconvertedData(filterResult)
    }
    
  }

  return (
    <>
      <div className="container">
        <div className='row'>
          <div className="col-md-1 pt-3">
            <SupervisedUserCircleIcon />
          </div>
          <div className="col-md-3">
            <p className='fs-2'>User Details</p>
          </div>
          <div className="col-md-5 offset-md-3 pt-3">
            <input type="search" className='p-1' placeholder='Search here...' value={filterval} onInput={(e) => searchFilter(e)} />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button className='bg-white border-0' onClick={oncliickAdd}><PersonAddIcon /></button>
          </div>

        </div>
        <div class="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Address</th>
                <th scope="col">Email</th>
                <th scope="col">Mobile</th>
                <th scope="col">Gender</th>
                <th scope="col">City</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {convertedList.map((item, i) => {
                return (
                  <tr>
                    <td>
                      {i + 1}
                    </td>
                    <td>
                      {item.name}
                    </td>
                    <td>
                      {item.address}
                    </td>
                    <td>
                      {item.email}
                    </td>
                    <td>
                      {item.mobile}
                    </td>
                    <td>
                      {item.gender}
                    </td>
                    <td>
                      {item.city}
                    </td>
                    <td>
                      <button className='btn btn-primary' onClick={() => editHandle(item.id, item)} ><EditIcon /></button>
                    </td>

                    <td>
                      <button className='btn btn-danger' onClick={() => deleteHandle(item.id)}><DeleteForeverIcon /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </div>
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className='text-center'>{(from == 0) ? 'Registration' : 'Edit'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row g-0">
              <div className="col-lg-12">
                <div className=" h-100 p-5">
                  <form>
                    <div className="row g-3">
                      <div className="col-12">
                        <div class="form-floating mb-3">
                          <input type="text" name='name' class="form-control" id="floatingInput" placeholder="Name" value={formvalue.name} onChange={onchangeHandle} autoComplete="off" />
                          <label for="floatingInput">Name</label>
                          <p id='nameerr' style={{ color: "red" }}></p>
                        </div>
                      </div>

                      <div className="col-12">
                        <div class="form-floating mb-3">
                          <input type="text" name='address' value={formvalue.address} onChange={onchangeHandle} class="form-control" id="floatingInput" placeholder="Your address" autoComplete="off" />
                          <label for="floatingInput">Address</label>
                          <p id='adderr' style={{ color: "red" }}></p>
                        </div>
                      </div>

                      <div className="col-12">
                        <div class="form-floating mb-3">
                          <input type="email" name='email' class="form-control" id="floatingInput" placeholder="email" value={formvalue.email} onChange={onchangeHandle} autoComplete="off" />
                          <label for="floatingInput">Email</label>
                          <p id='emailerr' style={{ color: "red" }}></p>

                        </div>
                      </div>

                      <div className="col-12">
                        <div class="form-floating mb-3">
                          <input type="text" name='mobile' class="form-control" id="floatingInput" placeholder="Mobile" value={formvalue.mobile} onChange={onchangeHandle} autoComplete="off" />
                          <label for="floatingInput">Mobile</label>
                          <p id='numerr' style={{ color: "red" }}></p>
                        </div>
                      </div>

                      <div className="col-12" onChange={onchangeHandle}>
                        <label>Gender</label><br />
                        <input type="radio" name='gender' value="Male" checked={formvalue.gender == "Male"} /> Male
                        &nbsp;&nbsp;
                        <input type="radio" name='gender' value="Female" checked={formvalue.gender == "Female"} /> Female <br />
                        <p id='generr' style={{ color: "red" }}></p>
                      </div>

                      <div className="col-12">
                        <label>Select City</label>
                        <select name="city" id="dropdown" onChange={onchangeHandle}>
                          <option value="city">--Select City--</option>
                          <option value="Ahmedabad">Ahmedabad</option>
                          <option value="Surat">Surat</option>
                          <option value="Baroda">Baroda</option>
                          <option value="Rajkot">Rajkot</option>
                          <option value="Gandhinagar">Gandhinagar</option>
                          <option value="Jamnagar">Jamnagar</option>
                          <option value="Bhavnagar">Bhavnagar</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <label className="form-check-label text-muted">
                            <input type="checkbox" className="form-check-input" id='chekthisbox' />
                            I agree to the company terms and policy
                          </label>
                          <p id='chkerr' style={{ color: "red" }}></p>
                        </div>
                      </div>

                      <div className="col-12">
                        <button id='signbtn' onClick={onsubmitHandle}>{(from == 0) ? 'SIGN UP' : 'UPDATE'}</button>
                        <button id='resetbtn' onClick={onresetHandle}>RESET</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </Modal.Body>
        </Modal>
      </>


    </>
  );
}

export default App;
