require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('neondb', 'neondb_owner', 'Pn2cpaoKbB4S', {
  host: 'ep-green-unit-a5jr4385.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

const Sector = sequelize.define(
  'Sector',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sector_name: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const Project = sequelize.define(
  'Project',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
    },
    feature_img_url: {
      type: Sequelize.STRING,
    },
    summary_short: {
      type: Sequelize.TEXT,
    },
    intro_short: {
      type: Sequelize.TEXT,
    },
    impacts: {
      type: Sequelize.TEXT,
    },
    original_source_url: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

Project.belongsTo(Sector, { foreignKey: 'sector_id' });

function initialize() {
  return sequelize.sync().then(() => {
    console.log("Database synchronized successfully.");
  }).catch((error) => {
    return Promise.reject(`Failed to initialize the database: ${error}`);
  });
}
function getAllSectors(){
  return Sector.findAll().then(sectors => {
    if(sectors.length >0 ) {
      return Promise.resolve(sectors);

    } else {
      return Promise.reject("No sectors found");
    }
  }).catch (error => {
    return Promise.reject("Failed to retrieve sectors");
  });
}
function addProject(projectData) {
  return Project.create({
    title: projectData.title,
    feature_img_url: projectData.feature_img_url,
    summary_short: projectData.summary_short,
    intro_short: projectData.intro_short,
    impacts: projectData.impacts,
    original_source_url: projectData.original_source_url,
    sector_id: projectData.sector_id, // Assume form contains sector_id
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch(error => {
      return Promise.reject("Failed to add project: " + error);
    });
}
function editProject(id, projectData) {
  return Project.update(
    {
      title: projectData.title,
      feature_img_url: projectData.feature_img_url,
      summary_short: projectData.summary_short,
      intro_short: projectData.intro_short,
      impacts: projectData.impacts,
      original_source_url: projectData.original_source_url,
      sector_id: projectData.sector_id,
    },
    {
      where: {
        id: id, // Target the project by ID
      },
    }
  )
    .then(([affectedRows]) => {
      if (affectedRows === 0) {
        return Promise.reject("No project found with the provided ID.");
      }
      return Promise.resolve(); // Successfully updated
    })
    .catch((error) => {
      return Promise.reject("Failed to update project: " + error);
    });
}
function getAllProjects() {
  return Project.findAll({
    include: [Sector], // Fixed here
  }).then((projects) => {
    if (projects.length > 0) {
      return Promise.resolve(projects);
    } else {
      return Promise.reject("No projects found");
    }
  }).catch((error) => {
    return Promise.reject(`Failed to retrieve projects: ${error}`);
  });
}

function getProjectById(projectId) {
  return Project.findAll({
    include: [Sector],
    where: {
      id: projectId
    },
  }).then((projects) => {
    if (projects.length > 0) {
      return Promise.resolve(projects[0]); // Fixed here
    } else {
      return Promise.reject(`Unable to find a project with ID: ${projectId}`);
    }
  }).catch((error) => {
    return Promise.reject(`Failed to retrieve project: ${error}`);
  });
}
function deleteProject(id) {
  return Project.destroy({
    where: {
      id: id, // Find the project by its id
    },
  })
    .then((affectedRows) => {
      if (affectedRows === 0) {
        // If no rows were affected, no project was found with the provided id
        return Promise.reject("No project found with the provided ID.");
      }
      // If the project was deleted, resolve the promise without any data
      return Promise.resolve();
    })
    .catch((error) => {
      // If an error occurs during the deletion, reject the promise with the error message
      return Promise.reject("Failed to delete project: " + error.errors[0].message);
    });
}
function getProjectsBySector(sector) {
  return Project.findAll({
    include: [Sector],
    where: {
      '$Sector.sector_name$': {
        [Sequelize.Op.iLike]: `%${sector}%`,
      },
    },
  })
    .then((projects) => {
      if (projects.length > 0) {
        return Promise.resolve(projects);
      } else {
        return Promise.reject(`No projects found in the sector: ${sector}`);
      }
    })
    .catch((error) => {
      return Promise.reject(`Failed to retrieve projects by sector: ${error}`);
    });
}

module.exports = {deleteProject,editProject, getAllSectors, addProject, getAllProjects, getProjectById, getProjectsBySector ,initialize};
