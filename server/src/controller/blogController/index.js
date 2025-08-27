const blogModel = require("../../Model/blogModel")
const validator = require("../../validator/validator")

const createBlogs = async function (req, res) {
    try {
       
        const data = req.body

    

        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, massage: "please fill the given area" }) };

        if ((!validator.isValid(data.title))) {
            return res.status(404).json({ success: false, message: "title must be required" })
        };

        if ((!validator.isValid(data.photo))) {
            return res.status(404).json({ success: false, message: "photo must be required" })
        };

        if ((!validator.isValid(data.description))) {
            return res.status(404).json({ success: false, message: "description must be required" })
        };
         
        const blogData = new blogModel(req.body);
        const blog = await blogData.save();

        return res.status(200).json({ success: true, message:"blog successfully created", data: blog })
    } catch (error) {
        
        res.status(500).json({ message: "internal server error" })
    }
}



const get_All_Blog = async (req, res) => {
    try {
        const AllBlog = await blogModel.find({ isDeleted: false }).sort({ createdAt: -1 });
        
        return AllBlog.length 
            ? res.status(200).json({ success: true, data: AllBlog, message: "Fetched all blogs" })
            : res.status(404).json({ success: false, message: "Blog data not found" });
    } catch (error) {
       
        res.status(500).json({ message: "Internal server error" });
    }
}

const get_Blog_Id = async (req, res) => {
    try {
        const getBlog = await blogModel.findById(req.params.id);
        
        if (!getBlog) {
            return res.status(404).json({ success: false, message: "Failed to fetch blog" });
        }
        
        res.status(200).json({ success: true, data: getBlog, message: "Blog fetched successfully" });
        
    } catch (error) {
        
        res.status(500).json({ message: "Internal server error" }); 
    }
}


const Update_Blog = async (req, res) => {
    try {
        const updateBlog = await blogModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!updateBlog) {
            return res.status(404).json({ success: false, message: "Failed to update blog" });
        }
        
        res.status(200).json({ success: true, data: updateBlog, message: "Blog updated successfully" });
        
    } catch (error) {
        
        res.status(500).json({ message: "Internal server error" });
    }
}




const Delete_Blog = async (req, res) => {
    try {
        const deleteBlog = await blogModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });

        if (!deleteBlog) {
            return res.status(404).json({ success: false, message: "Failed to delete blog" });
        }

        res.status(200).json({ success: true, data: deleteBlog, message: "Blog deleted successfully" });

    } catch (error) {
        
        res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = {createBlogs ,get_All_Blog ,get_Blog_Id,Update_Blog , Delete_Blog}
