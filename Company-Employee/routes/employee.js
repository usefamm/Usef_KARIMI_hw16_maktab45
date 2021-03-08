const express = require("express");
const Router = express.Router();
const employee = require("../models/employee");
const router = require("./api");
//create
Router.put("/", (req, res) => {
  const newEmployee = new employee({
    name: req.body.name,

    familyName: req.body.familyName,

    Code: req.body.Code,

    Gender: req.body.Gender,

    Manager: req.body.Manager,

    birthDay: req.body.birthDay,
  });
  newEmployee.save((err, employee) => {
    if (err)
      return res.status(500).json({
        msg: "Server Error :)",
        err: err.message,
      });
    res.json(employee);
  });
});
//age between 20 and 30
Router.get("/ageBetween2030", (req, res) => {
  employee.aggregate(
    [
      {
        $project: {
          date: "$birthDay",
          age: {
            $divide: [
              { $subtract: [new Date(), "$birthDay"] },
              365 * 24 * 60 * 60 * 1000,
            ],
          },
        },
      },
    ],
    (err, employees) => {
      if (err)
        return res.status(500).json({
          msg: "Server Error :)",
          err: err.message,
        });
      let targetEmployee = employees.filter(
        (el) => el.age <= 30 && el.age >= 20
      );
      
      let list = [];
      for (let i = 0; i < targetEmployee.length; i++) {
        employee.find(
          { _id: targetEmployee[i]._id },
          { _id: 0 },
          (err, employed) => {
            if (err)
              return res.status(500).json({
                msg: "Server Error :)",
                err: err.message,
              });
            list.push(employed);
            list = list.flat();
            if (i === targetEmployee.length - 1) {
                
                
              res.json(list);
            }
          }
        );
      }
    }
  );
});


Router.get('/managers',(req,res)=>{
    employee.find({"Manager":true},(err,manager)=>{
        if (err)
              return res.status(500).json({
                msg: "Server Error :)",
                err: err.message,
              });

              res.json(manager)

    })
})
module.exports = Router;
