import React from 'react';
import CommonLayout from '../../components/shop/common-layout';
import { Container } from 'reactstrap';

const AboutUs = () => {
    return (
        <CommonLayout title="About Us" parent="home">
            <section style={{ marginBottom: "50px" , paddingTop:"30px"}} className="section-b-space ratio_asos">
                <div className="collection-wrapper">
                    <Container>
                        <h3 style={{color:"#000000" , fontWeight:"600"}}>Welcome to Heed Shirts</h3>
                        <p>
                            At Heed, we blend classic design with modern comfort. Located in the heart of fashion innovation, we are dedicated to bringing you premium quality shirts that embody both style and durability. Our commitment to excellence has been the cornerstone of our success since our inception.
                        </p>
                        <h3 style={{color:"#000000" , fontWeight:"600"}}>Our Story</h3>
                        <p>
                            Heed began with a vision to revolutionize everyday wear. From our humble beginnings as a small boutique, we’ve grown into a globally recognized brand, thanks to our unwavering dedication to quality and design. What started as a passion for timeless fashion has evolved into a diverse collection of shirts crafted with precision and care.
                        </p>
                        <h3 style={{color:"#000000" , fontWeight:"600"}}>Our Mission</h3>
                        <p>
                            Our mission is to provide you with shirts that not only meet but exceed your expectations. We are committed to using high-quality materials and sustainable practices to deliver clothing that enhances your lifestyle. Each shirt is designed with the perfect blend of comfort and style, ensuring you feel confident and elegant.
                        </p>

                        <h3 style={{color:"#000000" , fontWeight:"600"}}>Why Choose Us?</h3>
                        <ul>
                            <li> <strong>Exceptional Quality:</strong><p>We use only the finest fabrics and materials, ensuring that every shirt meets our high standards of quality.</p></li>

                            <li> <strong>Timeless Style:</strong><p>Our designs combine classic elements with contemporary trends, making our shirts versatile for any occasion.</p></li>

                            <li> <strong>Customer Satisfaction:</strong><p>Your satisfaction is our priority. We are dedicated to providing excellent customer service and support to enhance your shopping experience.</p></li>
                        </ul>
                        <h3 style={{color:"#000000" , fontWeight:"600"}}>Explore Our Collection</h3>
                        <p>
                            Browse our extensive range of shirts and find the perfect fit for your wardrobe. From casual wear to formal attire, our collection is crafted to meet your every need and preference.
                        </p>

                        <h3 style={{color:"#000000" , fontWeight:"600"}}>Connect With Us</h3>
                        <p>
                            Join us on our journey to redefine everyday elegance. Whether you’re a longtime fan or a new customer, Heed is here to help you look and feel your best.
                        </p>

                        <h3 style={{color:"#000000" , fontWeight:"600"}}>Contact Us</h3>
                        <p>
                            Have questions or need assistance? Our dedicated customer support team is here to help. Reach out to us at <a href="mailto:heed.brandsin@gmail.com">heed.brandsin@gmail.com</a>
                            , and we’ll be happy to assist you.
                        </p>

                        <p>
                            Thank you for choosing ShopHeed. We look forward to being a part of your wardrobe and contributing to your style journey.
                        </p>
                    </Container>
                </div>
            </section>
        </CommonLayout>
    );
};

export default AboutUs;
