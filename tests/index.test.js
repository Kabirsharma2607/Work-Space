const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3001";

const axios = {
  post: async (...args) => {
    try {
      const response = await axios2.post(...args);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  get: async (...args) => {
    try {
      const response = await axios2.get(...args);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  put: async (...args) => {
    try {
      const response = await axios2.put(...args);
      return response;
    } catch (err) {
      return err.response;
    }
  },
  delete: async (...args) => {
    try {
      const response = await axios2.delete(...args);
      return response;
    } catch (err) {
      return err.response;
    }
  },
};

describe("Authentication", () => {
  test("User is able to sign up only once", async () => {
    const username = "kabir" + Math.random();
    const password = "password" + Math.random();

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "admin",
    });

    expect(response.status).toBe(200);

    const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "admin",
    });

    expect(updatedResponse.status).toBe(400);
  });

  test("Signup request fails if the username is empty", async () => {
    const username = `kabir-${Math.random()}`;
    const password = `123456`;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
    });
    expect(response.status).toBe(400);
  });

  test("Sign in succeeds if the username and password are correct", async () => {
    const username = "kabir" + Math.random();
    const password = "password" + Math.random();
    //console.log(username, password);
    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();
  });

  test("Sign in faiils if the username and password are incorrect", async () => {
    const username = "kabir" + Math.random();
    const password = "password" + Math.random();

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      role: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "shusjushusn",
      password: "sjhusjs62212151",
    });

    expect(response.status).toBe(403);
  });
});

// describe("User metadata endpoints", () => {
//   let token = "";
//   let avatarId = "";
//   beforeAll(async () => {
//     const username = `kabir-${Math.random()}`;
//     const password = `123456`;

//     await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       role: "admin",
//     });

//     const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username,
//       password,
//     });

//     token = response.data.token;

//     const avatarResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//         name: "Timmy",
//       }
//     );

//     avatarId = avatarResponse.data.avatarId;
//   });

//   test("User cant update their metadata with wrong avatar ID", async () => {
//     const response = await axios.post(
//       "/api/v1/user/metadata",
//       {
//         avatarId: "1321a45iajnaj",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     expect(response.status).toBe(400);
//   });

//   test("User can update their metadata with right avatar ID", async () => {
//     const response = await axios.post(
//       "/api/v1/user/metadata",
//       {
//         avatarId,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     expect(response.status).toBe(200);
//   });

//   test("User cant update their metadata if authheader is absent", async () => {
//     const response = await axios.post("/api/v1/user/metadata", {
//       avatarId,
//     });

//     expect(response.status).toBe(403);
//   });
// });

// describe("User avatar information", () => {
//   let token = "";
//   let avatarId = "";
//   let userId = "";
//   beforeAll(async () => {
//     const username = `kabir-${Math.random()}`;
//     const password = `123456`;

//     const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       role: "admin",
//     });
//     userId = signupResponse.data.userId;

//     const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username,
//       password,
//     });

//     token = response.data.token;

//     const avatarResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//         name: "Timmy",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     avatarId = avatarResponse.data.avatarId;
//   });

//   test("Get back avatar information for a user", async () => {
//     const response = await axios.get(
//       `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`
//     );

//     expect(response.data.avatars.length).toBe(1);
//     expect(response.data.avatars[0].userId).toBe(userId);
//   });

//   test("Available avatars lists the recently created avatar", async () => {
//     const response = await axios.get(`${BACKEND_URL}/api/v1//avatars`);
//     expect(response.data.avatars.length).not.toBe(0);

//     const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
//     expect(currentAvatar).toBeDefined();
//   });
// });

// describe("Space information", () => {
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let adminToken;
//   let adminId;
//   let userToken;
//   let userId;
//   beforeAll(async () => {
//     const username = `kabir-${Math.random()}`;
//     const password = `123456`;

//     const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       role: "admin",
//     });

//     adminId = signupResponse.data.adminId;

//     const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username,
//       password,
//     });

//     adminToken = response.data.adminToken;

