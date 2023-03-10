module.exports = app => {
    const announcements= require("../controllers/ann_controller.js");
  
    var router = require("express").Router();
  
    router.post("/",announcements.create);
  
    router.get("/",announcements.findAll);
  
    router.get("/published", announcements.findAllPublished);
  
    router.get("/:id", announcements.findOne);
  
    router.put("/:id", announcements.update);
  
    router.delete("/:id", announcements.delete);
  
    router.delete("/", announcements.deleteAll);
  
    app.use('/api/announcements', router);
  };