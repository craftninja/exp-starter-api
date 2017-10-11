const expect = require('expect');

require('../helpers/testSetup');

const User = require('../../models/user.js');

describe('User', () => {
  it('can be created', async () => {
    const usersBefore = await User.all();
    expect(usersBefore.length).toBe(0);

    await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });
    const usersAfter = await User.all();
    expect(usersAfter.length).toBe(1);
  });

  it('must have unique email to be created', async () => {
    await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });
    const duplicateUser = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });

    expect(duplicateUser).toEqual({ errors: ['Email already taken'] });
    const users = await User.all();
    expect(users.length).toBe(1);
  });

  it('can be updated', async () => {
    const originalUser = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });
    const updatedUser = await User.update({
      id: originalUser.id,
      firstName: 'Freyja',
      lastName: 'Puppy',
      email: 'freyja@example.com',
      birthYear: 2016,
      student: false,
      password: 'puppy password',
    });

    expect(updatedUser.firstName).toBe('Freyja');
    expect(updatedUser.lastName).toBe('Puppy');
    expect(updatedUser.email).toBe('freyja@example.com');
    expect(updatedUser.birthYear).toBe(2016);
    expect(updatedUser.student).toBe(false);
    expect(updatedUser.passwordDigest).not.toBe(originalUser.passwordDigest);
  });

  it('must have unique email to be updated', async () => {
    const firstUser = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });
    const secondUser = await User.create({
      firstName: 'Freyja',
      lastName: 'Puppy',
      email: 'freyja@example.com',
      birthYear: 2016,
      student: false,
      password: 'password',
    });
    const updateSecondUser = await User.update({
      id: secondUser.id,
      firstName: 'Freyja',
      lastName: 'Puppy',
      email: firstUser.email,
      birthYear: 2016,
      student: false,
      password: 'password',
    });

    expect(updateSecondUser).toEqual({ errors: ['Email already taken'] });
    const secondUserRecord = await User.find(secondUser.id);
    expect(secondUserRecord.email).toEqual('freyja@example.com');
  });

  it('can update user using same email address', async () => {
    const user = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });

    const updatedUser = await User.update({
      id: user.id,
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });

    expect(updatedUser.email).toEqual(user.email);
  });

  it('can be found by id', async () => {
    const user = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });

    const foundUser = await User.find(user.id);
    expect(foundUser.firstName).toEqual('Elowyn');
    expect(foundUser.lastName).toEqual('Platzer Bartel');
    expect(foundUser.email).toEqual('elowyn@example.com');
    expect(foundUser.birthYear).toEqual(2015);
    expect(foundUser.student).toEqual(true);
  });

  it('can be found by property', async () => {
    await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });

    const foundUserByEmail = await User.findBy({ email: 'elowyn@example.com' });
    expect(foundUserByEmail.firstName).toEqual('Elowyn');
    expect(foundUserByEmail.lastName).toEqual('Platzer Bartel');
    expect(foundUserByEmail.email).toEqual('elowyn@example.com');
    expect(foundUserByEmail.birthYear).toEqual(2015);
    expect(foundUserByEmail.student).toEqual(true);

    const foundUserByFirstName = await User.findBy({ firstName: 'Elowyn' });
    expect(foundUserByFirstName.firstName).toEqual('Elowyn');
    expect(foundUserByFirstName.lastName).toEqual('Platzer Bartel');
    expect(foundUserByFirstName.email).toEqual('elowyn@example.com');
    expect(foundUserByFirstName.birthYear).toEqual(2015);
    expect(foundUserByFirstName.student).toEqual(true);

    const foundUserByLastName = await User.findBy({ lastName: 'Platzer Bartel' });
    expect(foundUserByLastName.firstName).toEqual('Elowyn');
    expect(foundUserByLastName.lastName).toEqual('Platzer Bartel');
    expect(foundUserByLastName.email).toEqual('elowyn@example.com');
    expect(foundUserByLastName.birthYear).toEqual(2015);
    expect(foundUserByLastName.student).toEqual(true);

    const foundUserByBirthYear = await User.findBy({ birthYear: '2015' });
    expect(foundUserByBirthYear.firstName).toEqual('Elowyn');
    expect(foundUserByBirthYear.lastName).toEqual('Platzer Bartel');
    expect(foundUserByBirthYear.email).toEqual('elowyn@example.com');
    expect(foundUserByBirthYear.birthYear).toEqual(2015);
    expect(foundUserByBirthYear.student).toEqual(true);

    const foundUserByStudent = await User.findBy({ student: true });
    expect(foundUserByStudent.firstName).toEqual('Elowyn');
    expect(foundUserByStudent.lastName).toEqual('Platzer Bartel');
    expect(foundUserByStudent.email).toEqual('elowyn@example.com');
    expect(foundUserByStudent.birthYear).toEqual(2015);
    expect(foundUserByStudent.student).toEqual(true);
  });

  xit('can be found in multiple by property', async () => {
    await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });
    await User.create({
      firstName: 'Signe',
      lastName: 'Alongi',
      email: 'signe@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });
    await User.create({
      firstName: 'Alexa',
      lastName: 'Madison',
      email: 'Alexa@example.com',
      birthYear: 2013,
      student: true,
      password: 'password',
    });

    const foundUsers = await User.where({ birthYear: 2017 });
    expect(foundUsers.length).toEqual(2);
  });
});