//     const userSignupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username: username + "-user",
//         password,
//         role: "user",
//       }
//     );

//     userId = userSignupResponse.data.userId;

//     const userSigninResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signin`,
//       {
//         username: username + "-user",
//         password,
//       }
//     );

//     userToken = userSigninResponse.data.userToken;

//     const element1Response = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const element2Response = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     element1Id = element1Response.data.id;
//     element2Id = element2Response.data.id;

//     const mapResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         dimensions: "100x200",
//         name: "Test space",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 20,
//             y: 20,
//           },
//           {
//             elementId: element1Id,
//             x: 18,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 19,
//             y: 20,
//           },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     mapId = mapResponse.data.id;
//   });

//   test("User is able to create a space", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//         mapId: mapId,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(response.data.spaceId).toBeDefined();
//   });

//   test("User is able to create a space w/o map id (empty space)", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(response.data.spaceId).toBeDefined();
//   });

//   test("User is not able to create a space w/o mapid and dimensions", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(response.status).toBe(400);
//   });

//   test("User should not be able to delete a space that does not exist", async () => {
//     const response = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/randomIdjanjnajnaj`,
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(response.status).toBe(400);
//   });

//   test("User should be able to delete a space that does  exist", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const deleteResponse = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(deleteResponse.status).toBe(200);
//   });

//   test("User should not be able to delete a space created by some other user", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const deleteResponse = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     expect(deleteResponse.status).toBe(400);
//   });

//   test("Admin has no spaces initially", async () => {
//     const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
//       headers: {
//         Authorization: `Bearer ${adminToken}`,
//       },
//     });
//     expect(response.data.spaces.length).toBe(0);
//   });

//   test("Admin has no spaces initially", async () => {
//     const spaceCreateResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
//       headers: {
//         Authorization: `Bearer ${adminToken}`,
//       },
//     });
//     const filteredSpaces = response.data.spaces.find(
//       (x) => x.id == spaceCreateResponse.spaceId
//     );

//     expect(response.data.spaces.length).toBe(1);
//     expect(filteredSpaces).toBeDefined();
//   });
// });

// describe("Arena endpoints", () => {
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let adminToken;
//   let adminId;
//   let userToken;
//   let userId;
//   let spaceId;
//   beforeAll(async () => {
//     const username = `kabir-${Math.random()}`;
//     const password = `123456`;

//     const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       role: "admin",
//     });

//     adminId = signupResponse.data.adminId;

//     const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username,
//       password,
//     });

//     adminToken = response.data.adminToken;

//     const userSignupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username: username + "-user",
//         password,
//         role: "user",
//       }
//     );

//     userId = userSignupResponse.data.userId;

//     const userSigninResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signin`,
//       {
//         username: username + "-user",
//         password,
//       }
//     );

//     userToken = userSigninResponse.data.userToken;

//     const element1Response = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const element2Response = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     element1Id = element1Response.data.id;
//     element2Id = element2Response.data.id;

//     const mapResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         dimensions: "100x200",
//         name: "Test space arean",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 20,
//             y: 20,
//           },
//           {
//             elementId: element1Id,
//             x: 18,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 19,
//             y: 20,
//           },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     mapId = mapResponse.data.id;

//     const spaceResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//         mapId,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     spaceId = spaceResponse.data.spaceId;
//   });

//   test("Incorrect space ID returns a 400", async () => {
//     const response = await axios.get(
//       `${BACKEND_URL}/api/v1/space/bhbshbshbhab`,
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(response.status).toBe(400);
//   });

//   test("Correct space ID returns all elements", async () => {
//     const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
//       headers: {
//         Authorization: `Bearer ${userToken}`,
//       },
//     });
//     expect(response.data.dimensions).toBe("100x200");
//     expect(response.data.elements.length).toBe(3);
//   });

