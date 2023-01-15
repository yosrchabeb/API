module.exports = (sequelize, Sequelize) => {
    const announcement = sequelize.define("announcement", {
      course_name: {
        type: Sequelize.STRING
      },
      professor_name: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.STRING
      },
      time_slot: {
        type: Sequelize.STRING
      },
      classroom: {
        type: Sequelize.STRING
      },
      published: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return announcement;
  };