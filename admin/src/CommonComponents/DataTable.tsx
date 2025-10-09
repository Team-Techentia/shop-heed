//@ts-nocheck
import dynamic from "next/dynamic";
import { Fragment, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import DataTable from "react-data-table-component";

// const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

const Datatable = ({handleDeleteComment,handleGenerateInvoicing, openPopUp, handleChangeShopType, openCommentPopUp, handleStatusChange, myData, myClass, pagination, typeUse, handleDelete }: any) => {
  const [data, setData] = useState(myData);
  useEffect(() => {
    setData(myData)
  }, [myData])


  const Capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const columns = [];

  for (const key in myData[0]) {
    let selectorFunction = (row) => row[key];
    let editable = null;
    if (key === "image" || key === "status" || key === "avtar" || key === "vendor" || key === "order_status") {
      editable = null;
    }

    if (typeUse === "user-list") {
      let selectorFunction = (row) => row[key];

    }
    else if (
      typeUse === "manageOrder"
    ) {
      let selectorFunction = (row) => row[key];
      if (
        key === "Image"
      ) {
        selectorFunction = (row) => {
          const image = <img style={{ height: "50px" }} src={row[key]} alt="" />;
          return image
        };
      }
      if (key === "Date") {
        selectorFunction = (row) => {
          const date = new Date(row[key]);
          return date.toISOString().split('T')[0];
        };
      }
      if (key === "Id") {
        selectorFunction = (row) => {
          return (
            <div style={{ cursor: "pointer" }} onClick={() => {
              openPopUp(row.Id)
            }}>
              {row[key]}
            </div>
          )
        }
      }
      // if (key === "Order_Status") {

      //   selectorFunction = (row) => {

      //     return (



      //       <Input
      //         id="exampleSelect"
      //         name="select"
      //         type="select"
      //         value={row[key]}
      //         onChange={(e) => handleStatusChange(row.Id, e.target.value)}
      //       >

      //         <option value="pending-payment">
      //           Pending Payment
      //         </option >
      //         <option value="processing">
      //           Processing
      //         </option>
      //         <option value="on-hold">
      //           On Hold
      //         </option>
      //         <option value="completed">
      //           Completed
      //         </option>
      //         <option value="cancelled">
      //           Cancelled
      //         </option>
      //         <option value="refunded">
      //           Refunded
      //         </option>
      //         <option value="failed">
      //           Failed
      //         </option>
      //         <option value="draft">
      //           Draft
      //         </option>


      //       </Input>
      //     );
      //   }
      // }



      columns.push({
        name: <b>{Capitalize(key.toString())}</b>,
        header: <b>{Capitalize(key.toString())}</b>,
        selector: selectorFunction,
        Cell: editable,
        style: {
          textAlign: "center",
        },
      });

    } else if (typeUse === "transaction") {
      if (key === "Date") {
        selectorFunction = (row) => {
          const formatDate = (dateString: string): string => {

            const datePart = dateString.split('T')[0];
            const [year, month, day] = datePart.split('-');

            return `${day}/${month}/${year}`;
          };
          const date = new Date(row[key]);
          return formatDate(date.toISOString().split('T')[0]);
        };
      }

      columns.push({
        name: <b>{Capitalize(key.toString())}</b>,
        header: <b>{Capitalize(key.toString())}</b>,
        selector: selectorFunction,
        Cell: editable,
        style: {
          textAlign: "center",
        },
      });

    } else if (typeUse === "manaegOrder") {
      let selectorFunction = (row) => row[key];

      if (key === "Invoicing") {
        selectorFunction = (row) => {
          return (
            <>
            {
              row[key] ==="Generate Invoice" ? <div onClick={()=>{
                handleGenerateInvoicing(row["Order Id"])
              }}  style={{ cursor: "pointer" }}>
              {row[key]}
            </div> : <a href={row[key]} target="_blank">{row[key]}</a> 
            }
             
            </>


          )
        }
      }


      if (key === "Id") {
        selectorFunction = (row) => {
          return (
            <>

              <div onClick={() => {
                openPopUp(row.Id)
              }} style={{ cursor: "pointer" }}>
                {row[key]}

              </div>
            </>


          )
        }
      }
      if (
        key === "Image"
      ) {
        selectorFunction = (row) => {
          const image = <img style={{ height: "50px" }} src={row[key]} alt="" />;
          return image
        };
      }

      if (
        key === "Actions"
      ) {
        selectorFunction = (row) => {
          return (
            <>

              <div style={{ display: "flex", justifyContent: "center" }}>

                <div onClick={() => {
                  openPopUp(row[key])
                }} style={{ cursor: "pointer" }}>
                  <i
                    className="fa fa-pencil-square-o"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>

                </div>



                {/* <div onClick={() => {
                  handleDelete(row[key])
                }} style={{ cursor: "pointer" }}>

                  <i
                    className="fa fa-trash"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>
                </div> */}
              </div>
            </>

          )

        };
      }


      columns.push({
        name: <b>{Capitalize(key.toString())}</b>,
        header: <b>{Capitalize(key.toString())}</b>,
        selector: selectorFunction,
        Cell: editable,
        style: {
          textAlign: "center",
        },
      });



    }





    else if (typeUse === "users") {

      let selectorFunction = (row) => row[key];

      if (key === "Date") {
        selectorFunction = (row) => {
          const date = new Date(row[key]);
          return date.toISOString().split('T')[0];
        };
      }

      if (
        key === "Actions"
      ) {
        selectorFunction = (row) => {
          return (
            <>

              <div onClick={() => {
                handleDelete(row[key])
              }} style={{ cursor: "pointer" }}>

                <i
                  className="fa fa-trash"
                  style={{
                    width: 35,
                    fontSize: 20,
                    padding: 11,
                    color: "#e4566e",
                    cursor: "pointer",
                  }}
                ></i>

              </div>
            </>

          )

        };
      }

      columns.push({
        name: <b>{Capitalize(key.toString())}</b>,
        header: <b>{Capitalize(key.toString())}</b>,
        selector: selectorFunction,
        Cell: editable,
        style: {
          textAlign: "center",
        },
      });
    }





    else if (
      typeUse === "product-list"
    ) {



      let selectorFunction = (row) => row[key];
     if(
       key === "Size"
      ) {
        selectorFunction = (row) => {
          return (
            <> <div style={{textTransform:"uppercase"}}>
              {row[key]}</div> </>
     )
    }
  }

      if (
        key === "Image"
      ) {
        selectorFunction = (row) => {
          const image = <img style={{ height: "50px" }} src={row[key]} alt="" />;
          return image
        };
      }

      if (
        key === "Actions"
      ) {
        selectorFunction = (row) => {
          return (

            <>

              <div style={{ display: "flex", justifyContent: "center" }}>

                <div onClick={() => {
                  openPopUp(row[key])
                }} style={{ cursor: "pointer" }}>
                  <i
                    className="fa fa-pencil-square-o"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>

                </div>

                <div onClick={() => {
                  handleDelete(row[key])
                }} style={{ cursor: "pointer" }}>

                  <i
                    className="fa fa-trash"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>

                </div>
              </div>
            </>


          )






        };
      }
      if(key==="Delete"){
        selectorFunction=(row)=>{
          return <div onClick={() => {
            handleDeleteComment(row[key] , )
          }} style={{ cursor: "pointer" }}>  <i
          className="fa fa-trash"
          style={{
            width: 35,
            fontSize: 20,
            padding: 11,
            color: "#e4566e",
            cursor: "pointer",
          }}
        ></i> </div>
        }
      }

      if (
        key === "Comment"
      ) {
        selectorFunction = (row) => {
          return <div onClick={() => {
            openCommentPopUp(row[key])
          }} style={{ cursor: "pointer" }}> Comment </div>
        };
      }

      if (
        key === "Shopping Type"
      ) {
        selectorFunction = (row) => {
          return <div >     <Input
            style={{ width: "140px" }}
            type="select"
            value={row[key]}
            onChange={(e: any) => {
              handleChangeShopType(e.target.value, row["Product Id"])

            }}
          >
            <option value="" >Select Type</option>
            
            <option value="price drop">Price Drop</option>

          </Input> </div>
        };
      }



      columns.push({
        name: <b>{Capitalize(key.toString())}</b>,
        header: <b>{Capitalize(key.toString())}</b>,
        selector: selectorFunction,
        Cell: editable,
        style: {
          textAlign: "center",
        },
      });

    }
    else if (
      typeUse === "promocode-list"
    ) {



      let selectorFunction = (row) => row[key];


      if (
        key === "Actions"
      ) {
        selectorFunction = (row) => {
          return (

            <>

              <div style={{ display: "flex", justifyContent: "center" }}>

                <div onClick={() => {
                  openPopUp(row[key])
                }} style={{ cursor: "pointer" }}>
                  <i
                    className="fa fa-pencil-square-o"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>

                </div>

                <div onClick={() => {
                  handleDelete(row[key])
                }} style={{ cursor: "pointer" }}>

                  <i
                    className="fa fa-trash"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>

                </div>
              </div>
            </>


          )






        };
      }
      if(key==="Delete"){
        selectorFunction=(row)=>{
          return <div onClick={() => {
            handleDeleteComment(row[key] , )
          }} style={{ cursor: "pointer" }}>  <i
          className="fa fa-trash"
          style={{
            width: 35,
            fontSize: 20,
            padding: 11,
            color: "#e4566e",
            cursor: "pointer",
          }}
        ></i> </div>
        }
      }

      if (
        key === "Comment"
      ) {
        selectorFunction = (row) => {
          return <div onClick={() => {
            openCommentPopUp(row[key])
          }} style={{ cursor: "pointer" }}> Comment </div>
        };
      }

      if (
        key === "Shopping Type"
      ) {
        selectorFunction = (row) => {
          return <div >     <Input
            style={{ width: "140px" }}
            type="select"
            value={row[key]}
            onChange={(e: any) => {
              handleChangeShopType(e.target.value, row["Product Id"])

            }}
          >
            <option value="" >Select Type</option>
            
            <option value="price drop">Price Drop</option>

          </Input> </div>
        };
      }



      columns.push({
        name: <b>{Capitalize(key.toString())}</b>,
        header: <b>{Capitalize(key.toString())}</b>,
        selector: selectorFunction,
        Cell: editable,
        style: {
          textAlign: "center",
        },
      });

    }
    else if (
      typeUse === "featured-sections"
    ) {



      let selectorFunction = (row) => row[key];
     if(
       key === "Size"
      ) {
        selectorFunction = (row) => {
          return (
            <> <div style={{textTransform:"uppercase"}}>
              {row[key]}</div> </>
     )
    }
  }

      if (
        key === "Image"
      ) {
        selectorFunction = (row) => {
          const image = <img style={{ height: "50px" }} src={row[key]} alt="" />;
          return image
        };
      }

      if (
        key === "Actions"
      ) {
        selectorFunction = (row) => {
          return (

            <>

              <div style={{ display: "flex", justifyContent: "center" }}>

                <div onClick={() => {
                  openPopUp(row[key])
                }} style={{ cursor: "pointer" }}>
                  <i
                    className="fa fa-pencil-square-o"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>

                </div>

                <div onClick={() => {
                  handleDelete(row[key])
                }} style={{ cursor: "pointer" }}>

                  <i
                    className="fa fa-trash"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>

                </div>
              </div>
            </>


          )






        };
      }
      if(key==="Delete"){
        selectorFunction=(row)=>{
          return <div onClick={() => {
            handleDeleteComment(row[key] , )
          }} style={{ cursor: "pointer" }}>  <i
          className="fa fa-trash"
          style={{
            width: 35,
            fontSize: 20,
            padding: 11,
            color: "#e4566e",
            cursor: "pointer",
          }}
        ></i> </div>
        }
      }

      if (
        key === "Comment"
      ) {
        selectorFunction = (row) => {
          return <div onClick={() => {
            openCommentPopUp(row[key])
          }} style={{ cursor: "pointer" }}> Comment </div>
        };
      }

      if (
        key === "Shopping Type"
      ) {
        selectorFunction = (row) => {
          return <div >     <Input
            style={{ width: "140px" }}
            type="select"
            value={row[key]}
            onChange={(e: any) => {
              handleChangeShopType(e.target.value, row["Product Id"])

            }}
          >
            <option value="" >Select Type</option>
            
            <option value="price drop">Price Drop</option>

          </Input> </div>
        };
      }



      columns.push({
        name: <b>{Capitalize(key.toString())}</b>,
        header: <b>{Capitalize(key.toString())}</b>,
        selector: selectorFunction,
        Cell: editable,
        style: {
          textAlign: "center",
        },
      });

    }


    else if (
      typeUse === "subCategory"
    ) {

      let selectorFunction = (row) => row[key];
      
      // Handle Image column specifically
      if (key === "Image") {
        selectorFunction = (row) => {
          if (row[key]) {
            return (
              <img 
                style={{ 
                  height: "50px", 
                  width: "50px", 
                  objectFit: "cover", 
                  borderRadius: "5px" 
                }} 
                src={row[key]} 
                alt="SubCategory" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            );
          } else {
            return (
              <div 
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "5px",
                  fontSize: "10px",
                  color: "#6c757d",
                  border: "1px solid #ddd"
                }}
              >
                No Image
              </div>
            );
          }
        };
      }
      
      if (
        key === "Edit"
      ) {
        selectorFunction = (row) => {
          return
        };
      }
      if (
        key === "Actions"
      ) {
        selectorFunction = (row) => {
          return (
            <>

              <div style={{ display: "flex" }}>

                <div onClick={() => {
                  openPopUp(row[key])
                }} style={{ cursor: "pointer" }}>
                  <i
                    className="fa fa-pencil-square-o"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>

                </div>



                <div onClick={() => {
                  handleDelete(row[key])
                }} style={{ cursor: "pointer" }}>

                  <i
                    className="fa fa-trash"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>
                </div>
              </div>
            </>
          )
        };
      }

      if (
        key === "edit"
      ) {
        selectorFunction = (row) => {
          return <div onClick={() => {
            openCommentPopUp(row[key])
          }} style={{ cursor: "pointer" }}> Edit </div>
        };
      }



      columns.push({
        name: <b>{Capitalize(key.toString())}</b>,
        header: <b>{Capitalize(key.toString())}</b>,
        selector: selectorFunction,
        Cell: editable,
        style: {
          textAlign: "center",
        },
      });

    }

    else if (
      typeUse === "blogOrder"
    ) {
      let selectorFunction = (row) => row[key];
      if (
        key === "Edit"
      ) {
        selectorFunction = (row) => {
          return
        };
      }
      if (
        key === "Image"
      ) {
        selectorFunction = (row) => {
          const image = <img style={{ height: "50px" }} src={row[key]} alt="" />;
          return image
        };
      }
      if (key === "Date") {
        selectorFunction = (row) => {
          const date = new Date(row[key]);
          return date.toISOString().split('T')[0];
        };
      }
      if (
        key === "Actions"
      ) {
        selectorFunction = (row) => {
          return (
            <>

              <div style={{ display: "flex" }}>

                <div onClick={() => {
                  openPopUp(row[key])
                }} style={{ cursor: "pointer" }}>
                  <i
                    className="fa fa-pencil-square-o"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>

                </div>



                <div onClick={() => {
                  handleDelete(row[key])
                }} style={{ cursor: "pointer" }}>

                  <i
                    className="fa fa-trash"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>
                </div>
              </div>
            </>

          )

        };
      }








      columns.push({
        name: <b>{Capitalize(key.toString())}</b>,
        header: <b>{Capitalize(key.toString())}</b>,
        selector: selectorFunction,
        Cell: editable,
        style: {
          textAlign: "center",
        },
      });

    }
    else if (typeUse === "category") {

      let selectorFunction = (row) => row[key];

      if (
        key === "Edit"
      ) {
        selectorFunction = (row) => {
          return
        };
      }
      if (
        key === "Image"
      ) {
        selectorFunction = (row) => {
          const image = <img style={{ height: "50px" }} src={row[key]} alt="" />;
          return image
        };
      } if (
        key === "Actions"
      ) {
        selectorFunction = (row) => {
          return (
            <>

              <div style={{ display: "flex" }}>

                <div onClick={() => {
                  openPopUp(row[key])
                }} style={{ cursor: "pointer" }}>
                  <i
                    className="fa fa-pencil-square-o"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>

                </div>



                <div onClick={() => {
                  handleDelete(row[key])
                }} style={{ cursor: "pointer" }}>

                  <i
                    className="fa fa-trash"
                    style={{
                      width: 35,
                      fontSize: 20,
                      padding: 11,
                      color: "#e4566e",
                      cursor: "pointer",
                    }}
                  ></i>
                </div>
              </div>
            </>

          )

        };
      }

      columns.push({
        name: <b>{Capitalize(key.toString())}</b>,
        header: <b>{Capitalize(key.toString())}</b>,
        selector: selectorFunction,
        Cell: editable,
        style: {
          textAlign: "center",
        },
      });


    }





    else if (typeUse === "transaction") {
      if (key === "Date") {
        selectorFunction = (row) => {
          const date = new Date(row[key]);
          return date.toISOString().split('T')[0];
        };
      }

      columns.push({
        name: <b>{Capitalize(key.toString())}</b>,
        header: <b>{Capitalize(key.toString())}</b>,
        selector: selectorFunction,
        Cell: editable,
        style: {
          textAlign: "center",
        },
      });

    }





    else {
      let selectorFunction = (row) => row[key];
      columns.push({
        name: <b>{Capitalize(key.toString())}</b>,
        header: <b>{Capitalize(key.toString())}</b>,
        selector: selectorFunction,
        Cell: editable,
        style: {
          textAlign: "center",
        },
      });
    }

  }

  // if (multiSelectOption === true) {
  //   columns.push({
  //     name: (
  //       <Button
  //         color="danger"
  //         size="sm"
  //         className=" btn-delete mb-0 b-r-4"
  //         onClick={(e) => {
  //           if (window.confirm("Are you sure you wish to delete this item?")) handleRemoveRow();
  //         }}
  //       >
  //         Delete
  //       </Button>
  //     ),
  //     id: "delete",
  //     accessor: () => "delete",
  //     cell: (row) => (
  //       <div>
  //         <span>
  //           <Input type="checkbox" name={row.id} defaultChecked={checkedValues.includes(row.id)} onChange={(e) => selectRow(e, row.id)} />
  //         </span>
  //       </div>
  //     ),
  //     style: {
  //       textAlign: "center",
  //     },
  //     sortable: false,
  //   });
  // } else {
  //   columns.push({
  //     name: <b>Action</b>,
  //     id: "delete",
  //     accessor: (str) => "delete",
  //     cell: (row, index) => (
  //       <div>
  //         <span onClick={() => handleDelete(index)}>
  //           <i
  //             className="fa fa-trash"
  //             style={{
  //               width: 35,
  //               fontSize: 20,
  //               padding: 11,
  //               color: "#e4566e",
  //               cursor: "pointer",
  //             }}
  //           ></i>
  //         </span>

  //         <span>
  //           <i
  //             onClick={onOpenModal}
  //             className="fa fa-pencil"
  //             style={{
  //               width: 35,
  //               fontSize: 20,
  //               padding: 11,
  //               color: "rgb(40, 167, 69)",
  //               cursor: "pointer",
  //             }}
  //           ></i>
  //           <Modal isOpen={open} toggle={onCloseModal} style={{ overlay: { opacity: 0.1 } }}>
  //             <ModalHeader toggle={onCloseModal}>
  //               <h5 className="modal-title f-w-600" id="exampleModalLabel2">
  //                 Edit Product
  //               </h5>
  //             </ModalHeader>
  //             <ModalBody>
  //               <Form>
  //                 <FormGroup>
  //                   <Label htmlFor="recipient-name" className="col-form-label">
  //                     Category Name :
  //                   </Label>
  //                   <Input type="text" />
  //                 </FormGroup>
  //                 <FormGroup>
  //                   <Label htmlFor="message-text" className="col-form-label">
  //                     Category Image :
  //                   </Label>
  //                   <Input id="validationCustom02" type="file" />
  //                 </FormGroup>
  //               </Form>
  //             </ModalBody>
  //             <ModalFooter>
  //               <Button type="button" color="primary" onClick={() => onCloseModal("VaryingMdo")}>
  //                 Update
  //               </Button>
  //               <Button type="button" color="secondary" onClick={() => onCloseModal("VaryingMdo")}>
  //                 Close
  //               </Button>
  //             </ModalFooter>
  //           </Modal>
  //         </span>
  //       </div>
  //     ),
  //     style: {
  //       textAlign: "center",
  //     },
  //     sortable: false,
  //   });
  // }
  return (
    <div>
      <Fragment>

        <DataTable data={data} columns={columns} className={myClass} pagination={pagination} striped={true} center={true} />

        <ToastContainer />
      </Fragment>
    </div>
  );
};

export default Datatable;