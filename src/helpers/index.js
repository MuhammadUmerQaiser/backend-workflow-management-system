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
