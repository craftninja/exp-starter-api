const expect = require('expect');
const request = require('supertest');

require('../helpers');

const User = require('../../models/user.js')

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
    })
    const usersAfter = await User.all();
    expect(usersAfter.length).toBe(1);
  });

  xit('can be found by id', async () => {
    const user = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    })

    const foundUser = await User.find(user.id)
    expect(foundUser.firstName).toEq('Elowyn');
    expect(foundUser.lastName).toEq('Platzer Bartel');
    expect(foundUser.email).toEq('elowyn@example.com');
    expect(foundUser.birthYear).toEq(2015);
    expect(foundUser.student).toEq(true);
  });

  xit('can be found by property', async () => {
    const user = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    })

    const foundUser = await User.findBy({email: 'elowyn@example.com'})
    expect(foundUser.firstName).toEq('Elowyn');
    expect(foundUser.lastName).toEq('Platzer Bartel');
    expect(foundUser.email).toEq('elowyn@example.com');
    expect(foundUser.birthYear).toEq(2015);
    expect(foundUser.student).toEq(true);
  });

  xit('can be found in multiple by property', async () => {
    await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    })
    await User.create({
      firstName: 'Signe',
      lastName: 'Alongi',
      email: 'signe@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    })
    await User.create({
      firstName: 'Alexa',
      lastName: 'Madison',
      email: 'Alexa@example.com',
      birthYear: 2013,
      student: true,
      password: 'password',
    })

    const foundUsers = await User.where({birthYear: 2017})
    expect(foundUsers.length).toEq(2);
  });
});