//   test("Delete element is able to delete an element", async () => {
//     const getElements = await axios.get(
//       `${BACKEND_URL}/api/v1/space/${spaceId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const deleteResponse = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/element`,
//       {
//         spaceId: spaceId,
//         elementId: getElements.data.elements[0].id,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const newResponse = await axios.get(
//       `${BACKEND_URL}/api/v1/space/${spaceId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(newResponse.data.elements.length).toBe(2);
//   });

//   test("Adding an element fails if element lies outside the dimensions", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space/element`,
//       {
//         spaceId: spaceId,
//         elementId: element1Id,
//         x: 500,
//         y: 500,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(response.status).toBe(400);
//   });
// });

// describe("Admin endpoints", () => {
//   let adminToken;
//   let adminId;
//   let userToken;
//   let userId;
//   beforeAll(async () => {
//     const username = `kabir-${Math.random()}`;
//     const password = `123456`;

//     const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       role: "admin",
//     });

//     adminId = signupResponse.data.adminId;

//     const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username,
//       password,
//     });

//     adminToken = response.data.adminToken;

//     const userSignupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username: username + "-user",
//         password,
//         role: "user",
//       }
//     );

//     userId = userSignupResponse.data.userId;

//     const userSigninResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signin`,
//       {
//         username: username + "-user",
//         password,
//       }
//     );

//     userToken = userSigninResponse.data.userToken;
//   });

//   test("User is not able to hit admin endpoints", async () => {
//     const elementResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const mapResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         dimensions: "100x200",
//         name: "Test space admin",
//         defaultElements: [],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const avatarResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//         name: "Timmy",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     const updateElementResponse = await axios.put(
//       `${BACKEND_URL}/api/v1/admin/element/123`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     expect(elementResponse.status).toBe(403);
//     expect(mapResponse.status).toBe(403);
//     expect(avatarResponse.status).toBe(403);
//     expect(updateElementResponse.status).toBe(403);
//   });
//   test("Admin is able to hit admin endpoints", async () => {
//     const elementResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const mapResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         dimensions: "100x200",
//         name: "Test space admin",
//         defaultElements: [],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const avatarResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//         name: "Timmy",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     expect(elementResponse.status).toBe(403);
//     expect(mapResponse.status).toBe(403);
//     expect(avatarResponse.status).toBe(403);
//   });

//   test("Admin is able to update the imageUrl for an element", async () => {
//     const elementResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const updateElementResponse = await axios.put(
//       `${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     expect(updateElementResponse.status).toBe(200);
//   });
// });

// describe("Websocket tests", () => {
//   let adminToken;
//   let adminUserId;
//   let userToken;
//   let userId;
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let spaceId;

//   let ws1;
//   let ws2;

//   let ws1Messages = [];
//   let ws2Messages = [];

//   let userX;
//   let userY;
//   let adminX;
//   let adminY;

//   function waitForAndPopLatestMessage(messageArray) {
//     return new Promise((r) => {
//       if (messageArray.length > 0) {
//         r(messageArray.shift());
//       } else {
//         let interval = setInterval(() => {
//           if (messageArray.length > 0) {
//             r(messageArray.shift());
//             clearInterval(interval);
//           }
//         }, 100);
//       }
//     });
//   }

//   async function setupHTTP() {
//     const username = `kabir-${Math.random()}`;
//     const password = `123456`;
//     const adminSignupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username,
//         password,
//         role: "admin",
//       }
//     );
//     const adminSigninResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signin`,
//       {
//         username,
//         password,
//       }
//     );

//     adminToken = adminSigninResponse.data.token;
//     adminUserId = adminSignupResponse.data.userIdent;

//     const userSignupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username: `${username}-user`,
//         password,
//         role: "user",
//       }
//     );
//     const userSigninResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signin`,
//       {
//         username: `${username}-user`,
//         password,
//       }
//     );

//     userToken = userSigninResponse.data.token;
//     userId = userSignupResponse.data.userId;
//     const element1Response = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     const element2Response = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     element1Id = element1Response.data.id;
//     element2Id = element2Response.data.id;

