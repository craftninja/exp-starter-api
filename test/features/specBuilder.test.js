'use strict';

const expect = require('expect');
const proxyquire = require('proxyquire');


const expectedResult = `
{
  "swagger": "2.0",
  "info": {
    "title": "exp-starter-api",
    "version": "0.0.0"
  },
  "tags": [
    {
      "name": "login",
      "description": "Login endpoints"
    },
    {
      "name": "users",
      "description": "User management endpoints"
    }
  ],
  "definitions": {
    "user": {
      "type": "object",
      "properties": {
        "firstName": {
          "type": "string"
        },
        "lastName": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "birthYear": {
          "type": "number",
          "format": "int32"
        },
        "student": {
          "type": "boolean"
        },
        "password": {
          "type": "string"
        },
        "passwordDigest": {
          "type": "string"
        }
      }
    },
    "users": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/user"
      }
    },
    "jwtUser": {
      "type": "object",
      "properties": {
        "jwt": {
          "type": "string"
        },
        "user": {
          "$ref": "#/definitions/user"
        }
      }
    }
  },
  "parameters": {
    "userBody": {
      "name": "body",
      "in": "body",
      "description": "Post body for login",
      "required": true,
      "schema": {
        "$ref": "#/definitions/user"
      }
    },
    "pathId": {
      "name": "id",
      "in": "path",
      "description": "User ID in path",
      "required": true,
      "type": "number",
      "format": "int32"
    },
    "jwt": {
      "name": "jwt",
      "in": "header",
      "description": "Json web token",
      "required": false,
      "type": "string"
    }
  },
  "paths": {
    "/users": {
      "post": {
        "tags": [
          "users"
        ],
        "summary": "Create user",
        "description": "Creates a new user",
        "x-swagger-router-controller": "users",
        "operationId": "create",
        "parameters": [
          {
            "$ref": "#/parameters/userBody"
          }
        ],
        "responses": {
          "200": {
            "description": "success",
            "schema": {
              "$ref": "#/definitions/jwtUser"
            }
          },
          "default": {
            "$ref": "#/responses/error"
          }
        }
      },
      "get": {
        "tags": [
          "users"
        ],
        "summary": "Get all users",
        "description": "Retrieves an array of all users",
        "x-swagger-router-controller": "users",
        "operationId": "index",
        "parameters": [
          {
            "$ref": "#/parameters/jwt"
          }
        ],
        "responses": {
          "200": {
            "description": "success",
            "schema": {
              "$ref": "#/definitions/users"
            }
          },
          "default": {
            "$ref": "#/responses/error"
          }
        }
      }
    },
    "/users/{id}": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "Get a user",
        "description": "Gets a user (if the user is permitted to view the requested user data)",
        "x-swagger-router-controller": "users",
        "operationId": "show",
        "parameters": [
          {
            "$ref": "#/parameters/pathId"
          },
          {
            "$ref": "#/parameters/jwt"
          }
        ],
        "responses": {
          "200": {
            "description": "success",
            "schema": {
              "$ref": "#/definitions/user"
            }
          },
          "default": {
            "$ref": "#/responses/error"
          }
        }
      },
      "put": {
        "tags": [
          "users"
        ],
        "summary": "Update user info",
        "description": "Edits a user's information",
        "x-swagger-router-controller": "users",
        "operationId": "update",
        "parameters": [
          {
            "$ref": "#/parameters/pathId"
          },
          {
            "$ref": "#/parameters/jwt"
          },
          {
            "$ref": "#/parameters/userBody"
          }
        ],
        "responses": {
          "200": {
            "description": "success",
            "schema": {
              "$ref": "#/definitions/user"
            }
          },
          "default": {
            "$ref": "#/responses/error"
          }
        }
      }
    },
    "/login": {
      "post": {
        "tags": [
          "login"
        ],
        "summary": "Login",
        "description": "Logs the user in",
        "x-swagger-router-controller": "login",
        "operationId": "create",
        "parameters": [
          {
            "$ref": "#/parameters/userBody"
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/jwtUser"
            }
          },
          "default": {
            "$ref": "#/responses/error"
          }
        }
      }
    }
  },
  "responses": {
    "error": {
      "description": "Error response",
      "schema": {
        "type": "object",
        "properties": {
          "statusCode": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      }
    }
  }
}
`;

const spec = `
swagger: '2.0'
info:
  title: exp-starter-api
  version: 0.0.0

tags:
- name: login
  description: Login endpoints
- name: users
  description: User management endpoints
`;

const definitionsShared = `
jwtUser:
  type: object
  properties:
    jwt:
      type: string
    user:
      $ref: '#/definitions/user'    
`;

const definitionsUsers = `
user:
  type: object
  properties:
    firstName:
      type: string
    lastName:
      type: string
    email:
      type: string
    birthYear:
      type: number
      format: int32
    student:
      type: boolean
    password:
      type: string
    passwordDigest:
      type: string

users:
  type: array
  items:
    $ref: '#/definitions/user'
`;

