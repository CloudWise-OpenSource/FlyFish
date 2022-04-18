import { mockInstance } from '@chaoswise/request';

mockInstance.onGet("/get/allUser").reply(200, {
  data: "get 获取的全部用户 [user1, user2, user3]"
});

mockInstance.onPost("/get/allUser").reply(200, {
  data: "post 获取的全部用户 [user1, user2, user3]"
});

mockInstance.onGet("/get/user", {
  params: {
    id: 'user1'
  }
}).reply(200, {
  data: "get 获取的到的用户为： user1"
});

mockInstance.onPost("/get/user", {
  id: 'user1'
}).reply(200, {
  data: "post 获取的到的用户为： user2"
});