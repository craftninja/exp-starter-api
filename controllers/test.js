'use strict';

module.exports = {
  getTest: (req, res, next) => {
    const param = req.swagger.params.test.value;
    res.json({
      value: param
    });
  }
};
