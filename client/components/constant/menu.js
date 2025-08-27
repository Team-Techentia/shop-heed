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
    children: [
      {
        title: "Shirt",
        type: "sub",
        children: [
          { path: "/collections/plain-shirts", title: "Plain Shirts", imageSrc: "/assets/images/shirt/Plain Shirts.png", type: "link", icon: "alert" },
          { path: "/collections/check-shirts", title: "Check Shirts", imageSrc: "/assets/images/shirt/Check Shirts.png", type: "link", icon: "layout-accordion-merged" },
          { path: "/collections/stripe-shirts", title: "Stripe Shirts", imageSrc: "/assets/images/shirt/Stripe Shirts.png", type: "link", icon: "layers" },
          { path: "/collections/half-sleeve-shirt", title: "Half Sleeve Shirts", imageSrc: "/assets/images/shirt/Half Sleeve Shirts.png", type: "link", icon: "write" },
          // { path: "/collections/over-sized-shirts", title: "Over Sized Shirts", type: "link", icon: "map-alt" },
          { path: "/collections/cargo-shirts", title: "Cargo Shirts", imageSrc: "/assets/images/shirt/Cargo Shirts.png", type: "link", icon: "map-alt" },
          { path: "/collections/printed-shirts", title: "Printed Shirts", imageSrc: "/assets/images/shirt/Printed Shirts.png", type: "link", icon: "map-alt" },
        ],
      },
      {
        title: "Bottoms",
        type: "sub",
        children: [
          { path: "/launching-soon", title: "Jeans", type: "link", icon: "alert" },
          { path: "/launching-soon", title: "Cargo", type: "link", icon: "layout-accordion-merged" },
          { path: "/launching-soon", title: "Trouser", type: "link", icon: "layers" },
          { path: "/launching-soon", title: "Track Pant", type: "link", icon: "write" },
          { path: "/launching-soon", title: "Shorts", type: "link", icon: "map-alt" },
        ],
      },
      {
        title: "T-shirts",
        type: "sub",
        children: [
         
        ],
      },
      {
        title: "Jackets",
        type: "sub",
        children: [
         
        ],
      },
      {
        title: "Hoodies",
        type: "sub",
        children: [
        
        ],
      },
    ],
  },
  {
    title: "Trending Now",
    type: "link",
    path: "/collections/trending",
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
