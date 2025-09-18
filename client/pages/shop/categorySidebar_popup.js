import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Input, Label } from "reactstrap";
import CatogeryPopupSidebar from "./common/catogeryPopupSidebar";
import HeaderOne from "../../components/headers/header-one";
import MasterFooter from "../../components/footers/common/MasterFooter";
import Paragraph from "../../components/common/Paragraph";
import ProductItems from "../../components/common/product-box/ProductBox1";

// Price sorting options
const SORT_OPTIONS = [
    { value: 'default', label: 'Recommended' },
    { value: 'low-to-high', label: 'Price: Low to High' },
    { value: 'high-to-low', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' }
];

// Predefined colors
const ALL_COLORS = [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Green', hex: '#008000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Brown', hex: '#A52A2A' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Turquoise', hex: '#40E0D0' },
    { name: 'Cyan', hex: '#00FFFF' },
    { name: 'Magenta', hex: '#FF00FF' },
    { name: 'Lavender', hex: '#E6E6FA' },
    { name: 'Indigo', hex: '#4B0082' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'Olive', hex: '#808000' },
    { name: 'Teal', hex: '#008080' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Violet', hex: '#EE82EE' },
    { name: 'Silver', hex: '#C0C0C0' },
    { name: 'Gold', hex: '#FFD700' },
    { name: 'Charcoal', hex: '#36454F' },
    { name: 'Coral', hex: '#FF7F50' },
    { name: 'Crimson', hex: '#DC143C' },
    { name: 'Emerald', hex: '#50C878' },
    { name: 'Ivory', hex: '#FFFFF0' },
    { name: 'Khaki', hex: '#F0E68C' },
    { name: 'Mint', hex: '#98FF98' },
    { name: 'Peach', hex: '#FFDAB9' },
    { name: 'Plum', hex: '#DDA0DD' },
    { name: 'Rose', hex: '#FF007F' },
    { name: 'Sapphire', hex: '#0F52BA' },
    { name: 'Tan', hex: '#D2B48C' },
    { name: 'Aquamarine', hex: '#7FFFD4' },
];

// Predefined sizes
const ALL_SIZES = [
    'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'
];

// Helper functions
const extractValues = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value.map(v => String(v).trim()).filter(v => v);
    }
    return [String(value).trim()].filter(v => v);
};

const normalizeString = (str) => {
    return String(str).trim().toLowerCase();
};

