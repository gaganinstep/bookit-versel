const { getAllModels } = require("../../../middlewares/loadModels");

exports.create = async (staff_profile_id, data) => {
    const { StaffAvailability } = await getAllModels(process.env.DB_TYPE);
  return await StaffAvailability.create({ ...data, staff_profile_id });
};

exports.list = async (staff_profile_id) => {
    const { StaffAvailability } = await getAllModels(process.env.DB_TYPE);
  return await StaffAvailability.findAll({ where: { staff_profile_id } });
};

exports.update = async (id, data) => {
    const { StaffAvailability } = await getAllModels(process.env.DB_TYPE);
  return await StaffAvailability.update(data, { where: { id } });
};

exports.delete = async (id) => {
    const { StaffAvailability } = await getAllModels(process.env.DB_TYPE);
  return await StaffAvailability.destroy({ where: { id } });
};
