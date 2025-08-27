import React from "react";

const BlogSidebar = () => {
  const popularBlogData = [
    {
      date: "03",
      month: "May",
      title: "Injected humour the like",
      hits: "0",
      blog: "it look like readable English. Many desktop publishing text.",
    },
    {
      date: "03",
      month: "May",
      title: "Injected humour the like",
      hits: "0",
      blog: "it look like readable English. Many desktop publishing text.",
    },
    {
      date: "03",
      month: "May",
      title: "Injected humour the like",
      hits: "0",
      blog: "it look like readable English. Many desktop publishing text.",
    },
    {
      date: "03",
      month: "May",
      title: "Injected humour the like",
      hits: "0",
      blog: "it look like readable English. Many desktop publishing text.",
    },
  ];
  const data = []

  return (
    <>
      <div className="col-xl-3 col-lg-4 col-md-5">
        <div className="blog-sidebar">
          <div className="theme-card">
            <h4>Recent Blog</h4>
            <ul className="recent-blog">
              {data &&
                data.map((item, i) => (
                  <li key={i}>
                    <div className="media">
                      <img
                        className="img-fluid blur-up lazyload"
                        src={item.img}
                        alt="Generic placeholder image"
                      />
                      <div className="media-body align-self-center">
                        <h6>{item.title}</h6>
                        <p>0 hits</p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <div className="theme-card">
            <h4>Popular Blog</h4>
            <ul className="popular-blog">
              {popularBlogData.map((blogData, i) => {
                return (
                  <li key={i}>
                    <div className="media">
                      <div className="blog-date">
                        <span>{blogData.date} </span>
                        <span>{blogData.month}</span>
                      </div>
                      <div className="media-body align-self-center">
                        <h6>{blogData.title}</h6>
                        <p>{blogData.hits} hits</p>
                      </div>
                    </div>
                    <p>{blogData.blog}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogSidebar;
