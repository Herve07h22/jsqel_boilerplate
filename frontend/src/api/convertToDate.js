import moment from "moment";

const convertToDate = (o) => {
  //const dateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z$/
  const dateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
  //dateRegex.test('2018-12-31T23:00:00.000Z')
  if (!o) return o;

  if (typeof o === "string") {
    return dateRegex.test(o) ? moment(new Date(o)) : o;
  }

  if (typeof o === "object") {
    if (Array.isArray(o)) {
      return o.map((el) => convertToDate(el));
    } else {
      let returnedObject = {};
      Object.keys(o).forEach((key) => {
        returnedObject[key] = convertToDate(o[key]);
      });
      return returnedObject;
    }
  }

  return o;
};

export default convertToDate;