const CategorySidebar_popup = ({ product, banner, subCategory, backImage, title, cartClass }) => {
    console.log("subCategory", subCategory);
    
    const [showFilters, setShowFilters] = useState(false);
    
    // Filter states
    const [filters, setFilters] = useState({
        priceRange: [0, 3500],
        selectedSizes: [],
        selectedColors: [],
        sortBy: 'default'
    });

    const [filteredData, setFilteredData] = useState([]);
    const [availableSizes] = useState(ALL_SIZES);
    const [availableColors] = useState(ALL_COLORS);

    // Apply filters and sorting whenever product data or filters change
    useEffect(() => {
        if (product && product.length > 0) {
            let filtered = [...product];

            // Price range filter
            filtered = filtered.filter(prod => {
                const price = parseFloat(prod.price) || 0;
                return price >= filters.priceRange[0] && price <= filters.priceRange[1];
            });

            // Size filter
            if (filters.selectedSizes.length > 0) {
                filtered = filtered.filter(prod => {
                    const productSizes = extractValues(prod.size);
                    return productSizes.some(size =>
                        filters.selectedSizes.some(selectedSize =>
                            normalizeString(size) === normalizeString(selectedSize)
                        )
                    );
                });
            }

            // Color filter
            if (filters.selectedColors.length > 0) {
                filtered = filtered.filter(prod => {
                    const productColors = extractValues(prod.color);
                    return productColors.some(color =>
                        filters.selectedColors.some(selectedColor =>
                            normalizeString(color) === normalizeString(selectedColor)
                        )
                    );
                });
            }

            // Apply sorting
            if (filters.sortBy === 'low-to-high') {
                filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
            } else if (filters.sortBy === 'high-to-low') {
                filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
            } else if (filters.sortBy === 'newest') {
                filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            }

            setFilteredData(filtered);
        } else {
            setFilteredData([]);
        }
    }, [product, filters]);

    // Handle filter changes
    const handlePriceRangeChange = (value, type) => {
        setFilters(prev => ({
            ...prev,
            priceRange: type === 'min'
                ? [parseInt(value) || 0, prev.priceRange[1]]
                : [prev.priceRange[0], parseInt(value) || 3500]
        }));
    };

    const handleSizeToggle = (size) => {
        setFilters(prev => ({
            ...prev,
            selectedSizes: prev.selectedSizes.includes(size)
                ? prev.selectedSizes.filter(s => s !== size)
                : [...prev.selectedSizes, size]
        }));
    };

    const handleColorToggle = (colorName) => {
        setFilters(prev => ({
            ...prev,
            selectedColors: prev.selectedColors.includes(colorName)
                ? prev.selectedColors.filter(c => c !== colorName)
                : [...prev.selectedColors, colorName]
        }));
    };

    const handleSortChange = (sortValue) => {
        setFilters(prev => ({
            ...prev,
            sortBy: sortValue
        }));
    };

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({
            priceRange: [0, 3500],
            selectedSizes: [],
            selectedColors: [],
            sortBy: 'default'
        });
    };

    // Check if any filters are active
    const hasActiveFilters = filters.priceRange[0] !== 0 ||
        filters.priceRange[1] !== 3500 ||
        filters.selectedSizes.length > 0 ||
        filters.selectedColors.length > 0 ||
        filters.sortBy !== 'default';

    return (
        <>
            <HeaderOne topClass="top-header" logoName="logo.png" />
            
            {banner && banner.src && (
                <Paragraph title={banner.title} inner={banner.title} />
            )}
            
            <section className="section-b-space ratio_asos">
                <div className="premium-collection">
                    <Container>
                        {/* Header with Filter Toggle and Sort */}
                        <Row className="mb-4">
                            <Col>
                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <Label className="mb-0 small text-uppercase font-weight-bold">Sort by:</Label>
                                            <div className="custom-select">
                                                <Input
                                                    type="select"
                                                    value={filters.sortBy}
                                                    onChange={(e) => handleSortChange(e.target.value)}
                                                    className="sort-select"
                                                >
                                                    {SORT_OPTIONS.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </div>
                                        </div>

                                        {/* Filter Toggle Button */}
                                        <Button
                                            color="outline-dark"
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="filter-toggle-btn d-flex align-items-center"
                                        >
                                            <i className="fa fa-filter me-2"></i>
                                            Filters
                                            {hasActiveFilters && (
                                                <span className="filter-badge">
                                                    {filters.selectedSizes.length +
                                                        filters.selectedColors.length +
                                                        (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 3500 ? 1 : 0)}
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            {/* Filter Sidebar */}
                            <Col lg="3" className={showFilters ? "d-block" : "d-none"}>
                                <div className="filter-sidebar">
                                    {/* Price Range Filter */}
                                    <div className="filter-section mb-4">
                                        <h6 className="filter-title">Price Range</h6>
                                        <div className="price-inputs d-flex align-items-center gap-2 mb-3">
                                            <div className="price-input-group">
                                                <Label className="small text-muted">Min</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={filters.priceRange[0]}
                                                    onChange={(e) => handlePriceRangeChange(e.target.value, "min")}
                                                    min="0"
                                                    max="3500"
                                                    className="price-input"
                                                />
                                            </div>
                                            <span className="dash">-</span>
                                            <div className="price-input-group">
                                                <Label className="small text-muted">Max</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="3500"
                                                    value={filters.priceRange[1]}
                                                    onChange={(e) => handlePriceRangeChange(e.target.value, "max")}
                                                    min="0"
                                                    max="3500"
                                                    className="price-input"
                                                />
                                            </div>
                                        </div>
                                        <div className="price-slider position-relative">
                                            <input
                                                type="range"
                                                className="form-range range-min"
                                                min="0"
                                                max="3500"
                                                step="50"
                                                value={filters.priceRange[0]}
                                                onChange={(e) => handlePriceRangeChange(e.target.value, "min")}
                                            />
                                            <input
                                                type="range"
                                                className="form-range range-max"
                                                min="0"
                                                max="3500"
                                                step="50"
                                                value={filters.priceRange[1]}
                                                onChange={(e) => handlePriceRangeChange(e.target.value, "max")}
                                            />
                                        </div>
                                    </div>

                                    {/* Size Filter */}
                                    <div className="filter-section mb-4">
                                        <h6 className="filter-title">Size</h6>
                                        <div className="size-filters d-flex flex-wrap gap-2">
                                            {availableSizes.map((size) => (
                                                <button
                                                    key={size}
                                                    className={`size-btn ${filters.selectedSizes.includes(size) ? "active" : ""}`}
                                                    onClick={() => handleSizeToggle(size)}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Filter */}
                                    <div className="filter-section mb-4">
                                        <h6 className="filter-title">Color</h6>
                                        <div className="color-filters d-flex flex-wrap gap-2">
                                            {availableColors.map(({ name, hex }) => {
                                                const isSelected = filters.selectedColors.includes(hex);
                                                return (
                                                    <button
                                                        key={hex}
                                                        className={`color-btn ${isSelected ? "active" : ""}`}
                                                        onClick={() => handleColorToggle(hex)}
                                                        title={name}
                                                        style={{ backgroundColor: hex }}
                                                    >
                                                        {isSelected && <i className="fa fa-check"></i>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Clear Filters Button */}
                                    {hasActiveFilters && (
                                        <div className="text-center">
                                            <Button 
                                                color="outline-dark" 
                                                size="sm" 
                                                onClick={clearAllFilters}
                                                className="w-100"
                                            >
                                                Clear All Filters
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Col>

                            {/* Products Grid */}
                            <Col lg={showFilters ? "9" : "12"}>
                                <Row className="margin-default">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((prod, index) => (
                                            <Col
                                                xl={showFilters ? "4" : "3"}
                                                lg={showFilters ? "4" : "4"}
                                                md="6"
                                                sm="6"
                                                xs="6"
                                                key={index}
                                            >
                                                <div className="product-item-wrapper">
                                                    <ProductItems
                                                        product={prod}
                                                        backImage={backImage}
                                                        title={title}
                                                        cartClass={cartClass}
                                                    />
                                                </div>
                                            </Col>
                                        ))
                                    ) : (
                                        <Col className="text-center py-5">
                                            <div className="no-products">
                                                <i className="fa fa-search fa-3x mb-3"></i>
                                                <h5>No products found</h5>
                                                <p className="text-muted">Try adjusting your filters or search criteria</p>
                                                {hasActiveFilters && (
                                                    <Button color="dark" onClick={clearAllFilters} className="px-4">
                                                        Clear All Filters
                                                    </Button>
                                                )}
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            </Col>
                        </Row>
                    </Container>

                    {/* Add the same styles from TopCollection */}
                    <style jsx>{`
                        // .premium-collection {
                        //     font-family: 'Inter', 'Helvetica Neue', sans-serif;
                        //     color: #2c2c2c;
                        //     background: #fff;
                        // }
                        
                        .collection-title {
                            font-weight: 600;
                            color: #000;
                            letter-spacing: -0.5px;
                            margin-bottom: 0;
                        }
                        
                        .filter-toggle-btn {
                            border: 1px solid #ddd;
                            border-radius: 6px;
                            padding: 8px 16px;
                            font-weight: 500;
                            transition: all 0.2s ease;
                        }
                        
                        .filter-toggle-btn:hover {
                            background: #000;
                            color: #fff;
                            border-color: #000;
                        }
                        
                        .filter-badge {
                            background: #000;
                            color: #fff;
                            border-radius: 50%;
                            width: 20px;
                            height: 20px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 11px;
                            margin-left: 6px;
                        }
                        
                        .filter-sidebar {
                            background: #f8f9fa;
                            border-radius: 12px;
                            padding: 24px;
                            height: fit-content;
                            position: sticky;
                            top: 20px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                        }
                        
                        .filter-section {
                            padding-bottom: 20px;
                            border-bottom: 1px solid #eee;
                            margin-bottom: 20px;
                        }
                        
                        .filter-section:last-child {
                            border-bottom: none;
                            margin-bottom: 0;
                            padding-bottom: 0;
                        }
                        
                        .filter-title {
                            font-weight: 600;
                            margin-bottom: 16px;
                            color: #333;
                            font-size: 14px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        
                        .price-input-group {
                            margin-top:10px;
                            flex: 1;
                        }
                        
                        .price-input {
                            border-radius: 6px;
                            border: 1px solid #ddd;
                            padding: 8px 12px;
                            font-size: 14px;
                        }
                        
                        .price-input:focus {
                            border-color: #000;
                            box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
                        }
                        
                        .dash {
                            color: #888;
                            padding-top: 20px;
                        }
                        
                        .price-slider {
                            position: relative;
                            height: 40px;
                        }

                        .price-slider input[type="range"] {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            pointer-events: none;
                            background: transparent;
                        }

                        .price-slider input[type="range"]::-webkit-slider-thumb {
                            pointer-events: auto;
                            position: relative;
                            z-index: 2;
                        }

                        .price-slider input[type="range"]::-moz-range-thumb {
                            pointer-events: auto;
                            position: relative;
                            z-index: 2;
                        }
                        
                        .size-btn {
                            padding: 8px 12px;
                            border: 1px solid #ddd;
                            background: #fff;
                            border-radius: 6px;
                            font-size: 13px;
                            font-weight: 500;
                            transition: all 0.2s ease;
                            min-width: 40px;
                        }
                        
                        .size-btn:hover, .size-btn.active {
                            background: #000;
                            color: #fff;
                            border-color: #000;
                        }
                        
                        .color-btn {
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                            border: 2px solid #fff;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            position: relative;
                            transition: all 0.2s ease;
                        }
                        
                        .color-btn:hover, .color-btn.active {
                            transform: scale(1.1);
                            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                        }
                        
                        .color-btn.active {
                            border-color: #000;
                        }
                        
                        .color-btn i {
                            color: #fff;
                            font-size: 12px;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                        }
                        
                        .custom-select {
                            position: relative;
                        }
                        
                        .sort-select {
                            border: 1px solid #ddd;
                            border-radius: 6px;
                            padding: 8px 36px 8px 12px;
                            font-size: 14px;
                            appearance: none;
                            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
                            background-repeat: no-repeat;
                            background-position: right 12px center;
                            background-size: 16px;
                        }
                        
                        .sort-select:focus {
                            border-color: #000;
                            box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
                        }
                        
                        .product-item-wrapper {
                            transition: transform 0.2s ease;
                        }
                        
                        .product-item-wrapper:hover {
                            transform: translateY(-4px);
                        }
                        
                        .no-products {
                            padding: 40px 0;
                        }
                        
                        @media (max-width: 991px) {
                            .filter-sidebar {
                                position: fixed;
                                top: 0;
                                left: 0;
                                width: 320px;
                                height: 100vh;
                                z-index: 1000;
                                overflow-y: auto;
                                border-radius: 0;
                                box-shadow: 4px 0 20px rgba(0,0,0,0.1);
                                transform: translateX(-100%);
                                transition: transform 0.3s ease;
                            }
                            
                            .filter-sidebar.show {
                                transform: translateX(0);
                            }
                        }
                        
                        @media (max-width: 575px) {
                            .filter-toggle-btn {
                                padding: 6px 12px;
                                font-size: 14px;
                            }
                        }
                    `}</style>
                </div>
            </section>
            
            <CatogeryPopupSidebar />
          <MasterFooter
        footerClass={`footer-light`}
        footerLayOut={"light-layout upper-footer"}
        footerSection={"small-section border-section border-top-0"}
        belowSection={"section-b-space light-layout"}
        newLatter={true}
        logoName={"logo.png"}
        />
        </>
    );
};

export default CategorySidebar_popup;