const db = require("../models");
const announcement= db.announcements;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

    if (!req.body.course_name) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    const newAnnouncement = new announcement({
      course_name: req.body.course_name,
      professor_name: req.body.professor_name,
      level: req.body.level,
      time_slot: req.body.time_slot,
      date:req.body.date,
      classroom: req.body.classroom,
      published: req.body.published ? req.body.published : false
    });
    
    newAnnouncement.save()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the Announcement."
        });
      });
}

  exports.findAll = (req, res) => {
    const course_name = req.query.course_name;
    var condition = course_name ? { course_name: { [Op.like]: `%${course_name}%` } } : null;
  
    announcement.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
  };
  exports.findOne = (req, res) => {
    const id = req.params.id;
  
    announcement.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Tutorial with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Tutorial with id=" + id
        });
      });
  };
  exports.update = (req, res) => {
    const id = req.params.id;
  
    announcement.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Announcement was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update announcement with id=${id}. Maybe Tutorial was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating announcement with id=" + id
        });
      });
  };

  exports.delete = (req, res) => {
    const id = req.params.id;
  
   announcement.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Announcement was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Announcement with id=${id}. Maybe Tutorial was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Announcement with id=" + id
        });
      });
  };

  exports.deleteAll = (req, res) => {
    announcement.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Announcement were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all Announcements."
        });
      });
  };

  exports.findAllPublished = (req, res) => {
    announcement.findAll({ where: { published: true } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Announcements."
        });
      });
  };
