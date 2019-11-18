process.env.NODE_ENV = "test"
const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('Given array with an object convert timestamp to string date and time  ', () => {
    const testArr = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }]
    const actual = formatDates(testArr);
    const expected = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: "Thu, 15 Nov 2018 12:21:54 GMT",
      votes: 100,
    }];
    expect(actual).to.deep.equal(expected);
  });
  it('Given array with multiple objects convert timestamp to string date and time  ', () => {
    const testArr = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100},  {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171,
      }]
    const actual = formatDates(testArr);
    const expected = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: "Thu, 15 Nov 2018 12:21:54 GMT",
      votes: 100,
    },{
      title: 'Eight pug gifs that remind me of mitch',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'some gifs',
      created_at: "Wed, 17 Nov 2010 12:21:54 GMT",
    }];
    expect(actual).to.deep.equal(expected);
  });
});

describe('makeRefObj', () => {
  it('Given array with single object return reference object', () => {
    const testArr = [{
      article_id: 28,
      title: 'High Altitude Cooking',
      body: 'Most backpacking trails vary only a few thousand feet elevation. However, many trails can be found above 10,000 feet. But what many people don’t take into consideration at these high altitudes is how these elevations affect their cooking.',
      votes: 0,
      topic: 'cooking',
      author: 'happyamy2016',
      created_at: "2018-05-27T03:32:28.000Z"
    }];
    const actual = makeRefObj(testArr);

    const expected = {"High Altitude Cooking": 28};
    expect(actual).to.deep.equal(expected)
  });
  it('Given array of objects return reference object', () => {
    const testArr = [{
      article_id: 28,
      title: 'High Altitude Cooking',
      body: 'Most backpacking trails vary only a few thousand feet elevation. However, many trails can be found above 10,000 feet. But what many people don’t take into consideration at these high altitudes is how these elevations affect their cooking.',
      votes: 0,
      topic: 'cooking',
      author: 'happyamy2016',
      created_at: "2018-05-27T03:32:28.000Z"
    },{
      article_id: 29,
      title: 'High Altitude Booking',
      body: 'Most backpacking trails vary only a few thousand feet elevation. However, many trails can be found above 10,000 feet. But what many people don’t take into consideration at these high altitudes is how these elevations affect their cooking.',
      votes: 0,
      topic: 'cooking',
      author: 'happyamy2016',
      created_at: "2018-05-27T03:32:28.000Z"
    }];
    const actual = makeRefObj(testArr);

    const expected = {"High Altitude Cooking": 28,"High Altitude Booking": 29};
    expect(actual).to.deep.equal(expected)
  });
});

describe('formatComments', () => {
  it('Given array with single object return formatted object', () => {
    const comments = [{
      body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
      belongs_to: 'The People Tracking Every Touch, Pass And Tackle in the World Cup',
      created_by: 'tickle122',
      votes: -1,
      created_at: 1468087638932,
    }];

    const refObj = {"The People Tracking Every Touch, Pass And Tackle in the World Cup" : 18}
    const actual = formatComments(comments,refObj);

   const expected = {
     "author":"tickle122",
     "article_id":18,
     "created_at" : "Sat, 09 Jul 2016 18:07:18 GMT" 
  };
    expect(actual[0]).to.include.keys(Object.keys(expected))
    expect(actual[0].author).to.equal(expected.author)
  });

});
