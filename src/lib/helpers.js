module.exports = {
  randomId: () =>
    `${new Date().getTime().toString(36)}-${Math.random()
      .toString(36)
      .substring(2, 11)
      .padStart(9, "0")}`,
};
