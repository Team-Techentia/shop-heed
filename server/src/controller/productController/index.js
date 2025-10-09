const mainProductModel = require("../../Model/mainProductModel");
const productModel = require("../../Model/productModel");
const productUniqueIdCounters = require("../../Model/productUniqueIdCounters");
const { generateToken } = require("../../scheduler/token");
const axios = require("axios");
const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await productUniqueIdCounters.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
};

function calculateDiscount(mrp, sellingPrice) {
  const discount = ((mrp - sellingPrice) / mrp) * 100;
  return discount.toFixed(2);
}

const createProduct = async function (req, res) {
  try {
    const data = req.body;
    const {
      brand,
      category,
      subCategory,
      shopType,
      discount,
      type,
      specificationArray,
      price,
      specificationSingleLine,
      variants,
      finalPrice,
    } = req.body;

    if (Object.keys(data) == 0) {
      return res
        .status(400)
        .send({ status: false, message: "no data provided" });
    }
    const iSProductExist = await productModel.findOne({ title: variants[0].title });
    if (iSProductExist) {
      return res
        .status(500)
        .json({ success: false, message: "Product title already exist" });
    }

    const product = new mainProductModel({
      brand,
      category,
      subCategory,
      discount,
      type,
      price,
      shopType,
      finalPrice,
    });

    await product.save();
    const variantPromises = variants.map(async (variant) => {
      const uniquePropertyId = await getNextSequenceValue("productUniqueId");
      const discount = Math.floor(calculateDiscount(price, finalPrice));
      const newVariant = new productModel({
        ...variant,
        specificationArray,
        productId: product._id,
        brand,
        category,
        subCategory,
        discount,
        type,
        shopType,
        price,
        uniquePropertyId,
        finalPrice,
        specificationSingleLine,
      });
      await newVariant.save();
      return newVariant;
    });

    const createdVariantIds = await Promise.all(variantPromises);
    product.products = createdVariantIds;
    await product.save();

    return res.status(201).json({
      product,
      variants: createdVariantIds,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const get_All_Product = async function (req, res) {
  try {
    const allProduct = await mainProductModel
      .find({ isDeleted: false })
      .populate("products")
      .sort({ createdAt: -1 });
    if (!allProduct) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }
    const arr = [];
    await allProduct.map((data, index) => {
      arr.push(data.products.find(p => p.quantity > 0));
    });

    return res
      .status(200)
      .json({ success: true, data: arr, message: "fetched all product data" });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};
const get_NEW_Product = async function (req, res) {
  try {
    const allProduct = await mainProductModel
      .find({ isDeleted: false, shopType: { $in: ["new and trending"] }, })
      .populate("products")
      .sort({ createdAt: -1 });
    if (!allProduct) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }
    const arr = [];
    allProduct.forEach((data) => {
      // Find the first product with quantity > 0
      const availableProduct = data.products.find((p) => p.quantity > 0);
      if (availableProduct) {
        arr.push(availableProduct);
      }
    });


    return res
      .status(200)
      .json({ success: true, data: arr, message: "fetched all product data" });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const get_Product_By_Id = async function (req, res) {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res
        .status(404)
        .json({ success: false, message: "product id not found" });
    }

    const productData = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });

    if (!productData) {
      return res
        .status(404)
        .json({ success: false, message: "product data not found" });
    }
    return res.status(201).json({
      success: true,
      data: productData,
      message: "fetched data by their id ",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const getAllSameProductById = async function (req, res) {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res
        .status(404)
        .json({ success: false, message: "product id not found" });
    }

    const productData = await productModel
      .find({
        productId: productId,
        isDeleted: false,
      })
      .sort({ createdAt: -1 });

    if (!productData) {
      return res
        .status(404)
        .json({ success: false, message: "product data not found" });
    }
    return res.status(201).json({
      success: true,
      data: productData,
      message: "fetched data by their id ",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const updated_main_Product = async function (req, res) {
  try {
    const productId = req.params.id;
    const data = req.body;

    if (!productId) {
      return res
        .status(404)
        .json({ success: false, message: "product Id not found" });
    }

    const updateProduct = await mainProductModel.findByIdAndUpdate(
      productId,
      { $set: data },
      { new: true }
    );

    if (!updateProduct) {
      return res
        .status(404)
        .json({ success: false, message: "product updated failed" });
    }
    return res.status(201).json({
      success: true,
      data: updateProduct,
      message: "product data updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const delete_main_Product = async function (req, res) {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res
        .status(404)
        .json({ success: false, message: "product Id not found" });
    }
    const mainProduct = await mainProductModel.findById(productId);
    if (!mainProduct) {
      return { success: false, message: "Main product not found" };
    }
    mainProduct.isDeleted = true;
    await mainProduct.save();
    await productModel.updateMany(
      { _id: { $in: mainProduct.products } },
      { $set: { isDeleted: true } }
    );

    return res
      .status(201)
      .json({ success: true, message: "product data updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const updated_Product = async function (req, res) {
  try {
    const productId = req.params.id;
    const data = req.body;
    const {
      price,
      finalPrice,
      type,
      subCategory,
      category,
      brand,
      isDeleted,
      shopType,
    } = data;

    const discount = Math.floor(calculateDiscount(price, finalPrice));
    data.discount = discount;

    if (!productId) {
      return res
        .status(404)
        .json({ success: false, message: "Product ID not found" });
    }

    const updateProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: data },
      { new: true }
    );

    if (!updateProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product update failed" });
    }

    if (isDeleted === true) {
      const mainProduct = await mainProductModel.findById(
        updateProduct.productId
      );

      if (!mainProduct) {
        return res.status(404).json({
          success: false,
          message: "Main product not found",
        });
      }

      mainProduct.products = mainProduct.products.filter(
        (prodId) => prodId.toString() !== productId.toString()
      );
      // if (shopType) {
      //   mainProduct.shopType = Array.from(new Set([...mainProduct.shopType, ...shopType]));
      // }


      await mainProduct.save();

      return res.status(200).json({
        success: true,
        message: "Product deleted and removed from main product successfully",
      });
    }

    const mainProduct = await mainProductModel.findById(
      updateProduct.productId
    );
    const createPromise = mainProduct.products.map(async (data, index) => {
      await productModel.findByIdAndUpdate(
        data,
        {
          $set: {
            shopType,
            price,
            finalPrice,
            subCategory,
            category,
            brand,
            discount,
          },
        },
        { new: true }
      );
    });

    await Promise.all(createPromise);
    let mainProductData = await mainProductModel.findById(
      updateProduct.productId
    );
    if (shopType) {
      mainProductData.shopType = Array.from(new Set([...mainProduct.shopType, ...shopType]));
      await mainProductData.save()
    }


    if (
      price ||
      finalPrice ||
      type ||
      subCategory ||
      category ||
      brand ||
      shopType ||
      discount
    ) {
      await mainProductModel.findByIdAndUpdate(
        updateProduct.productId,
        {
          $set: {
            price,
            discount,
            type,
            subCategory,
            category,
            brand,
            finalPrice,
            shopType,
          },
        },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      data: updateProduct,
      message: "Product data updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const filterProduct = async (req, res) => {
  try {
    let products;
    const { subCategory, category, shopType, isTrending } = req.query;
    let filter = { isDeleted: false };
    let where = { ...filter };
    if (category) {
      where.$or = [
        { category: { $in: category.split(",") } },
        { value: { $in: category.split(",") } }
      ];
    }
    if (subCategory) {
      where.subCategory = {
        $in: subCategory && subCategory.split(",").map((item) => item),
      };
    }
    if (isTrending) {
      where.shopType = { $in: ["price drop"] };
    } else if (shopType) {
      where.shopType = { $in: shopType && shopType.split(",").map((item) => item) };
    }
    console.log(where)
    if (subCategory === "all") {
      products = await mainProductModel
        .find(filter)
        .populate("products")
        .sort({ createdAt: -1 });
    } else {
      products = await mainProductModel
        .find(where)
        .populate("products")
        .sort({ createdAt: -1 });
    }

    const arr = [];
    products.forEach((data) => {
      arr.push(data.products[0]);
    });

    res.json(arr);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


const filterProductV2 = async (req, res) => {
  try {
    let products;
    const { subCategory, category, shopType, isTrending } = req.query;
    let filter = { isDeleted: false };
    let where = { ...filter };
    if (category) {
      where.category = category;
    }
    if (subCategory) {
      where.subCategory = {
        $in: subCategory && subCategory.split(",").map((item) => item),
      };
    }
    if (isTrending) {
      where.shopType = { $in: ["price drop"] };
    }
    if (subCategory === "all") {
      products = await productModel
        .find(filter)
        .sort({ createdAt: -1 });
    } else {
      products = await productModel
        .find(where)
        .sort({ createdAt: -1 });
    }



    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const AllBrands = async (req, res) => {
  try {
    const allBrands = await productModel
      .find()
      .select("brand -_id")
      .sort({ createdAt: -1 });
    return res.status(200).json({ status: true, data: allBrands });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const get_All_Product_Admin = async function (req, res) {
  try {
    const allProduct = await mainProductModel
      .find({ isDeleted: false })
      .populate("products")
      .sort({ createdAt: -1 });
    if (!allProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      data: allProduct,
      message: "Fetched all product data",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const get_All_Product_Admin_by_id = async function (req, res) {
  try {
    const Product = await mainProductModel
      .findOne({ isDeleted: false, _id: req.params.id })
      .populate({
        path: "products",
        match: { isDeleted: false },
      })
      .sort({ createdAt: -1 });
    if (!Product) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }

    return res
      .status(200)
      .json({ success: true, data: Product, message: "fetched product data" });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const searchProductsHomePage = async (req, res) => {
  try {
    const { query, page, limit } = req.query;

    if (!query) {
      return res.status(400).json({ message: "No search query provided" });
    }

    let filter = { isDeleted: false };

    const priceMatch = query.match(/under (\d+)/i);
    if (priceMatch) {
      const maxPrice = parseInt(priceMatch[1], 10);
      filter.price = { $lte: maxPrice };
    }

    const searchRegex = new RegExp(query, "i");

    const skip = (page - 1) * limit;

    const products = await productModel
      .find({
        ...filter,
        $or: [
          { title: searchRegex },
          { color: searchRegex },
          { brand: searchRegex },
          { category: searchRegex },
          { subCategory: { $in: searchRegex } },
          { type: searchRegex },
          { "specificationArray.answer": searchRegex },
          { "specificationArray.question": searchRegex },
          { specificationSingleLine: searchRegex },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("title price image");

    if (products.length === 0) {
      return res.json({
        status: false,
        message: "No products found matching your search criteria",
      });
    }

    return res.json({
      data: products,
      status: true,
      page: parseInt(page),
      hasMore: products.length === limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const serviceAvailability = async (req, res) => {
  try {
    const { pickup_postcode, delivery_postcode } = req.query;
    const SHIPROCKET_ACCESS_TOKEN = await generateToken();

    // Query parameters
    const params = {
      pickup_postcode,
      delivery_postcode,
      weight: "1", // Default weight in kgs  shirt weight not defines
      cod: 1, // Default to Cash on Delivery service (1 for COD, 0 for Prepaid service)
    };

    const response = await axios.get(process.env.SERVICE_AVAILABILITY_URL, {
      params: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SHIPROCKET_ACCESS_TOKEN}`,
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ error: "courier service not available in your area." });
  }
};

module.exports = {
  updated_main_Product,
  get_All_Product_Admin_by_id,
  createProduct,
  get_All_Product,
  get_NEW_Product,
  get_Product_By_Id,
  updated_Product,
  filterProduct,
  AllBrands,
  getAllSameProductById,
  get_All_Product_Admin,
  delete_main_Product,
  searchProductsHomePage,
  filterProductV2,
  serviceAvailability,
};
