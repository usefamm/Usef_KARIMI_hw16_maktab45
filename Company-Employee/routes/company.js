
const express = require("express");
const company = require("../models/company");
const router = express.Router();
const Company = require("../models/company");


//showing companies UI
router.get("/companiesPage", (req, res) => {
  Company.find({},{"__v":0},{lean: true}, (err, companies) => {
    if (err)
      return res.status(500).json({
        msg: "Server Error :)",
        err: err.message,
      });
    
    let list=Object.keys(companies[0])
    
    
   
    res.render("company", {
      list,companies
    }
    );
  });
});



//ReadAll Companies Less Than One Year
router.get("/all", (req, res) => {
  Company.aggregate(
    [
      {
        $project: {
          
          dateDifference: {
            $divide: [
              {
                $subtract: ["$SubmitDate", new Date()],
              },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
    ],
    (err, companies) => {
      if (err)
        return res.status(500).json({
          msg: "Server Error :)",
          err: err.message,
        });

      let target = companies.filter(
        (el) => el.dateDifference > -365 && el.dateDifference < 365
      );
      let list = [];
      for (let i = 0; i < target.length; i++) {
        Company.find({ _id: target[i]._id }, {name:1,_id:0}, (err, users) => {
          if (err)
            return res.status(500).json({
              msg: "Server Error :)",
              err: err.message,
            });
          list.push(users);
          list = list.flat();
          if (i === target.length - 1) {
            res.json(list);
          }
        });
      }
    }
  );
});



router.put("/", (req, res) => {
  
  //Create
  const newCompany = new Company({
    name: req.body.name,

    submitNumber: req.body.submitNumber,

    Town: req.body.Town,

    City: req.body.City,

    SubmitDate: req.body.SubmitDate,

    Phone: req.body.Phone,
  });

  newCompany.save((err, company) => {
    if (err)
      return res.status(500).json({
        msg: "Server Error :)",
        err: err.message,
      });
    res.json(company);
  });
});

//Update tehran
router.post("/Tehran", (req, res) => {
  Company.updateMany({$or:[
    { City: { $ne: "Tehran" }},
    { Town: { $ne: "Tehran" } }]},
    { $set: { City: "Tehran", Town: "Tehran" } },
    {
      new: true,
    },
    (err, company) => {
      if (err)
        return res.status(500).json({
          msg: "Server Error :)",
          err: err.message,
        });
      res.json(company);
    }
  );
});

//Delete table 
router.delete("/delete/:id", (req, res) => {
  console.log(req.body);
  Company.deleteOne(
    {
      _id: req.params.id
    },
    (err, company) => {
      if (err)
        return res.status(500).json({
          msg: "Server Error :)",
          err: err.message,
        });
      res.json({
        company,
        msg: "success",
      });
    }
  );
});

//Update table 
router.post('/update',(req,res)=>{
  company.findOneAndUpdate({_id:req.body._id},req.body, {new:true}, (err,info)=>{
    if (err)
    return res.status(500).json({
      msg: "Wrong inputs",
      err: err.message,
    });
    res.json(info)

  })

})


module.exports = router;
