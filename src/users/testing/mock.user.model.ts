export class MockUserModel {
  findOne(argument): Object {
    return {
      exec: () => {
        /* if (typeof argument === 'string') {
          if (argument === '1') {
            return Object.assign({}, {
              _id: '1',
              name: 'test',
              email: 'test@test.com',
              password: '$2b$10$qJMKL4a8RkUB/hh2yK0ZFO0ZFzvlhEJDrd8FlCEeS1xnZIjvKjJku',
              myConversations: [],
            });
          }
          return null;
        } */

        if (argument.email === 'test@test.com') {
          return Object.assign({}, {
            _id: '1',
            name: 'test',
            email: 'test@test.com',
            password: '$2b$10$qJMKL4a8RkUB/hh2yK0ZFO0ZFzvlhEJDrd8FlCEeS1xnZIjvKjJku',
            myConversations: [],
          });
        }

        return null;
      }
    };
  }
}
