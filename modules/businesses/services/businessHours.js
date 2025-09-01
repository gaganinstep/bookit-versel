const { getAllModels } = require("../../../middlewares/loadModels");

exports.setBusinessHour = async (location_id, data) => {
  const { BusinessHour } = await getAllModels(process.env.DB_TYPE); 
  const [record, created] = await BusinessHour.upsert({ ...data, location_id });
  return record;
};

exports.getBusinessHours = async (location_id) => {
  const { BusinessHour } = await getAllModels(process.env.DB_TYPE);
  return await BusinessHour.findAll({ where: { location_id } });
};

exports.deleteBusinessHour = async (location_id, day_of_week) => {
  const { BusinessHour } = await getAllModels(process.env.DB_TYPE);
  return await BusinessHour.destroy({ where: { location_id, day_of_week } });
};
