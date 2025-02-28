export default (record, message = "Record not found") => {
    if (!record) {
        throw { type: 404, message };
    }
    return record;
};