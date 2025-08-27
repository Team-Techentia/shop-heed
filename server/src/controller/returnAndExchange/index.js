const model =require("../../Model/returnAndExchange")
const email = require("../emailController/index");

exports.create = async (req, res) => {
     try {
         if(Object.keys(req.body).length === 0) throw new Error("body is missing");
          const createdModel = await model.create(req.body);
          await email.returnOrExchangeMail(req.body)
          return res.json(createdModel);
     } catch (error) {
          res.json({error:error.message});
     }
};


exports.get = async (req, res) => {
     try {
             const foundModel = await model.findById(req.params.id)

          return res.json(mapper.toModel(foundModel));
     } catch (e) {
          res.json({error:e.message});
     }
};

exports.delete = async (req, res) => {
     try {
          //find user if exists
          const foundModel = await model.findById(req.params.id)
          await foundModel.delete();
          return res.json(`model deleted successfully `);
     } catch (err) {
          res.json({error:err.message});
     }
};

