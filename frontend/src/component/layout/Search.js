import { useEffect, useState } from 'react';
import{useLocation, useNavigate} from 'react-router-dom'

export default function Search() {
    const navigate=useNavigate();
    const location=useLocation();
    const [keyword,setKeyword]=useState('');
    const searchHandler=(e)=>{
        e.preventDefault();
        navigate(`/search/${keyword}`)
    }
    const clearKeyword=()=>{
      setKeyword('')
    }
    useEffect(()=>{
      if (location.pathname==='/'){
        clearKeyword()
      }
    },[location])
  return (
    <form action="" onSubmit={searchHandler}>
      <div className="input-group">
        <input
          type="text"
          id="search_field"
          className="form-control"
          placeholder="Enter Product Name ..."
          value={keyword}
          onChange={(e)=>{
            setKeyword(e.target.value)
          }}
        />
        <div className="input-group-append">
          <button id="search_btn" className="btn">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </form>
  );
}
