import React, { Fragment, useEffect, useState } from "react";
import { Input } from "reactstrap";
import Api from "../../Api";
import Link from "next/link";

const SearchSiteBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [data1, setData1] = useState();

  const closeNav = () => {
    const closemyslide = document.getElementById("search_side_bar");
    if (closemyslide) closemyslide.classList.remove("open-side");
  };

  useEffect(() => {
    setTimeout(() => {
      setPage(1);
      setData([]);
      setHasMore(true);
      if (searchInput) fetchData(1);
    }, 2000);
  }, [searchInput]);

  const fetchData = async (currentPage) => {
    try {
      setLoading(true);
      const query = searchInput;
      const res = await Api.searchProductsHomePage(query, currentPage, 70);
      const newData = res.data.data;
      setData1(res.data.status);
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setData((prevData) => [...prevData, ...newData]);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchData(page);
    }
  }, [page]);

  return (
    <Fragment>
      <div id="search_side_bar" className="sidenav ">
        <a href={null} className="sidebar-overlay" onClick={closeNav}></a>
        <nav>
          <a href={null} onClick={closeNav}>
            <div className="sidebar-back text-start">
              <i style={{marginTop:"-1px"}} className="fa fa-angle-left pe-2" aria-hidden="true"></i> Close
            </div>
          </a>
         <div style={{position:"relative"}}>
         <i
                      style={{
                        position: "absolute",
                        top: "10px",
                        fontSize: "18px",
                        left:"3px"
                      }}
                      className="fa fa-search"
                    ></i>
          <Input
            id="query search-autocomplete"
            type="search"
            placeholder="What are you looking for ?"
            className="nav-search nav-search-field"
            aria-expanded="true"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            style={{paddingLeft:"27px", border:"none"}}
          />
         </div>

          <div
            style={{ overflow: "auto", height: "90vh" }}
            onScroll={handleScroll}
          >
            {data1 === false ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <div>
                  <h4>No results could be found.</h4>
                  <button
                    onClick={() => {
                      setData([]);
                      setSearchInput("");
                    }}
                    style={{ padding: "5px 10px", borderRadius: "7px" }}
                    className="btn btn-solid"
                  >
                    New Search
                  </button>
                </div>
              </div>
            ) : (
              data.map((item) => (
                <div key={item.id}>
                  <Link
                    href={`/product-details/${encodeURIComponent(
                      item.title.replaceAll(" ", "-").replaceAll("/", "-")
                    )}/${item._id}`}
                    onClick={() => {
                      closeNav();
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        marginTop: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="sidebar-item"
                    >
                      <img
                        style={{ height: "100px", width: "100px" }}
                        src={item.image[0]}
                        alt=""
                        className="sidebar-item-img"
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <h6
                          style={{ lineHeight: "16px" }}
                          className="sidebar-item-title"
                        >
                          {item.title.length > 35
                            ? `${item.title.slice(0, 35)}...`
                            : item.title}
                        </h6>

                        <h6 className="sidebar-item-title">₹ {item.price}</h6>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}

            {loading && <p>Loading more products...</p>}
          </div>
        </nav>
      </div>
    </Fragment>
  );
};

export default SearchSiteBar;
