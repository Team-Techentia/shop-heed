export const 
MENUITEMS = [
  {
    title: "Home",
    type: "link",
    path: "/",

  },
  
  {
    title: "Shop",
    megaMenu: true,
    megaMenuType: "small",
    type: "sub",
    children: [],
  },
  {
    title: "Trending Now",
    type: "link",
    path: "/collections/trending%20now",
  },

  {
    title: "Bulk Enquiry ",
    type: "link",
    path: "/bulk-enquiry",
  },

   {
    title: "Customer Support",
    type: "sub",
    children: [
      {  title: "Return and Exchange",
        path: "/return_and_exchange", type: "link" },
     
      {
        title: "Delivery and Shipping",
        path: "/shipping-and-delivery",
        type: "link",
    
      },
      {  title: "Contact Us",
        path: "/contact-us", type: "link" },

      {   title: "Track Order",
        path: "https://www.shiprocket.in/shipment-tracking/", type: "link" },
    ],
  },
];