const parametersShared = `
jwt:
  name: jwt
  in: header
  description: Json web token
  required: false
  type: string
`;

const parametersUsers = `
userBody:
  name: body
  in: body
  description: Post body for login
  required: true
  schema:
    $ref: '#/definitions/user'

pathId:
  name: id
  in: path
  description: User ID in path
  required: true
  type: number
  format: int32
`;

const pathsLogin = `
/login:
  post:
    tags:
    - login
    summary: Login
    description: Logs the user in
    x-swagger-router-controller: login
    operationId: create
    parameters:
    - $ref: '#/parameters/userBody'
    responses:
      200:
        description: Success
        schema:
          $ref: '#/definitions/jwtUser'
      default:
        $ref: '#/responses/error'
`;

const pathsUsers = `
/users:
  post:
    tags:
    - users
    summary: Create user
    description: Creates a new user
    x-swagger-router-controller: users
    operationId: create
    parameters:
    - $ref: '#/parameters/userBody'
    responses:
      200:
        description: success
        schema:
          $ref: '#/definitions/jwtUser'
      default:
        $ref: '#/responses/error'
  get:
    tags:
    - users
    summary: Get all users
    description: Retrieves an array of all users
    x-swagger-router-controller: users
    operationId: index
    parameters:
    - $ref: '#/parameters/jwt'
    responses:
      200:
        description: success
        schema:
          $ref: '#/definitions/users'
      default:
        $ref: '#/responses/error'

/users/{id}:
  get:
    tags:
    - users
    summary: Get a user
    description: Gets a user (if the user is permitted to view the requested user data)
    x-swagger-router-controller: users
    operationId: show
    parameters:
    - $ref: '#/parameters/pathId'
    - $ref: '#/parameters/jwt'
    responses:
      200:
        description: success
        schema:
          $ref: '#/definitions/user'
      default:
        $ref: '#/responses/error'
  put:
    tags:
    - users
    summary: Update user info
    description: Edits a user's information
    x-swagger-router-controller: users
    operationId: update
    parameters:
    - $ref: '#/parameters/pathId'
    - $ref: '#/parameters/jwt'
    - $ref: '#/parameters/userBody'
    responses:
      200:
        description: success
        schema:
          $ref: '#/definitions/user'
      default:
        $ref: '#/responses/error'
`;

const responsesError = `
error:
  description: Error response
  schema:
    type: object
    properties:
      statusCode:
        type: string
      message:
        type: string
`;

const mockFiles = {
  spec: {
    definitions: {
      'shared.yaml': definitionsShared,
      'users.yaml': definitionsUsers
    },
    parameters: {
      'shared.yaml': parametersShared,
      'users.yaml': parametersUsers
    },
    paths: {
      'login.yaml': pathsLogin,
      'users.yaml': pathsUsers
    },
    responses: {
      'error.yaml': responsesError
    },
    'spec.yaml': spec
  }
};

const getPathResult = (filePath) => {
  const pathsArr = filePath
    .split('/')
    .filter(el => el && el !== '.');
  let result = mockFiles;

  pathsArr.forEach(subpath => {
    if (result[subpath]) {
      result = result[subpath];
    } else {
      result = new Error(`No subpath found for ${subpath} in ${filePath}!`);
      return;
    }
  });

  return result;
};

const fsStub = {
  readdir: (filePath, cb) => {
    const result = getPathResult(filePath);

    result instanceof Error
      ? cb(result)
      : cb(null, Object.keys(result));
  },
  stat: (filePath, cb) => {
    const result = getPathResult(filePath);

    result instanceof Error
      ? cb(result)
      : cb(null, {
        result,
        isDirectory: () => typeof result === 'object'
      });
  },
  readFile: (filePath, cb) => {
    const result = getPathResult(filePath);

    result instanceof Error
      ? cb(result)
      : cb(null, result);
  },
  readFileSync: (filePath) => {
    const result = getPathResult(filePath);

    if (result instanceof Error) {
      throw result;
    }

    return result;
  },
  writeFileSync: (path, content) => {
    content = JSON.parse(content);
    const expected = JSON.parse(expectedResult);
    expect(content).toEqual(expected);
  }
};

const pathStub = {
  resolve: (str1, str2) => {
    if (__dirname.includes(str1)) {
      str1 = '';
    }
    str1 = str1
      .split('/')
      .filter(str => str && str !== '.');
    str2 = str2
      .split('/')
      .filter(str => str.trim() && str !== '.');
    return [...str1, ...str2].join('/');
  }
};

describe('Spec builder', () => {
  it('Builds a valid spec into spec.json', async () => {
    await proxyquire('../../specBuilder.js', {
      path: pathStub,
      fs: fsStub
    });
  });
});