//     const mapResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "https://thumbnail.com/a.png",
//         dimensions: "100x200",
//         name: "Test space arean",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 20,
//             y: 20,
//           },
//           {
//             elementId: element1Id,
//             x: 18,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 19,
//             y: 20,
//           },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     mapId = mapResponse.data.id;

//     const spaceResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "Test",
//         dimensions: "100x200",
//         mapId,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     spaceId = spaceResponse.data.spaceId;
//   }

//   async function setupWs() {
//     ws1 = new WebSocket(WS_URL);

//     await new Promise((r) => {
//       ws1.onopen = r;
//     });

//     ws1.onmessage = (event) => {
//       ws1Messages.push(JSON.parse(event.data));
//     };

//     ws2 = new WebSocket(WS_URL);

//     await new Promise((r) => {
//       ws2.onopen = r;
//     });

//     ws2.onmessage = (event) => {
//       ws2Messages.push(JSON.parse(event.data));
//     };
//   }

//   beforeAll(async () => {
//     await setupHTTP();
//     await setupWs();
//   });

//   test("Get back acknowldgement for joining the space", async () => {
//     ws1.send(
//       JSON.stringify({
//         role: "join",
//         payload: {
//           spaceId: spaceId,
//           token: adminToken,
//         },
//       })
//     );
//     const message1 = await waitForAndPopLatestMessage(ws1Messages);

//     ws2.send(
//       JSON.stringify({
//         role: "join",
//         payload: {
//           spaceId: spaceId,
//           token: userToken,
//         },
//       })
//     );
//     const message2 = await waitForAndPopLatestMessage(ws2Messages);
//     const message3 = await waitForAndPopLatestMessage(ws1Messages);

//     expect(message1.role).toBe("space-joined");
//     expect(message2.role).toBe("space-joined");

//     expect(message1.payload.users.length).toBe(0);
//     expect(message2.payload.users.length).toBe(1);
//     expect(message3.role).toBe("user-join");

//     expect(message3.payload.x).toBe(message2.payload.spawn.x);
//     expect(message3.payload.y).toBe(message2.payload.spawn.y);
//     expect(message3.payload.userId).toBe(userId);

//     adminX = message1.payload.spawn.x;
//     adminY = message1.payload.spawn.y;

//     userX = message2.payload.spawn.x;
//     userX = message2.payload.spawn.x;
//   });

//   test("User should not be able to move across the boundary", async () => {
//     ws1.send(
//       JSON.stringify({
//         role: "movement",
//         payload: {
//           x: 100000,
//           y: 100000,
//         },
//       })
//     );
//     const message = await waitForAndPopLatestMessage(ws1Messages);
//     expect(message.role).toBe("movement-rejected");
//     expect(message.payload.x).toBe(adminX);
//     expect(message.payload.y).toBe(adminY);
//   });

//   test("User should not be able to move 2 blocks at the same time", async () => {
//     ws1.send(
//       JSON.stringify({
//         role: "movement",
//         payload: {
//           x: adminX + 2,
//           y: adminY,
//         },
//       })
//     );
//     const message = await waitForAndPopLatestMessage(ws1Messages);
//     expect(message.role).toBe("movement-rejected");
//     expect(message.payload.x).toBe(adminX);
//     expect(message.payload.y).toBe(adminY);
//   });

//   test("Correct movement should be broadcasted to the other sockets in the room", async () => {
//     ws1.send(
//       JSON.stringify({
//         role: "movement",
//         payload: {
//           x: adminX + 1,
//           y: adminY,
//           userId: adminId,
//         },
//       })
//     );
//     const message = await waitForAndPopLatestMessage(ws2Messages);
//     expect(message.role).toBe("movement");
//     expect(message.payload.x).toBe(adminX + 1);
//     expect(message.payload.y).toBe(adminY);
//   });

//   test("If a user leaves, the other receieves a leave event", async () => {
//     ws1.close();
//     const message = await waitForAndPopLatestMessage(ws2Messages);
//     expect(message.role).toBe("user-left");
//     expect(message.payload.userId).toBe(adminUserId);
//   });
// });
