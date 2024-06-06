const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "/assets/uploads"));
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    // cb(null, fileName);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const roles = [
  { name: "Chariman", level: 1 },
  { name: "Senior Member", level: 2 },
  { name: "Member", level: 3 },
  { name: "Commissioner", level: 4 },
  { name: "Deputy Commissioner", level: 5 },
  { name: "Assistant Commissioner", level: 6 },
  { name: "SSTO", level: 7 },
];


const upload = multer({ storage });

exports.uploadImage = (value) => {
  return upload.single(value);
};


exports.checkTargetDateIsNotFutureDate = (value) => {
  const currentDate = new Date();
  const targetDate = new Date(value);
  return targetDate <= currentDate;
};

exports.checkTargetTimeIsNotFutureTime = (value, date) => {
  const currentDate = new Date();
  const targetDate = new Date(date);
  const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();
  const targetTime =
    parseInt(value.split(":")[0]) * 60 + parseInt(value.split(":")[1]);
  if (targetDate < currentDate) {
    return true; //date pichli hai no need to check time;
  } else if (targetDate == currentDate) {
    if (targetTime <= currentTime) {
      return true;
    } else {
      return false;
    }
  } else {
    return false; //date future ki hai false krdo bina check kiye
  }
};

exports.checkTargetDateMustBeFutureDate = (value) => {
  const currentDate = new Date();
  const targetDate = new Date(value);
  return targetDate > currentDate;
};

exports.getRoleLevel = (roleName) => {
  const role = roles.find(role => role.name === roleName);
  return role ? role.level : null;
};

