module.exports = async user => {
  const serialized = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    birthYear: user.birthYear,
    student: user.student,
  };
  return serialized;
};
