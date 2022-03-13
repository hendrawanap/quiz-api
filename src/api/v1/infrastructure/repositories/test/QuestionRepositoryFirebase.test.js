const Question = require('../../../domain/entities/Question');
const QuestionRepositoryFirebase = require('../QuestionRepositoryFirebase');

describe('QuestionRepositoryFirebase', () => {
  describe('getAll()', () => {
    let db;
    let storage;
    let repository;

    it('should return empty array if db is empty', async () => {
      db = {
        collection: (collectionId) => ({
          get: async () => ({empty: true}),
        }),
      };
      storage = {
        getDownloadLink: async (url) => 'link',
      };
      repository = new QuestionRepositoryFirebase(db, storage);
      const result = await repository.getAll();
      expect(result).toEqual([]);
    });

    it('should return array of questions', async () => {
      const docs = [
        {
          id: 1,
          data: () => ({
            topic: 'Makanan',
            img: 'a',
            question: 'haha',
            answer: 'haha',
            choices: ['haha', 'hihi', 'hehe', 'hoho'],
          }),
        },
        {
          id: 2,
          data: () => ({
            topic: 'Makanan',
            img: 'b',
            question: 'hihi',
            answer: 'haha',
            choices: ['haha', 'hihi', 'hehe', 'hoho'],
          }),
        },
        {
          id: 3,
          data: () => ({
            topic: 'Makanan',
            img: 'c',
            question: 'hehe',
            answer: 'haha',
            choices: ['haha', 'hihi', 'hehe', 'hoho'],
          }),
        },
      ];
      const dowloadLinkMock = jest.fn();
      db = {
        collection: (collectionId) => ({
          get: async () => ({
            empty: false,
            forEach: (callback) => {
              return docs.forEach((doc) => callback(doc));
            },
          }),
        }),
      };
      storage = {
        getDownloadLink: (url) => dowloadLinkMock(),
      };
      dowloadLinkMock
          .mockReturnValueOnce(new Promise((resolve, reject) => resolve(['/foods/a.png'])))
          .mockReturnValueOnce(new Promise((resolve, reject) => resolve(['/foods/b.jpg'])))
          .mockReturnValue(new Promise((resolve, reject) => reject(new Error('failed'))));
      repository = new QuestionRepositoryFirebase(db, storage);
      const result = await repository.getAll();
      const expected = [];
      expected.push(new Question(1, 'haha', 'haha', ['haha', 'hihi', 'hehe', 'hoho'], '/foods/a.png', 'Makanan'));
      expected.push(new Question(2, 'hihi', 'haha', ['haha', 'hihi', 'hehe', 'hoho'], '/foods/b.jpg', 'Makanan'));
      expected.push(new Question(3, 'hehe', 'haha', ['haha', 'hihi', 'hehe', 'hoho'], null, 'Makanan'));
      expect(result).toEqual(expected);
    });
  });
});
