const createEntity = async (model, entityName, isActiveAvailable, req, res) => {
  try {
    const { name, isActive } = req.body;

    const existingEntity = await model.findOne({ name: name });
    if (!existingEntity) {
      const entityData = {
        name: name,
      };

      if (entityName == "Team") {
        entityData.member = req.body.member;
        entityData.membersList = req.body.membersList;
      }
      if (isActive) {
        entityData.isActive = true;
      }

      const newEntity = new model(entityData);
      await newEntity.save();

      res.status(200).json({
        message: `${entityName} created successfully`,
        data: newEntity,
      });
    } else {
      res.status(500).json({ message: `${entityName} already exists` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEntities = async (
  model,
  isActiveAvailable,
  req,
  res,
  populate = null
) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const paginatedData = req.query.paginatedData || false;

    let query = model.find();

    if (isActiveAvailable) {
      const isActive = req.query.isActive === "true";
      query = isActive ? query.where({ isActive: true }) : query;
    }
    if (req.query.category != 'null' && req.query.category != undefined) {
      query = query.where({category: req.query.category});
    }

    if (populate) {
      const fieldsToPopulate = populate.split(',');
      if(fieldsToPopulate){
        fieldsToPopulate.forEach(item => {
          query = query.populate(item.trim())
        });
      }else{
        query = query.populate(populate);
      }
    }

    const totalEntities = await model.countDocuments(query._conditions);

    const totalPages = Math.ceil(totalEntities / limit);

    query = query.sort({ createdAt: -1 });

    if (paginatedData == "true") {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const entities = await query.exec();

    res.status(200).json({
      data: entities,
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateEntity = async (model, entityName, isActiveAvailable, req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const entityExists = await model.findById(id);

    if (!entityExists) {
      return res
        .status(404)
        .json({ message: `${entityName} with that id does not exist` });
    }

    entityExists.name = name || entityExists.name;

    if (entityName == "Team") {
      entityExists.member = req.body.member || entityExists.member;
      entityExists.membersList =
        req.body.membersList || entityExists.membersList;
    }

    if (isActiveAvailable) {
      if (isActive !== undefined) {
        entityExists.isActive = isActive;
      }
    }

    await entityExists.save();

    res.status(200).json({
      message: `${entityName} updated successfully`,
      data: entityExists,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteEntity = async (model, entityName, req, res) => {
  const { id } = req.params;
  try {
    const entity = await model.findById(id);
    if (!entity) {
      return res
        .status(404)
        .json({ message: `${entityName} with that id does not exist` });
    }
    await entity.deleteOne();
    res.json({
      message: `${entityName} deleted successfully`,
      data: entity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  createEntity,
  updateEntity,
  deleteEntity,
  getAllEntities,
};
