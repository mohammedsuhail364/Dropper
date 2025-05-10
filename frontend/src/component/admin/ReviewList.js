import { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { clearError, clearReviewDeleted} from "../../slices/productSlice";

import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";
import SideBar from "./SideBar";
import { deleteReview, getReviews } from "../../actions/productActions";

export default function ReviewList() {
  const {
    reviews = [],
    loading = true,
    error,
    isReviewDeleted,
 
  } = useSelector((state) => state.productState);
  const dispatch = useDispatch();
  const [productId,setProductId]=useState();
  const setReviews = () => {
    const data = {
      columns: [
        {
            label: "ID",
            field: "id",
            sort: "asc",
        },
        {
            label: "Rating",
            field: "rating",
            sort: "asc",
        },
        {
          label: "User",
          field: "user",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };
    reviews.forEach((review) => {
      data.rows.push({
        id: review._id,
        rating: review.rating,
        user:review.user.name,
        comment:review.comments,
        actions: (
          <Fragment>
            
            <Button onClick={e=>deleteHandler(e,review._id)} className="btn btn-danger py-1 px-2 ml-2">
              <i className="fa fa-trash"></i>
            </Button>
          </Fragment>
        ),
      });
    });
    return data;
  };
  const deleteHandler=(e,id)=>{
    e.target.disabled=true;
    dispatch(deleteReview(productId,id));

  }
  const submitHandler=(e)=>{
    e.preventDefault();
    dispatch(getReviews(productId));


  }
  useEffect(() => {
    if (error) {
      toast(error , {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
    }
    if(isReviewDeleted){
      toast('Order Deleted Successfully',{
          type:'success',
          position:'bottom-center',
          onOpen:()=>dispatch(clearReviewDeleted())
      })
      dispatch(getReviews(productId));
      return; 
  }
  }, [dispatch, error,isReviewDeleted,productId]);
  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <SideBar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">Reviews List</h1>
        <div className="row justify-content-center mt-5">
            <div className="col-5">
                <form onSubmit={submitHandler} action="">
                    <div className="form-group">
                        <label htmlFor="">Product Id</label>
                        <input type="text" 
                        onChange={e=>setProductId(e.target.value)}
                        value={productId}
                        className="form-control"
                        />
                        <button type="submit" disabled={loading} className="btn btn-warning btn-block py-2 mt-3 text-white">
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setReviews()}
              bordered
              striped
              hover
              className="px-3"
            />
          )}
        </Fragment>
      </div>
    </div>
  );
}
